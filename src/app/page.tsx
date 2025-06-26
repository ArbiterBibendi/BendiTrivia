import { SpeedInsights } from "@vercel/speed-insights/next";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { validateRequest } from "../utils/auth";
import categories from "../utils/categories";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <SpeedInsights />
      <h1 id="selectacategory">Select a category</h1>
      <div id="homepageCategoryHolder">
        {categories.map((value: string) => {
          return (
            <a
              href={`/play?category=${value}`}
              key={uuidv4()}
              className="homepageCategoryLink"
            >
              {value}
            </a>
          );
        })}
      </div>
    </>
  );
}
