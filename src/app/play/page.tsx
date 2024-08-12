import HomeNavLink from "@/components/homeNavLink";
import { Card } from "@/components/card";
import { getTrivia } from "@/utils/trivia";

export default async function Home({
  searchParams,
}: {
  searchParams: { id?: string; category?: string };
}) {
  const trivia = await getTrivia(searchParams["id"], searchParams["category"]);
  return (
    <>
      <HomeNavLink />
      <div className="cardHolder">
        <Card trivia={trivia} />
      </div>
    </>
  );
}
