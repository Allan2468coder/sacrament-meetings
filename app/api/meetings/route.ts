import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: Request): Promise<Response> {
  await connection();
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("query") ?? searchParams.get("q") ?? "";
  const parsedPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const date = searchParams.get("date");
  return Response.json(await getMeetings(query, currentPage, date));
}
