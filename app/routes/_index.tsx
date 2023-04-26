import type { ActionFunction, LoaderFunction, TypedResponse} from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "../../prisma/PrismaClient";
import { FaIndent, FaTrash, FaPhoneAlt } from "react-icons/fa";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async (): Promise<TypedResponse> => {
    const contacts = await prisma.phoneNumber.findMany();
    return json({ contacts: contacts ?? [] });
  };
  
  type response = { message?: string };
  export const action: ActionFunction = async ({ request }): Promise<TypedResponse<response>> => {
    
    try {
      const body = new URLSearchParams(await request.text());
      const action = body.get("action");
      const id = Number(body.get("id"));
      if (action === "delete") {
        await prisma.phoneNumber.delete({ where: { id } });
      }
      return json({}, 200);
    } catch (e) {
      console.log(e);
      return json<response>({ message: "error" }, 500);
    }
  };
  
export default function Index() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const data = useLoaderData();
  const contacts = data.contacts ?? [];
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState(contacts);

  useEffect(() => {
    if(searchText) {
      setItems(items.filter((item: { id: number; name: string; lastName: string; phone: string }) => 
        item.lastName.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setItems(contacts);
    }
  }, [searchText]);

  function handleDelete(contactId: number) {
    const data = new FormData();
    data.append("action", "delete");
    data.append("id", contactId.toString());
    submit(data, { method: "post" });
  }

  return (
    <div className="flex flex-col text-center justify-center items-center w-full">
      <div className="flex-col bg-gray-100 rounded-md m-10 w-2/5 p-2">
        <div className="flex flex-row items-center justify-center p-5">
          <FaIndent className="mr-1"></FaIndent>
          <h1 className="text-2xl">Phone Book</h1>
        </div>
        <div className="items-center flex flex-row justify-between w-full text-lg">
          <label>Contacts</label>
          <button className="bg-blue-500 text-white p-2 rounded-md text-xs" onClick={() => navigate("/new")}>+ Add Contact</button>
        </div>
        <div className="items-center flex flex-row w-full py-2">
          <input className="flex w-full rounded-md text-sm" value={searchText}
              onChange={(e) => setSearchText(e.currentTarget.value)} placeholder="Search for contact by last name..."/>
        </div>
        <div className="flex flex-col justify-between w-full pt-2">
          {items.map((item: { id: number; name: string; lastName: string; phone: string }) => 
            <div className="bg-white flex flex-row justify-between w-full border-b border-gray-100 rounded-md" key={item.id}>
              <div className="flex flex-col">
                <div className="text-left text-lg">{item.name} {item.lastName}</div>
                <div className="flex flex-row align-bottom items-center text-gray-400">
                  <FaPhoneAlt className="p-0.5"/>
                  <div className="text-xs">{item.phone}</div>
                </div>
              </div>
              <button className="bg-red-500 m-2 p-2 rounded-md text-xs" onClick={() => handleDelete(item.id)}>
                <FaTrash className="text-white"/>
              </button>
            </div>
            )
          }
          {items.length === 0 && <div className="bg-white text-gray-400 rounded-md text-sm">No contacts</div>}
        </div>
      </div>
    </div>
  );
}
