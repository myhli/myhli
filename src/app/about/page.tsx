import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Media,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
  SmartLink,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import { ContactButtons } from "@/components/about/ContactButtons";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];

  return (
    <Column maxWidth="m" paddingTop="24" fillWidth>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Floating Table of Contents (auto-hidden on screens <= 1360px) */}
      {about.tableOfContent.display && (
        <TableOfContents structure={structure} about={about} />
      )}

      <Row fillWidth s={{ direction: "column" }} horizontal="center" gap="xl">
        {/* Left Sticky Column */}
        {about.avatar.display && (
          <Column
            className={styles.avatarColumn}
            top="80"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <div className={styles.avatarWrap}>
              <Avatar src={person.avatar} size="xl" />
            </div>
            <Row gap="8" vertical="center">
              <Icon onBackground="neutral-weak" name="globe" />
              <span className={styles.monoMeta}>{person.location}</span>
            </Row>

            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8" horizontal="center">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="s">
                    <span className={styles.monoMeta}>{language}</span>
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}

        {/* Right Main Flow */}
        <Column className={styles.blockAlign} flex={9} fillWidth maxWidth={52}>
          {/* Identity & Header Block */}
          <Column
            id={about.intro.title}
            className={styles.sectionContainer}
            fillWidth
            vertical="center"
            marginBottom="32"
          >
            <div className={styles.availabilityPill}>
              <span>Available for select projects</span>
            </div>

            <Heading
              className={styles.textAlign}
              variant="display-strong-xl"
              style={{ letterSpacing: "-0.035em" }}
            >
              {person.name}
            </Heading>

            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
              style={{ marginTop: "4px" }}
            >
              {person.role}
            </Text>

            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="16"
                paddingBottom="4"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
              >
                <ContactButtons items={social} emailAddress={person.email} />
              </Row>
            )}
          </Column>

          {/* Intro description */}
          {about.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="48">
              {about.intro.description}
            </Column>
          )}

          {/* Work Experience Section - Full Width Uncrowded Cards */}
          {about.work.display && (
            <Column
              id={about.work.title}
              className={styles.sectionContainer}
              fillWidth
              marginBottom="48"
            >
              <Row className={styles.sectionHeader}>
                <Heading as="h2" variant="heading-strong-l">
                  {about.work.title}
                </Heading>
                <span className={styles.timeframeBadge}>
                  {about.work.experiences.length} positions
                </span>
              </Row>

              <Column fillWidth gap="16">
                {about.work.experiences.map((experience, index) => {
                  const isFeatured = index === 0;

                  return (
                    <div
                      key={`${experience.company}-${experience.role}-${index}`}
                      className={`${styles.experienceCard} ${
                        isFeatured ? styles.featuredCard : ""
                      }`}
                    >
                      <div className={styles.experienceHeader}>
                        <div className={styles.experienceTitleGroup}>
                          {experience.link ? (
                            <SmartLink
                              href={experience.link}
                              className={styles.companyLink}
                            >
                              <Text id={experience.company} variant="heading-strong-m" onBackground="neutral-strong">
                                {experience.company}
                              </Text>
                              <span className={styles.linkIcon}>
                                <Icon name="arrowUpRight" size="xs" />
                              </span>
                            </SmartLink>
                          ) : (
                            <Text id={experience.company} variant="heading-strong-m" onBackground="neutral-strong">
                              {experience.company}
                            </Text>
                          )}
                          <span className={styles.roleBadge}>{experience.role}</span>
                        </div>
                        <span className={styles.timeframeBadge}>{experience.timeframe}</span>
                      </div>

                      <ul className={styles.achievementsList}>
                        {experience.achievements.map(
                          (achievement: React.ReactNode, i: number) => (
                            <li key={`${experience.company}-${i}`}>
                              <Text
                                as="span"
                                variant="body-default-m"
                                onBackground="neutral-weak"
                              >
                                {achievement}
                              </Text>
                            </li>
                          ),
                        )}
                      </ul>

                      {experience.images && experience.images.length > 0 && (
                        <Row fillWidth paddingTop="m" gap="12" wrap>
                          {experience.images.map((image, i) => (
                            <Row
                              key={i}
                              border="neutral-medium"
                              radius="m"
                              minWidth={image.width}
                              height={image.height}
                            >
                              <Media
                                enlarge
                                radius="m"
                                sizes={image.width.toString()}
                                alt={image.alt}
                                src={image.src}
                              />
                            </Row>
                          ))}
                        </Row>
                      )}
                    </div>
                  );
                })}
              </Column>
            </Column>
          )}

          {/* Studies Section - Dedicated & Clear */}
          {about.studies.display && (
            <Column
              id={about.studies.title}
              className={styles.sectionContainer}
              fillWidth
              marginBottom="48"
            >
              <Row className={styles.sectionHeader}>
                <Heading as="h2" variant="heading-strong-l">
                  {about.studies.title}
                </Heading>
              </Row>

              <Column fillWidth gap="16">
                {about.studies.institutions.map((institution, index) => (
                  <div
                    key={`${institution.name}-${index}`}
                    className={styles.experienceCard}
                  >
                    <div className={styles.experienceHeader}>
                      <div className={styles.experienceTitleGroup}>
                        <Text id={institution.name} variant="heading-strong-m">
                          {institution.name}
                        </Text>
                        <span className={styles.roleBadge}>
                          Software & Game Development (PPLG)
                        </span>
                      </div>
                      <span className={styles.timeframeBadge}>Kudus, Indonesia</span>
                    </div>
                    <Text
                      variant="body-default-m"
                      onBackground="neutral-weak"
                      style={{ marginTop: "4px", lineHeight: "1.6" }}
                    >
                      {institution.description}
                    </Text>
                  </div>
                ))}
              </Column>
            </Column>
          )}

          {/* Technical Skills Section - Balanced Responsive Grid */}
          {about.technical.display && (
            <Column
              id={about.technical.title}
              className={styles.sectionContainer}
              fillWidth
              marginBottom="48"
            >
              <Row className={styles.sectionHeader}>
                <Heading as="h2" variant="heading-strong-l">
                  {about.technical.title}
                </Heading>
              </Row>

              <div className={styles.skillsGrid}>
                {about.technical.skills.map((skill, index) => (
                  <div key={`${skill.title}-${index}`} className={styles.skillCard}>
                    <Text id={skill.title} variant="heading-strong-m">
                      {skill.title}
                    </Text>

                    <Text
                      variant="body-default-m"
                      onBackground="neutral-weak"
                      style={{ lineHeight: "1.6" }}
                    >
                      {skill.description}
                    </Text>

                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" style={{ marginTop: "auto", paddingTop: "8px" }}>
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="s" prefixIcon={tag.icon}>
                            <span className={styles.monoMeta}>{tag.name}</span>
                          </Tag>
                        ))}
                      </Row>
                    )}

                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, i) => (
                          <Row
                            key={i}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <Media
                              enlarge
                              radius="m"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </div>
                ))}
              </div>
            </Column>
          )}
        </Column>
      </Row>
    </Column>
  );
}