import { headers } from "next/headers";
import type { Trivia } from "../components/card";

const errorTrivia = {
  question: "Something went wrong",
  answer: "",
  id: "-1",
  category: "",
  requestedCategory: "",
};

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
      cache: "force-cache",
      headers: headers(),
    }
  );

  if (!response.ok) {
    if (response.status == 429) {
      return {
        ...errorTrivia,
        question: "Rate limited, please try again in a few seconds",
      };
    }
    console.error("Something went wrong fetching trivia");
    return errorTrivia;
  }
  const responseJson = await response.json();
  const trivia: Trivia = responseJson.message;
  return trivia;
}
