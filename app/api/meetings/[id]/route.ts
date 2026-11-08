import { connection } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();
  const { id } = await params;
  const meeting = getMeetingById(id);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  return Response.json({ meeting });
}
