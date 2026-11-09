import atlasLogo from '../../images/projects/fall2026/atlas.png';
import cabalLogo from '../../images/projects/fall2026/cabal.png';
import calconnectLogo from '../../images/projects/fall2026/calconnect.png';
import chessblitzLogo from '../../images/projects/fall2026/chessblitz.png';
import cloudTCPLogo from '../../images/projects/fall2026/cloudtcp.jpg';
import curbIQLogo from '../../images/projects/fall2026/curbiq.jpg';
import devpadLogo from '../../images/projects/fall2026/devpad.jpg';
import gettothesurfaceLogo from '../../images/projects/fall2026/gettothesurface.jpg';
import inductionLogo from '../../images/projects/fall2026/induction.jpg';
import neoquestLogo from '../../images/projects/fall2026/neoquest.jpg';
import nexusLogo from '../../images/projects/fall2026/nexus.png';
import nothingbutnetLogo from '../../images/projects/fall2026/nothingbutnet.png';
import propertydamageLogo from '../../images/projects/fall2026/propertydamage.jpg';
import sightlineLogo from '../../images/projects/fall2026/sightline.jpg';
import smplerLogo from '../../images/projects/fall2026/smpler.png';
import sortifyLogo from '../../images/projects/fall2026/sortify.jpg';
import trailmateLogo from '../../images/projects/fall2026/trailmate.jpg';
import trinketLogo from '../../images/projects/fall2026/trinket.jpg';
import villagehubLogo from '../../images/projects/fall2026/villagehub.png';

const fall2026 = {
  studio: [
    {
      name: "Atlas",
      tagline: "One searchable workspace for LG NOVA's project knowledge",
      tags: ["AI", "Data", "Productivity"],
      accent: "#A50034",
      difficulty: "intermediate",
      logo: atlasLogo,
      pms: ["Chester Duan", "Cindy Wang"],
      description: "An internal knowledge and project intelligence platform for LG NOVA that brings scattered project data, documents, and updates into one searchable workspace. Build dashboards, data integrations, and AI-powered discovery tools that help teams quickly find what they need and understand what’s happening across the organization.",
      clientName: "LG NOVA"
    },
    {
      name: "CloudTCP",
      tagline: "AI-drafted traffic control plans, in minutes not hours",
      tags: ["AI", "Computer Vision", "Automation"],
      accent: "#06B6D4",
      difficulty: "advanced",
      logo: cloudTCPLogo,
      pms: ["Ashley Iattoni", "Benjamin Huang", "Dayton Phan"],
      description: "An AI-powered platform that turns the time-consuming process of drafting Traffic Control Plans into an automated workflow. Build tools that combine image analysis with official traffic-control standards to generate accurate engineering drawings for construction permits in minutes instead of hours.",
      clientName: "Traffic Patterns, LLC"
    },
    {
      name: "Nexus",
      tagline: "AI-powered investing on real-time data and live news",
      tags: ["AI", "Data", "Finance"],
      accent: "#2A3050",
      difficulty: "advanced",
      logo: nexusLogo,
      pms: ["Ganesh Karayi", "Arnav Mahadev", "Jonathan Tran", "Diego Llamas"],
      description: "AI-powered investment platform, utilizing real-time financial data and live news events to create a hub of information so that investors can make the most informed finance decisions possible.\n\n3 Main projects this semester:\n\nFeedback Driven Reinforcement Learning, Portfolio Analysis, and Stock Ranking",
      clientName: "iPick.ai"
    },
    {
      name: "Smpler",
      tagline: "Automated investment analysis for institutional managers",
      tags: ["AI", "Data", "Finance"],
      accent: "#F97316",
      logo: smplerLogo,
      difficulty: "intermediate",
      pms: ["Sainik Ghosh", "Justin Le"],
      description: "Smpler is an AI-powered SaaS platform helping institutional investment managers automate investment analysis, turning hours of manual work across messy Excels and PDFs into minutes. This project builds a data pipeline that ingests ~50 public real estate and economic data sources (cap rates, occupancy, job growth, migration trends) into a structured database with an analytics layer and API, so Smpler can benchmark deals against real market context.",
      clientName: "Smpler"
    },
    {
      name: "Village Hub",
      tagline: "One place for residents, resources and community support",
      tags: ["AI", "Community"],
      accent: "#14B8A6",
      logo: villagehubLogo,
      difficulty: "intermediate",
      pms: ["Felicia Ye", "Helena Zhang", "Emmanuel Elizalde-Ocampo"],
      description: "A community platform for clients Tiny Village Spirit and Hope Solutions that connects residents with support resources, meetings, and each other in one place. Work directly with staff and residents to design and build AI-powered tools, shared calendars, and community organizing features that address real community needs.",
      clientName: "Tiny Village Spirit & Hope Solutions"
    }
  ],
  launch: [
    {
      name: "Get to the Surface",
      tagline: "A pixel-art platformer from Earth's core into space",
      tags: ["Games"],
      accent: "#6366F1",
      difficulty: "beginner",
      logo: gettothesurfaceLogo,
      pms: ["Turner Osswald"],
      description: "A 2D Foddian-style platformer where players climb from the Earth’s core all the way into space, with each layer introducing new environments, movement mechanics, and obstacles. Build everything from pixel art and original music to physics-based gameplay inspired by games like Jump King and Pogostuck."
    },
    {
      name: "CalConnect",
      tagline: "Finding Berkeley tutors who fit how you learn",
      tags: ["AI", "Education"],
      accent: "#3B82F6",
      difficulty: "beginner",
      logo: calconnectLogo,
      pms: ["Leo Li", "Jamil Shirinov", "James Apuyan"],
      description: "A personalized tutoring platform that helps UC Berkeley students find peer tutors who match not only what they’re learning, but how they learn best. Build an AI-assisted matching experience around courses, availability, learning styles, and personality to make finding the right academic support easier."
    },
    {
      name: "Trinket",
      tagline: "Finish your work, earn collectible trinkets",
      tags: ["AI", "Productivity"],
      accent: "#14B8A6",
      difficulty: "beginner",
      logo: trinketLogo,
      pms: ["Keira Tan", "Johanna Flores"],
      description: "A gamified productivity app that turns getting your work done into a collectible experience. Use AI to pull assignments and deadlines from syllabi, stay accountable with an AI companion, and earn virtual currency for completing goals that can be spent on unique collectible trinkets."
    },
    {
      name: "Cabal",
      tagline: "Online Diplomacy, where AI takes over for ghosting players",
      tags: ["AI", "Games"],
      accent: "#EAB308",
      difficulty: "intermediate",
      logo: cabalLogo,
      pms: ["Karthik Subramanian", "Christopher Chang"],
      description: "Diplomacy is a seven-player game of pure negotiation and betrayal, with a devoted community stuck on software from 2012. Cabal is the modern version. Its real edge: when a player ghosts mid-game, which is the thing that kills online Diplomacy, AI takes over their position and plays plausibly instead of letting their units sit frozen. Everything else, correct adjudication and a reputation system that deters abandoners, is what earns the community's trust."
    },
    {
      name: "NeoQuest",
      tagline: "Turning \"nothing to do\" into your next side quest",
      tags: ["Community", "Maps"],
      accent: "#7C3AED",
      difficulty: "intermediate",
      logo: neoquestLogo,
      pms: ["Nishaad Sovani", "Siddharth Garimella", "Emily Yue"],
      description: "A local discovery app that turns “there’s nothing to do” into your next side quest. Find spontaneous hangouts and unconventional activities based on your group’s budget, interests, transportation, and location, then explore them through an interactive map or contribute side quests of your own."
    },
    {
      name: "CurbIQ",
      tagline: "Routes built around what you can actually navigate",
      tags: ["Accessibility", "Maps"],
      accent: "#14B8A6",
      difficulty: "intermediate",
      logo: curbIQLogo,
      pms: ["Harshini Pulivarthi", "Sneha Atmakur"],
      description: "An accessibility-first navigation app that finds routes based on what a person can actually navigate, not simply what gets them there fastest. Combine maps, elevation data, personalized mobility preferences, and crowdsourced hazard reports to help users avoid stairs, steep slopes, construction, and other accessibility barriers."
    },
    {
      name: "SightLine",
      tagline: "Your day's best moments in a 60-second video",
      tags: ["Mobile", "Video"],
      accent: "#22C55E",
      difficulty: "intermediate",
      logo: sightlineLogo,
      pms: ["Chad Park", "Ryan Lin", "Austin Tenbrink"],
      description: "SightLine is a mobile app that turns the best moments of your day into a single 60-second video for you to save, share, and remember. The app will connect to the user’s Meta Ray-Ban Glasses, capturing video and audio whenever the user is recording with the glasses. By the end of the day, the final video will be generated with one click of a button."
    },
    {
      name: "Sortify",
      tagline: "Point your camera to know which bin it goes in",
      tags: ["AI", "Computer Vision", "Sustainability"],
      accent: "#84CC16",
      difficulty: "intermediate",
      logo: sortifyLogo,
      pms: ["Caden Luu"],
      description: "A camera-powered waste sorting tool that takes the guesswork out of deciding what goes in recycling, compost, or landfill. Identify an item with AI, combine it with local disposal rules, and gamify sustainable habits through sorting history, points, and streaks."
    },
    {
      name: "TrailMate",
      tagline: "Hike recommendations tailored to what you enjoy",
      tags: ["AI", "Maps"],
      accent: "#2E752F",
      difficulty: "intermediate",
      logo: trailmateLogo,
      pms: ["Janice Lin", "Melody Shane", "Miles Petrick"],
      description: "A personalized trail discovery app that learns what you actually enjoy hiking and recommends where to go next. Combine trail, elevation, location, and scenic data with machine learning to find hikes tailored to your experience, available time, and past adventures."
    },
    {
      name: "NothingButNet",
      tagline: "Instant feedback on your basketball shooting form",
      tags: ["Computer Vision", "Sports"],
      accent: "#E7A977",
      logo: nothingbutnetLogo,
      difficulty: "intermediate",
      pms: ["Navya Lella", "Ayah Elzein"],
      description: "NothingButNet is an app that analyzes a basketball player's shooting form using computer vision and pose estimation. A user records a free throw or jump shot on their phone, uploads it to the app, and receives instant feedback on their shooting mechanics — including a visual overlay showing their joint positions, angle measurements for key checkpoints, and specific tips for improvement."
    },
    {
      name: "Property Damage",
      tagline: "A two-player fighter in a materials-simulated arena",
      tags: ["Games"],
      accent: "#6C3D39",
      difficulty: "intermediate",
      logo: propertydamageLogo,
      pms: ["Joseph Ong", "Zander Rosenzweig"],
      description: "A local two-player 2D fighting game featuring a materials simulation as the arena."
    },
    {
      name: "Induction",
      tagline: "Do fine-tuned mechanisms transfer to unseen tasks?",
      tags: ["AI", "Research"],
      accent: "#3B5BDB",
      difficulty: "intermediate",
      logo: inductionLogo,
      pms: ["Leo Park", "Haaziq Kazi", "Benjamin Wang"],
      description: "We study how fine-tuning on one reasoning task changes a model’s internal mechanisms and whether those same mechanisms are reused on related, unseen tasks. By tracking behavior and causal circuit changes across fine-tuning checkpoints, we test whether mechanistic transfer emerges before, alongside, or after behavioral generalization."
    },
    {
      name: "ChessBlitz",
      tagline: "Teaching K-8 problem solving through chess tactics",
      tags: ["AI", "Education", "Games"],
      accent: "#FAEF7C",
      difficulty: "intermediate",
      logo: chessblitzLogo,
      pms: ["Matthew Rodrigues", "Yashom Kapoor", "Peter Lourenco", "Ashley Iattoni"],
      description: "Application for teaching problem solving skills to students K-8 in a gamified manner through chess tactics. Building out custom curriculums, game design, and an LLM coach.",
      clientName: "School of the Madeline"
    },
    {
      name: "DevPad",
      tagline: "Note-taking for STEM students, with code that runs",
      tags: ["Education", "Mobile", "Productivity"],
      accent: "#0B7A75",
      difficulty: "intermediate",
      logo: devpadLogo,
      pms: ["Jason Shorey", "Yuchan Chung"],
      description: "DevPad is a productivity-focused mobile app that assists STEM students in note-taking. It differs from traditional note-taking apps by including features especially helpful for Computer Science topics, such as a built-in interpreter for multiple programming languages."
    }
  ]
};

export default fall2026;
