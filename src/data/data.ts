// All portfolio content lives here. Edit this file to update the site.

export interface Job {
  company: string;
  short: string; // label on the timeline bar
  tile: string; // monogram on the card
  role: string;
  from: string; // "YYYY-MM"
  to?: string; // omit for the current job
  summary: string;
  projects: string[];
  awards?: string[];
}

export interface Project {
  title: string;
  org?: string;
  copy: string;
  tags: string[];
  links?: { label: string; href: string }[];
  video?: boolean;
}

export const PROFILE = {
  first: "Bhavesh",
  last: "Bafana",
  role: "Frontend Developer",
  summary:
    "Frontend Developer with 4.5+ years building scalable, high-performance React and Next.js apps for enterprise clients including Verizon, Honeywell and Mastercard.",
  resume: "/React-developer-Bhavesh_Bafana.pdf",
  email: "bafanabrb@gmail.com",
  phone: "+91 8805798998",
  linkedin: "https://www.linkedin.com/in/bhaveshbafana",
  education: { degree: "B.E. Mechanical Engineering", school: "Savitribai Phule Pune University", year: 2020 },
};

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Web Technologies", items: ["JavaScript", "TypeScript", "HTML5", "CSS3"] },
  {
    group: "Libraries & Frameworks",
    items: ["React", "Redux", "Next.js", "React Query", "React Router", "jQuery", "LESS", "GraphQL", "REST API", "Jest", "React Testing Library"],
  },
  { group: "Databases", items: ["MySQL", "PostgreSQL"] },
  { group: "Tools", items: ["Git", "GitHub", "Bitbucket", "Jira", "Figma", "VS Code"] },
];

export const JOBS: Job[] = [
  {
    company: "Infosys",
    short: "Infosys",
    tile: "INFY",
    role: "Senior Associate Consultant",
    from: "2025-11",
    summary: "Modernizing legacy applications for Verizon by migrating them into an existing production React application.",
    projects: ["Verizon"],
  },
  {
    company: "Tata Consultancy Services",
    short: "TCS",
    tile: "TCS",
    role: "Software Engineer",
    from: "2022-05",
    to: "2025-10",
    summary:
      "Built and optimized enterprise web experiences for Honeywell, Mastercard and Exelon, from high-traffic e-commerce pages to reusable media components.",
    projects: ["Honeywell", "Mastercard", "Exelon"],
    awards: ["Star of the Month", "On-the-Spot ×2"],
  },
];

export const CLIENT_PROJECTS: Project[] = [
  {
    title: "Verizon — Application Modernization",
    org: "Infosys · Client project",
    copy: "Migrating two legacy applications into an existing production React app alongside its wireless workflows, with dedicated routing and a separate Redux store that keeps the new flow isolated.",
    tags: ["React", "Redux", "REST API", "PostgreSQL"],
  },
  {
    title: "Honeywell Building Solutions",
    org: "TCS · Client project",
    copy: "B2B e-commerce platform. Developed and optimized the Cart, Product Detail, Checkout and Order Confirmation pages, plus data tables built for large datasets.",
    tags: ["React", "Redux", "JavaScript"],
  },
  {
    title: "Mastercard — Currency Conversion",
    org: "TCS · Client project",
    copy: "A responsive currency conversion page that converts in real time as users change currencies and amounts, with animated dropdowns and transitions, working across browsers.",
    tags: ["JavaScript", "HTML5", "CSS3"],
  },
  {
    title: "Exelon Corporation",
    org: "TCS · Client project",
    copy: "Reusable, responsive React components for multimedia content, including video cards that autoplay on hover and pause on leave using the HTML5 video API.",
    tags: ["React", "HTML5", "CSS3"],
    video: true,
  },
];

export const PERSONAL_PROJECTS: Project[] = [
  {
    title: "Mauli — Pregnancy Care App",
    copy: "A mobile-first maternal health app in English, Hindi and Marathi for rural and semi-urban patients, with symptom tracking, reminders and appointments, plus AI guidance kept safe by a rule-based risk engine.",
    tags: ["Next.js", "React", "TypeScript", "Supabase", "LLM API"],
  },
  {
    title: "Garden OS — Smart Gardening Assistant",
    copy: "A cross-platform gardening app with plant, seed and harvest tracking and offline support, backed by a rules engine that schedules daily care for about 140 plant species using growth stage, season and live weather.",
    tags: ["React Native (Expo)", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
  },
  {
    title: "Pitchside — 3D Stadium Seat Selection",
    copy: "See your seat before you book. A cricket ticketing concept where you rotate a full 3D stadium, tap any seat and see the exact match-day view before paying.",
    tags: ["React", "React Three Fiber", "Three.js", "Drei", "GSAP", "Zustand", "Vite"],
    links: [{ label: "GitHub", href: "https://github.com/devbrb/Cricket-match-ticket-booking" }],
  },
  {
    title: "AI Code Guard",
    org: "Open source",
    copy: "An AI agent skill that reviews every code change against the repository it lands in, and catches security, performance and maintainability problems before they ship.",
    tags: ["Node.js", "JavaScript", "AI agents", "Git", "ESLint", "npm"],
    links: [
      { label: "GitHub", href: "https://github.com/devbrb/ai-code-guard-skill" },
      { label: "npm", href: "https://www.npmjs.com/package/ai-code-guard-skill" },
    ],
  },
  {
    title: "3D Train Seat Booking",
    copy: "Pick a travel class and book berths in a 3D Indian Railways coach from three synced views: an orbit model, an eye-level walkthrough down the aisle, and an exploded floor plan. All five classes, from General to 1AC, are modelled to real interior dimensions.",
    tags: ["React", "React Three Fiber", "Three.js", "Drei", "Zustand", "Vite"],
    links: [{ label: "GitHub", href: "https://github.com/devbrb/3D-train-seat-booking-concept" }],
  },
  {
    title: "Fab Thread — eCommerce",
    copy: "An eCommerce platform with dynamic product listings, user authentication, and real-time database interactions.",
    tags: ["React", "Redux", "React Query", "React Router", "Supabase"],
    links: [
      { label: "Live", href: "https://fabthread.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Bhavesh210996/The-Fab-Thread-ecomm" },
    ],
  },
];

export const AWARDS = ["Star of the Month", "On-the-Spot Award (twice)"];
