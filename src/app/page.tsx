import { Card } from "../components/card";
import { Trivia } from "../components/card";

async function getTrivia(): Promise<Trivia> {
  const url: string = process.env.HOST_URL as string;
  const response: Response = await fetch(url + "/api/trivia", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching trivia");
  }
  const responseJson = await response.json();
  const trivia: Trivia = responseJson.message;
  return trivia;
}
export default async function Home() {
  const trivia2 = await getTrivia();
  return (
    <>
      <h1>BendiTrivia</h1>
      <div className="cardHolder">
        <Card trivia={trivia2} />
      </div>
    </>
  );
}
