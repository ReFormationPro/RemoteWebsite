import Home from "./components/Home";
import { kv } from "@vercel/kv";
import { cookies, headers } from 'next/headers'

async function SendMessage(message: any): Promise<boolean> {
  "use server";
  await kv.set("user_1_session", message + JSON.stringify(headers()));
  return true;
}

async function GetMessage(): Promise<string | null> {
  "use server";
  const session = await kv.get("user_1_session");
  return session as (string | null);
}

export default function Page() {
  return <Home sendMessage={SendMessage} getMessage={GetMessage}></Home>;
}
