"use client";

import { FormEvent } from "react";

async function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error(error);
  }
}

export default async function Page() {
  return (
    <>
      <h1>
        Create an account
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
