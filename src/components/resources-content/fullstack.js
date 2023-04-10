import django1 from "../../images/django/django1.png";
import django2 from "../../images/django/django2.png";
import django3 from "../../images/django/django3.png";
import django4 from "../../images/django/django4.png";
import django5 from "../../images/django/django5.png";

const fullstack = (
    <div>
        <h1>Fullstack (Django)</h1>
        <p>If you answer yes to the following questions, you should consider using Django for your project:</p>
        <ul>
            <li>Do you need an easy to set up a website/backend/database?</li>
            <li>Do you despise Javascript with a passion and would rather write in Python?</li>
            <li>Do you not want to use NodeJS?</li>
        </ul>
        <p>This tutorial will cover how to set up and enter a Django environment and create and interact with a Django database.</p>
        <p>If you would like to learn more about Django such as how to send Html to users, url redirects, and more, I recommend the following tutorial starting at ~25 min:</p>
        <a href="https://www.youtube.com/watch?v=rHux0gMZ3Eg" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=rHux0gMZ3Eg</a>
        <p>If you have completed your project and are ready for deployment, I recommend the following video:</p>
        <a href="https://www.youtube.com/watch?v=mAeK4Ia4fk8" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=mAeK4Ia4fk8</a>
        <h2>Prerequisites</h2>
        <p>Terminal proficiency</p>
        <h2>Setup</h2>
        <p>Install Python:</p>
        <p>Windows: <pre><code>py --version</code></pre> (should return version number)</p>
        <p>Install Django:</p>
        <p>Windows:</p>
        <pre><code>py -m pip install django</code></pre>
        <p><pre><code>py -m django --version</code></pre> (should return version number)</p>
        <p>Create folder for Django Environment</p>
        <p>Change directory inside that folder</p>
        <p>Create Virtual Environment inside the folder</p>
        <p>Windows:</p>
        <pre><code>py -m pipenv install django</code></pre>
        <h2>START HERE IF YOU ALREADY INSTALLED DJANGO ENVIRONMENT</h2>
        <p>Enter the virtual environment with the following command (to run special Django commands). You will run this every time you close the project and want to start working on it again.</p>
        <p>Windows: <pre><code>py -m pipenv shell</code></pre></p>
        <p>Mac: <pre><code>python pipenv shell</code></pre></p>
        <p>Create a project with the following command (This will create a folder that contains settings and dependencies. Don't forget the . at the end of the command so it doesn't create too many folders):</p>
        <pre><code>django-admin startproject &lt;name of project&gt; .</code></pre>
        <p>Create an app with the following command (This will be what actually deals with sending html to users, running logic, and handling databases)</p>
        <pre><code>py manage.py startapp &lt;name of app&gt;</code></pre>
        <p>Run server (click on link, should redirect to following page)</p>
        <pre><code>py manage.py runserver</code></pre>
        <img src={django1} alt="" />
        <h2>Setting up the Database</h2>
        <p>Create a Database model in &lt;name of app&gt; / models.py such as the following:</p>
        <img src={django2} alt="" />
        <p>Be sure to include the manager variable (name doesn't matter) in order to gain access to all rows in your database and a __str__ method to see the values inside the rows instead of “Object [Object]”</p>
        <p>To create the database, run the following commands</p>
        <p>Windows:</p>
        <pre><code>py manage.py makemigrations</code></pre>
        <pre><code>py manage.py migrate</code></pre>
        <p>You will notice a file called db.sqlite3 (next to manage.py, Pipfile, and Pipfile.lock). This file contains your new table (Users in my case) and other ones created by Django.</p>
        <p>To view your table with a nice visual you can use the following site and upload the db.sqlite3 file: https://sqliteviewer.app/ . Under tables on the left, you should see your new table called &lt;name of app&gt;_&lt;name of table&gt; (myapp_users  in my case)</p>
        <img src={django3} alt="" />
        <h2>Operating on the Table via Terminal</h2>
        <p>Run the following command to run Python interpreter inside the virtual shell you are already in</p>
        <p>Windows: <pre><code>py manage.py shell</code></pre></p>
        <p>Here is an example of me creating an entry, searching, and deleting from the table</p>
        <img src={django4} alt="" />
        <h2>Operating on Table via Python Files</h2>
        <p>If you would like to operate on your database once you do the runserver command, following the instructions below.</p>
        <p>In your app folder, add the ready function and os import:</p>
        <img src={django5} alt="" />
        <p>The ready function inside &lt;yourAppName&gt;Config class will run twice when calling the py manage.py runserver command.</p>
        <p>The run_once variable and logic is there to ensure that the code after it will run once, and this might be something to consider if you want to run some logic on the database when starting up the server (as opposed to the terminal).</p>
    </div>
)

export default fullstack;