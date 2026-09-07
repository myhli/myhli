import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Row } from "@once-ui-system/core";

const person: Person = {
  firstName: "Irham Mada",
  lastName: "Izzatila",
  name: `Irham Mada Izzatila`,
  role: "Software & Mobile Developer",
  avatar: "/images/profile.png",
  email: "irhammadaizzatila@gmail.com",
  location: "Asia/Jakarta",
  languages: ["Indonesian", "English"],
  locale: "en",
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/myhli",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/i.lhmm_19/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "Home",
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Welcome</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Featured Work</strong>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
      Hi, I'm {person.firstName},<br></br>
      a Software & Game Development student at SMK Raden Umar Said.
      Dedicated to crafting responsive web applications, mobile solutions, and engaging game experiences.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "Home",
  title: "Home",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        A dedicated technology student at SMK Raden Umar Said (Kudus), majoring in Software
        and Game Development (PPLG). Experienced in web and mobile development, visual design,
        multimedia production (photography & videography), and game programming.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Project Youth",
        timeframe: "2025 - Present",
        role: "Game Coder",
        link: "/work/project-youth-game-development",
        achievements: [
          <>
            Collaborative school project developing an interactive visual novel featuring the official SMK RUS mascot. Served as a Game Coder utilizing Ren'Py for narrative scripting, dialogue pruning, branching story routes, and character destiny meter mechanics.
          </>,
        ],
        images: [],
      },
      {
        company: "RUSMEDIA",
        timeframe: "2025 - Present",
        role: "Photographer & Videographer",
        link: "/work/rusmedia-creative-productions",
        achievements: [
          <>
            Operated professional camera equipment and produced comprehensive photo and video coverage for institutional and formal events.
          </>,
        ],
        images: [],
      },
      {
        company: "Fun Art Festival - 21",
        timeframe: "2025 - 2026",
        role: "Visual Concept & Digital Media Designer",
        link: "/work/rusmedia-creative-productions",
        achievements: [
          <>
            Designed visual branding concepts, engaging social media promotional assets, and broadcast layouts for live streaming productions.
          </>,
        ],
        images: [],
      },
      {
        company: "Freelance",
        timeframe: "2024 - 2026",
        role: "Web & Mobile Developer",
        link: "/work/bespoke-web-and-mobile-apps",
        achievements: [
          <>
            Architected and delivered bespoke web and mobile applications tailored to client specifications.
          </>,
          <>
            Managed end-to-end client communication, autonomous workflow execution, and timely project delivery.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "SMK Raden Umar Said",
        description: <>Software & Game Development (2026 - Present)</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Software & Web Development",
        description: (
          <>
            Building responsive user interfaces, programming application logic, and developing full-stack web solutions with JavaScript and Next.js.
          </>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
        images: [],
      },
      {
        title: "Design & Digital Media",
        description: (
          <>
            Crafting digital assets (2D illustration, vector graphics, and live stream overlays) along with UI/UX prototyping in Figma.
          </>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        images: [],
      },
      {
        title: "Hardware, Networking & Multimedia",
        description: (
          <>
            PC assembly, network and Wi-Fi configuration, and professional camera operation for photography and video documentation.
          </>
        ),
        tags: [
          {
            name: "PC Assembly",
          },
          {
            name: "Networking",
          },
          {
            name: "Videography",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: "Projects",
  description: `Design and dev projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery",
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
