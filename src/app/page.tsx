import Link from "next/link";
import { Card } from "../components/card";
import { getTrivia } from "../utils/trivia";
import { categories } from "../utils/categories";
import HomeNavLink from "@/components/homeNavLink";

export default async function Home() {
  return (
    <>
      <HomeNavLink />
      <div id="homepageCategoryHolder">
        {categories.map((value, index) => {
          return (
            <>
              <Link
                href={`/play?category=${value}`}
                key={index}
                className="homepageCategoryLink"
              >
                {value}
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
}
