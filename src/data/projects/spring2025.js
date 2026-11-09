import webaiLogo from "../../images/projects/spring2025/webai.png";
import superhumanLogo from "../../images/projects/spring2025/superhuman.png";
import relativityspaceLogo from "../../images/projects/spring2025/relativityspace.png";
import chessblitzLogo from "../../images/projects/spring2025/chessblitz.png";
import bagchasersLogo from "../../images/projects/spring2025/otterz.png";
import walmartLogo from "../../images/projects/spring2025/walmart.png";
import carbO2nullLogo from "../../images/projects/spring2025/carbO2null.png";
import sentistockLogo from "../../images/projects/spring2025/sentistock.png";
import unitaskLogo from "../../images/projects/spring2025/unitask.jpeg";
import skin2careLogo from "../../images/projects/spring2025/skin2care.png";

const spring2025 = { studio: [
    {
        name: "WebAI",
        tagline: "Summarizing long videos from what is said and what is shown",
        tags: ["AI", "Computer Vision", "Video"],
        accent: "#06044e",
        difficulty: "advanced",
        logo: webaiLogo,
        pms: ["Varun Vemulapalli", "Chris Joseph", "Damond Fang"],
        description: "WebAI is developing an advanced video summarization inference element for the Navigator product that enables professionals to easily process long-form video content. The modular pipeline combines audio transcription via Whisper with computer vision techniques like OpenCV and YOLO to extract key metadata and generate accurate summaries. Future development focuses on building robust API endpoints, synchronizing audio-visual modules, and integrating the complete pipeline into the webAI Navigator interface.",
        clientName: "webAI"
    },
    {
        name: "Superhuman",
        tagline: "A game for learning email shortcuts, and a new vertical for Superhuman",
        tags: ["Games", "Productivity"],
        accent: "#432949",
        difficulty: "advanced",
        logo: superhumanLogo,
        pms: ["Payam Erfan", "Gabriel Gomes", "Isaac Lei"],
        description: "Partnering with Superhuman, our team is developing two key features to boost user proficiency and expand product reach: an interactive onboarding game that accelerates email shortcut mastery, and a new vertical tailored with custom integrations for specialized professionals. By contributing directly to Superhuman’s core codebase, we are delivering high-performance tools designed to streamline daily email workflows for a broader user base.",
        clientName: "Superhuman"
    },
    {
        name: "Relativity Space",
        tagline: "A hybrid rocket engine for launching satellites into orbit",
        tags: ["Hardware", "Research"],
        accent: "#000000",
        difficulty: "advanced",
        logo: relativityspaceLogo,
        pms: ["Joshua Schiller", "Mahdin Zahere", "Amisha Gupta"],
        description: "Relativity Space is a space launch company that designs and builds reusable rockets for space exploration. The team is developing a new rocket engine that will be used to launch the company's satellites into orbit. The engine is a hybrid rocket engine that uses a liquid fuel and a solid fuel propellant.",
        clientName: "Relativity Space"
    },
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
        name: "BagChasers LLC",
        tagline: "Sharper OCR and reconciliation for Nyra, an AI accountant",
        tags: ["AI", "Automation", "Finance"],
        accent: "#ff6701",
        difficulty: "advanced",
        logo: bagchasersLogo,
        pms: ["Ava Joshi", "Mihir Mirchandani", "Rachel Cheung"],
        description: "Bag Chasers LLC is partnering with Otterz to revolutionize AI-powered accounting by enhancing the OCR and reconciliation capabilities of Nyra, the world's first AI accountant. The team will integrate advanced AI models, including Gemini 2.0 and OpenAI APIs, to improve data extraction and build robust agentic financial systems. This project offers students a hands-on opportunity to tackle complex fintech and machine learning challenges in a real-world collaborative environment.",
        clientName: "Otterz"
    },
    {
        name: "Walmart",
        tagline: "Researching how generative AI and quantum computing fit Walmart",
        tags: ["AI", "Research"],
        accent: "#0253e3",
        difficulty: "advanced",
        logo: walmartLogo,
        pms: ["Justin Choi", "Joshua Schiller", "Amy Yu"],
        description: "Focused on driving innovative tech adoption at Walmart Global Tech, this project evaluated cutting-edge fields like generative AI and quantum computing to enhance high-level operational efficiency. The team conducted comprehensive market research to identify high-impact tools and assess their strategic relevance to core corporate roles. The final deliverables included cost analyses, implementation roadmaps, and data-driven recommendations to guide seamless tech integration across the organization.",
        clientName: "Walmart"
    },
    {
        name: "CarbO2Null",
        tagline: "AI-automated life cycle assessments of products' carbon footprints",
        tags: ["AI", "Data", "Sustainability"],
        accent: "#5c56ee",
        difficulty: "advanced",
        logo: carbO2nullLogo,
        pms: ["Turner Osswald", "Danh Tran", "Jenny Liang"],
        description: "CarbO2Null helps business to discover the environmental impacts of their products through AI-automated Life Cycle Assessment (LCAs). Our project focuses on utilizing AI and LLM to automate the data extraction & collection process on medical industries products from scientific literature.  By inputting structured data in LCA models, we will breakdown the production process and analysis carbon footprint of various materials during different phases, and use ML to provide optimized strategies for the industries.",
        clientName: "CarbonGraph"
    },
    {
        name: "GroGetter",
        tagline: "Log groceries, track expiry dates and get meal ideas",
        tags: ["Mobile", "Productivity", "Sustainability"],
        accent: "#6efcad",
        difficulty: "intermediate",
        pms: ["Smriti Govindan", "Devah Schaefers"],
        description: "GroGetter is a mobile and web platform designed to help users minimize food waste and save money by logging groceries, tracking expiration dates, and suggesting meals based on available ingredients. By providing timely expiration alerts and a clean, user-friendly dashboard, the platform makes maintaining a well-stocked and sustainable kitchen effortless."
    },
    {
        name: "EventFull",
        tagline: "Berkeley campus events recommended for your interests",
        tags: ["AI", "Community"],
        accent: "#222d45",
        difficulty: "intermediate",
        pms: ["Peyton Li", "Neel Sharma"],
        description: "EventFull is a personalized web application designed to help UC Berkeley students effortlessly discover campus events tailored to their specific interests. By leveraging machine learning recommendation algorithms, the platform delivers curated suggestions complete with event details, schedules, and peer ratings to maximize student engagement. It provides an intuitive hub for students to stay connected with university life while sharing and rating their experiences."
    },
    {
        name: "SentiStock",
        tagline: "Forecasting stocks from social media sentiment",
        tags: ["AI", "Data", "Finance"],
        accent: "#00d29d",
        difficulty: "intermediate",
        logo: sentistockLogo,
        pms: ["Anupriya Islam", "Sofia Valadez"],
        description: "SentiStock predicts stock movements by combining social media sentiment analysis with deep learning-based time series forecasting, offering insights into market trends driven by public sentiment."
    },
    {
        name: "UniTask",
        tagline: "A campus marketplace for paying peers to help with tasks",
        tags: ["Community", "Mobile"],
        accent: "#2d6f3f",
        difficulty: "intermediate",
        logo: unitaskLogo,
        pms: ["Sibi Saravanan", "Kai Shing"],
        description: "UniTask is a campus-centered marketplace application that connects students needing help with tasks to peers seeking to earn money. The platform features a Swift frontend integrated with Firebase for authentication and database management, enabling users to log in, post tasks, and track orders securely. Developed as a real-world full-stack project, UniTask empowers student communities by facilitating trusted peer-to-peer transactions and collaborative learning."
    },
    {
        name: "Skin2Care",
        tagline: "Personalized skincare routines from a survey of your skin",
        tags: ["AI", "Health"],
        accent: "#4892dc",
        difficulty: "intermediate",
        logo: skin2careLogo,
        pms: ["Jesslyn Ashley Ruswan", "Arthur Wigo"],
        description: "Skin2Care is a ML/AI skincare assistant that helps users to achieve glowing and glass skin through a personalized approach. The app will start by surveying users about their skin types, concerns, and goals, collecting detailed information about their current skincare habits and preferences. Using this data, the app will provide tailored skincare tips and recommend effective routines designed to address their needs."
    },
    {
        name: "Golden Bear Bets",
        tagline: "Machine-learned betting lines to check sportsbooks against",
        tags: ["AI", "Data", "Sports"],
        accent: "#ff9301",
        difficulty: "advanced",
        pms: ["Anthony Kobzar", "Ethan Zhang", "Dennis Vengerov"],
        description: "Golden Bear Bets is a sports betting analysis platform designed to help users evaluate the probability of betting lines hitting by utilizing machine learning models to project its own lines. It aims to counter the deceptive lines used by sportsbooks that often bait users into placing unreliable bets."
    }
], launch: [] };

export default spring2025;
