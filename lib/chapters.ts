import type { PersonProfile } from "@/components/PeopleList";
import { getTeamMember } from "@/lib/team";

// Each entry references a person from the central TEAM roster by name.
// `role` is required and always overrides TEAM's role for display on this
// chapter's board, since a person's org-wide role (from TEAM) and their
// chapter-specific role can differ.
// Optional `description` overrides the person's TEAM bio for this chapter's board.
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
      {
        name: "Joshua Lin",
        role: "Co-President",
        description: [
          "Joshua Lin serves as Co-President of the Irvine Chapter of Caring for Caregivers. He leads the chapter's initiatives to support and uplift healthcare workers in the community. Even as a student, he has seen how powerful small acts of recognition can be—and how much they can brighten the lives of the people who keep our communities healthy.",
          "Working alongside an incredible team, he is dedicated to bringing students and the community together to recognize and support local caregivers. Through creative events and meaningful gestures, he aims to show healthcare professionals in Irvine that they are seen and valued.",
        ],
      },
      {
        name: "George Pan",
        role: "Co-President",
        description: [
          "George Pan serves as Co-President of the Irvine Chapter of Caring for Caregivers. He helps plan events, organize the team, and develop creative ways to educate students about healthcare burnout. A longstanding interest in the medical field drives his work to uplift the people who dedicate their lives to caring for others.",
          "His work with the Irvine chapter has strengthened his communication and leadership skills. He remains focused on bringing students and communities together, finding new ways to show appreciation for caregivers, and helping the chapter grow its impact in the Irvine area.",
        ],
      },
      { name: "Kayla Doan", role: "Co-Vice President & Lead Research Coordinator" },
      { name: "Ila Semsarieh", role: "Co-Vice President & Production" },
      {
        name: "Ayush Patel",
        role: "Chief Technology Officer",
        description: [
          "Ayush Patel serves as Chief Technology Officer for the Irvine Chapter of Caring for Caregivers. He works with the team to leverage technology and innovation to support the chapter's mission of uplifting caregivers. His technical expertise, particularly in website and application development, data analytics, and automation, helps enhance the chapter's work and digital presence.",
          "His commitment to the organization has strengthened his leadership skills. He aims to use technology to expand the chapter's initiatives and help the Irvine team more effectively connect with and support healthcare workers in the community.",
        ],
      },
      { name: "Chloe Wong", role: "Treasurer" },
      { name: "Kemy [Lastname]", role: "Treasurer" },
      { name: "Brandon Chang", role: "Event Coordinator" },
      { name: "Emily [lastname]", role: "Event Coordinator" },
      {
        name: "Renee Lee",
        role: "Design & Social Media",
        description: [
          "Renee Lee serves as the Design & Social Media lead for the Irvine Chapter of Caring for Caregivers. She guides the chapter's creative direction, designing graphics and managing social media to effectively communicate the chapter's mission and amplify the voices of caregivers.",
          "Through creative design and thoughtful social media content, she brings the chapter's message to life and helps connect with community members who care about supporting healthcare professionals. Her work is rooted in creating visual stories that resonate with and celebrate the dedication of local caregivers.",
        ],
      },
      { name: "Hailey [lastname]", role: "Design & Social Media" },
      { name: "Chase Gress", role: "Outreach Coordinator" },
      { name: "Malcolm [lastname]", role: "Outreach Coordinator" },
      { name: "Audrey Eum", role: "Outreach Coordinator" },
      { name: "Nathaniel Gluzman-Chuang", role: "Research Coordinator" },
      {
        name: "Braeden Bunya",
        role: "Outreach Coordinator",
        description: [
          "Braeden Bunya serves as an Outreach Coordinator for the Irvine Chapter of Caring for Caregivers. He helps orchestrate events, works closely with community partners and caregivers, and helps bring the chapter's initiatives to life on the ground.",
          "A love for the medical field shapes his work. Having grown up around doctors and physicians, he has seen firsthand both the beauty and the challenges of a career in medicine. Through the Irvine chapter, he hopes to have a positive impact on those who selflessly serve others in our community.",
        ],
      },
    ],
  },
  {
    slug: "mission-viejo",
    name: "Mission Viejo",
    image: "/chapters/mission-viejo.jpg",
    imageAlt: "Mission Viejo",
    board: [{ name: "George Pan", role: "Chapter President" }],
  },
  {
    slug: "new-york",
    name: "New York",
    image: "/chapters/new-york.jpg",
    imageAlt: "New York City",
    board: [{ name: "Renee Lee", role: "Chapter President" }],
  },
  {
    slug: "bay-area",
    name: "Bay Area",
    image: "/chapters/bay-area.jpg",
    imageAlt: "The Bay Area",
    board: [{ name: "Chloe Wong", role: "Chapter President" }],
  },
  {
    slug: "toronto",
    name: "Toronto",
    image: "/chapters/toronto.jpg",
    imageAlt: "Toronto",
    board: [{ name: "Ayush Patel", role: "Chapter President" }],
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
