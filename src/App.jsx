import { useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import { Promise as PromiseSection, Projects, Process, About, Reviews } from "./components/Sections.jsx";
import { Contact, Footer } from "./components/Contact.jsx";

export default function App() {
  // one restrained reveal per section heading
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <Nav />
      <Hero />
      <PromiseSection />
      <Services />
      <Projects />
      <Process />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}
