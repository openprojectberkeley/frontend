// Spring 2026 Projects Data
// Data sourced from project registration form

// Project logos - enabled logos
import tinyvillageLogo from '../images/projects/tinyvillage.png';
import lgnovaLogo from '../images/projects/lgnova.webp';
import quantizeLogo from '../images/projects/quantize.svg';

// Unused logos - uncomment when ready
// import copatibleLogo from '../images/projects/copatible.svg';
// import nexusLogo from '../images/projects/nexus.svg';
// import educalLogo from '../images/projects/educal.svg';
// import fonarLogo from '../images/projects/fonar.svg';
// import gisticeLogo from '../images/projects/gistice-league.svg';
// import oskiopsLogo from '../images/projects/oskiops.svg';
// import sightlineLogo from '../images/projects/sightline.svg';

export const sectionInfo = {
  client: {
    title: "Client",
    description: "Build real products with startups, nonprofits, and companies beyond Berkeley.",
    color: "#4DB6AC" // teal
  },
  passion: {
    title: "Passion",
    description: "Pitch and develop intermediate to advanced projects driven by your interests.",
    color: "#9270C6" // purple
  },
  competitive: {
    title: "Competitive",
    description: "Work in teams of five to turn MVPs into production-ready solutions with PM mentorship.",
    color: "#FF9C03" // orange
  }
};

export const projectTypes = [
  "Full-Stack Applications: web and mobile software products",
  "Data & Analytics: AI chatbots, machine learning pipelines, dashboards",
  "Systems & Internal Tools: APIs, backend design, automation"
];

export const projects = {
  client: [
    {
      id: 1,
      name: "CoPatible",
      // logo: copatibleLogo,
      pms: ["Karthik Subramanian", "Zehra Naqvi"],
      description: "CoPatible is a voice-first platform that plans, books, and matches people into small, in-person experiences based on how they feel and the life chapter they're in. Our project focuses on building the MVP web app, voice prototypes, and AI-powered matching tools to connect founders in San Francisco.",
      difficulty: 4,
      clientName: "CoPatible"
    },
    {
      id: 2,
      name: "Village Hub",
      logo: tinyvillageLogo,
      pms: ["Charmi Buddaluru", "Harshini Pulivarthi"],
      description: "Village Hub is an app that serves the residents of youth tiny home communities formed by the non profit organization Tiny Village Spirit. Its main purpose is to be a centralizing tool that allows residents to check in and out of the village, book shared amenities, and more.",
      difficulty: 2,
      clientName: "Tiny Village Spirit"
    },
    {
      id: 3,
      name: "Atlas",
      logo: lgnovaLogo,
      pms: ["Anupriya Islam", "Andre Ramos"],
      description: "Atlas is an internal data and AI-powered platform built for LG NOVA that brings company-wide information into one place using AI-generated summaries, intelligent search, and interactive views to support everyday work and decision-making.",
      difficulty: 4,
      clientName: "LG NOVA",
      coffeeChatRequired: true
    },
    {
      id: 4,
      name: "Nexus",
      // logo: nexusLogo,
      pms: ["Andrew Zhou", "Ganesh Karayi", "Jayden Szeto"],
      description: "Nexus is a company relationship visualization platform that transforms iPick.ai's scattered data into an interactive graph database. Users can explore competitor, supplier, and subsidiary relationships between 8,000+ companies through a D3.js force-directed visualization, with AI-powered relationship suggestions and an admin panel for data curation.",
      difficulty: 4,
      clientName: "iPick.ai",
      coffeeChatRequired: true
    }
  ],
  passion: [
    {
      id: 5,
      name: "Huddle",
      pms: ["Annie Lin", "Parsa Faraji Alamouti"],
      description: "Huddle is a collaborative study app making it easier to find the right people and places to study with! It matches students into study groups and recommends locations on or near the Berkeley campus based on shared preferences, availability, and feedback from prior study sessions.",
      difficulty: 2
    },
    {
      id: 6,
      name: "QUANTIZE",
      logo: quantizeLogo,
      pms: ["Jessica Chiu", "Megan Nguyen", "Althea Rosales"],
      description: "Built by DJs for DJs, QUANTIZE is a booking platform that helps beginner/student DJs find their first stage and gain essential industry exposure. Simultaneously, it will provide venues with a straightforward tool to discover fresh talent that fits their unique atmosphere and budget.",
      difficulty: 3
    },
    {
      id: 7,
      name: "Cal Bites",
      pms: ["Jayden Lee", "Christopher Chang", "Leo Park"],
      description: "We're building a collaborative, student-driven dining app for UC Berkeley that goes beyond menus by letting students rate dishes, post reviews and photos, follow profiles, and get notified when highly rated or favorited items appear. The app also tracks dining hall performance trends and integrates meal plan info to give students both social and practical insights into campus dining.",
      difficulty: 3
    },
    {
      id: 8,
      name: "Fonar",
      // logo: fonarLogo,
      pms: ["Nishaad", "Ben Ross"],
      description: "Fonar streamlines phone calls by showing when your contacts are available and using an AI secretary to remember what was said.",
      difficulty: 3
    },
    {
      id: 9,
      name: "EduCal",
      // logo: educalLogo,
      pms: ["Sainik Ghosh", "Justin Le", "Khushi Bhalla"],
      description: "An educational tool made for grade school and college students, converting learning into gaming by taking in an assignment or exam and turns those into interactive games where students can learn without losing attention.",
      difficulty: 3
    },
    {
      id: 10,
      name: "GIStice League",
      // logo: gisticeLogo,
      pms: ["Emily Ma", "David Zhang"],
      description: "We will use spatial machine learning to quantify and predict grocery store inequities, proving that neighborhood demographics are a primary driver of resource access in urban environments.",
      difficulty: 3
    },
    {
      id: 11,
      name: "ChessBlitz",
      pms: ["Yashom Kapoor", "Peter Lourenco"],
      description: "Chess tactics app for K-5 students.",
      difficulty: 2
    },
    {
      id: 12,
      name: "MatchLab",
      pms: ["Noor Pirzada", "Surabhi Verma"],
      description: "Our project aims to create a web-based platform that helps students gain practical experience through short and structured micro-projects. The platform uses AI to generate beginner-friendly projects, match users to projects based on their skills and goals, and provide guidance when users get stuck.",
      difficulty: 3
    },
    {
      id: 13,
      name: "SightLine",
      // logo: sightlineLogo,
      pms: ["Chad Park", "Ryan Lin"],
      description: "SightLine connects to Meta Ray-Ban smart glasses to transform what you see and hear into real-time, structured notes. Perfect for lectures, meetings, and study sessions; no manual note-taking required.",
      difficulty: 3
    }
  ],
  competitive: [
    {
      id: 14,
      name: "OSKIOps",
      // logo: oskiopsLogo,
      pms: ["Felicia Ye", "Helena Zhang"],
      description: "OSKIOps is a warehouse operating system that helps private warehouse owners better communicate with retailers. By centralizing real-time updates and analytics-ready information, it reduces errors and enables more efficient, data-driven warehouse operations.",
      difficulty: 2
    }
  ]
};
