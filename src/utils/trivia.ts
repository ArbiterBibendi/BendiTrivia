import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const errorTrivia = {
  question: "Something went wrong",
  answer: "",
  id: "-1",
  category: "",
  requestedCategory: "",
};
export type Trivia = {
  question: string;
  answer: string;
  category: string;
  id: string;
  requestedCategory: string;
};
const url: string = process.env.HOST_URL as string;

export const getTrivia = async (id?: string, category?: string) => {
  if (id) {
    return await fetchTriviaCached(headers(), id, category);
  }
  return await fetchTrivia(headers(), id, category);
};
const fetchTrivia = async (
  headers: Headers,
  id?: string,
  category?: string
) => {
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
      headers: new Headers(headers),
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
};
const fetchTriviaCached = unstable_cache(fetchTrivia);
