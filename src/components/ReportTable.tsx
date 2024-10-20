"use client";
import { Report } from "@/app/admin/page";
import { ChangeEvent, RefObject, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import categories from "@/utils/categories";
type ServerMessage = {
  error?: string;
  message?: string;
};
async function updateTrivia(
  reportsRef: RefObject<Report[]>,
  i: number,
  serverMessageRef: RefObject<HTMLDivElement>
) {
  if (!reportsRef.current) {
    return;
  }
  if (serverMessageRef.current) {
    serverMessageRef.current.textContent = "";
  }
  const report = reportsRef.current[i];
  const response = await fetch(`/api/trivia`, {
    cache: "no-store",
    method: "PUT",
    body: JSON.stringify(report),
  });
  const message: ServerMessage = await response.json();
  if (serverMessageRef.current) {
    serverMessageRef.current.textContent =
      message.message || message.error || "";
  }
}
async function deleteReport(report: Report) {
  if (!report.id) {
    return;
  }
  const response = await fetch(`/api/report`, {
    method: "DELETE",
    cache: "no-store",
    body: report.id,
  });
  const message: ServerMessage = await response.json();
  if (message.message == "ok") {
    location.reload();
  }
}
function onQuestionInputChange(
  e: ChangeEvent<HTMLTextAreaElement>,
  reportsRef: RefObject<Report[]>,
  i: number
) {
  if (!reportsRef.current) {
    return;
  }
  reportsRef.current[i].question = e.target.value;
}
function onAnswerInputChange(
  e: ChangeEvent<HTMLTextAreaElement>,
  reportsRef: RefObject<Report[]>,
  i: number
) {
  if (!reportsRef.current) {
    return;
  }
  reportsRef.current[i].answer = e.target.value;
}
function onCategoryInputChange(
  e: ChangeEvent<HTMLSelectElement>,
  reportsRef: RefObject<Report[]>,
  i: number
) {
  if (!reportsRef.current) {
    return;
  }
  console.log(reportsRef.current);
  reportsRef.current[i].category = e.target.value;
}
export default function ReportTable({ reports }: { reports: Report[] }) {
  const reportsRef: RefObject<Report[]> = useRef([]);
  const serverMessageRef: RefObject<HTMLDivElement> = useRef(null);
  return (
    <div id="reportsTableContainer">
      <table id="reportsTable">
        <tbody>
          <tr>
            <th>id</th>
            <th>trivia_id</th>
            <th>question</th>
            <th>answer</th>
            <th>category</th>
            <th>info</th>
            <th>
              <div className="serverMessage" ref={serverMessageRef}></div>
            </th>
          </tr>
          {reports.map((report, i) => {
            if (reportsRef.current) {
              reportsRef.current[i] = report;
            }
            return (
              <tr key={uuidv4()}>
                <td>{report.id}</td>
                <td>{report.trivia_id}</td>
                <td>
                  <textarea
                    spellCheck="false"
                    defaultValue={report.question}
                    onChange={(e) => onQuestionInputChange(e, reportsRef, i)}
                  ></textarea>
                </td>
                <td>
                  <textarea
                    spellCheck="false"
                    defaultValue={report.answer}
                    onChange={(e) => onAnswerInputChange(e, reportsRef, i)}
                  ></textarea>
                </td>
                <td>
                  <select
                    defaultValue={report.category}
                    onChange={(e) => onCategoryInputChange(e, reportsRef, i)}
                  >
                    {categories.map((category: string) => {
                      return (
                        <option key={uuidv4()} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <div>{report.info}</div>
                </td>
                <td>
                  <button
                    onClick={() =>
                      updateTrivia(reportsRef, i, serverMessageRef)
                    }
                  >
                    Update Trivia
                  </button>
                  <button onClick={() => deleteReport(report)}>
                    Close Report
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
