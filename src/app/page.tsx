import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import categories from "../utils/categories";
import { redirect } from "next/navigation";
import { validateRequest } from "@/utils/auth";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <h1 id="selectacategory">Select a category</h1>
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
