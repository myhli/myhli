"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { routes } from "@/resources";
import styles from "./SectionSlider.module.scss";

interface SectionSliderProps {
  children: React.ReactNode;
}

interface SectionItem {
  path: string;
  label: string;
}

const ALL_SECTIONS: SectionItem[] = [
  { path: "/about", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/blog", label: "Blog" },
  { path: "/gallery", label: "Gallery" },
];

export const SectionSlider: React.FC<SectionSliderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Filter only active sections configured in routes
  const activeSections = ALL_SECTIONS.filter((section) => {
    return routes[section.path as keyof typeof routes] !== false;
  });

  const getSectionIndex = (path: string | null): number => {
    if (!path) return -1;
    const cleanPath = path.replace(/\/$/, "") || "/";
    if (cleanPath === "/" || cleanPath === "/about") {
      const homeIdx = activeSections.findIndex((s) => s.path === "/about");
      return homeIdx !== -1 ? homeIdx : 0;
    }
    const idx = activeSections.findIndex(
      (section) => section.path !== "/about" && cleanPath.startsWith(section.path)
    );
    return idx !== -1 ? idx : 0;
  };

  const currentIndex = getSectionIndex(pathname);

  // Preload all active sections on mount so transitions are instant
  useEffect(() => {
    activeSections.forEach((section) => {
      router.prefetch(section.path);
    });
  }, [activeSections, router]);

  // Slider transition state
  const [sliderState, setSliderState] = useState<{
    currentPath: string;
    currentChildren: React.ReactNode;
    outgoingPath: string | null;
    outgoingChildren: React.ReactNode | null;
    direction: "next" | "prev";
    isAnimating: boolean;
  }>({
    currentPath: pathname,
    currentChildren: children,
    outgoingPath: null,
    outgoingChildren: null,
    direction: "next",
    isAnimating: false,
  });

  const isAnimatingRef = useRef(false);
  isAnimatingRef.current = sliderState.isAnimating;

  // React 19 state-during-render pattern to sync with route changes with 0ms delay
  if (pathname !== sliderState.currentPath) {
    const prevIdx = getSectionIndex(sliderState.currentPath);
    const nextIdx = getSectionIndex(pathname);

    if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
      const dir: "next" | "prev" = nextIdx > prevIdx ? "next" : "prev";
      setSliderState({
        currentPath: pathname,
        currentChildren: children,
        outgoingPath: sliderState.currentPath,
        outgoingChildren: sliderState.currentChildren,
        direction: dir,
        isAnimating: true,
      });
    } else {
      setSliderState({
        currentPath: pathname,
        currentChildren: children,
        outgoingPath: null,
        outgoingChildren: null,
        direction: "next",
        isAnimating: false,
      });
    }
  } else if (
    children !== sliderState.currentChildren &&
    !sliderState.isAnimating
  ) {
    setSliderState((prev) => ({
      ...prev,
      currentChildren: children,
    }));
  }

  const handleAnimationEnd = () => {
    setSliderState((prev) => {
      if (!prev.isAnimating) return prev;
      return {
        ...prev,
        outgoingPath: null,
        outgoingChildren: null,
        isAnimating: false,
      };
    });
  };

  // Scroll to top instantly at transition start and safety timer
  useEffect(() => {
    if (sliderState.isAnimating) {
      window.scrollTo({ top: 0, behavior: "instant" });
      const timer = setTimeout(() => {
        handleAnimationEnd();
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [sliderState.isAnimating]);

  // Navigate to section index with debounce check
  const navigateTo = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= activeSections.length) return;
    if (isAnimatingRef.current) return;
    const target = activeSections[targetIndex];
    window.scrollTo({ top: 0, behavior: "instant" });
    router.push(target.path);
  };

  // Keyboard Navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        if (currentIndex >= 0 && currentIndex < activeSections.length - 1) {
          e.preventDefault();
          navigateTo(currentIndex + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          e.preventDefault();
          navigateTo(currentIndex - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, activeSections]);

  // Detect mobile device
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth <= 768;
      setIsMobileDevice(hasTouch || isNarrow);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Touch Gesture Navigation: Disabled on mobile devices per user request ("hanya bisa tap saja tidak usah swipe")
  useEffect(() => {
    // If mobile/touch device detected, do not attach swipe listeners — tap only
    if (isMobileDevice) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchLastX = 0;
    let touchLastY = 0;
    let touchStartTime = 0;
    let isTracking = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        isTracking = false;
        return;
      }

      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      if (
        target &&
        (target.closest("header") ||
          target.closest("nav") ||
          target.closest("[data-no-swipe]") ||
          target.closest("input, textarea, select") ||
          target.closest(`.${styles.noSwipe}`))
      ) {
        isTracking = false;
        return;
      }

      const edgeThreshold = 22;
      if (
        touch.clientX < edgeThreshold ||
        touch.clientX > window.innerWidth - edgeThreshold
      ) {
        isTracking = false;
        return;
      }

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchLastX = touch.clientX;
      touchLastY = touch.clientY;
      touchStartTime = Date.now();
      isTracking = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking || e.touches.length !== 1) return;
      touchLastX = e.touches[0].clientX;
      touchLastY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking) return;
      isTracking = false;

      if (e.changedTouches && e.changedTouches.length > 0) {
        touchLastX = e.changedTouches[0].clientX;
        touchLastY = e.changedTouches[0].clientY;
      }

      const deltaX = touchLastX - touchStartX;
      const deltaY = touchLastY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const elapsed = Date.now() - touchStartTime;

      const isSwipe = absX >= 30 && absX > absY * 0.85 && elapsed <= 800;

      if (isSwipe) {
        if (deltaX < 0) {
          if (currentIndex >= 0 && currentIndex < activeSections.length - 1) {
            navigateTo(currentIndex + 1);
          }
        } else {
          if (currentIndex > 0) {
            navigateTo(currentIndex - 1);
          }
        }
      }
    };

    const handleTouchCancel = (e: TouchEvent) => {
      if (!isTracking) return;
      handleTouchEnd(e);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [currentIndex, activeSections, isMobileDevice]);

  // Trackpad Horizontal Wheel Navigation
  useEffect(() => {
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      if (
        Math.abs(e.deltaX) > 45 &&
        Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4
      ) {
        const now = Date.now();
        if (now - lastWheelTime < 650) return;
        lastWheelTime = now;

        if (e.deltaX > 45) {
          if (currentIndex >= 0 && currentIndex < activeSections.length - 1) {
            navigateTo(currentIndex + 1);
          }
        } else if (e.deltaX < -45) {
          if (currentIndex > 0) {
            navigateTo(currentIndex - 1);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex, activeSections]);

  const isNext = sliderState.direction === "next";

  return (
    <div className={styles.sliderWrapper}>
      {/* Invisible prefetch links to force Next.js client router cache hydration */}
      <div style={{ display: "none" }} aria-hidden="true">
        {activeSections.map((section) => (
          <Link key={section.path} href={section.path} prefetch={true}>
            {section.label}
          </Link>
        ))}
      </div>

      <div className={styles.slideContainer}>
        {sliderState.isAnimating && sliderState.outgoingChildren ? (
          <>
            {/* Outgoing layer: slides out */}
            <div
              className={`${styles.outgoingPane} ${
                isNext ? styles.outgoingNext : styles.outgoingPrev
              }`}
            >
              {sliderState.outgoingChildren}
            </div>

            {/* Incoming layer: slides in */}
            <div
              className={`${styles.incomingPane} ${
                isNext ? styles.incomingNext : styles.incomingPrev
              }`}
              onAnimationEnd={handleAnimationEnd}
            >
              {sliderState.currentChildren}
            </div>
          </>
        ) : (
          <div className={styles.singlePane}>
            {sliderState.currentChildren}
          </div>
        )}
      </div>
    </div>
  );
};
