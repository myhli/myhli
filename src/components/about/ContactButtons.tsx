"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@once-ui-system/core";
import styles from "./ContactButtons.module.scss";

interface SocialItem {
  name: string;
  icon: string;
  link: string;
  essential?: boolean;
}

interface ContactButtonsProps {
  items: SocialItem[];
  emailAddress: string;
}

export const ContactButtons: React.FC<ContactButtonsProps> = ({ items, emailAddress }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
      setCopied(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2600);
    } else {
      // Fallback: trigger mailto directly
      window.location.href = `mailto:${emailAddress}`;
    }
  };

  return (
    <div className={styles.contactGroup}>
      {items
        .filter((item) => item.essential)
        .map((item) => {
          const isEmail = item.name.toLowerCase() === "email" || item.link.startsWith("mailto:");

          if (isEmail) {
            return (
              <button
                key={item.name}
                type="button"
                className={styles.actionBtn}
                onClick={handleEmailClick}
                aria-label={`Copy email address ${emailAddress}`}
                title="Click to copy email address"
              >
                <Icon name={item.icon as any} size="xs" />
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              aria-label={`Visit ${item.name}`}
            >
              <Icon name={item.icon as any} size="xs" />
              <span>{item.name}</span>
            </a>
          );
        })}

      {/* Tactile Feedback Toast */}
      {mounted &&
        copied &&
        createPortal(
          <div className={styles.toastPill} role="status" aria-live="polite">
            <span className={styles.toastDot} />
            <span>Email copied to clipboard ({emailAddress})</span>
          </div>,
          document.body
        )}
    </div>
  );
};
