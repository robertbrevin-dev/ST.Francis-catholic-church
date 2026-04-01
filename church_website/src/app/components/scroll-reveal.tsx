import { useEffect, useRef } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale" | "blur" | "flip";
  delay?: string;
  duration?: number;
  [key: string]: unknown;
}

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const delay = (entry.target as HTMLElement).dataset.delay;
            if (delay) {
              (entry.target as HTMLElement).style.transitionDelay = delay;
            }
            // Stagger animation for children
            if ((entry.target as HTMLElement).classList.contains("stagger-children")) {
              const children = (entry.target as HTMLElement).querySelectorAll(".stagger-item");
              children.forEach((child, idx) => {
                setTimeout(() => {
                  child.classList.add("visible");
                }, idx * 80);
              });
            }
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-flip, .stagger-children, .stagger-item";
    const els = document.querySelectorAll(selectors);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function ScrollReveal({ 
  children, 
  className = "", 
  direction = "up", 
  delay = "", 
  duration = 0.7,
  ...props 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const directionMap: { [key: string]: string } = {
    "left": "reveal-left",
    "right": "reveal-right",
    "scale": "reveal-scale",
    "blur": "reveal-blur",
    "flip": "reveal-flip",
  };
  
  const cls = directionMap[direction] || "reveal";
  
  return (
    <div 
      ref={ref} 
      className={`${cls} ${className}`} 
      data-delay={delay}
      style={{ "--reveal-duration": `${duration}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`stagger-children ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`stagger-item reveal ${className}`}>
      {children}
    </div>
  );
}

export function AnimatedBg() {
  return (
    <div className="animated-bg-container">
      <div className="animated-bg-orb orb-1"></div>
      <div className="animated-bg-orb orb-2"></div>
      <div className="animated-bg-orb orb-3"></div>
      <div className="animated-bg-gradient"></div>
    </div>
  );
}
