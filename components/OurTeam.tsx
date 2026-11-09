import { PeopleSection } from "@/components/PeopleList";
import { TEAM } from "@/lib/team";

const FEATURED_TEAM = TEAM.filter((member) => member.featured);

export default function OurTeam() {
  return <PeopleSection title="Our Team" people={FEATURED_TEAM} />;
}
