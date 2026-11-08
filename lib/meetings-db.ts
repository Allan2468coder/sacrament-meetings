import type { SacramentMeeting } from "@/lib/types";

type MeetingProgram = Omit<SacramentMeeting, "id" | "date">;

const programs: MeetingProgram[] = [
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
    meetingType: "stake",
    presiding: "President Michael Grant",
    conducting: "Bishop Daniel Harper",
    announcements: ["Stake conference will be held next month."],
    openingHymn: { number: 85, title: "How Firm a Foundation" },
    openingPrayer: "Sister Grace Turner",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 174, title: "While of These Emblems We Partake" },
    speakers: [
      { name: "President Michael Grant", topic: "Strengthening faith in Jesus Christ", type: "speaker" },
      { name: "Stake Choir", topic: "Come, Follow Me", type: "musical-number" },
    ],
    closingHymn: { number: 219, title: "Because I Have Been Given Much" },
    closingPrayer: "Brother Samuel Wright",
  },
  {
    meetingType: "regular",
    presiding: "Bishop Daniel Harper",
    conducting: "Sister Elaine Porter",
    openingHymn: { number: 27, title: "Praise to the Man" },
    openingPrayer: "Brother Owen Price",
    wardBusiness: [{ description: "Sustain the ward youth conference leaders." }],
    stakeBusiness: false,
    sacramentHymn: { number: 187, title: "God Loved Us, So He Sent His Son" },
    speakers: [
      { name: "Sister Mia Anderson", topic: "Building faith one day at a time", type: "speaker" },
      { name: "Ward Choir", topic: "Because I Have Been Given Much", type: "musical-number" },
      { name: "Brother Ethan Scott", topic: "Making room for one another", type: "speaker" },
    ],
    closingHymn: { number: 293, title: "Each Life That Touches Ours for Good" },
    closingPrayer: "Sister Abigail Reed",
  },
  {
    meetingType: "general",
    presiding: "Bishop Daniel Harper",
    conducting: "Brother Isaac Wells",
    announcements: ["Please join us for the ward service project this Saturday."],
    openingHymn: { number: 3, title: "Now Let Us Rejoice" },
    openingPrayer: "Sister Clara Young",
    wardBusiness: [{ description: "Recognize the Primary children completing their service project." }],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "I Stand All Amazed" },
    speakers: [
      { name: "Sister Lily Chen", topic: "Finding hope through the Savior", type: "speaker" },
      { name: "Brother Noah Ellis", topic: "Ministering with love", type: "speaker" },
    ],
    closingHymn: { number: 30, title: "Come, Come, Ye Saints" },
    closingPrayer: "Brother Peter James",
  },
  {
    meetingType: "regular",
    presiding: "Bishop Daniel Harper",
    conducting: "Sister Elaine Porter",
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Brother Matthew Cole",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 191, title: "Behold the Great Redeemer Die" },
    speakers: [
      { name: "Brother Caleb Morgan", topic: "Choosing gratitude every day", type: "speaker" },
      { name: "Sister Hannah Brooks", topic: "The peace found in prayer", type: "speaker" },
    ],
    closingHymn: { number: 301, title: "I Am a Child of God" },
    closingPrayer: "Sister Julia Bennett",
  },
];

function toDateId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMostRecentSunday(): Date {
  const sunday = new Date();
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  return sunday;
}

export function getCurrentSundayDate(): string {
  return toDateId(getMostRecentSunday());
}

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const currentSunday = getMostRecentSunday();
  const meetings: SacramentMeeting[] = [
    ...programs.map((program, index) => {
      const meetingDate = new Date(currentSunday);
      meetingDate.setDate(currentSunday.getDate() - index * 7);

      return {
        ...program,
        id: index + 1,
        date: toDateId(meetingDate),
      };
    }),
    {
      ...programs[0],
      id: programs.length + 1,
      date: "2026-05-03",
    },
  ];

  return date ? meetings.filter((meeting) => meeting.date === date) : meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return getMeetings().find((meeting) => meeting.id === id) ?? null;
}
