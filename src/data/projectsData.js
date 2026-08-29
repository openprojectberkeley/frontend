// Fall 2026 Projects Data

// Project logos - enabled logos
import tinyvillageLogo from '../images/projects/tinyvillage.png';
import atlasLogo from '../images/projects/atlas.png';
import chessblitzLogo from '../images/projects/chessblitz.png';
import nexusLogo from '../images/projects/nexus.png';

// Unused logos - uncomment when ready
// import matXLogo from '../images/projects/matX.svg';
// import copatibleLogo from '../images/projects/copatible.png';
// import operativeLogo from '../images/projects/operative.svg';
// import ibmLogo from '../images/projects/ibm.png';
// import bmLogo from '../images/projects/bm.png';
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
    title: "OP Studio",
    description: "For returning members looking to be involved in a more serious client project. Working with more experienced devs and PMs, you'll hone your skills and learn what tech looks like in industry.",
    color: "#9BE9FF" // blue
  },
  passion: {
    title: "OP Launch",
    description: "Your first steps in Open Project. Projects in OP Launch help grow your fundamentals in development and systems while becoming a part of our growing OP community! We have lots of passion and client projects - there's something here for everyone.",
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
      name: "Atlas",
      logo: atlasLogo,
      pms: ["Chester Duan", "Avaneesh Joshi", "Ojasvi Shrivastava", "Cindy Wang"],
      description: "An internal knowledge and project intelligence platform for LG NOVA that brings scattered project data, documents, and updates into one searchable workspace. Build dashboards, data integrations, and AI-powered discovery tools that help teams quickly find what they need and understand what's happening across the organization.",
      clientName: "LG NOVA"
    },
    {
      id: 2,
      name: "TCP (Traffic Control Patterns)",
      pms: ["Ashley Iattoni", "Benjamin Huang", "Dayton Phan"],
      description: "An AI-powered platform that turns the time-consuming process of drafting Traffic Control Plans into an automated workflow. Build tools that combine image analysis with official traffic-control standards to generate accurate engineering drawings for construction permits in minutes instead of hours.",
      clientName: "Traffic Patterns, LLC"
    },
    {
      id: 3,
      name: "Smpler",
      pms: ["Sainik Ghosh", "Justin Le"],
      description: "Smpler is an AI-powered SaaS platform helping institutional investment managers automate investment analysis, turning hours of manual work across messy Excels and PDFs into minutes. This project builds a data pipeline that ingests ~50 public real estate and economic data sources (cap rates, occupancy, job growth, migration trends) into a structured database with an analytics layer and API, so Smpler can benchmark deals against real market context."
    },
    {
      id: 4,
      name: "Village Hub",
      logo: tinyvillageLogo,
      pms: ["Felicia Ye", "Helena Zhang", "Emmanuel Elizalde-Ocampo"],
      description: "A community platform for clients Tiny Village Spirit and Hope Solutions that connects residents with support resources, meetings, and each other in one place. Work directly with staff and residents to design and build AI-powered tools, shared calendars, and community organizing features that address real community needs.",
      clientName: "Tiny Village Spirit & Hope Solutions"
    },
    {
      id: 5,
      name: "Nexus",
      logo: nexusLogo,
      pms: ["Ganesh Karayi", "Arnav Mahadev"],
      description: "AI-powered investment platform, utilizing real-time financial data and live news events to create a hub of information so that investors can make the most informed finance decisions possible.",
      clientName: "iPick.ai"
    }
  ],
  passion: [
    {
      id: 6,
      name: "Get to the Surface",
      pms: ["Turner Osswald"],
      description: "A 2D Foddian-style platformer where players climb from the Earth's core all the way into space, with each layer introducing new environments, movement mechanics, and obstacles. Build everything from pixel art and original music to physics-based gameplay inspired by games like Jump King and Pogostuck."
    },
    {
      id: 7,
      name: "CalConnect",
      pms: ["Leo Li", "Jamil Shirinov", "James Apuyan"],
      description: "A personalized tutoring platform that helps UC Berkeley students find peer tutors who match not only what they're learning, but how they learn best. Build an AI-assisted matching experience around courses, availability, learning styles, and personality to make finding the right academic support easier."
    },
    {
      id: 8,
      name: "Trinket",
      pms: ["Keira Tan", "Johanna Flores"],
      description: "A gamified productivity app that turns getting your work done into a collectible experience. Use AI to pull assignments and deadlines from syllabi, stay accountable with an AI companion, and earn virtual currency for completing goals that can be spent on unique collectible trinkets."
    },
    {
      id: 9,
      name: "Cabal",
      pms: ["Karthik Subramanian", "Christopher Chang"],
      description: "Diplomacy is a seven-player game of pure negotiation and betrayal, with a devoted community stuck on software from 2012. Cabal is the modern version. Its real edge: when a player ghosts mid-game, which is the thing that kills online Diplomacy, AI takes over their position and plays plausibly instead of letting their units sit frozen. Everything else, correct adjudication and a reputation system that deters abandoners, is what earns the community's trust."
    },
    {
      id: 10,
      name: "NeoQuest",
      pms: ["Nishaad Sovani", "Siddharth Garimella"],
      description: "A local discovery app that turns \"there's nothing to do\" into your next side quest. Find spontaneous hangouts and unconventional activities based on your group's budget, interests, transportation, and location, then explore them through an interactive map or contribute side quests of your own."
    },
    {
      id: 11,
      name: "CurbIQ",
      pms: ["Harshini Pulivarthi", "Sneha Atmakur"],
      description: "An accessibility-first navigation app that finds routes based on what a person can actually navigate, not simply what gets them there fastest. Combine maps, elevation data, personalized mobility preferences, and crowdsourced hazard reports to help users avoid stairs, steep slopes, construction, and other accessibility barriers."
    },
    {
      id: 12,
      name: "SightLine",
      pms: ["Chad Park", "Ryan Lin", "Austin Tenbrink"],
      description: "SightLine is a mobile app that turns the best moments of your day into a single 60-second video for you to save, share, and remember. The app will connect to the user's Meta Ray-Ban Glasses, capturing video and audio whenever the user is recording with the glasses. By the end of the day, the final video will be generated with one click of a button."
    },
    {
      id: 13,
      name: "Sortify",
      pms: ["Caden Luu", "Arnav Sharma"],
      description: "A camera-powered waste sorting tool that takes the guesswork out of deciding what goes in recycling, compost, or landfill. Identify an item with AI, combine it with local disposal rules, and gamify sustainable habits through sorting history, points, and streaks."
    },
    {
      id: 14,
      name: "TrailFinder",
      pms: ["Janice Lin", "Melody Shane", "Miles Petrick"],
      description: "A personalized trail discovery app that learns what you actually enjoy hiking and recommends where to go next. Combine trail, elevation, location, and scenic data with machine learning to find hikes tailored to your experience, available time, and past adventures."
    },
    {
      id: 15,
      name: "NothingButNet",
      pms: ["Navya Lella", "Ayah Elzein"],
      description: "NothingButNet is an app that analyzes a basketball player's shooting form using computer vision and pose estimation. A user records a free throw or jump shot on their phone, uploads it to the app, and receives instant feedback on their shooting mechanics — including a visual overlay showing their joint positions, angle measurements for key checkpoints, and specific tips for improvement."
    },
    {
      id: 16,
      name: "Property Damage",
      pms: ["Joseph Ong", "Zander Rosenzweig"],
      description: ""
    },
    {
      id: 17,
      name: "Mechanistic Transfer During Fine-Tuning",
      pms: ["Leo Park", "Haaziq Kazi"],
      description: ""
    },
    {
      id: 18,
      name: "ChessBlitz",
      logo: chessblitzLogo,
      pms: ["Matthew Rodrigues", "Yashom Kapoor", "Peter Lourenco", "Ashley Iattoni"],
      description: "Application for teaching problem solving skills to students K-8 in a gamified manner through chess tactics. Building out custom curriculums, game design, and an LLM coach."
    }
  ],
  competitive: []
};
