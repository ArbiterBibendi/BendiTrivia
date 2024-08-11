import Link from "next/link";
import { Card } from "../components/card";
import { getTrivia } from "../utils/trivia";
import { categories } from "../utils/categories";

export default async function Home() {
  return (
    <>
      <h1>BendiTrivia</h1>
      {categories.map((value, index) => {
        return (
          <>
            <Link href={`/play?category=${value}`} key={index}>
              {value}
            </Link>
            <br></br>
          </>
        );
      })}
    </>
  );
}
