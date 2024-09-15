import { headers } from "next/headers";
import { validateRequest } from "../../utils/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

type Report = {
  id: string;
  trivia_id: string;
  question: string;
  answer: string;
  info: string;
};
const url: string = process.env.HOST_URL as string;
async function getReports(): Promise<Report[]> {
  const response = await fetch(`${url}/api/report`, {
    cache: "no-store",
    headers: new Headers(headers()),
  });
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
    <table id="reportsTable">
      <tbody>
        <tr>
          <th>id</th>
          <th>trivia_id</th>
          <th>question</th>
          <th>answer</th>
          <th>info</th>
        </tr>
        {reports.map((report) => {
          return (
            <tr>
              <td>{report.id}</td>
              <td>{report.trivia_id}</td>
              <td>{report.question}</td>
              <td>{report.answer}</td>
              <td>{report.info}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
