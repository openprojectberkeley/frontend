import backend1 from '../../images/backend/backend1.png';
import backend2 from '../../images/backend/backend2.png';
import backend3 from '../../images/backend/backend3.png';
import backend4 from '../../images/backend/backend4.png';
import backend5 from '../../images/backend/backend5.png';
import backend6 from '../../images/backend/backend6.png';
import backend7 from '../../images/backend/backend7.png';
import backend8 from '../../images/backend/backend8.png';
import backend9 from '../../images/backend/backend9.png';
import backend10 from '../../images/backend/backend10.png';
import backend11 from '../../images/backend/backend11.png';
import backend12 from '../../images/backend/backend12.png';
import backend13 from '../../images/backend/backend13.png';
import backend14 from '../../images/backend/backend14.png';
import backend15 from '../../images/backend/backend15.png';
import backend16 from '../../images/backend/backend16.png';
import backend17 from '../../images/backend/backend17.png';
import backend18 from '../../images/backend/backend18.png';

const backend = (
    <div>
        <h1>Backend (Node)</h1>
        <p>Backend development involves designing, developing, and maintaining the server-side of web applications, using programming languages like Python, Java, Ruby, and Node.js, and frameworks like Django, Flask, Ruby on Rails, and Express.js. Node.js is a platform that allows developers to use JavaScript for server-side programming, while Express.js is a framework built on top of Node.js to make it easier to create web applications and APIs. Together, they enable developers to build fast, scalable, and powerful web applications using JavaScript.</p>
        <p>If you answer yes to the following questions, you should use a backend with Node.js:</p>
        <ul>
            <li>Do you want a clean coding and file environment?</li>
            <li>Do you need a frontend for a website and a backend to store/retrieve data from a database?</li>
            <li>Do you like or want to learn Javascript?</li>
            <li>Do you need to handle user authentication and authorization?</li>
            <li>Do you need to handle server-side logic, such as generating dynamic content, performing calculations, or processing data?</li>
            <li>Do you need to interact with external APIs or services, such as payment gateways, social media platforms, or messaging services?</li>
            <li>Do you need to manage the performance and scalability of your application, such as caching, load balancing, or server optimization?</li>
        </ul>
        <h2>Tutorial</h2>
        <p>Node.js is an open-source server-side runtime environment built on Chrome's V8 JavaScript engine. It allows developers to build fast, scalable, and efficient applications using JavaScript on the server-side. In this tutorial, we will cover the basics of Node.js as a backend and connect it to a frontend that is built with React.js.</p>
        <h2>Setup Node.js</h2>
        <p>Install NodeJS <a href="https://nodejs.org/en" target="_blank" rel="noreferrer">https://nodejs.org/en</a></p>
        <p>Create a folder for your project, mine will be called “test”</p>
        <p>Open your project folder inside VSCode</p>
        <img src={backend1} alt=""/>
        <p>Run the following command to initialize the backend, and press enter multiple times to complete the prompts given to you. You will notice a package.json file has been created in your folder.</p>
        <pre><code>npm init</code></pre>
        <img src={backend2} alt=""/>
        <p>Run the following command to install express, the framework that will handle requests made to the server.</p>
        <pre><code>npm install express</code></pre>
        <img src={backend3} alt=""/>
        <p>Create a JS file, mine is called index.js. This will be the file that will be run on start.</p>
        <img src={backend4} alt=""/>
        <p>Open package.json and add the following to scripts. (You may also delete the test entry in scripts).</p>
        <pre><code>"start": "node &lt;name of start file&gt;"</code></pre>
        <img src={backend5} alt=""/>
        <p>Running a server requires you to use the command “node &lt;path to start file”&gt;, but by doing the previous step, you may accomplish the same using the command “npm start” regardless of your location within your project folder.</p>
        <p>I added a simple print statement in my start file and ran the server. As you can see in the terminal, the print statement was executed.</p>
        <img src={backend6} alt=""/>
        <p>To stop the server, use the following shortcut in the terminal:</p>
        <pre><code>Ctrl + C</code></pre>
        <h2>Setup Express</h2>
        <p>To set up a simple Express server, add the following code to your start file.</p>
        <img src={backend7} alt=""/>
        <p>Running npm start will start your server, and you can see your website by typing localhost:&lt;port&gt; in your browser.</p>
        <img src={backend8} alt=""/>
        <p>If you would like to serve your users basic html/js/css without any frameworks such as React, you may follow this guide: <a href="https://expressjs.com/en/starter/static-files.html" target="_blank" rel="noreferrer">https://expressjs.com/en/starter/static-files.html</a></p>
        <h2>Setting up React</h2>
        <p>If you want to use React for your front-end, run the following command to initialize a React project inside your project folder. My react project will be called “test-frontend”</p>
        <pre><code>npx create-react-app &lt;name of your react project&gt;</code></pre>
        <img src={backend9} alt=""/>
        <p>Your folder structure should look like the following:</p>
        <img src={backend10} alt=""/>
        <p>For our React project to be able to communicate with our backend, you will need to add the following key-value pair in the package.json file INSIDE of your React project folder. Whenever we will use the fetch function, it will call it using the following url, which is the url of our Express server.</p>
        <pre><code>"proxy": "http://localhost:&lt;port number that was in your index.js file&gt;"</code></pre>
        <img src={backend11} alt=""/>
        <p>As proof of concept, we will add the following logic to our App.js file in the test-frontend/src folder. It will load a page for the user, fetch an additional message from the server, and update the html with the fetched message.</p>
        <img src={backend12} alt=""/>
        <p>We will also update our Express start file (index.js) on line 5 from '/'' to '/api' so it matches the React fetch pattern</p>
        <img src={backend13} alt=""/>
        <p>Because Express and React are 2 different servers that will be running simultaneously, it will get tedious to start each one up individually in different terminals using npm start in the project folder and inside the React project folder. To make it easier, we will use the “Concurrently” module. We first need to install it.</p>
        <pre><code>npm install concurrently</code></pre>
        <img src={backend14} alt=""/>
        <p>In your project's package.json file (NOT inside your React project folder), edit the start script to the following:</p>
        <pre><code>“server”: “node &lt;start file for Express server&gt;”</code></pre>
        <pre><code>“client”: “npm start —prefix &lt;name of React project&gt;”</code></pre>
        <pre><code>“start”: "concurrently \"npm run server\" \"npm run client\" "</code></pre>
        <p>NOTE: there are 2 dashes before the word prefix</p>
        <img src={backend15} alt=""/>
        <p>Running the npm start command should output the following:</p>
        <img src={backend16} alt=""/>
        <p>And the website has the message that it received via the fetch request.</p>
        <img src={backend17} alt=""/>
        <p>If you go to http://localhost:3001/api, you will notice that the message on the React page matches the one in the Express backend.</p>
        <img src={backend18} alt=""/>
        <p>To terminate the two servers, you may use Ctrl+c once/twice.</p>
        <p>If you received an error, read the following:</p>
        <ul>
            <li>make sure you did not confuse the React folder with the project folder in the previous steps</li>
            <li>To start both of your servers, make sure you are running npm start OUTSIDE of your React project folder or you will be running the React npm start script, which is just the front-end</li>
            <li>Try running the following command in your project folder before trying to start your server</li>
            <pre><code>npm install</code></pre>
            <li>For some reason, calling fetch(“/”) as opposed to fetch(“/api”) does not work</li>
        </ul>
        <p>Congratulations, you are now ready to start your adventure in NodeJS land, but a word of caution, do not fall into callback hell (i.e. too many .then() statements)</p>
    </div>
)

export default backend;