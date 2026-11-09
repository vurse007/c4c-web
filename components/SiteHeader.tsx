"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { DONATE_HREF, NAV_LINKS } from "@/lib/nav";

// Same-page anchors (e.g. "#get-involved") scroll down smoothly instead of jumping.
function smoothScrollToHash(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (!href.startsWith("#")) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", href);
}

function NavLink({
  href,
  label,
  light,
}: {
  href: string;
  label: string;
  light: boolean;
}) {
  const pathname = usePathname();
  const active =
    !href.includes("#") &&
    (pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)));

  return (
    <Link
      href={href}
      onClick={(event) => smoothScrollToHash(event, href)}
      className={`group relative text-[15px] font-regular transition-colors ${
        light
          ? "text-black/80 hover:text-black"
          : "text-white/90 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-1 left-0 h-[1.5px] w-full origin-left ${light ? "bg-black" : "bg-white"} transition-transform duration-300 ease-out ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

// `light` is for all-white pages (e.g. Donate): black text, inverted logo, and
// a translucent white bar instead of black when it slides back in on scroll-up.
export default function SiteHeader({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y < 16;
      const goingUp = y < lastScrollY.current - 8;
      const goingDown = y > lastScrollY.current + 8;

      if (atTop) {
        setNavSolid(false);
        setNavHidden(false);
      } else if (goingUp) {
        setNavSolid(true);
        setNavHidden(false);
      } else if (goingDown) {
        setNavHidden(true);
        setMenuOpen(false);
      }

      lastScrollY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 ${
        navSolid
          ? light
            ? "border-b border-black/10 bg-white/80 backdrop-blur-sm"
            : "bg-black/70 backdrop-blur-sm"
          : light
            ? "border-b border-transparent bg-transparent"
            : "bg-transparent"
      }`}
      style={{
        transform: navHidden ? "translateY(-100%)" : "translateY(0)",
        transition:
          "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <nav className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <Link
          href="/"
          className={`flex items-center gap-2 ${light ? "text-black" : "text-white"}`}
        >
          <Image
            src="/c4cweb.svg"
            alt="C4C logo"
            width={32}
            height={34}
            className={`h-8 w-auto ${light ? "invert" : ""}`}
          />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              light={light}
            />
          ))}
          <Link
            href={DONATE_HREF}
            className={`rounded-full px-5 py-2 text-[15px] font-regular transition-colors ${
              light
                ? "bg-black text-white hover:bg-black/85"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            Donate
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[1.5px] w-6 ${light ? "bg-black" : "bg-white"} transition-transform ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-6 ${light ? "bg-black" : "bg-white"} transition-transform ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div
          className={`mx-6 flex flex-col gap-1 rounded-2xl p-4 backdrop-blur md:hidden ${
            light ? "border border-black/10 bg-white/90" : "bg-black/80"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2.5 text-[15px] font-regular ${
                light
                  ? "text-black/80 hover:bg-black/5"
                  : "text-white/90 hover:bg-white/10"
              }`}
              onClick={(event) => {
                smoothScrollToHash(event, link.href);
                setMenuOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={DONATE_HREF}
            className={`mt-1 rounded-lg px-3 py-2.5 text-center text-[15px] font-regular ${
              light ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Donate
          </Link>
        </div>
      )}
    </header>
  );
}
