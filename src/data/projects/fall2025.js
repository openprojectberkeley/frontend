import chessblitzLogo from "../../images/projects/fall2025/chessblitz.png";
import oreLogo from "../../images/projects/fall2025/ore.png";
import wooshLogo from "../../images/projects/fall2025/woosh.png";
import munchLogo from "../../images/projects/fall2025/munch.png";
import campusflowLogo from "../../images/projects/fall2025/campusflow.png";
import atlasLogo from "../../images/projects/fall2025/atlas.png";
import lumenrouteLogo from "../../images/projects/fall2025/lumenroute.png";
import getgreenLogo from "../../images/projects/fall2025/getgreen.png";
import piggypointLogo from "../../images/projects/fall2025/piggypoint.png";

const fall2025 = {
    studio: [
        {
            name: "ChessBlitz",
            tagline: "Teaching K-8 problem solving through chess tactics",
            tags: ["AI", "Education", "Games"],
            accent: "#FAEF7C",
            difficulty: "intermediate",
            logo: chessblitzLogo,
            pms: ["Yashom Kapoor", "Devah Schaefers"],
            description: "Application for teaching problem solving skills to students K-8 in a gamified manner through chess tactics. Building out custom curriculums, game design, and an LLM coach.",
        },
        {
            name: "PARlor",
            tagline: "Golf leagues with friends, with leaderboards and weekly challenges",
            tags: ["AI", "Community", "Sports"],
            accent: "#48a84e",
            difficulty: "beginner",
            pms: ["Ryan Lin", "Peter Lourenco", "Ted Nguyen"],
            description: "Golf is often viewed as a social game, but current platforms tend to overlook these social aspects in favor of individual performance. We want to create a golf app that brings people together and allows casual players to compete with stakes and experience the thrill of competition. We’re building a golf league app where you can join leagues with your friends and compete with them. There will be league leaderboards and stats, LLM-generated weekly challenges, golf round score inputting, long drive distance competitions, social features (friends, chats, etc.), and scheduled tournaments for the league or specifically between two players."
        },
        {
            name: "Outer Rim Exploration",
            tagline: "Mapping hidden minerals underground with muon sensors",
            tags: ["Hardware", "Research", "Sustainability"],
            accent: "#183a58",
            difficulty: "advanced",
            logo: oreLogo,
            pms: ["Karthik Gannavarapu", "Isaac Hwang"],
            description: "ORE uses our novel, muon hodoscope (muon sensor) platform to map the subsurface rapidly and discover the hidden mineral resources to enable the world’s renewable energy transition. Our moonshot has taken us to the moon and Mars where we will discover the ice deposits for rocket fuel and accelerate the new space economy.",
            clientName: "Outer Rim Exploration Inc."
        },
        {
            name: "Woosh",
            tagline: "A full-stack site for deliveries in the spare space in cars",
            tags: ["AI", "Logistics", "Sustainability"],
            accent: "#ccdeff",
            difficulty: "intermediate",
            logo: wooshLogo,
            pms: ["Chad Park", "Holden Fees"],
            description: "For this semester’s project, we will be collaborating with Woosh Navigation, a Berkeley SkyDeck company that aims to transform LPL (Less than pallet load) deliveries within the local business delivery industry by using empty space in cars for the transportation of goods to reduce costs and CO2 emissions from truck deliveries. Woosh is in the final stages of developing their app which will be used to schedule deliveries, however, they are in need of a new website. Therefore, we have been tasked with developing a full stack website application for them. This website will support users, an AI chatbot, and additional key features to enhance the platform. Although this is a very open-ended project with many possible routes to go, there is a common end goal: have a functioning  and publicly accessible website with documentation for Woosh to be able to expand and improve it in the future.",
            clientName: "Woosh Logistics Inc."
        },
        {
            name: "Money Maker",
            tagline: "Predicting stock prices from the sentiment of news coverage",
            tags: ["AI", "Data", "Finance"],
            accent: "#090d51",
            difficulty: "advanced",
            pms: ["Emily Ma", "David Zhang"],
            description: "Stock markets are extremely hard to get into and requires a lot of learning and analysis, so we want to find a way to predict stock market prices for a specific company using news sources. Using AI to get a sentiment analysis on news sources and outlets for that company and using that information as data points to run machine learning algorithms to predict stock market prices."
        },
        {
            name: "WorldCraft",
            tagline: "Minecraft builds from real-world photos, starting with UC Berkeley",
            tags: ["AI", "Computer Vision", "Games"],
            accent: "#7d9a79",
            difficulty: "intermediate",
            pms: ["Diego Llamas", "Benjamin Huang"],
            description: "Have you ever been interested in creating our beautiful campus with Minecraft? This semester, we are pursuing this goal in creating Minecraft structures from real-world images and ultimately recreating the UC Berkeley campus. This project will enable us to leverage the latest insights in 3D model generation to create something we are all familiar with."
        },
        {
            name: "PromptParty",
            tagline: "A new daily prompt to answer and debate with friends",
            tags: ["AI", "Community", "Mobile"],
            accent: "#499eff",
            difficulty: "intermediate",
            pms: ["Ben Ross", "Sami Houssaini"],
            description: "PromptParty is a mobile social media platform designed to foster social connections by challenging users to answer a new engaging prompt each day. Combining the daily release mechanic of BeReal with the interactive, debate-focused nature of active group chats, the app gives users a dedicated space to share perspectives and discuss fun topics. The project utilizes React Native, FastAPI, and a machine-learning recommendation engine to deliver a full-stack mobile experience with personalized content feeds."
        },
        {
            name: "EcoSim",
            tagline: "A free-market simulation run by autonomous LLM agents",
            tags: ["AI", "Data", "Research"],
            accent: "#28839b",
            difficulty: "intermediate",
            pms: ["Ayman Islam", "Yonatan Herrera Gonzalez"],
            description: "EcoSim is an interactive free-market simulation platform designed to model complex economic behaviors across autonomous agents such as individuals, businesses, and governments. Driven by FastMCP and OpenRouter, individual LLMs function as the decision-making engines for each agent, enabling real-time interaction and autonomous adaptation based on economic theories. The project combines a Python backend for simulation logic and data analysis with a WebGL frontend, allowing users to tinker with market parameters and visually track evolving macroeconomic outcomes."
        },
        {
            name: "LyricCal",
            tagline: "Song recommendations matched to your mood and what lyrics convey",
            tags: ["AI", "Music"],
            accent: "#7f3bc7",
            difficulty: "intermediate",
            pms: ["Peyton Li", "Kailash Ramesh", "David Cruz"],
            description: "People often rely on music as an escape from their reality. But the problem arises when they get sick of listening to the same songs on repeat, but don’t know what else to do. The Spotify recommendations are not adjusted to their current mood, so they have no where else to turn. That’s where we have a solution. LyricCal hopes to deliver a machine learning web app that classifies songs based on their mood that the lyrics convey (such as happy, angry, edgy, etc.) and then implement the mood results alongside acoustic features to recommend songs based on the mood of the user and the most recent tracks they have listened to. Users can finally find those new songs they’ve been aching for with this project, and we hope to make it a reality."
        },
        {
            name: "SaveBites",
            tagline: "Track your groceries and turn them into recipes before they spoil",
            tags: ["Productivity", "Sustainability"],
            accent: "#6edcad",
            difficulty: "intermediate",
            pms: ["Ashwika Gampa", "Devansh Ojha", "Jonathan Tran"],
            description: "Every semester, students often buy groceries in bulk, forget about items in the fridge, or end up letting food spoil—wasting money and contributing to environmental harm. Between classes, labs, and social life, it’s hard to keep track of what you have and when it will go bad. Our project aims to solve this by creating a Food Waste Tracker & Recipe Generator app designed for busy students."
        },
        {
            name: "Munch",
            tagline: "Swipe with friends to settle where to eat",
            tags: ["AI", "Community"],
            accent: "#fed0bb",
            difficulty: "intermediate",
            logo: munchLogo,
            pms: ["Abhi Kiran", "Sophie Nguyen"],
            description: "Munch is a full-stack web application designed to eliminate group decision fatigue when choosing where to eat by combining social swiping with intelligent restaurant recommendations. By leveraging location services, the Yelp API, and scikit-learn, the app aggregates individual swipes from group sessions to identify the ideal dining spot for everyone. Built using React, Tailwind, Flask, and MongoDB, Munch offers a seamless user interface while storing past choices to continually refine future group recommendations."
        },
        {
            name: "CampusFlow",
            tagline: "Walking routes and gap-time spots built from your class schedule",
            tags: ["Maps", "Mobile", "Productivity"],
            accent: "#2f4a88",
            difficulty: "intermediate",
            logo: campusflowLogo,
            pms: ["Edwin Luck", "Aslesha Chandra"],
            description: "Campus Flow is a mobile application designed to streamline student life by combining class schedule management with interactive campus mapping. By analyzing weekly class times and locations, the app generates optimized walking routes between lectures and suggests nearby study spots, dining options, or hangouts during schedule gaps. Built using React Native, Expo, Firebase, and the Google Maps API, Campus Flow provides a unified visual experience to help students maximize their time on campus."
        },
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
            name: "LumenRoute",
            tagline: "Navigation that finds the safest way home from crime data",
            tags: ["Data", "Maps", "Mobile"],
            accent: "#1d4667",
            difficulty: "intermediate",
            logo: lumenrouteLogo,
            pms: ["Khushi Bhalla", "Jenny Liang"],
            description: "LumenRoute is a navigation application designed to help users get home safely by determining the safest routes using real-time and historical crime data. The project integrates Google's Routes API with automated data scraping from sources like Gmail and police portals to dynamically score route safety. Through a combination of backend routing algorithms and a React Native frontend, it provides commuters with secure, crime-aware navigation."
        },
        {
            name: "GetGreen.ai",
            tagline: "Everyday climate action as a game, with a personal AI assistant",
            tags: ["AI", "Games", "Sustainability"],
            accent: "#299f47",
            difficulty: "intermediate",
            logo: getgreenLogo,
            pms: ["Dylan Stier", "Julia Beaupré", "Justin Le"],
            description: "GetGreen is an app that gamifies climate action through day-to-day tasks. The project features a personalized AI assistant utilizing web-scraped environmental articles, a PostgreSQL backend, and a local LLM with retrieval-augmented generation to deliver tailored recommendations and maximize user engagement.",
            clientName: "GetGreen"
        },
        {
            name: "PiggyPoint",
            tagline: "A score for your spending habits, with personalized advice",
            tags: ["Data", "Finance"],
            accent: "#1e681e",
            difficulty: "intermediate",
            logo: piggypointLogo,
            pms: ["Nishaad Sovani", "Felicia Ye"],
            description: "PiggyPoint is a web application designed to study users' financial habits, generate an evaluative spending score, and provide personalized financial recommendations."
        },
        {
            name: "Haven",
            tagline: "AI matching and side-by-side comparisons for picking software vendors",
            tags: ["AI", "Productivity"],
            accent: "#f5f5f3",
            difficulty: "intermediate",
            pms: ["Neel Sharma"],
            description: "Haven is an AI-powered software discovery platform designed to streamline and automate vendor selection for startups and enterprises. Utilizing a Gemini LLM fine-tuned with LoRA on comprehensive vendor data, the app analyzes custom RFP-style requests to match a business's specific operational needs with optimal software tools. Haven generates automated side-by-side comparison tables detailing features, pricing, ratings, and key pros and cons to help decision-makers rapidly select the best software solution."
        }
    ], launch: [] };

export default fall2025;
