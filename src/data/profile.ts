export const profile = {
  name: "Divya Prakash",
  role: "Frontend Engineer",
  focus: "design systems, accessibility",
  email: "divyaprakash2999@gmail.com",
  location: "Boston, MA",
  github: "https://github.com/divyaprakash29",
  linkedin: "https://linkedin.com/in/divya-prakash29/",
  lede:
    "I build interfaces the way I test them — with real users, not just unit tests. Three years shipping production React at Prodapt Solutions, now sharpening the design side of that equation at Northeastern.",
};

// Drawn from real résumé facts — 3 yrs at Prodapt, 4 featured projects,
// and the measured perf win from the code-splitting work. Don't inflate these.
export const stats = [
  { value: "3+", label: "Years of Experience" },
  { value: "4", label: "Projects Shipped" },
  { value: "35%", label: "Faster Load Times" },
];

// Mirrors "Divya Prakash_FrontEnd_Engineer.pdf" (WORK EXPERIENCE section).
// Wording is trimmed for the web but every claim and number is from the
// résumé — keep it that way.
export const experience = [
  {
    company: "Prodapt Solutions",
    location: "India",
    title: "Software Engineer",
    dates: "Oct 2021 – Aug 2024",
    highlights: [
      {
        text: "Built responsive web applications with JavaScript, Next.js, Tailwind CSS, and Material UI across telecom customer platforms.",
        stat: "+20% user engagement",
      },
      {
        text: "Designed and integrated RESTful APIs with Axios for real-time data flow across billing and service-management systems.",
        stat: "−25% support requests",
      },
      {
        text: "Cut load times with code splitting and lazy loading while keeping Lighthouse scores above 90.",
        stat: "−35% load time",
      },
      {
        text: "Turned Figma and Balsamiq wireframes into production-ready UI with cross-functional agile teams.",
        stat: "+20% faster delivery",
      },
      {
        text: "Validated UI with Jest and ran usability testing aligned with user-centered design.",
        stat: "−30% UI defects",
      },
    ],
  },
  {
    company: "Tech Fortune Technologies",
    location: "India",
    title: "Front End Engineer Intern",
    dates: "Mar 2021 – Apr 2021",
    highlights: [
      {
        text: "Built responsive UI components with React.js, TypeScript, and Redux for cross-device compatibility.",
        stat: "−20% UI inconsistencies",
      },
      {
        text: "Implemented Redux Toolkit state management and optimized rendering performance.",
        stat: "−25% component load time",
      },
      {
        text: "Collaborated on prototyping and interaction design with Framer and Notion, contributing to design systems.",
        stat: null,
      },
    ],
  },
];

export const projects = [
  {
    slug: "hustlehub",
    tag: "HustleHub",
    desc: "A full-stack freelance marketplace — clients post work, freelancers bid, Stripe handles the money.",
    detail:
      "Built solo end to end: schema design, REST API, and the React client. PWA install prompts kept freelancers checking bids without an app-store detour.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "PWA"],
    stat: null,
    href: "https://github.com/divyaprakash29/Hustle-Hub",
  },
  {
    slug: "libraryapp",
    tag: "LibraryApp",
    desc: "Northeastern's library, redesigned mobile-first. Room booking and event discovery, shaped by real usability testing.",
    detail:
      "Ran usability testing with 15+ users on paper and Figma prototypes before a line of code shipped. The room-booking flow changed twice because of what those sessions turned up.",
    stack: ["Figma", "UX Research", "Prototyping", "Accessibility"],
    stat: "−40% booking steps",
    href: "https://github.com/divyaprakash29/Northeastern_Library_App",
  },
  {
    slug: "healthsystem",
    tag: "HealthSystem",
    desc: "Patient records and diagnostics for a clinical front desk, built to hold up during a busy shift.",
    detail:
      "A coursework capstone: one shared patient database behind a Java Swing front end, built for three role types — front desk, nursing, and diagnostics.",
    stack: ["Java Swing", "Systems Design"],
    stat: null,
    href: "https://github.com/divyaprakash29/Hospital-Management-System",
  },
  {
    slug: "cloudnativeapp",
    tag: "CloudNativeApp",
    desc: "A FastAPI backend that deploys itself — Terraform for infrastructure, GitHub Actions for everything after git push.",
    detail:
      "Infrastructure as code from day one — a single Terraform apply stands up the VPC and RDS instance, and GitHub Actions deploys on every push to main.",
    stack: ["Python", "FastAPI", "AWS", "Terraform", "CI/CD"],
    stat: null,
    href: "https://github.com/divyaprakash29/webapp",
  },
];

export type Project = (typeof projects)[number];

export const skills = [
  {
    group: "frontend",
    path: "src/",
    items: [
      "React.js",
      "Redux",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "jQuery",
      "Framer Motion",
    ],
  },
  {
    group: "backend",
    path: "src/",
    items: ["Node.js", "Express.js", "FastAPI", "REST APIs", "Java", "Python"],
  },
  {
    group: "data",
    path: "src/",
    items: ["MongoDB", "MySQL", "PostgreSQL", "NoSQL"],
  },
  {
    group: "ux",
    path: "design/",
    items: [
      "Figma",
      "Framer",
      "Balsamiq",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
      "Accessibility",
    ],
  },
  {
    group: "tools",
    path: "./",
    items: ["Git", "Postman", "JIRA", "Confluence", "Notion"],
  },
];

export const aboutViews = {
  engineer: [
    { key: "role", value: "Frontend Engineer" },
    { key: "based", value: "Boston, MA" },
    { key: "degree", value: "M.S. Information Systems" },
    { key: "school", value: "Northeastern, 2026" },
    { key: "prior", value: "B.E. Information Science, 2021" },
  ],
  designer: [
    { key: "role", value: "UX-minded engineer" },
    { key: "toolkit", value: "Figma, Framer, Balsamiq" },
    { key: "practice", value: "usability testing, design systems" },
    { key: "belief", value: "the interface is the product" },
  ],
};
