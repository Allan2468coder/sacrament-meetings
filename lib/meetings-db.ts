import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const sql = neon(process.env.DATABASE_URL!);
const ITEMS_PER_PAGE = 5;

export async function getUpcomingMeeting(): Promise<SacramentMeeting | null> {
  const rows = await sql`SELECT
    id,
    to_char(date, 'YYYY-MM-DD') AS "date",
    meeting_type AS "meetingType",
    presiding,
    conducting,
    announcements,
    opening_hymn AS "openingHymn",
    opening_prayer AS "openingPrayer",
    ward_business AS "wardBusiness",
    stake_business AS "stakeBusiness",
    sacrament_hymn AS "sacramentHymn",
    speakers,
    closing_hymn AS "closingHymn",
    closing_prayer AS "closingPrayer"
  FROM meetings
  WHERE date >= CURRENT_DATE
  ORDER BY date ASC
  LIMIT 1`;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function getMeetings(
  query: string = "",
  currentPage: number = 1,
  date?: string | null,
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${query}%`;
  const offset = (Math.max(1, currentPage) - 1) * ITEMS_PER_PAGE;
  const rows = await sql`SELECT
    id,
    to_char(date, 'YYYY-MM-DD') AS "date",
    meeting_type AS "meetingType",
    presiding,
    conducting,
    announcements,
    opening_hymn AS "openingHymn",
    opening_prayer AS "openingPrayer",
    ward_business AS "wardBusiness",
    stake_business AS "stakeBusiness",
    sacrament_hymn AS "sacramentHymn",
    speakers,
    closing_hymn AS "closingHymn",
    closing_prayer AS "closingPrayer"
  FROM meetings
  WHERE (
    ${query === ""} OR
    presiding ILIKE ${searchTerm} OR
    conducting ILIKE ${searchTerm} OR
    meeting_type ILIKE ${searchTerm} OR
    speakers::text ILIKE ${searchTerm}
  )
  AND (${date ?? null}::date IS NULL OR date = ${date ?? null}::date)
  ORDER BY date DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

  return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string = "",
  date?: string | null,
): Promise<number> {
  const searchTerm = `%${query}%`;
  const rows = await sql`SELECT COUNT(*) AS count
    FROM meetings
    WHERE (
      ${query === ""} OR
      presiding ILIKE ${searchTerm} OR
      conducting ILIKE ${searchTerm} OR
      meeting_type ILIKE ${searchTerm} OR
      speakers::text ILIKE ${searchTerm}
    )
    AND (${date ?? null}::date IS NULL OR date = ${date ?? null}::date)`;

  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
  id: number,
): Promise<SacramentMeeting | null> {
  const rows = await sql`SELECT
    id,
    to_char(date, 'YYYY-MM-DD') AS "date",
    meeting_type AS "meetingType",
    presiding,
    conducting,
    announcements,
    opening_hymn AS "openingHymn",
    opening_prayer AS "openingPrayer",
    ward_business AS "wardBusiness",
    stake_business AS "stakeBusiness",
    sacrament_hymn AS "sacramentHymn",
    speakers,
    closing_hymn AS "closingHymn",
    closing_prayer AS "closingPrayer"
  FROM meetings WHERE id = ${id}`;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  const rows = await sql`INSERT INTO meetings (
    date,
    meeting_type,
    presiding,
    conducting,
    announcements,
    opening_hymn,
    opening_prayer,
    ward_business,
    stake_business,
    sacrament_hymn,
    speakers,
    closing_hymn,
    closing_prayer
  ) VALUES (
    ${data.date}::date,
    ${data.meetingType},
    ${data.presiding},
    ${data.conducting},
    ARRAY(
      SELECT jsonb_array_elements_text(${JSON.stringify(data.announcements ?? [])}::jsonb)
    ),
    ${JSON.stringify(data.openingHymn)}::jsonb,
    ${data.openingPrayer},
    ${JSON.stringify(data.wardBusiness)}::jsonb,
    ${data.stakeBusiness},
    ${JSON.stringify(data.sacramentHymn)}::jsonb,
    ${JSON.stringify(data.speakers)}::jsonb,
    ${JSON.stringify(data.closingHymn)}::jsonb,
    ${data.closingPrayer}
  ) RETURNING id`;

  const id = Number(rows[0]?.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("The meeting was inserted but its generated ID was not returned.");
  }

  const meeting = await getMeetingById(id);
  if (!meeting) {
    throw new Error(`Meeting ${id} was inserted but could not be loaded.`);
  }
  return meeting;
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  const rows = await sql`UPDATE meetings SET
    date = COALESCE(${updates.date ?? null}::date, date),
    meeting_type = COALESCE(${updates.meetingType ?? null}, meeting_type),
    presiding = COALESCE(${updates.presiding ?? null}, presiding),
    conducting = COALESCE(${updates.conducting ?? null}, conducting),
    announcements = CASE
      WHEN ${updates.announcements === undefined} THEN announcements
      ELSE ARRAY(
        SELECT jsonb_array_elements_text(${JSON.stringify(updates.announcements ?? [])}::jsonb)
      )
    END,
    opening_hymn = COALESCE(${updates.openingHymn === undefined ? null : JSON.stringify(updates.openingHymn)}::jsonb, opening_hymn),
    opening_prayer = COALESCE(${updates.openingPrayer ?? null}, opening_prayer),
    ward_business = COALESCE(${updates.wardBusiness === undefined ? null : JSON.stringify(updates.wardBusiness)}::jsonb, ward_business),
    stake_business = COALESCE(${updates.stakeBusiness ?? null}::boolean, stake_business),
    sacrament_hymn = COALESCE(${updates.sacramentHymn === undefined ? null : JSON.stringify(updates.sacramentHymn)}::jsonb, sacrament_hymn),
    speakers = COALESCE(${updates.speakers === undefined ? null : JSON.stringify(updates.speakers)}::jsonb, speakers),
    closing_hymn = COALESCE(${updates.closingHymn === undefined ? null : JSON.stringify(updates.closingHymn)}::jsonb, closing_hymn),
    closing_prayer = COALESCE(${updates.closingPrayer ?? null}, closing_prayer)
  WHERE id = ${id}
  RETURNING id`;

  if (!rows.length) {
    return null;
  }
  return getMeetingById(id);
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
