"use client";

import { useEffect, useState } from "react";

import { Fade, Flex, Row } from "@once-ui-system/core";

import { display, person } from "@/resources";
import { LiquidNavbar } from "./navigation/LiquidNavbar";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  return (
    <>
      <Fade
        s={{ hide: true }}
        fillWidth
        position="fixed"
        height="80"
        zIndex={9}
        style={{ pointerEvents: "none" }}
      />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="104"
        zIndex={9}
        style={{ pointerEvents: "none" }}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={10}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row
          s={{ hide: true }}
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
        >
          {display.location && <Row>{person.location}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <LiquidNavbar />
        </Row>
        <Flex
          s={{ hide: true }}
          fillWidth
          horizontal="end"
          vertical="center"
        >
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            {display.time && <TimeDisplay timeZone={person.location} />}
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
