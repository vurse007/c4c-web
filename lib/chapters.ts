import type { PersonProfile } from "@/components/PeopleList";
import { getTeamMember } from "@/lib/team";

// Each entry references a person from the central TEAM roster by name.
// `role` is required and always overrides TEAM's role for display on this
// chapter's board, since a person's org-wide role (from TEAM) and their
// chapter-specific role can differ.
// Optional `description` overrides the person's TEAM bio for this chapter's board.
// People on the org-wide "Our Team" page (featured in TEAM) are not listed on
// chapter boards.
export type ChapterBoardMember = {
  name: string;
  role: string;
  description?: string[];
};

export type Chapter = {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  board: ChapterBoardMember[];
};

export const CHAPTERS: Chapter[] = [
  {
    slug: "irvine",
    name: "Irvine",
    image: "/chapters/irvine.jpg",
    imageAlt: "Irvine",
    board: [
      { name: "Kayla Doan", role: "Co-Vice President & Lead Research Coordinator" },
      { name: "Ila Semsarieh", role: "Co-Vice President & Production" },
      { name: "Kemy [Lastname]", role: "Treasurer" },
      { name: "Brandon Chang", role: "Event Coordinator" },
      { name: "Emily [lastname]", role: "Event Coordinator" },
      { name: "Hailey Liu", role: "Design & Social Media" },
      { name: "Chase Gress", role: "Outreach Coordinator" },
      { name: "Malcolm [lastname]", role: "Outreach Coordinator" },
      { name: "Audrey Eum", role: "Outreach Coordinator" },
      { name: "Nathaniel Gluzman-Chuang", role: "Research Coordinator" },
      { name: "Thea Johnson", role: "Film Lead and Producer" },
      { name: "Ella Lee", role: "Social Media Manager" },
    ],
  },
  {
    slug: "mission-viejo",
    name: "Mission Viejo",
    image: "/chapters/mission-viejo.jpg",
    imageAlt: "Mission Viejo",
    board: [
      { name: "Ryan Toung", role: "Co-President" },
      { name: "George Pan", role: "Co-President" },
      { name: "Timothy Wasef", role: "Vice President and Communications" },
      { name: "Mario Martella", role: "Treasurer" },
      { name: "Aidan Rodriguez", role: "Secretary and Communications" },
      { name: "Chloey Park", role: "Video Editor" },
      { name: "John Beach", role: "Event Coordinator" },
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    image: "/chapters/new-york.jpg",
    imageAlt: "New York City",
    board: [
      { name: "Ara Woo", role: "Co-President" },
      { name: "Renee Lee", role: "Co-President" },
      { name: "Miranda Mei", role: "Secretary" },
      { name: "Stephen Lyu", role: "Treasurer" },
      { name: "Chloe Wu", role: "Event Coordinator" },
      { name: "Sophie Xiao", role: "Video Producer" },
      { name: "Christy Fu", role: "Video Editor" },
      { name: "Jasmine Dhringra", role: "Social Media Manager" },
    ],
  },
  {
    slug: "bay-area",
    name: "Bay Area",
    image: "/chapters/bay-area.jpg",
    imageAlt: "The Bay Area",
    board: [
      { name: "Seona Sheth", role: "Co-President" },
      { name: "Chloe Wong", role: "Co-President" },
      { name: "Edwin Huang", role: "Treasurer" },
      { name: "Riya Srivastava", role: "Secretary" },
      { name: "Kyla Lee", role: "Communication Coordinator" },
      { name: "Aaron Hwang", role: "Social Media Manager" },
      { name: "Helen Karupasamy", role: "Event Coordinator" },
    ],
  },
  {
    slug: "toronto",
    name: "Toronto",
    image: "/chapters/toronto.jpg",
    imageAlt: "Toronto",
    board: [],
  },
  {
    slug: "taiwan",
    name: "Taiwan",
    image: "/chapters/taiwan.jpg",
    imageAlt: "Taiwan",
    board: [],
  },
  {
    slug: "uganda",
    name: "Uganda",
    image: "/chapters/uganda.jpg",
    imageAlt: "Uganda",
    board: [],
  },
];

export function getChapter(slug: string) {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

// Resolves a chapter's board members against the central TEAM roster, so
// bios/headshots stay defined in one place while each chapter controls how
// that person's role is displayed on its own board. Description overrides
// the central bio if provided.
export function getChapterBoard(chapter: Chapter): PersonProfile[] {
  return chapter.board.map(({ name, role, description }) => ({
    ...getTeamMember(name),
    role,
    bio: description || getTeamMember(name).bio,
  }));
}
