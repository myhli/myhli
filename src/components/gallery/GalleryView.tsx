"use client";

import React from "react";
import { Column, Heading, SmartLink, Text, Icon } from "@once-ui-system/core";
import { gallery } from "@/resources";
import styles from "./GalleryView.module.scss";

export default function GalleryView() {
  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <Column gap="4">
          <Heading as="h1" variant="heading-strong-xl">
            {gallery.title}
          </Heading>
          <span style={{ color: "var(--neutral-on-background-weak)", fontSize: "0.95rem" }}>
            Visual photography & multimedia showcase
          </span>
        </Column>
        <span className={styles.countBadge}>Status: Disabled</span>
      </div>

      {/* Coming Soon Hero Card */}
      <div className={styles.comingSoonCard}>
        <div className={styles.comingSoonBadge}>
          <span className={styles.pulseDot} />
          COMING SOON
        </div>

        <Heading as="h2" variant="display-strong-m" wrap="balance" style={{ textAlign: "center" }}>
          Gallery In Curation
        </Heading>

        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          wrap="balance"
          style={{ textAlign: "center", maxWidth: "480px", lineHeight: "1.6" }}
        >
          This gallery is temporarily disabled while a new editorial collection of photography, videography, and digital media captures is being curated and processed.
        </Text>

        <div className={styles.comingSoonGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Archive Status</span>
            <span className={styles.metaValue}>In Production</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Curator</span>
            <span className={styles.metaValue}>Irham Mada Izzatila</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Expected</span>
            <span className={styles.metaValue}>2026 Collection</span>
          </div>
        </div>

        <SmartLink href="/work" className={styles.actionBtn}>
          <Text variant="body-default-s">Explore Projects</Text>
          <Icon name="arrowRight" size="xs" />
        </SmartLink>
      </div>
    </div>
  );
}
