import type { Trivia } from "../components/card";

const url: string = process.env.HOST_URL as string;
export async function getTrivia(
  id?: string,
  category?: string
): Promise<Trivia> {
  // just pass id and category directly to trivia api
  const newSearchParams = new URLSearchParams();
  if (id) {
    newSearchParams.set("id", id);
  }
  if (category) {
    newSearchParams.set("category", category);
  }
  const response: Response = await fetch(
    `${url}/api/trivia${
      newSearchParams.size > 0 ? `?${newSearchParams.toString()}` : ""
    }`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Something went wrong fetching trivia");
  }
  const responseJson = await response.json();
  const trivia: Trivia = responseJson.message;
  return trivia;
}
