import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET() {
  await connection();
  return Response.json({ meetings: getMeetings() });
}
