import atlasLogo from '../../images/projects/spring2026/atlas.png';
import chessblitzLogo from '../../images/projects/spring2026/chessblitz.png';
import nexusLogo from '../../images/projects/spring2026/nexus.png';
import sightlineLogo from '../../images/projects/spring2026/sightline.jpg';
import villagehubLogo from '../../images/projects/spring2026/villagehub.png';
import matXLogo from '../../images/projects/spring2026/matX.svg';
import copatibleLogo from '../../images/projects/spring2026/copatible.png';
import operativeLogo from '../../images/projects/spring2026/operative.svg';
import ibmLogo from '../../images/projects/spring2026/ibm.png';
import bmLogo from '../../images/projects/spring2026/bm.png';
import fonarLogo from '../../images/projects/spring2026/fonar.png';
import matchlabLogo from '../../images/projects/spring2026/matchlab.png';
import syncrateLogo from '../../images/projects/spring2026/syncrate.png';
import dogsenseLogo from '../../images/projects/spring2026/dogsense.png';

const spring2026 = {
  studio: [
    {
      name: "Atlas",
      tagline: "One place for LG NOVA's company-wide information",
      tags: ["AI", "Data", "Productivity"],
      accent: "#A50034",
      difficulty: "advanced",
      logo: atlasLogo,
      pms: ["Anupriya Islam", "Andre Ramos", "Erin Lee"],
      description: "Atlas is an internal data and AI-powered platform built for LG NOVA that brings company-wide information into one place using AI-generated summaries, intelligent search, and interactive views to support everyday work and decision-making.",
      clientName: "LG NOVA"
    },
    {
      name: "Operative",
      tagline: "AI agents that plan and run security investigations",
      tags: ["AI", "Automation", "Security"],
      accent: "#1599b0",
      difficulty: "intermediate",
      logo: operativeLogo,
      pms: ["Justin Le", "Sainik Ghosh"],
      description: "Operative is an advanced systems project focused on building an AI-powered cybersecurity platform that can learn tools, plan investigations, and execute workflows autonomously. The project combines backend infrastructure, agentic AI systems, and frontend interfaces to simulate a next-generation Security Operations Center (SOC).",
      clientName: "Operative"
    },
    {
      name: "ChessBlitz",
      tagline: "Chess tactics for K-5 beginners, with AI-personalized hints",
      tags: ["AI", "Education", "Games"],
      accent: "#FAEF7C",
      difficulty: "intermediate",
      logo: chessblitzLogo,
      pms: ["Yashom Kapoor", "Peter Lourenco", "Matthew Rodrigues"],
      description: "ChessBlitz is building an educational chess tactics app for K-5 students by using AI-personalized hints, gamification, and a fun interface to make learning chess stimulating and accessible for young beginners.",
      clientName: "School of the Madeline"
    },
    {
      name: "IBM",
      tagline: "Simulated international events with live AI commentary",
      tags: ["AI", "Data"],
      accent: "#1060fe",
      difficulty: "advanced",
      logo: ibmLogo,
      pms: ["Anupriya Islam", "Jonathan Tran", "Benjamin Huang", "Diego Llamas"],
      description: "We're working with IBM to build an AI-powered simulation platform for international competitive events, integrating real-time commentary, live analytics, and intelligent team collaboration tools.",
      clientName: "IBM"
    },
    {
      name: "SightLine",
      tagline: "Smart glasses that turn lectures and meetings into notes",
      tags: ["Productivity", "Wearables"],
      accent: "#22C55E",
      difficulty: "intermediate",
      logo: sightlineLogo,
      pms: ["Chad Park", "Ryan Lin"],
      description: "SightLine connects to Meta Ray-Ban smart glasses to transform what you see and hear into real-time, structured notes. Perfect for lectures, meetings, and study sessions; no manual note-taking required."
    },
    {
      name: "GIStice League",
      tagline: "Mapping and predicting grocery access inequities in cities",
      tags: ["AI", "Maps", "Research"],
      accent: "#0c343d",
      difficulty: "intermediate",
      pms: ["Emily Ma", "David Zhang"],
      description: "We will use spatial machine learning to quantify and predict grocery store inequities, proving that neighborhood demographics are a primary driver of resource access in urban environments."
    },
    {
      name: "MatchLab",
      tagline: "AI-generated micro-projects matched to your skills and goals",
      tags: ["AI", "Education"],
      accent: "#432682",
      difficulty: "intermediate",
      logo: matchlabLogo,
      pms: ["Surabhi Verma", "Noor Pirzada"],
      description: "Our project aims to create a web-based platform that helps students gain practical experience through short and structured micro-projects. The platform uses AI to generate beginner-friendly projects, match users to projects based on their skills and goals, and provide guidance when users get stuck."
    },
    {
      name: "CoPatible",
      tagline: "Voice-first planning for small, in-person experiences",
      tags: ["AI", "Community"],
      accent: "#f1eab2",
      difficulty: "intermediate",
      logo: copatibleLogo,
      pms: ["Zehra Naqvi", "Karthik Subramanian"],
      description: "CoPatible is a voice-first platform that plans, books, and matches people into small, in-person experiences based on how they feel and the life chapter they're in. Our project focuses on building the MVP web app, voice prototypes, and AI-powered matching tools to connect founders in San Francisco.",
      clientName: "CoPatible"
    },
    {
      name: "TRACKLIST",
      tagline: "Rate and review any album, EP or song",
      tags: ["Community", "Music"],
      accent: "#d029fc",
      difficulty: "intermediate",
      pms: ["Megan Nguyen", "Jessica Chiu"],
      description: "TRACKLIST is a music rating and review web app inspired by Letterboxd (for movies) and Beli (for restaurants). Users can search for any album, EP, or song, give it a star rating out of 5, write a short review, and build a personal profile that showcases everything they have listened to and loved."
    },
    {
      name: "Syncrate",
      tagline: "Real-time updates between warehouse owners and retailers",
      tags: ["Data", "Logistics"],
      accent: "#7ad2d8",
      difficulty: "intermediate",
      logo: syncrateLogo,
      pms: ["Felicia Ye", "Helena Zhang"],
      description: "Syncrate is a warehouse operating system that helps private warehouse owners better communicate with retailers. By centralizing real-time updates and analytics-ready information, it reduces errors and enables more efficient, data-driven warehouse operations."
    },
    {
      name: "Fonar",
      tagline: "See who's free to call, and let AI remember what was said",
      tags: ["AI", "Productivity"],
      accent: "#1f3d5a",
      difficulty: "intermediate",
      logo: fonarLogo,
      pms: ["Nishaad Sovani", "Ben Ross"],
      description: "Fonar streamlines phone calls by showing when your contacts are available and using an AI secretary to remember what was said."
    },
    {
      name: "MatX",
      tagline: "Benchmarking machine learning algorithms on MatX hardware",
      tags: ["AI", "Hardware"],
      accent: "#ed1c25",
      difficulty: "advanced",
      logo: matXLogo,
      pms: ["Leo Park", "Jayden Lee", "Christopher Chang"],
      description: "We are looking to build a benchmarking platform that evaluates how efficiently different machine learning algorithms run on MatX hardware, measuring both algorithm and system level performance.",
      clientName: "MatX"
    },
    {
      name: "Nexus",
      tagline: "An interactive graph of how 8,000+ companies connect",
      tags: ["AI", "Data"],
      accent: "#2A3050",
      difficulty: "advanced",
      logo: nexusLogo,
      pms: ["Andrew Zhou", "Ganesh Karayi", "Arnav Mahadev", "Jayden Szeto"],
      description: "Nexus is a company relationship visualization platform that transforms iPick.ai's scattered data into an interactive graph database. Users can explore competitor, supplier, and subsidiary relationships between 8,000+ companies through a D3.js force-directed visualization, with AI-powered relationship suggestions and an admin panel for data curation.",
      clientName: "iPick.ai"
    },
    {
      name: "DogSense (DailySense)",
      tagline: "Smart pet monitoring for early detection and proactive care",
      tags: ["AI", "Health", "Productivity"],
      accent: "#be1929",
      difficulty: "intermediate",
      logo: dogsenseLogo,
      pms: ["Ashley Iattoni", "Yonatan Herrera Gonzalez"],
      description: "DogSense is a smart pet-monitoring system that combines React Native software, IoT hardware sensors, and a Random Forest machine learning model to track a dog's real-time health and environment. The platform features a dedicated Temperature Analytics page that translates key signals like resting heat level and room temperature into simple, readable insights. By detecting potential health or comfort issues early, DogSense helps owners take a preventative approach and make informed care decisions even when away from home."
    },
    {
      name: "Huddle",
      tagline: "Study groups and study spots matched to you at Berkeley",
      tags: ["Community", "Education"],
      accent: "#1c4586",
      difficulty: "beginner",
      pms: ["Annie Lin", "Parsa Faraji Alamouti"],
      description: "Huddle is a collaborative study app making it easier to find the right people and places to study with! It matches students into study groups and recommends locations on or near the Berkeley campus based on shared preferences, availability, and feedback from prior study sessions."
    },
    {
      name: "Village Hub",
      tagline: "Check-ins and amenity booking for tiny home residents",
      tags: ["Community"],
      accent: "#14B8A6",
      difficulty: "intermediate",
      logo: villagehubLogo,
      pms: ["Charmi Buddaluru", "Harshini Pulivarthi"],
      description: "Village Hub is an app that serves the residents of youth tiny home communities formed by the non profit organization Tiny Village Spirit. Its main purpose is to be a centralizing tool that allows residents to check in and out of the village, book shared amenities, and more.",
      clientName: "Tiny Village Spirit & Hope Solutions"
    },
    {
      name: "Behn Meyer Agricare",
      tagline: "A loyalty platform for Behn Meyer's distributors and retailers",
      tags: ["Agriculture", "Data"],
      accent: "#0a347a",
      difficulty: "advanced",
      logo: bmLogo,
      pms: ["Jenny Liang", "Mia Salinas"],
      description: "Behn Meyer AgriCare is a loyalty and engagement platform that captures transaction data between distributors and retailers, giving them a way to submit invoices and redeem points while giving Behn Meyer direct visibility into sales and a channel to run promotions and technical support programs.",
      clientName: "Behn Meyer Agricare"
    }
  ],
  launch: []
};

export default spring2026;
