import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/effects/SmoothScroll.jsx";
import ScrollToTop from "./components/effects/ScrollToTop.jsx";
import Loader from "./components/effects/Loader.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Semesters from "./pages/Semesters.jsx";
import Subject from "./pages/Subject.jsx";
import Assignments from "./pages/Assignments.jsx";
import Library from "./pages/Library.jsx";
import About from "./pages/About.jsx";
import Contribute from "./pages/Contribute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Viewer from "./pages/Viewer.jsx";
import "./styles/pages.css";
import "./styles/polish.css";

function seen() {
  try { return sessionStorage.getItem("uv-loaded") === "1"; } catch (e) { return false; }
}

export default function App() {
  const [phase, setPhase] = useState(() =>
    window.location.pathname === "/" && !seen() ? "loading" : "done"
  );
  const reveal = () => setPhase("reveal");
  const done = () => {
    try { sessionStorage.setItem("uv-loaded", "1"); } catch (e) { /* ignore */ }
    setPhase("done");
  };

  return (
    <>
      {phase !== "done" && <Loader onReveal={reveal} onDone={done} />}
      {phase !== "loading" && (
        <SmoothScroll>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/semesters" element={<Semesters />} />
            <Route path="/semesters/:sem/:subject" element={<Subject />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/library" element={<Library />} />
            <Route path="/about" element={<About />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/view" element={<Viewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </SmoothScroll>
      )}
    </>
  );
}