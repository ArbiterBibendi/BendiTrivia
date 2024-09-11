import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

type Report = {
  id: string;
  trivia_id: string;
  info: string;
};
const url: string = process.env.HOST_URL as string;
async function getReports(): Promise<Report[]> {
  const response = await fetch(`${url}/api/report`, { cache: "no-store" });
  if (response.ok) {
    return await response.json();
  }
  return [];
}
export default async function Page() {
  const { user } = await validateRequest();
  if (!user || user.role != "admin") {
    redirect("/");
  }
  const reports = await getReports();
  console.log(reports);
  return (
    <table>
      <tbody>
        {reports.map((report) => {
          return (
            <tr>
              <td>{report.id}</td>
              <td>{report.trivia_id}</td>
              <td>{report.info}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
