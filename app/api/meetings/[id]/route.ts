import { connection } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  await connection();
  const { id } = await params;
  const numericId = Number(id);

  if (!id.trim() || !Number.isSafeInteger(numericId)) {
    return Response.json({ error: "Meeting ID must be a valid number." }, { status: 400 });
  }

  const meeting = getMeetingById(numericId);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  return Response.json(meeting);
}
