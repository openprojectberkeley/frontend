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
        "Start Here": starthere(),
        "Git": git(),
        "GitHub": github(),
        "HTML, CSS, JavaScript": htmlcssjavascript(),
        "Frontend (React)": frontend(),
        "Backend (Node)": backend(),
        "Full Stack (Django)": fullstack(),
        "Data Science": datascience(),
        "AWS Computing": awscomputing(),
        "Design": design()
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

function starthere() {
    return (
        <div>
            <h1>Stuck? Check these out!</h1>
            <p>This is my main content.</p>
        </div>
    )
}

function git() {
    return (
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
}

function github() {
    return (
        <div>
            <h1>GitHub</h1>
        </div>
    )
}

function htmlcssjavascript() {
    return (
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
}

function frontend() {
    return (
        <div>
            <h1>Frontend (React)</h1>
        </div>
    )
}

function backend() {
    return (
        <div>
            <h1>Backend (Node)</h1>
        </div>
    )
}

function fullstack() {
    return (
        <div>
            <h1>Fullstack (Django)</h1>
        </div>
    )
}

function datascience() {
    return (
        <div>
            <h1>Data Science</h1>
        </div>
    )
}

function awscomputing() {
    return (
        <div>
            <h1>AWS Computing</h1>
        </div>
    )
}

function design() {
    return (
        <div>
            <h1>Design</h1>
        </div>
    )
}