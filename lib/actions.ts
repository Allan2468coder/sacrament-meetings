"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import {
  addMeeting as addMeetingRecord,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from "@/lib/meetings-db";
import type {
  MeetingFormActionState,
  SacramentMeeting,
  SpeakerItem,
} from "@/lib/types";

export async function authenticate(
  _previousState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const meetingTypes = ["testimony", "regular", "stake", "general"] as const;
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid meeting date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid meeting date.");

const hymnNumberSchema = z
  .string()
  .regex(/^[1-9]\d*$/, "Enter a valid positive hymn number.")
  .transform(Number)
  .refine(Number.isSafeInteger, "Enter a valid positive hymn number.");

const linesSchema = z.string().transform((value) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);

const speakersSchema = z.string().transform((value, context) => {
  const speakers: SpeakerItem[] = [];

  for (const [index, line] of value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .entries()) {
    const [type, ...parts] = line.split("|");
    const speakerType = type?.trim();
    const name = parts.shift()?.trim() ?? "";
    const topic = parts.join("|").trim();

    if (
      (speakerType !== "speaker" && speakerType !== "musical-number") ||
      !name
    ) {
      context.addIssue({
        code: "custom",
        message: `Speaker entry ${index + 1} must use “speaker | name | topic” or “musical-number | name | topic”.`,
      });
      return z.NEVER;
    }

    speakers.push({
      type: speakerType,
      name,
      topic,
    });
  }

  return speakers;
});

const MeetingFormSchema = z.object({
  date: dateSchema,
  meetingType: z.enum(meetingTypes),
  presiding: z.string().trim().min(1, "Please provide presiding."),
  conducting: z.string().trim().min(1, "Please provide conducting."),
  announcements: linesSchema,
  openingHymnNumber: hymnNumberSchema,
  openingHymnTitle: z.string().trim().min(1, "Please provide opening hymn title."),
  openingPrayer: z.string().trim().min(1, "Please provide opening prayer."),
  wardBusiness: linesSchema,
  stakeBusiness: z.literal("on").optional().transform((value) => value === "on"),
  sacramentHymnNumber: hymnNumberSchema,
  sacramentHymnTitle: z
    .string()
    .trim()
    .min(1, "Please provide sacrament hymn title."),
  speakers: speakersSchema,
  closingHymnNumber: hymnNumberSchema,
  closingHymnTitle: z.string().trim().min(1, "Please provide closing hymn title."),
  closingPrayer: z.string().trim().min(1, "Please provide closing prayer."),
});

type MeetingFormData = z.output<typeof MeetingFormSchema>;

async function requireOwnerSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session;
}

function parseMeetingFormData(
  formData: FormData,
):
  | { success: true; data: Omit<SacramentMeeting, "id"> }
  | { success: false; state: MeetingFormActionState } {
  const parsed = MeetingFormSchema.safeParse({
    date: formData.get("date"),
    meetingType: formData.get("meetingType"),
    presiding: formData.get("presiding"),
    conducting: formData.get("conducting"),
    announcements: formData.get("announcements"),
    openingHymnNumber: formData.get("openingHymnNumber"),
    openingHymnTitle: formData.get("openingHymnTitle"),
    openingPrayer: formData.get("openingPrayer"),
    wardBusiness: formData.get("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") ?? undefined,
    sacramentHymnNumber: formData.get("sacramentHymnNumber"),
    sacramentHymnTitle: formData.get("sacramentHymnTitle"),
    speakers: formData.get("speakers"),
    closingHymnNumber: formData.get("closingHymnNumber"),
    closingHymnTitle: formData.get("closingHymnTitle"),
    closingPrayer: formData.get("closingPrayer"),
  });

  if (!parsed.success) {
    return {
      success: false,
      state: {
        errors: parsed.error.flatten().fieldErrors,
        message: "Please correct the highlighted fields.",
      },
    };
  }

  const data: MeetingFormData = parsed.data;
  return {
    success: true,
    data: {
      date: data.date,
      meetingType: data.meetingType,
      presiding: data.presiding,
      conducting: data.conducting,
      announcements: data.announcements,
      openingHymn: {
        number: data.openingHymnNumber,
        title: data.openingHymnTitle,
      },
      openingPrayer: data.openingPrayer,
      wardBusiness: data.wardBusiness.map((description) => ({ description })),
      stakeBusiness: data.stakeBusiness,
      sacramentHymn: {
        number: data.sacramentHymnNumber,
        title: data.sacramentHymnTitle,
      },
      speakers: data.speakers,
      closingHymn: {
        number: data.closingHymnNumber,
        title: data.closingHymnTitle,
      },
      closingPrayer: data.closingPrayer,
    },
  };
}

function revalidateMeetingPages(id: number): void {
  revalidatePath("/meetings");
  revalidatePath("/");
  revalidatePath("/meetings/current");
  revalidatePath(`/meetings/${id}`);
  revalidatePath(`/meetings/${id}/edit`);
  revalidatePath("/api/meetings");
  revalidatePath(`/api/meetings/${id}`);
}

export async function createMeeting(
  _previousState: MeetingFormActionState,
  formData: FormData,
): Promise<MeetingFormActionState> {
  await requireOwnerSession();

  const result = parseMeetingFormData(formData);
  if (!result.success) {
    return result.state;
  }

  let meeting: SacramentMeeting;
  try {
    meeting = await addMeetingRecord(result.data);
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw new Error("Failed to create the meeting. Please try again later.");
  }

  revalidateMeetingPages(meeting.id);
  redirect("/meetings");
}

export async function updateMeeting(
  id: number,
  _previousState: MeetingFormActionState,
  formData: FormData,
): Promise<MeetingFormActionState> {
  await requireOwnerSession();

  if (!Number.isSafeInteger(id) || id < 1) {
    return {
      message: "Meeting ID must be a positive number.",
      errors: {},
    };
  }

  const result = parseMeetingFormData(formData);
  if (!result.success) {
    return result.state;
  }

  let meeting: SacramentMeeting | null;
  try {
    meeting = await updateMeetingRecord(id, result.data);
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw new Error("Failed to update the meeting. Please try again later.");
  }

  if (!meeting) {
    return {
      message: "This meeting no longer exists.",
      errors: {},
    };
  }

  revalidateMeetingPages(id);
  redirect("/meetings");
}

export async function deleteMeeting(
  _previousState: MeetingFormActionState,
  formData: FormData,
): Promise<MeetingFormActionState> {
  await requireOwnerSession();

  const idText = formData.get("id");
  const id = typeof idText === "string" ? Number(idText) : Number.NaN;
  if (!Number.isSafeInteger(id) || id < 1) {
    return {
      message: "Meeting ID must be a positive number.",
      errors: {},
    };
  }

  let deleted: boolean;
  try {
    deleted = await deleteMeetingRecord(id);
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw new Error("Failed to delete the meeting. Please try again later.");
  }

  if (!deleted) {
    return {
      message: "This meeting no longer exists.",
      errors: {},
    };
  }

  revalidateMeetingPages(id);
  redirect("/meetings");
}
