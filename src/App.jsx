import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Learning from "./components/Learning.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import useSmoothScroll from "./hooks/useSmoothScroll.js";
import useReveal from "./hooks/useReveal.js";

export default function App() {
  useSmoothScroll();
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Learning />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
