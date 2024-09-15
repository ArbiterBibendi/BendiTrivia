"use client";
import { Report } from "@/app/admin/page";
async function updateTrivia(report: Report) {
  const response = await fetch(`/api/trivia`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(report),
  });
  console.log(report);
}
export default function ReportTable({ reports }: { reports: Report[] }) {
  return (
    <table id="reportsTable">
      <tbody>
        <tr>
          <th>id</th>
          <th>trivia_id</th>
          <th>question</th>
          <th>answer</th>
          <th>info</th>
          <div className="serverMessage"></div>
        </tr>
        {reports.map((report) => {
          return (
            <>
              <tr>
                <td>{report.id}</td>
                <td>{report.trivia_id}</td>
                <td>{report.question}</td>
                <td>{report.answer}</td>
                <td>{report.info}</td>
                <button onClick={() => updateTrivia(report)}>
                  Update Trivia
                </button>
                <button>Close Report</button>
              </tr>
            </>
          );
        })}
      </tbody>
    </table>
  );
}
