"use client";

import { redirect } from "next/navigation";
import { FormEvent } from "react";

async function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      window.location.replace("/");
    }
  } catch (error) {
    console.error(error);
  }
}

export default function Page() {
  return (
    <>
      <h1>
        Login
        <form onSubmit={onSubmit}>
          <label htmlFor="username">Username</label>
          <input name="username" id="username" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="pass" />
          <br />
          <button>Continue</button>
        </form>
      </h1>
    </>
  );
}

interface ActionResult {
  error: string;
}
