export const profile = {
  name: "Divya Prakash",
  role: "Frontend Engineer",
  focus: "design systems, accessibility",
  email: "divyaprakash2999@gmail.com",
  location: "Boston, MA",
  github: "https://github.com/divyaprakash29",
  linkedin: "https://linkedin.com/in/divya-prakash29/",
  lede:
    "I build interfaces the way I test them — with real users, not just unit tests. Two years shipping production React at Prodapt Solutions, now sharpening the design side of that equation at Northeastern.",
};

// Drawn from real résumé facts — 2 yrs at Prodapt, 4 featured projects,
// and the measured perf win from the code-splitting work. Don't inflate these.
export const stats = [
  { value: "2+", label: "Years of Experience" },
  { value: "4", label: "Projects Shipped" },
  { value: "35%", label: "Faster Load Times" },
];

export const experience = [
  {
    hash: "a3f9c2e",
    company: "Prodapt Solutions",
    title: "Software Engineer",
    dates: "Oct 2021 – Aug 2023",
    scope: "feat(ui):",
    message: "responsive component overhaul",
    detail: "Rebuilt core flows for consistency across breakpoints and devices.",
    stat: "+20% user engagement",
  },
  {
    hash: "7b1e881",
    company: "Prodapt Solutions",
    title: "Software Engineer",
    dates: "Oct 2021 – Aug 2023",
    scope: "fix(api):",
    message: "trim redundant calls, tighten error states",
    detail: "Optimized request patterns behind the slowest support-ticket flows.",
    stat: "−25% support tickets",
  },
  {
    hash: "d92a41f",
    company: "Prodapt Solutions",
    title: "Software Engineer",
    dates: "Oct 2021 – Aug 2023",
    scope: "perf(bundle):",
    message: "code-splitting + lazy loading",
    detail: "Deferred non-critical chunks on the routes users hit first.",
    stat: "+35% load performance",
  },
  {
    hash: "f04c10a",
    company: "Tech Fortune Technologies",
    title: "Front End Engineer Intern",
    dates: "Mar – Apr 2021",
    scope: "feat(components):",
    message: "React + TypeScript starter kit",
    detail: "Shared component patterns so future screens stopped reinventing them.",
    stat: "−20% UI inconsistencies",
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
  },
  {
    slug: "libraryapp",
    tag: "LibraryApp",
    desc: "Northeastern's library, redesigned mobile-first. Room booking and event discovery, shaped by real usability testing.",
    detail:
      "Ran three rounds of usability testing on paper and Figma prototypes before a line of code shipped. The room-booking flow changed twice because of what those sessions turned up.",
    stack: ["Figma", "UX Research", "Prototyping", "Accessibility"],
  },
  {
    slug: "healthsystem",
    tag: "HealthSystem",
    desc: "Patient records and diagnostics for a clinical front desk, built to hold up during a busy shift.",
    detail:
      "A coursework capstone: one shared patient database behind a Java Swing front end, built for three role types — front desk, nursing, and diagnostics.",
    stack: ["Java Swing", "Systems Design"],
  },
  {
    slug: "cloudnativeapp",
    tag: "CloudNativeApp",
    desc: "A FastAPI backend that deploys itself — Terraform for infrastructure, GitHub Actions for everything after git push.",
    detail:
      "Infrastructure as code from day one — a single Terraform apply stands up the VPC and RDS instance, and GitHub Actions deploys on every push to main.",
    stack: ["Python", "FastAPI", "AWS", "Terraform", "CI/CD"],
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
