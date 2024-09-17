import { headers } from "next/headers";
import { validateRequest } from "../../utils/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import ReportTable from "@/components/ReportTable";

export type Report = {
  id: string;
  trivia_id: string;
  question: string;
  answer: string;
  info: string;
};
const url: string = process.env.HOST_URL as string;
async function getReports(page: number): Promise<Report[]> {
  const response = await fetch(`${url}/api/report?p=${page}`, {
    cache: "no-store",
    headers: new Headers(headers()),
  });
  if (response.ok) {
    return await response.json();
  }
  return [];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { p: string };
}) {
  const { user } = await validateRequest();
  if (!user || user.role != "admin") {
    redirect("/");
  }
  const page = Number(searchParams.p) || Number(0);
  const reports = await getReports(page);
  return <ReportTable reports={reports} />;
}
