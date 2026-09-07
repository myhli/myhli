"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ToggleButton, useTheme } from "@once-ui-system/core";
import styles from "./ThemeToggle.module.scss";

export const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("dark");
  const [flashState, setFlashState] = useState<{
    active: boolean;
    toTheme: "light" | "dark";
    x: number;
    y: number;
  }>({
    active: false,
    toTheme: "light",
    x: 0,
    y: 0,
  });
  const [isRotating, setIsRotating] = useState(false);

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const lastToggleRef = useRef(0);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to read the real active theme from DOM / storage / media query
  const getResolvedTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "dark";
    const domAttr = document.documentElement.getAttribute("data-theme");
    if (domAttr === "light" || domAttr === "dark") return domAttr;
    const stored = localStorage.getItem("data-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  useEffect(() => {
    setMounted(true);
    setActiveTheme(getResolvedTheme());

    // Observe data-theme changes on documentElement so UI always reflects current state
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const val = document.documentElement.getAttribute("data-theme");
          if (val === "light" || val === "dark") {
            setActiveTheme(val);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [getResolvedTheme]);

  const toggleTheme = useCallback(
    (e?: React.SyntheticEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Debounce rapid double-taps
      const now = Date.now();
      if (now - lastToggleRef.current < 560) return;
      lastToggleRef.current = now;

      const current = getResolvedTheme();
      const target: "light" | "dark" = current === "dark" ? "light" : "dark";

      // Calculate origin coordinates for the radial flash
      let originX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
      let originY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

      if (e && "clientX" in e && (e as React.MouseEvent).clientX) {
        originX = (e as React.MouseEvent).clientX;
        originY = (e as React.MouseEvent).clientY;
      } else if (
        e &&
        "changedTouches" in e &&
        (e as React.TouchEvent).changedTouches?.[0]
      ) {
        const touch = (e as React.TouchEvent).changedTouches[0];
        originX = touch.clientX;
        originY = touch.clientY;
      } else if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        originX = rect.x + rect.width / 2;
        originY = rect.y + rect.height / 2;
      }

      // 1. Start icon rotation micro-animation
      setIsRotating(true);

      // 2. Add smooth theme transition class to root
      document.documentElement.classList.add("theme-transitioning");

      // 3. Trigger Flash Overlay (Bloom in-out)
      setFlashState({
        active: true,
        toTheme: target,
        x: originX,
        y: originY,
      });

      // 4. At the flash apex (~360ms into the animation, slow build-up peak), swap the theme colors
      setTimeout(() => {
        document.documentElement.setAttribute("data-theme", target);
        try {
          localStorage.setItem("data-theme", target);
        } catch {}
        try {
          setTheme(target);
        } catch {}
        setActiveTheme(target);
      }, 360);

      // 5. Clean up flash overlay and transition class when animation finishes (~560ms)
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => {
        setFlashState((prev) => ({ ...prev, active: false }));
        setIsRotating(false);
        document.documentElement.classList.remove("theme-transitioning");
      }, 560);
    },
    [getResolvedTheme, setTheme],
  );

  // When dark, display sun icon ("light") to switch to light mode.
  // When light, display moon icon ("dark") to switch to dark mode.
  const icon = activeTheme === "dark" ? "light" : "dark";
  const targetLabel = activeTheme === "dark" ? "light" : "dark";

  return (
    <>
      <div ref={buttonRef} style={{ display: "inline-flex" }}>
        <ToggleButton
          prefixIcon={icon}
          onClick={toggleTheme}
          onTouchEnd={toggleTheme}
          aria-label={`Switch to ${targetLabel} mode`}
          className={isRotating ? styles.iconRotating : undefined}
          style={{
            touchAction: "manipulation",
            minWidth: "36px",
            minHeight: "36px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Radiant In-Out Flash Overlay */}
      {mounted &&
        flashState.active &&
        createPortal(
          <div
            className={`${styles.flashOverlay} ${
              flashState.toTheme === "light"
                ? styles.flashToLight
                : styles.flashToDark
            }`}
            style={
              {
                "--flash-x": `${flashState.x}px`,
                "--flash-y": `${flashState.y}px`,
              } as React.CSSProperties
            }
          />,
          document.body,
        )}
    </>
  );
};


