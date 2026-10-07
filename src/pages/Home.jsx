import Hero from "../components/sections/Hero.jsx";
import Stats from "../components/sections/Stats.jsx";
import HowItWorks from "../components/sections/HowItWorks.jsx";
import SubjectsShowcase from "../components/sections/SubjectsShowcase.jsx";
import RecentFiles from "../components/sections/RecentFiles.jsx";
import Features from "../components/sections/Features.jsx";
import Creator from "../components/sections/Creator.jsx";
import Faq from "../components/sections/Faq.jsx";
import CtaBanner from "../components/sections/CtaBanner.jsx";
import Reveal from "../components/effects/Reveal.jsx";
import "../styles/landing.css";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal><Stats /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><SubjectsShowcase /></Reveal>
      <Reveal><RecentFiles /></Reveal>
      <Reveal><Features /></Reveal>
      <Reveal><Creator /></Reveal>
      <Reveal><Faq /></Reveal>
      <Reveal><CtaBanner /></Reveal>
    </>
  );
}
