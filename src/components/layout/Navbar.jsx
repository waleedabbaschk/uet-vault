import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const links = [
  ["Home", "/"],
  ["Semesters", "/semesters"],
  ["Assignments", "/assignments"],
  ["Library", "/library"],
  ["About", "/about"],
  ["Contribute", "/contribute"],
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const overHero = pathname === "/" && !past;

  return (
    <header className={"nav" + (overHero ? " on-hero" : "") + (open ? " open" : "")}>
      <Link to="/" className="nav-logo">UET<span>VAULT</span></Link>
      <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className="nav-links">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
