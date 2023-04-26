import type { ActionFunction, TypedResponse} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { prisma } from "../../prisma/PrismaClient";
import { FaIndent } from "react-icons/fa";

type response = { message?: string };
export const action: ActionFunction = async ({ params, request }): Promise<TypedResponse<response>> => {
  const form = await request.formData();
  const name = form.get("name") as string;
  const lastName = form.get("lastName") as string;
  const phone = form.get("phone") as string;

  if (name && phone) {
    await prisma.phoneNumber.create({
      data: {
        name,
        lastName,
        phone
      }
    });
    return redirect("/");
  }

  return redirect("/new");
};

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col text-center justify-center items-center w-full">
      <div className="flex-col bg-gray-100 rounded-md m-10 w-2/5 p-2">
      <div className="flex flex-row items-center justify-center p-5">
          <FaIndent className="mr-1"></FaIndent>
          <h1 className="text-2xl">Phone Book</h1>
        </div>
        <div className="items-center flex flex-row justify-start w-full text-lg">
          <label>Contacts</label>
        </div>
        <form method="post" className="flex flex-col justify-center space-y-2 items-center pt-2">
          <div className="flex flex-row border bg-white border-gray-300 rounded w-full items-center">
            <input className="flex w-full" name="name" placeholder="Name..."/>
          </div>
          <div className="flex flex-row border bg-white border-gray-300 rounded w-full items-center">
            <input className="flex w-full" name="lastName" placeholder="Last Name..."/>
          </div>
          <div className="flex flex-row border bg-white border-gray-300 rounded w-full items-center">
            <input className="flex w-full" name="phone" placeholder="Phone..."/>
          </div>
          <div className="flex flex-row w-full items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-xs">Save</button>
            <button type="button" className="bg-red-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-xs"
              onClick={() => navigate("/")}>Go back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
