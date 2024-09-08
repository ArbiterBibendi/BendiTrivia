/* eslint-disable no-console */

"use client";

import { usePathname } from "next/navigation";
import { RefObject, useEffect, useRef } from "react";

export type Trivia = {
  question: string;
  answer: string;
  category: string;
  id: string;
  requestedCategory: string;
};
export type ReportResponse = {
  message: string;
};
function revealAnswer(
  e: React.MouseEvent<HTMLElement>,
  answerRef: RefObject<HTMLElement>
) {
  const answerElement = answerRef.current;
  answerElement?.setAttribute("style", "filter: none");
}
function getNewTrivia(category: string, pathName: string) {
  window.location.href = `${pathName}?category=${category}`;
}
function showReportDialogue(
  reportDialogueRef: RefObject<HTMLElement>,
  reportButtonRef: RefObject<HTMLElement>,
  nextButtonRef: RefObject<HTMLElement>
) {
  const reportDialogue = reportDialogueRef.current;
  reportDialogue?.setAttribute("style", "display: flex");

  const reportButton = reportButtonRef.current;
  reportButton?.setAttribute("style", "display: none");

  const nextButton = nextButtonRef.current;
  nextButton?.setAttribute("style", "display: none");
}
function hideReportDialogue(
  reportDialogueRef: RefObject<HTMLElement>,
  reportButtonRef: RefObject<HTMLElement>,
  nextButtonRef: RefObject<HTMLElement>
) {
  const reportDialogue = reportDialogueRef.current;
  reportDialogue?.setAttribute("style", "display: none");

  const reportButton = reportButtonRef.current;
  reportButton?.setAttribute("style", "display: block");

  const nextButton = nextButtonRef.current;
  nextButton?.setAttribute("style", "display: block");
}
async function reportCard(
  id: string,
  reportReasonRef: RefObject<HTMLInputElement>,
  reportDialogueRef: RefObject<HTMLElement>,
  reportButtonRef: RefObject<HTMLElement>,
  nextButtonRef: RefObject<HTMLElement>
) {
  const reasonTextArea = reportReasonRef.current;
  const reason = reasonTextArea?.value;
  const response = await fetch("/api/report", {
    method: "POST",
    body: JSON.stringify({
      trivia_id: id,
      reason,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  const reportResponse: ReportResponse = await response.json();
  if (!response.ok) {
    console.error("Something went wrong while reporting card.");
  }
  hideReportDialogue(reportDialogueRef, reportButtonRef, nextButtonRef);
}
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category, id, requestedCategory }: Trivia = trivia;
  // answer, reportDialogue, reportButton, nextButton. reportReason
  const answerRef = useRef(null);
  const reportDialogueRef = useRef(null);
  const reportButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const reportReasonRef = useRef(null);
  const pathName = usePathname();

  useEffect(() => {
    // store the cardid and requested category state in the URL
    window.history.replaceState(
      null,
      "",
      `${pathName}?category=${requestedCategory}&id=${id}`
    );
  }, [id, pathName, requestedCategory]);

  return (
    <div
      role="none"
      className="card"
      onClick={(e) => revealAnswer(e, answerRef)}
    >
      <div className="cardContents">
        <h3 className="category">{category}</h3>
        <h2>{question}</h2>
        <h2 className="answer" ref={answerRef}>
          {answer}
        </h2>
      </div>
      <div id="buttonHolder">
        <button
          aria-label="report"
          type="button"
          id="reportButton"
          onClick={() =>
            showReportDialogue(
              reportDialogueRef,
              reportButtonRef,
              nextButtonRef
            )
          }
          ref={reportButtonRef}
        >
          <img alt="show report dialogue" src="/flag.svg" />
        </button>

        <button
          aria-label="next"
          type="button"
          id="nextButton"
          onClick={() => getNewTrivia(requestedCategory, pathName)}
          ref={nextButtonRef}
        >
          <img alt="next card" src="/next.svg" />
        </button>
      </div>
      <div id="reportDialogue" ref={reportDialogueRef}>
        <textarea
          id="reportReason"
          placeholder="Input reason for report"
          ref={reportReasonRef}
        />
        <div id="reportDialogueButtonHolder">
          <button
            aria-label="show report dialogue"
            type="button"
            onClick={() =>
              reportCard(
                id,
                reportReasonRef,
                reportDialogueRef,
                reportButtonRef,
                nextButtonRef
              )
            }
            className="reportButton"
          >
            <img alt="submit report" src="/rightarrow.svg" />
          </button>
          <button
            aria-label="hide report dialogue"
            type="button"
            onClick={() =>
              hideReportDialogue(
                reportDialogueRef,
                reportButtonRef,
                nextButtonRef
              )
            }
            className="reportButton"
          >
            <img alt="hide report dialogue" src="/close.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}
