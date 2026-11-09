import Image from "next/image";

export type PersonProfile = {
  name: string;
  role: string;
  photo: string | null;
  bio: string[];
  quote?: string;
  // Whether this person appears on the top-level "Our Team" page,
  // reserved for the organization's biggest roles (e.g. president,
  // vice president). Chapter-only members are left off.
  featured?: boolean;
};

export function Portrait({
  name,
  photo,
}: {
  name: string;
  photo: string | null;
}) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/[0.06]">
      {photo ? (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

export function PeopleList({ people }: { people: PersonProfile[] }) {
  return (
    <ul>
      {people.map((person) => (
        <li
          key={person.name}
          className="grid grid-cols-1 gap-8 border-b border-black/15 py-12 last:border-b-0 md:grid-cols-12 md:gap-10 lg:gap-16 lg:py-16"
        >
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-3xl font-regular leading-[1.1] tracking-tight text-black lg:text-4xl">
              {person.name}
            </h3>
            <p className="mt-3 text-[15px] font-light text-black/45">
              {person.role}
            </p>
          </div>
          <div className="space-y-5 text-lg font-light leading-[1.7] text-black/65 sm:text-xl md:col-span-5 lg:col-span-6 lg:text-[1.35rem] lg:leading-[1.7]">
            {person.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {person.quote ? (
              <p className="pt-2 italic">{person.quote}</p>
            ) : null}
          </div>
          <div className="md:col-span-3">
            <Portrait name={person.name} photo={person.photo} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PeopleSection({
  title,
  people,
}: {
  title: string;
  people: PersonProfile[];
}) {
  return (
    <section className="relative z-10 w-full bg-white">
      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
          {title}
        </h2>
        <div
          aria-hidden
          className="mt-16 h-px w-full bg-black/15 sm:mt-20 lg:mt-24"
        />
        <PeopleList people={people} />
      </div>
    </section>
  );
}
