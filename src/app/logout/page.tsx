"use client";

import { useEffect } from "react";

async function logout() {
  const response = await fetch("/api/logout");
  if (response.ok) {
    window.location.href = "/login";
  }
}
export default function Page() {
  useEffect(() => {
    logout();
  }, []);
  return <h3>Logging out</h3>;
}
