import { Card } from "@/components/card";
import HomeNavLink from "@/components/homeNavLink";
import { validateRequest } from "@/utils/auth";
import { getTrivia } from "@/utils/trivia";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { id?: string; category?: string };
}) {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  const trivia = await getTrivia(searchParams.id, searchParams.category);
  return (
    <>
      <HomeNavLink />
      <div className="cardHolder">
        <Card trivia={trivia} />
      </div>
    </>
  );
}
