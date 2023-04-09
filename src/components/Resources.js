import styles from '../css/Resources.module.css';
import ResourcesButton from './ResourcesButton';
import { useState } from 'react';

import git1 from '../images/git1.png';
import git2 from '../images/git2.png';
import git3 from '../images/git3.png';
import git4 from '../images/git4.png';
import git5 from '../images/git5.png';
import git6 from '../images/git6.png';
import git7 from '../images/git7.png';
import git8 from '../images/git8.png';
import git9 from '../images/git9.png';

export default function Resources() {
    const [resource, setResource] = useState("Start Here");
    const resources = {
        "Start Here": starthere,
        "Git": git,
        "GitHub": github,
        "HTML, CSS, JavaScript": htmlcssjavascript,
        "Frontend (React)": frontend,
        "Backend (Node)": backend,
        "Full Stack (Django)": fullstack,
        "Data Science": datascience,
        "AWS Computing": awscomputing,
        "Design": design
    }
 
    return (
        <div className={styles.container}>
        <div className={styles.sidebar}>
            <ResourcesButton button="Start Here" content={[]} state={setResource} />
            <ResourcesButton button="Git/GitHub" content={["Git", "GitHub"]} state={setResource} />
            <ResourcesButton button="Web Dev" content={["HTML, CSS, JavaScript", "Frontend (React)", "Backend (Node)", "Full Stack (Django)"]} state={setResource} />
            <ResourcesButton button="Data Science" content={["Data Science", "AWS Computing"]} state={setResource} />
            <ResourcesButton button="Design" content={[]} state={setResource} />
        </div>
        <div className={styles.mainContent}>
            {resources[resource]}
        </div>
        </div>
    );
}

const starthere = (
        <div>
            <h1>Stuck? Check these out!</h1>
            <p>This is my main content.</p>
        </div>
    )

const git = (
        <div>
            <h1>Git</h1>
            <p>Git is a version-control system that you will use to update your team's code. This tutorial will cover most of the necessary functions. If you need a different function or a more thorough explanation, you will find it online.</p>
            <h2>Prerequisites</h2>
            <ul>
                <li>Terminal proficiency</li>
                <li>Git installed</li>
                <ul>
                    <li>Windows: <a href="https://gitforwindows.org/" target="_blank" rel="noreferrer">https://gitforwindows.org/</a></li>
                    <li>Mac: <a href="https://sourceforge.net/projects/git-osx-installer/files/" target="_blank" rel="noreferrer">https://sourceforge.net/projects/git-osx-installer/files/</a></li>
                </ul>
            </ul>
            <p>To make sure you have git installed, run the following command in your terminal. It should return a version number if that's true.</p>
            <pre><code>git --version</code></pre>
            <h2>Basic Git Functions</h2>
            <p>First, create a folder “test”. Mine will be located in the Downloads folder, but you can put it wherever. We will use it for testing purposes.</p>
            <p>Open your terminal and change your current directory to be inside the “test” folder.</p>
            <img src={git1} alt="" />
            <p>Run the following command to initialize the git repository</p>
            <pre><code>git init</code></pre>
            <img src={git2} alt="" />
        </div>
    )

const github = (
        <div>
            <h1>GitHub</h1>
        </div>
    )

const htmlcssjavascript = (
        <div>
            <h1>Intro to HTML, CSS, and JavaScript</h1>
            <p>Gain a swift understanding of HTML, CSS, and JavaScript. As you progress through this tutorial, there's no need to commit everything to memory; our aim is to simply acquaint you with the appearance of the code. Remember, when constructing your web applications, it's perfectly acceptable to rely on online resources.</p>
            <a href="https://brytdesigns.com/html-css-javascript-whats-the-difference" target="_blank" rel="noreferrer">https://brytdesigns.com/html-css-javascript-whats-the-difference</a>
            <h2>Get familiar with HTML and CSS</h2>
            <p>Path 1 is a thorough, slower-paced, approach that we highly recommend for those completely new to HTML and CSS, with no prior web development experience. While it may be a bit lengthy, sections 1, 2, 8, 9, 11, and 12 are the most vital components. However, if you have some familiarity with HTML and CSS, we suggest Path 2 - a faster-paced journey that provides a rapid understanding of these technologies while actively working on a project. We strongly urge you to code along!</p>
            <p>1. Slower but More In Depth:</p>
            <a href="https://www.youtube.com/watch?v=LGQuIIv2RVA&list=PL4-IK0AVhVjM0xE0K2uZRvsM7LkIhsPT-&index=1" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=LGQuIIv2RVA&list=PL4-IK0AVhVjM0xE0K2uZRvsM7LkIhsPT-&index=1</a>
            <p>2. Deep Dive and Fast Paced Tutorial:</p>
            <a href="https://www.youtube.com/watch?v=gXLjWRteuWI" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=gXLjWRteuWI</a>
            <h2>CSS FlexBox vs. Grid</h2>
            <p>Flexbox and grid are both powerful layout mechanisms in CSS, but they have different strengths. Flexbox is ideal for laying out items in a single row or column, while grid is best suited for laying out items in a two-dimensional grid. They will be used fairly often when building your website.</p>
            <p>Learn FlexBox: <a href="https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox">https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox</a></p>
            <p>Learn Grid:</p>
            <p>1. <a href="https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid">https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid</a></p>
            <p>2. <a href="https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-creating-a-grid">https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-creating-a-grid</a></p>
            <h2>Responsive Web Design</h2>
            <p>Responsive web design in CSS is an approach that allows websites to adapt to different screen sizes and devices. It's important because it ensures that websites look great and function properly on any device, which is crucial for providing a positive user experience and improving engagement and conversion rates.</p>
            <p>Learn Responsive Web Design:</p>
            <p>1. <a href="https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness">https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness</a></p>
            <p>2. <a href="https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries">https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries</a></p>
            <h2>Great Resources to Use While Coding</h2>
            <p>1. <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noreferrer">https://css-tricks.com/snippets/css/a-guide-to-flexbox/</a></p>
            <p>2. <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank" rel="noreferrer">https://css-tricks.com/snippets/css/complete-guide-grid/</a></p>
        </div>
    )

const frontend = (
        <div>
            <h1>Frontend (React)</h1>
        </div>
    )

const backend = (
        <div>
            <h1>Backend (Node)</h1>
        </div>
    )

const fullstack = (
        <div>
            <h1>Fullstack (Django)</h1>
        </div>
    )

const datascience = (
        <div>
            <h1>Data Science</h1>
        </div>
    )

const awscomputing = (
        <div>
            <h1>AWS Computing</h1>
        </div>
    )

const design = (
        <div>
            <h1>Figma</h1>
            <p>Welcome! Learn how to design your website to use in your projects! BUCKLE UP WE ARE IN FOR A RIDE 🚔🚨 who says you can't be a good designer AND a good SWE?!</p>
            <h2>🪑 Table of Contents</h2>
            <ol>
                <li>building your moodboard with Pinterest</li>
                <li>Figuring out your fonts and colors</li>
                <li>Using Figma to block/build out your designs</li>
                <li>Importing your designs into code or whatever it may be</li>
            </ol>
            <h2>✏️ Moodboard Building with Pinterest</h2>
            <ul>
                <li>why?</li>
                <ul>
                    <li>moodboard is a great way to plan out the ~vibes~ of your website/design. It's an easy way to get inspiration and figure out how and what you want in your designs.</li>
                    <li>the algorithm for Pinterest goes CRAZY HARD if you see an image that you like, it will give you similar images with the same vibes/theme so it makes the mood-boarding process a lot easier!</li>
                </ul>
            </ul>
            <h3>Directions</h3>
            <ol>
                <li>go to Pinterest <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">here</a></li>
                <li>search for whatever you want (website designs, home page design, search bar design, whatever)</li>
                <ul>
                    <li>if you see something you like, hover on the image, and a “Save” button should appear. Save it and create a mood board with whatever name you desire</li>
                    <li>should be intuitive but if not, here's a quick video of how! <a href="https://www.youtube.com/watch?v=tUuihZp8udY" target="_blank" rel="noreferrer">here</a></li>
                </ul>
            </ol>
            <h2>🅰️ Fonts and Colors </h2>
            <p>Making memorable designs is intentional with the fonts and colors you choose.</p>
            <p>FUN FACT O'CLOCK!</p>
            <ul>
                <li>The color red: Ever notice how almost all fast food places have the color red? (think mcd, panda express, in-n-out, literally everything) this is being when your brain sees red, it produces a sense of hunger!</li>
                <li>The color blue: All the big tech companies, their main color is blue! Blue is seen as dependable and reliable (think meta, Twitter, LinkedIn, Zoom) All your favorite products are very intentional with the colors they choose.</li>
            </ul>
            <p>IMPORTANT: the most important when it comes to design is if YOU think it looks good! be confident in your choices 😎</p>
            <h3>WHERE DO I FIND FONTS? (for free)</h3>
            <p>Every Berkeley students have free access to everything Adobe related</p>
            <ul>
                <li><a href="https://fonts.adobe.com/" target="_blank" rel="noreferrer">Adobe Fonts</a></li>
                <li><a href="https://www.dafont.com/" target="_blank" rel="noreferrer">Da Font</a></li>
            </ul>
            <p>These are my favorite two websites to get fonts from, but you can literally search for “Free fonts” and a lot will show up. A good way to find inspiration is through your mood board or your favorite websites!</p>
            <h3>WHERE DO I FIND COLORS</h3>
            <ul>
                <li>Look through your mood board and see what main colors you choose. Think about how those colors make you feel. Does it address the feel of the product you are creating?</li>
                <li>A good rule of thumb for colors: 👍</li>
                <ul>
                    <li>you usually will have 1-2 main colors</li>
                    <li>1-3 accent colors (supporting colors)</li>
                    <li>don't want to have more than 3-4 colors because then it gets overwhelming and takes away the attention of the product you are building!</li>
                </ul>
                <li><a href="https://coolors.co/" target="_blank" rel="noreferrer">https://coolors.co/</a></li>
                <ul>
                    <li>good for a color generation if you need to vibe it out!</li>
                </ul>
            </ul>
            <h2>✒️ FIGMA balls time! 😹</h2>
            <p>this is the fun part!!</p>
            <h3>WHAT IS FIGMA? <a href="https://figma.com/" target="_blank" rel="noreferrer">here</a></h3>
            <p>Think Adobe Illustrator, but a lot more approachable and made for website building, wireframing, and prototyping. A lot easier to use and super easy to learn (learning curve is literally a flat line, trust)</p>
            <ul>
                <li>you can sign up with Figma using your berkeley.edu email (free!) you can either use it on a browser or download it down to your laptop</li>
            </ul>
            <h3>Watch this video (43 mins)</h3>
            <a href="https://www.youtube.com/watch?v=HZuk6Wkx_Eg" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=HZuk6Wkx_Eg</a>
            <ul>
                <li>this video goes into depths more than it needs to design a good website, but it is SO GOOD.</li>
                <li>after this video you are figma expert (design 🤝 code) ← this is going to be you.</li>
            </ul>
            <h3>Important parts to know in the video (from 1:02 to 21:20)</h3>
            <ol>
                <li>figma interface overview</li>
                <li>page & grid set-up</li>
                <li>design the hero & navigation (this is a good part to do as a demo and follow along to get the feel of how to create shapes)</li>
            </ol>
            <h2>Using your designs 💃</h2>
            <p>after all the hard work (phew! good job!) you can now use your designs and make it a reality with your awesome coding skills! (so sexy)</p>
            <ul>
                <li>however, you want to use your designs is up to you!</li>
                <li>on the side, you can select your designs as png or jpg to insert into your code.</li>
                <li>having a design is having a guide on where to put certain elements, be free and explore whatever you think works best!</li>
            </ul>
        </div>
    )