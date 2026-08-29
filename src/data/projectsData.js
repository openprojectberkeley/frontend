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
      name: "Atlas",
      logo: atlasLogo,
      pms: ["Chester Duan", "Avaneesh Joshi", "Ojasvi Shrivastava", "Cindy Wang"],
      description: "",
      clientName: "LG NOVA"
    },
    {
      id: 2,
      name: "TCP (Traffic Control Patterns)",
      pms: ["Ashley Iattoni", "Benjamin Huang", "Dayton Phan"],
      description: ""
    },
    {
      id: 3,
      name: "Smpler",
      pms: ["Sainik Ghosh", "Justin Le"],
      description: ""
    },
    {
      id: 4,
      name: "Village Hub",
      logo: tinyvillageLogo,
      pms: ["Felicia Ye", "Helena Zhang", "Emmanuel Elizalde-Ocampo"],
      description: "",
      clientName: "Tiny Village Spirit & Hope Solutions"
    },
    {
      id: 5,
      name: "Nexus",
      logo: nexusLogo,
      pms: ["Ganesh Karayi", "Arnav Mahadev"],
      description: "",
      clientName: "iPick.ai"
    }
  ],
  passion: [
    {
      id: 6,
      name: "Get to the Surface",
      pms: ["Turner Osswald"],
      description: ""
    },
    {
      id: 7,
      name: "CalConnect",
      pms: ["Leo Li", "Jamil Shirinov", "James Apuyan"],
      description: ""
    },
    {
      id: 8,
      name: "Trinket",
      pms: ["Keira Tan", "Johanna Flores"],
      description: ""
    },
    {
      id: 9,
      name: "Cabal",
      pms: ["Karthik Subramanian", "Christopher Chang"],
      description: ""
    },
    {
      id: 10,
      name: "NeoQuest",
      pms: ["Nishaad Sovani", "Siddharth Garimella"],
      description: ""
    },
    {
      id: 11,
      name: "CurbIQ",
      pms: ["Harshini Pulivarthi", "Sneha Atmakur"],
      description: ""
    },
    {
      id: 12,
      name: "SightLine",
      pms: ["Chad Park", "Ryan Lin", "Austin Tenbrink"],
      description: ""
    },
    {
      id: 13,
      name: "Sortify",
      pms: ["Caden Luu", "Arnav Sharma"],
      description: ""
    },
    {
      id: 14,
      name: "TrailFinder",
      pms: ["Janice Lin", "Melody Shane", "Miles Petrick"],
      description: ""
    },
    {
      id: 15,
      name: "NothingButNet",
      pms: ["Navya Lella", "Ayah Elzein"],
      description: ""
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
      description: ""
    }
  ],
  competitive: []
};
