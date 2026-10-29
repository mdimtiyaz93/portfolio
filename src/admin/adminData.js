export const initialData = {
  hero: {
    name: "Md Imtiyaz",
    role: "Full Stack Developer",
    tagline: "Building modern web experiences.",
    resumeUrl: "",
  },
  about: {
    heading: "About Me",
    description:
      "I am a Computer Science Engineering student interested in full-stack development.",
    experience: "Fresher",
    projectsCompleted: "3",
  },
  skills: {
    technical: "Java, JavaScript, React, Node.js, Express.js, MongoDB",
    tools: "Git, GitHub, VS Code, Postman",
  },
  projects: {
    wanderlust: {
      title: "Wanderlust",
      description: "A full-stack travel listing application.",
      demo: "https://wanderlust-hfhq.onrender.com/",
      github: "",
    },
    videoCall: {
      title: "Apna Video Call",
      description: "A real-time video calling application.",
      demo: "https://apna-video-call-xw3s.onrender.com",
      github: "https://github.com/mdimtiyaz93/Apna-video-call",
    },
    watchUp: {
      title: "WatchUp",
      description: "A synchronized video watching application.",
      demo: "",
      github: "https://github.com/mdimtiyaz93/WatchUp",
    },
  },
  contact: {
    email: "",
    github: "https://github.com/mdimtiyaz93",
    linkedin: "https://www.linkedin.com/in/md-imtiyaz-765981372",
    instagram: "https://www.instagram.com/md_imtiyaz93/",
    x: "https://x.com/imtiyaz9341",
  },
  stats: {
    projects: "3",
    experience: "Fresher",
    learning: "MERN Stack",
  },
  settings: {
    siteTitle: "Md Imtiyaz | Developer Portfolio",
    maintenance: "false",
  },
};

export const navGroups = [
  {
    title: "WORKSPACE",
    items: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "health", label: "Health", icon: "HeartPulse" },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { id: "projects", label: "Project Manager", icon: "FolderKanban" },
      { id: "hero", label: "Hero & Personal", icon: "PanelsTopLeft" },
      { id: "about", label: "About & Stats", icon: "ChartNoAxesCombined" },
      { id: "skills", label: "Skills", icon: "Code2" },
      { id: "contact", label: "Contact & Socials", icon: "Mail" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { id: "inbox", label: "Inquiries Inbox", icon: "Inbox" },
      { id: "settings", label: "Settings", icon: "Settings" },
      { id: "backup", label: "Backup", icon: "Database" },
    ],
  },
];

export const sectionNames = Object.fromEntries(
  navGroups.flatMap((group) =>
    group.items.map((item) => [item.id, item.label]),
  ),
);
