import git1 from '../../images/git1.png';
import git2 from '../../images/git2.png';
import git3 from '../../images/git3.png';
import git4 from '../../images/git4.png';
import git5 from '../../images/git5.png';
import git6 from '../../images/git6.png';
import git7 from '../../images/git7.png';
import git8 from '../../images/git8.png';
import git9 from '../../images/git9.png';


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
        <p>Create a new document inside the folder with some text. I made a file called abc.txt with the following contents:</p>
        <img src={git3} alt="" />
        <p>Running git status will show you the status of the git repository such as new/deleted/changed documents. Here, it shows that my new file abc.txt is not being tracked yet.</p>
        <img src={git4} alt="" />
        <p>For an analogy, pretend you are playing some sort of game where you can save your progress manually. Git status will tell you what has changed since the last time you saved your game.</p>
        <p>By running the following command, we will tell git that we want to include the changes made in abc.txt in our next commit. In terms of the analogy, you are telling the game what progress you want to include in your next save.</p>
        <pre><code>git add &lt;name of file&gt;</code></pre>
    </div>
)

export default git;