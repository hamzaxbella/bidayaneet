import { redirect } from "next/navigation";
export default function Page() {
  redirect("/auth/admin/sign-in");
}
