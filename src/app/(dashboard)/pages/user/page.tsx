import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { UserForm } from "@/components/Forms/user-form";
export const metadata: Metadata = {
  title: "User Page",
};

export default async function UserPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Usuarios" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <UserForm />
        </div>
      </div>
    </div>
  );
}
