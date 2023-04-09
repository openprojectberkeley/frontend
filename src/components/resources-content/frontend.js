import styles from '../../css/Resources.module.css'

const frontend = (
    <div>
        <h1>Frontend (React)</h1>
        <p>React.js or React is a popular JavaScript library used for building front-end user interfaces. 
            The toolkit allows for developers to build complex and dynamic web applications with smaller and 
            reusable <span className={styles.bold}>components</span>. You could use React to develop a variety of user interfaces, ranging from a 
            simple website to an entire mobile app. <span className={styles.bold}>That being said, this tutorial is specifically geared towards 
            web development with React.js rather than mobile development with React Native.</span>   
        </p>
        <h2>Why React?</h2>
        <p>React is a popular choice for UI development, especially web development, for a multitude of reasons, 
            including but not limited to:
        </p>
        <ul>
            <p>
                1. Reusable components: 
            The library allows for you to build individual components that could be reused and combined with other 
            components throughout your web application. This allows for a much easier process of writing and maintaining 
            your code, and it allows for you to easily add new or modifying existing features without repetitive work.
            </p>
            <p>
                2. Virtual DOM: 
            React uses a virtual DOM, which is a lightweight replica of the actual DOM (Document Object Model). When you make
             changes to components, React automatically updates the virtual DOM, and then it efficiently updates the actual DOM. 
             This process of rendering only the necessary changes from the previous virtual DOM state allows for a faster and more 
             responsive web user interface.
            </p>
            <p>
                <a href="https://www.codecademy.com/article/react-virtual-dom">
                    Here</a> is a more comprehensive guide to the internal virtual DOM process if you want
                     a more in-depth read.
            </p>
        </ul>
        <p>Overall, React is a flexible and powerful library that allows for developers to build fast and scalable web applications.</p>
        <h2>How to Set Up React.js</h2>
        <p>There are two prerequisites that you need to run React.js:</p>
        <ul>
            <p>1. Node.js</p>
            <p>2. npm package manager</p>
        </ul>
        <p>You could check whether or not you have Node.js installed or what version of Node.js you have by typing the following command into your terminal:
        </p>
        <pre><code>node -v</code></pre>
        <p>If you see an error, or if you don’t see a version (e.g. ‘v18.12.1’) as an output, that means you have not installed Node.js. If the latter, 
            you can directly install Node from the <a href="https://nodejs.org/en/download">Node.js website.</a>
        </p>
        <p>
        Luckily, npm package manager is automatically installed with Node.js. To double check whether or not you have npm, you can type the following command into your terminal:
        </p>
        <pre><code>npm -v</code></pre>
        <h2>Creating a Web Application With React.js</h2>
        <p>Let’s try and create a simple web application with React. First, you want to make a new directory for your new project. You can do so by using the following command 
        in your terminal, replacing “directory-name” with your desired title:</p>
        <pre><code>mkdir directory-name</code></pre>
        <p>Thereafter, you want to cd into the folder and type in the following command into the terminal:
        </p>
        <pre><code>npx create-react.app .</code></pre>
        <p>The “.” indicates that you want a React application to be initialized in the current directory that you are in. 
        </p>
        <p>The terminal should then initialize React and start installing the necessary packages. It probably would look something like the picture above. Once everything is installed and ready, you should see the following screen: 
        </p>
        <p>Now, let’s open up tutorial-app, the directory we created earlier, in VS code. You should see that it’s been populated with various files and folders with some code in them already, like below:
        </p>
        <p>What you are looking at is the file <span className={styles.bold}>App.js</span>, the most fundamental snippet of code in your web application. In this file, you would essentially define your website’s structure, components and behavior.
        </p>
        <p>Let’s see what our website looks like right now! In order to do that, you would run the following command in your terminal:
        </p>
        <pre><code>npm start</code></pre>
        <p>
        You should see the following output in your terminal, and your website should be opened up in your web browser for you. Before you make any changes to your code, it should look like this:
        </p>
        <p>
        The cool thing is you don’t have to reload the webpage whenever you make any changes to your code! Once you have run <code>npm start</code>, the website automatically updates your changes every time you save your code, without you having to reload the web page. This allows for a much smoother and quicker development process.
        </p>
        <p>
        Go watch this <a href="https://www.youtube.com/watch?v=hQAHSlTtcmY&t=241s">Youtube video</a> and follow along to learn how to create a simple TodoList website. <span className={styles.bold}>The actual coding portion starts at 5:24.</span> The entire video covers what this document has gone over and most of what is going to be covered in the upcoming sections. It also covers important topics such as working with functions, state, and event handling. Good luck!
        </p>
        <h2>Components</h2>
        <p>When you develop your web application, it is important to build your application with reusable and smaller components.
        </p>
        <p>
        For example, when you develop a website, some separate components you might want are Home and About pages. Within those pages, some reusable components may include a header component and a footer component. Dividing your program into those separate components would help you maintain an efficient and clean code.
        </p>
        <p>
        To make a new component, just make a new .js file and write all of the code for that component in that file. Here is an example:
        </p>
        <p>
        You could also import components into other snippets of code, like below! This allows you to use your developed components within other components.
        </p>
        <h2>
            JSX
        </h2>
        <p>
        JSX stands for JavaScript XML, and it is basically React’s version of HTML. It allows for developers to write HTML elements within JavaScript in their React code. As you continue to develop your web applications in React, you can see that JSX makes it much easier to incorporate HTML and CSS elements into your code.
        </p>
        <p>
        If you are not very familiar with HTML and its syntax, <a href="https://www.w3schools.com/html/html5_syntax.asp">this resource</a> might be helpful to read through. If you are not familiar with JavaScript, <a href="https://www.w3schools.com/js/js_syntax.asp">this resource</a> would be helpful. Otherwise, there are some important rules to JSX that you should keep in mind:
        </p>
        <ul>
            <p>
                1. Every JSX element must have a closing tag, even if it is a fragment (an empty tag). For instance, if you want to make a <code>&lt;div&gt;</code> element, the valid syntax for it is <pre><code>&lt;div&gt;Insert your text here. &lt;/div&gt;</code></pre> <code>&lt;div&gt;</code> or <code>&lt;/div&gt;</code> by itself is not valid.
            </p>
            <p>
                2. JSX can have nested elements, much like HTML elements. For instance, you can have a <code>&lt;div&gt;</code> element inside another <code>&lt;div&gt;</code> element.
            </p>
            <p>
                3. If you want to have multiple JSX elements on a webpage (which you most likely will), you want to wrap everything inside a single outermost element. You can do so by having an outermost <code>&lt;div&gt;&lt;/div&gt;</code> element or <code>&lt;&gt;&lt;/&gt;</code> (an empty element is called a fragment). Having unwrapped, multiple JSX elements inside a single return function will result in an error.
            </p>
            <p>
                4. Expressions must be wrapped inside curly braces "{ '{}' }". For instance, <code>&lt;div&gt;{'{'}1 + 2{'}'}&lt;/div&gt;</code> would render as <code>&lt;div&gt;3&lt;/div&gt;</code>.
            </p>
            <p>
                5. JSX elements can contain other React components. For example, <pre><code>&lt;div&gt;&lt;Homepage/&gt;&lt;/div&gt;</code></pre> would render a <code>&lt;div&gt;</code> element containing the 'Homepage' component.
            </p>
        </ul>
        <h2>Importing Files</h2>
        <p>
        Importing files such as images is a pretty straightforward step within React. First you would want to move the image file into your project directory. A common destination for image files is inside ‘/src/images/’.
        </p>
        <p>
        Then, you would want to import the image component on the top of your code like below. “bear” is an arbitrary name used to refer to the “bear.jpeg” file; you can change it as you desire.
        </p>
        <p>
        The snippet of code should then render to look like the following in your web browser:
        </p>
        <h2>CSS</h2>
        <p>
        CSS is what makes one’s website beautiful and well-formatted. CSS (Cascading Style Sheet) allows for developers to control aesthetic aspects of your websites such as fonts, colors, spacing, layout, and even animation. Syntactically, it’s quite simple! Let’s go through an example:
        </p>
        <p>
        First and foremost, you want to link your CSS stylesheet. You typically would want a different CSS file for each corresponding component. For instance, <span className={styles.bold}>Homepage.js</span> would have a corresponding <span className={styles.bold}>Homepage.module.css</span> file. You can link your stylesheet to the corresponding .js file by importing it at the top, like so:
        </p>
        <p>
        Let’s say you want to change the h1 element, which says “Hello!”, to be in red font. To do so, you want to associate a className within the <code>&lt;h1&gt;</code> element, such as so:
        </p>
        <p>
        In your CSS file, you would want to make the following changes. Note that for colors, you can either put in keywords such as “red” and “white” or input a color’s hex code.
        </p>
        <p>
        Let’s say you also want to format the text so that it is in the center of the webpage. A common way to do so is by using Flexbox, which we will go over in details later. To activate Flexbox, simply put <code>display: flex</code> like below and use the following Flex properties! Don’t forget the semicolon after each line!
        </p>
        <p>
        Now the web page looks like this:
        </p>
        <p>
        Alternatively, here is a simple <a href="https://www.youtube.com/watch?v=ZawAwPYrxGA">tutorial</a> on how to style with CSS.
        </p>
        <p>
        Here is a very useful <a href="https://www.w3schools.com/cssref/index.php">reference</a> of all the CSS properties!
        </p>
        <h2>Flexbox</h2>
        <p>
        Flexbox is a CSS module that allows for a flexible and dynamic way to arrange and align elements on your web page. There are two types of Flexbox elements: parent container and child items. As the names suggest, a parent container wraps around the child elements, and they each have their own corresponding Flexbox properties that you can use to manipulate the elements.
        </p>
        <p>
        Like mentioned before, a flex container is defined by <code>display: flex</code>. You want to define this whenever you want to make use of Flexbox properties.
        </p>
        <p>
        Here is a comprehensive <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/">reference sheet</a> on Flexbox tricks, which includes all the different Flexbox properties that you can use!
        </p>
    </div>
)

export default frontend;