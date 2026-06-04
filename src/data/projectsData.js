// Spring 2026 Projects Data
// Data sourced from project registration form

// Project logos - enabled logos
import tinyvillageLogo from '../images/projects/tinyvillage.png';
import atlasLogo from '../images/projects/atlas.png';
import matXLogo from '../images/projects/matX.svg';
import chessblitzLogo from '../images/projects/chessblitz.png';
import copatibleLogo from '../images/projects/copatible.png';
import operativeLogo from '../images/projects/operative.svg';
import nexusLogo from '../images/projects/nexus.png';
import ibmLogo from '../images/projects/ibm.png';
import bmLogo from '../images/projects/bm.png';

// Unused logos - uncomment when ready
// import educalLogo from '../images/projects/educal.svg';
// import fonarLogo from '../images/projects/fonar.svg';
// import gisticeLogo from '../images/projects/gistice-league.svg';
// import syncrateLogo from '../images/projects/syncrate.svg';
// import huddleLogo from '../images/projects/huddle.svg';
// import tracklistLogo from '../images/projects/tracklist.svg';
// import matchlabLogo from '../images/projects/matchlab.svg';
// import sightlineLogo from '../images/projects/sightline.svg';

export const sectionInfo = {
  client: {
    title: "Client",
    description: "Build real products with startups, nonprofits, and companies beyond Berkeley.",
    color: "#9BE9FF" // blue
  },
  passion: {
    title: "Passion",
    description: "Pitch and develop intermediate to advanced projects driven by your interests.",
    color: "#FDFFBC" // yellow
  },
  competitive: {
    title: "Competitive",
    description: "Work in teams to turn MVPs into production-ready solutions with PM mentorship.",
    color: "#97FFC7" // green
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
      logo: copatibleLogo,
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
      id: 9,
      name: "Operative",
      logo: operativeLogo,
      pms: ["Sainik Ghosh", "Justin Le"],
      description: "Operative is an advanced systems project focused on building an AI-powered cybersecurity platform that can learn tools, plan investigations, and execute workflows autonomously. The project combines backend infrastructure, agentic AI systems, and frontend interfaces to simulate a next-generation Security Operations Center (SOC).",
      difficulty: 3,
      clientName: "Operative",
    },
    {
      id: 3,
      name: "Atlas",
      logo: atlasLogo,
      pms: ["Anupriya Islam", "Andre Ramos", "Erin Lee"],
      description: "Atlas is an internal data and AI-powered platform built for LG NOVA that brings company-wide information into one place using AI-generated summaries, intelligent search, and interactive views to support everyday work and decision-making.",
      difficulty: 4,
      clientName: "LG NOVA",
      coffeeChatRequired: true
    },
    {
      id: 4,
      name: "Nexus",
      logo: nexusLogo,
      pms: ["Andrew Zhou", "Ganesh Karayi", "Jayden Szeto", "Arnav Mahadev"],
      description: "Nexus is a company relationship visualization platform that transforms iPick.ai's scattered data into an interactive graph database. Users can explore competitor, supplier, and subsidiary relationships between 8,000+ companies through a D3.js force-directed visualization, with AI-powered relationship suggestions and an admin panel for data curation.",
      difficulty: 4,
      clientName: "iPick.ai",
      coffeeChatRequired: true
    },
    {
      id: 15,
      logo: matXLogo,
      name: "MatX",
      pms: ["Christopher Chang", "Jayden Lee", "Leo Park"],
      description: "We are looking to build a benchmarking platform that evaluates how efficiently different machine learning algorithms run on MatX hardware, measuring both algorithm and system level performance.",
      difficulty: 5,
      clientName: "MatX",
      coffeeChatRequired: true,
    },
    {
      id: 16,
      name: "IBM",
      logo: ibmLogo,
      pms: ["Jonathan Tran", "Diego Llamas", "Benjamin Huang"],
      description: "We're working with IBM to build an AI-powered simulation platform for international competitive events, integrating real-time commentary, live analytics, and intelligent team collaboration tools.",
      difficulty: 4,
      clientName: "IBM",
      coffeeChatRequired: true,
    },
    {
      id: 7,
      name: "Behn Meyer AgriCare",
      logo: bmLogo,
      pms: ["Jenny Liang", "Mia Salinas"],
      description: "Behn Meyer AgriCare is a loyalty and engagement platform that captures transaction data between distributors and retailers, giving them a way to submit invoices and redeem points while giving Behn Meyer direct visibility into sales and a channel to run promotions and technical support programs.",
      difficulty: 4,
      clientName: "Behn Meyer",
      coffeeChatRequired: true,
    }
  ],
  passion: [
    {
      id: 5,
      name: "Huddle",
      // logo: huddleLogo,
      pms: ["Annie Lin", "Parsa Faraji Alamouti"],
      description: "Huddle is a collaborative study app making it easier to find the right people and places to study with! It matches students into study groups and recommends locations on or near the Berkeley campus based on shared preferences, availability, and feedback from prior study sessions.",
      difficulty: 2
    },
    {
      id: 6,
      name: "TRACKLIST",
      // logo: tracklistLogo,
      pms: ["Jessica Chiu", "Megan Nguyen"],
      description: "TRACKLIST is a music rating and review web app inspired by Letterboxd (for movies) and Beli (for restaurants). Users can search for any album, EP, or song, give it a star rating out of 5, write a short review, and build a personal profile that showcases everything they have listened to and loved.",
      difficulty: 3
    },
    {
      id: 8,
      name: "Fonar",
      // logo: fonarLogo,
      pms: ["Nishaad Sovani", "Ben Ross"],
      description: "Fonar streamlines phone calls by showing when your contacts are available and using an AI secretary to remember what was said.",
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
      logo: chessblitzLogo,
      pms: ["Yashom Kapoor", "Peter Lourenco"],
      description: "ChessBlitz is building an educational chess tactics app for K-5 students by using AI-personalized hints, gamification, and a fun interface to make learning chess stimulating and accessible for young beginners.",
      difficulty: 2
    },
    {
      id: 12,
      name: "MatchLab",
      // logo: matchlabLogo,
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
      name: "Syncrate",
      // logo: syncrateLogo,
      pms: ["Felicia Ye", "Helena Zhang"],
      description: "Syncrate is a warehouse operating system that helps private warehouse owners better communicate with retailers. By centralizing real-time updates and analytics-ready information, it reduces errors and enables more efficient, data-driven warehouse operations.",
      difficulty: 2
    }
  ]
};
