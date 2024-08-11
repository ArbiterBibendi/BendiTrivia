import { Card } from "../../components/card";
import { getTrivia } from "../../utils/trivia";

export default async function Home({
  searchParams,
}: {
  searchParams: { id?: string; category?: string };
}) {
  const trivia = await getTrivia(searchParams["id"], searchParams["category"]);
  return (
    <>
      <h1>BendiTrivia</h1>
      <div className="cardHolder">
        <Card trivia={trivia} />
      </div>
    </>
  );
}
