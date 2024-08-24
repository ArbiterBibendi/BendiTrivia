import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import HomeNavLink from "@/components/homeNavLink";

import categories from "../utils/categories";

export default async function Home() {
  return (
    <>
      <HomeNavLink />
      <div id="homepageCategoryHolder">
        {categories.map((value: string) => {
          return (
            <Link
              href={`/play?category=${value}`}
              key={uuidv4()}
              className="homepageCategoryLink"
            >
              {value}
            </Link>
          );
        })}
      </div>
    </>
  );
}
