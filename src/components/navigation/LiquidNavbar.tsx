"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes, about, work, gallery, display } from "@/resources";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./LiquidNavbar.module.scss";

interface TabItem {
  id: string;
  path: string;
  label: string;
}

export const LiquidNavbar: React.FC = () => {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  // Active navigation items based on configuration
  const tabs: TabItem[] = React.useMemo(() => {
    const list: TabItem[] = [];
    if (routes["/about"]) {
      list.push({ id: "about", path: "/about", label: about.label || "Home" });
    }
    if (routes["/work"]) {
      list.push({ id: "work", path: "/work", label: work.label || "Work" });
    }
    if (routes["/gallery"]) {
      list.push({ id: "gallery", path: "/gallery", label: gallery.label || "Gallery" });
    }
    return list;
  }, []);

  // Determine active tab index from pathname
  const getActiveIndex = useCallback(
    (path: string) => {
      if (path.startsWith("/work")) {
        const idx = tabs.findIndex((t) => t.path === "/work");
        return idx !== -1 ? idx : 0;
      }
      if (path.startsWith("/gallery")) {
        const idx = tabs.findIndex((t) => t.path === "/gallery");
        return idx !== -1 ? idx : 0;
      }
      return 0; // Default to Home (/about)
    },
    [tabs],
  );

  const activeIndex = getActiveIndex(pathname);

  // References
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Pill visual position & dimension
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({
    left: 4,
    width: 64,
    ready: false,
  });

  // Align pill to a specific tab index
  const snapPillToTab = useCallback((targetIndex: number) => {
    const el = tabRefs.current[targetIndex];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
        ready: true,
      });
    }
  }, []);

  // Update pill whenever activeIndex changes or route changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      snapPillToTab(activeIndex);
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, snapPillToTab]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => {
      snapPillToTab(activeIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, snapPillToTab]);

  // Preload all tabs on mount for instant transitions
  useEffect(() => {
    tabs.forEach((tab) => {
      router.prefetch(tab.path);
    });
  }, [tabs, router]);

  // Core tab navigation logic (pure tap/click)
  const handleTabClick = (targetIndex: number) => {
    const selectedTab = tabs[targetIndex];
    if (!selectedTab) return;

    snapPillToTab(targetIndex);

    if (selectedTab.path !== pathname) {
      router.push(selectedTab.path);
    }
  };

  return (
    <div className={styles.track}>
      {/* Apple Liquid Glass Floating Pill Indicator */}
      <div
        className={styles.liquidPill}
        style={{
          transform: `translate3d(${pillStyle.left}px, 0, 0)`,
          width: `${pillStyle.width}px`,
          opacity: pillStyle.ready ? 1 : 0,
        }}
      />

      {/* Interactive Tabs */}
      {tabs.map((tab, index) => {
        const isSelected = activeIndex === index;
        const isGallery = tab.id === "gallery";

        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            className={`${styles.tabItem} ${isSelected ? styles.tabActive : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
            {isGallery && <span className={styles.soonBadge}>Soon</span>}
          </button>
        );
      })}

      {/* Theme Switcher within same liquid dock */}
      {display.themeSwitcher && (
        <>
          <div className={styles.divider} />
          <div className={styles.themeToggleWrap}>
            <ThemeToggle />
          </div>
        </>
      )}
    </div>
  );
};
