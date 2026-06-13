import { redirect } from "next/navigation";

export default async function MyCoursesRedirect() {
  redirect("/profile/courses");
}
