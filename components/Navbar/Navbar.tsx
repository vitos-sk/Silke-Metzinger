"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollProgress from "@/components/motion/ScrollProgress";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#ueber-mich", label: "Über mich" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#news-events", label: "News/Events" },
  { href: "#kontakt", label: "Kontakt" },
];

const SECTION_ORDER = ["home", "ueber-mich", "leistungen", "news-events", "kontakt"];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    window.setTimeout(() => {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const setNavbarHeight = () => {
      document.documentElement.style.setProperty("--navbar-h", `${headerEl.offsetHeight}px`);
    };

    setNavbarHeight();
    const resizeObserver = new ResizeObserver(setNavbarHeight);
    resizeObserver.observe(headerEl);
    return () => resizeObserver.disconnect();
  }, [isScrolled, isMenuOpen]);

  const intersectingIds = useRef(new Set<string>());

  useEffect(() => {
    const sections = SECTION_ORDER.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => section !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.current.add(entry.target.id);
          } else {
            intersectingIds.current.delete(entry.target.id);
          }
        });

        // Bei mehreren gleichzeitig überschneidenden Sections (z.B. beim
        // Sprung per Nav-Link an eine gemeinsame Kante) gewinnt deterministisch
        // die unterste (nach tatsächlicher DOM-Reihenfolge), statt der zuletzt
        // vom Observer gemeldeten (Race Condition).
        const lowestIntersecting = [...SECTION_ORDER]
          .reverse()
          .find((id) => intersectingIds.current.has(id));

        if (lowestIntersecting) {
          setActiveSection(lowestIntersecting);
        }
      },
      { rootMargin: "-110px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 w-full transform-gpu px-0 py-0 transition-[padding] duration-300 ${
        isScrolled ? "md:px-0 md:py-0" : "md:px-6 md:py-4"
      }`}
    >
      <div className="relative mx-auto max-w-6xl transform-gpu overflow-hidden rounded-3xl bg-ivory shadow-xl shadow-text-primary/20 will-change-transform md:bg-ivory/40 md:backdrop-blur-xl">
        <ScrollProgress />
        <nav
          className={`flex items-center justify-between px-6 py-2 transition-[padding] duration-300 md:px-8 ${
            isScrolled ? "md:py-2" : "md:py-3"
          }`}
        >
          <a href="#home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Silke Metzinger"
              width={949}
              height={312}
              priority
              className={`h-9 w-auto transition-[height] duration-300 ${
                isScrolled ? "md:h-11" : "md:h-14"
              }`}
            />
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`relative pb-1 text-sm transition-colors ${
                        isActive ? "text-sage" : "text-text-primary hover:text-sage"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-sage transition-all duration-300 ${
                          isActive
                            ? "scale-x-100 opacity-100 shadow-[0_0_8px_2px_rgba(143,175,138,0.55)]"
                            : "scale-x-0 opacity-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="#kontakt"
              className="inline-block rounded-full bg-sage px-5 py-2 text-sm text-ivory transition-opacity hover:opacity-90"
            >
              Erstgespräch buchen
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
            className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-text-primary transition-transform duration-300 ${
                isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-text-primary transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-6 bg-text-primary transition-transform duration-300 ${
                isMenuOpen ? "translate-y-[-3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 px-6 pb-4">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleMobileNavClick(e, link.href)}
                    className={`relative block border-l-2 py-2 pl-3 text-sm transition-colors ${
                      isActive
                        ? "border-sage text-sage shadow-[inset_8px_0_12px_-10px_rgba(143,175,138,0.6)]"
                        : "border-transparent text-text-primary hover:text-sage"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href="#kontakt"
                onClick={(e) => handleMobileNavClick(e, "#kontakt")}
                className="inline-block rounded-full bg-sage px-5 py-2 text-sm text-ivory transition-opacity hover:opacity-90"
              >
                Erstgespräch buchen
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
