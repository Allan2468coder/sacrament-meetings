import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: Request): Promise<Response> {
  await connection();
  const date = new URL(request.url).searchParams.get("date");
  return Response.json(getMeetings(date));
}
