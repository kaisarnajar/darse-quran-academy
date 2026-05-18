import { redirect } from "next/navigation";

export default async function MyCoursesRedirect({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const params = await searchParams;
  const query = params.pending === "1" ? "?pending=1" : "";
  redirect(`/profile/courses${query}`);
}
