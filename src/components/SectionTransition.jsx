import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SectionTransition() {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      setExiting(true);
      setTimeout(() => setExiting(false), 400);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={exiting ? { y: "100%" } : { y: "-100%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[60] bg-(--color-accent-deep) pointer-events-none"
    />
  );
}
