const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#ueber-mich", label: "Über mich" },
  { href: "#leistungen", label: "Leistungen" },
  { href: "#news-events", label: "News/Events" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-serif text-xl text-text-primary">
          Silke Metzinger
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-text-primary transition-colors hover:text-sage"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#kontakt"
          className="hidden rounded-full bg-sage px-5 py-2 text-sm text-ivory transition-opacity hover:opacity-90 md:inline-block"
        >
          Erstgespräch buchen
        </a>
      </nav>
    </header>
  );
}
