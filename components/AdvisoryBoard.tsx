import { PeopleSection } from "@/components/PeopleList";

const ADVISORS = [
  {
    name: "Kimberly Gress",
    role: "General Dentist, DDS",
    photo: "/headshots/kimberly-gress.jpg",
    bio: [
      "Dr. Kimberly Rivera Gress is a general dentist and a member of the ADA, CDA, and OCDS. She earned her Doctorate of Dental Surgery from the UC San Francisco School of Dentistry and a B.S. in Biology from Cal Poly San Luis Obispo.",
      "She helps guide the program and keep its work on course to support caregivers across professions. Her hope is that the effort students put into this work is not only well-intentioned, but also effective in the care it provides.",
    ],
  },
  {
    name: "Tina Chang",
    role: "Hospitality Executive",
    photo: "/headshots/tina-chang.jpg",
    bio: [
      "Tina Chang brings more than twenty years of experience in the hospitality industry, pairing a service-oriented approach with close collaboration alongside ownership groups.",
      "Her professional background in hospitality and her personal experience as a cancer survivor shape her work on the advisory board. During treatment, she received compassionate care from healthcare workers, particularly at the infusion center, and saw firsthand the dedication and impact of their work.",
      "Serving on the board allows her to give back, support caregivers, and help advance the mission of Caring for Caregivers.",
    ],
  },
  {
    name: "Phoenix Florido",
    role: "Registered Nurse, MSN",
    photo: "/headshots/phoenix-florido.jpg",
    bio: [
      "Phoenix Florido, MSN, BSN, PHN, RN, serves as an RN Utilization Manager and RN Case Manager in acute care. As a licensed registered nurse with ten years of experience in an acute care setting, her clinical background informs her work championing patient safety, quality of care, and ethics in decision-making.",
      "As an advisory board member, she hopes to advocate for Caring for Caregivers’ mission of giving back and showing gratitude to unsung heroes in healthcare, while fostering students’ initiative, focus, and dedication to learning about the healthcare profession.",
    ],
    quote: "For it is in giving that we receive. — St. Francis",
  },
];

export default function AdvisoryBoard() {
  return <PeopleSection title="Advisory Board" people={ADVISORS} />;
}
