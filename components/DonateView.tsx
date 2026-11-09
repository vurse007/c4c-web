import DonateSlideshow from "@/components/DonateSlideshow";
import ZeffyForm from "@/components/ZeffyForm";

export default function DonateView({ photos }: { photos: string[] }) {
  return (
    <section className="relative z-10 w-full bg-white">
      <div className="px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:px-14 lg:pb-24 lg:pt-44">
        <p className="text-xl font-light text-black/50 sm:text-2xl">Donate</p>
        <h1 className="mt-4 text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
          Give back to those who <span className="text-blue-500">care</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg font-light leading-[1.6] text-black/50 sm:text-xl">
          Donate to Caring for Caregivers to help us support healthcare
          providers with care packages that show them they are seen and
          appreciated. Give today and help us make sure the caregivers on the
          front lines know someone has their back.
        </p>
        <div aria-hidden className="mt-16 h-px w-full bg-black/15 sm:mt-20" />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_600px] lg:gap-x-14">
          <DonateSlideshow photos={photos} />

          <div>
            <ZeffyForm />
            <p className="mt-4 text-sm font-light text-black/40">
              Donations are processed securely by Zeffy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
