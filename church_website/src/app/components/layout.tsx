import { useEffect } from "react";
import { useLocation } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";
import { AnimatedBg } from "./scroll-reveal";
import { AnimatedOutlet } from "./animated-outlet";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = delay;
            el.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBg />
      <Header />
      <main className="flex min-h-0 flex-1 flex-col parish-main-bg">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  );
}
