import { Card } from "../components/card";
import { Trivia } from "../components/card";

const url: string = process.env.HOST_URL as string;
async function getTrivia(id?: string): Promise<Trivia> {
  const response: Response = await fetch(
    url + "/api/trivia" + (id ? `?id=${id}` : ""),
    {
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Something went wrong fetching trivia");
  }
  const responseJson = await response.json();
  const trivia: Trivia = responseJson.message;
  return trivia;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { id?: string; category?: string };
}) {
  const trivia = await getTrivia(searchParams["id"]);

  console.log(searchParams);
  return (
    <>
      <h1>BendiTrivia</h1>
      <div className="cardHolder">
        <Card trivia={trivia} />
      </div>
    </>
  );
}
