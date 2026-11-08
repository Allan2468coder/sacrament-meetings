import type { SacramentMeeting, MeetingType } from "@/lib/types";

type MeetingProgram = Omit<SacramentMeeting, "id" | "date">;

const programs = [
  {
    meetingType: "regular",
    presiding: "Bishop Daniel Harper",
    conducting: "Sister Elaine Porter",
    announcements: ["Ward temple trip sign-ups are available in the foyer."],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Brother Matthew Cole",
    wardBusiness: [{ description: "Welcome new members of the ward." }],
    stakeBusiness: false,
    sacramentHymn: { number: 185, title: "Reverently and Meekly Now" },
    speakers: [
      { name: "Sister Hannah Brooks", topic: "Finding stillness in a busy world", type: "speaker" },
      { name: "Brother Caleb Morgan", topic: "Small acts of everyday discipleship", type: "speaker" },
    ],
    closingHymn: { number: 301, title: "I Am a Child of God" },
    closingPrayer: "Sister Julia Bennett",
  },
  {
    meetingType: "testimony",
    presiding: "Bishop Daniel Harper",
    conducting: "Brother Isaac Wells",
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Sister Clara Young",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
    speakers: [
      { name: "Brother Noah Ellis", topic: "Gratitude in every season", type: "speaker" },
      { name: "Sister Lily Chen", topic: "The quiet strength of covenants", type: "speaker" },
    ],
    closingHymn: { number: 293, title: "Each Life That Touches Ours for Good" },
    closingPrayer: "Brother Peter James",
  },
  {
    meetingType: "regular",
    presiding: "Bishop Daniel Harper",
    conducting: "Sister Elaine Porter",
    openingHymn: { number: 85, title: "How Firm a Foundation" },
    openingPrayer: "Brother Owen Price",
    wardBusiness: [{ description: "Sustain the ward youth conference leaders." }],
    stakeBusiness: true,
    sacramentHymn: { number: 174, title: "While of These Emblems We Partake" },
    speakers: [
      { name: "Sister Mia Anderson", topic: "Building faith one day at a time", type: "speaker" },
      { name: "Ward Choir", topic: "Because I Have Been Given Much", type: "musical-number" },
      { name: "Brother Ethan Scott", topic: "Making room for one another", type: "speaker" },
    ],
    closingHymn: { number: 219, title: "Because I Have Been Given Much" },
    closingPrayer: "Sister Abigail Reed",
  },
] satisfies (Omit<MeetingProgram, "meetingType"> & { meetingType: MeetingType })[];

function toDateId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMostRecentSunday(): Date {
  const sunday = new Date();
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7));
  return sunday;
}

export function getMeetings(): SacramentMeeting[] {
  const currentSunday = getMostRecentSunday();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentSunday);
    date.setDate(currentSunday.getDate() - index * 7);

    const dateId = toDateId(date);
    const program = programs[index % programs.length];
    return {
      ...program,
      id: Number(dateId.replaceAll("-", "")),
      date: dateId,
    };
  });
}

export function getMeetingById(id: string): SacramentMeeting | undefined {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId)) {
    return undefined;
  }
  return getMeetings().find((meeting) => meeting.id === numericId);
}
