"use client";

import {
  Carousel,
  Column,
  Flex,
  Heading,
  Icon,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  link: string;
  tags?: string[];
  category?: string;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  link,
  tags = [],
  index = 0,
}) => {
  const projectLink = href || link;

  return (
    <div
      className={styles.projectCardContainer}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <Column fillWidth gap="m">
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
      <Flex
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex flex={5} direction="column" gap="8">
            {projectLink ? (
              <SmartLink
                href={projectLink}
                className={styles.titleLink}
              >
                <Heading as="h2" wrap="balance" variant="heading-strong-xl">
                  {title}
                </Heading>
                <span className={styles.arrowIcon}>
                  <Icon name="arrowUpRight" size="m" />
                </span>
              </SmartLink>
            ) : (
              <Heading as="h2" wrap="balance" variant="heading-strong-xl">
                {title}
              </Heading>
            )}

            {tags && tags.length > 0 && (
              <div className={styles.tagList}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.techPill}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Flex>
        )}
        {(description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            <div className={styles.projectActions}>
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  className={styles.actionButton}
                  href={href}
                >
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  className={styles.actionButton}
                  href={link}
                >
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              )}
            </div>
          </Column>
        )}
      </Flex>
    </Column>
  </div>
  );
};
