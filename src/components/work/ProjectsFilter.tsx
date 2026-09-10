"use client";

import React, { useState, useMemo } from "react";
import { ProjectCard } from "@/components";
import styles from "./ProjectsFilter.module.scss";

interface PostItem {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    images: string[];
    category?: string;
    tags?: string[];
    team?: { name: string; role: string; avatar: string; linkedIn: string }[];
    link?: string;
  };
  content: string;
}

interface ProjectsFilterProps {
  projects: PostItem[];
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const list = ["All"];
    projects.forEach((p) => {
      if (p.metadata.category && !list.includes(p.metadata.category)) {
        list.push(p.metadata.category);
      }
    });
    return list;
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.metadata.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div className={styles.filterContainer}>
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className={styles.categoryBar} role="tablist" aria-label="Project categories">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => p.metadata.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.categoryBtn} ${isActive ? styles.activeBtn : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className={styles.categoryCount}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Projects List */}
      <div className={styles.projectsList}>
        {filteredProjects.map((post, index) => (
          <ProjectCard
            key={post.slug}
            index={index}
            priority={index < 2}
            href={`/work/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            tags={post.metadata.tags}
            category={post.metadata.category}
            link={post.metadata.link || ""}
          />
        ))}
      </div>
    </div>
  );
};
