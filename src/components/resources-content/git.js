import git1 from '../../images/git/git1.png';
import git2 from '../../images/git/git2.png';
import git3 from '../../images/git/git3.png';
import git4 from '../../images/git/git4.png';
import git5 from '../../images/git/git5.png';
import git6 from '../../images/git/git6.png';
import git7 from '../../images/git/git7.png';
import git8 from '../../images/git/git8.png';
import git9 from '../../images/git/git9.png';
import git10 from '../../images/git/git10.png';
import git11 from '../../images/git/git11.png';
import git12 from '../../images/git/git12.png';
import git13 from '../../images/git/git13.png';
import git14 from '../../images/git/git14.png';
import git15 from '../../images/git/git15.png';
import git16 from '../../images/git/git16.png';
import git17 from '../../images/git/git17.png';
import git18 from '../../images/git/git18.png';
import git19 from '../../images/git/git19.png';
import git20 from '../../images/git/git20.png';
import git21 from '../../images/git/git21.png';
import git22 from '../../images/git/git22.png';
import git23 from '../../images/git/git23.png';
import git24 from '../../images/git/git24.png';
import git25 from '../../images/git/git25.png';
import git26 from '../../images/git/git26.png';
import git27 from '../../images/git/git27.png';
import git28 from '../../images/git/git28.png';

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
        <img src={git5} alt="" />
        <p>If you changed a lot of files or are too lazy to write the name of the file you changed, you may use a dot to add ALL of your changed files in your current folder.</p>
        <img src={git6} alt="" />
        <p>Running git status will now tell us that the file is now ready to be committed.</p>
        <img src={git7} alt="" />
        <p>To commit what you have added, run the following command</p>
        <pre><code>git commit -m “&lt;your message here&gt;”</code></pre>
        <img src={git8} alt="" />
        <p>This is equivalent to saving the game (a good practice in case your computer randomly dies).</p>
        <p>If you run git status, you will see that you have no changes to commit. In terms of the analogy, you have not made any new progress in your game so there's no point in saving again.</p>
        <img src={git9} alt="" />
        <p>To view the history of your commits, use the git log command</p>
        <img src={git10} alt="" />
        <p>Now, suppose you make some changes to abc.txt, add them, and commit them.</p>
        <img src={git11} alt="" />
        <img src={git12} alt="" />
        <p>You realize that you just committed absolute garbage and want to go back to what you had previously committed (your last save point).</p>
        <p>To do so, use the git reset command. The long string of letters and numbers represents your commit hash, which you can find next to your commit when you run the git log command.</p>
        <pre><code>git reset --hard &lt;commit hash&gt;</code></pre>
        <img src={git13} alt="" />
        <p>Now, the contents of abc.txt do not contain garbage anymore.</p>
        <img src={git14} alt="" />
        <h2>Branches</h2>
        <p>Now, we are going to cover what branches are and how to use them.</p>
        <p>Suppose the name of the good copy of the code is called “master”. If you create a new branch called “oski” and switch to it, all changes that you will make on the “oski” branch will not affect the code on the “master” branch.</p>
        <p>In terms of the game save analogy, think of branches as save slots. You can update save slot 1, but that will not affect slot 2.</p>
        <p>To view all existing branches, use the following command.</p>
        <img src={git15} alt="" />
        <p>The branch you are currently on has an asterisk next to it. In this case, we have only one branch and it's called master.</p>
        <p>Let's create a new branch with the following command.</p>
        <pre><code>git branch &lt;name of branch&gt;</code></pre>
        <img src={git16} alt="" />
        <p>Now switch over to the oski branch with the following command</p>
        <pre><code>git checkout &lt;name of branch&gt;</code></pre>
        <img src={git17} alt="" />
        <p>I will now add “bear” to the abc.txt file, git add it, and commit the change</p>
        <img src={git18} alt="" />
        <p>If I now go back to the master branch and open abc.txt, I will not see the change I made on the oski branch (there is no bear).</p>
        <img src={git19} alt="" />
        <img src={git20} alt="" />
        <p>Note that you are not able to switch branches if you made changes to the files but did not commit them (going to save slot 1 without saving your progress on save slot 2).</p>
        <img src={git21} alt="" />
        <h2>Push/Pull</h2>
        <p>When working on an existing Github repository, you will have to first clone the repository on your device using the following command once:</p>
        <pre><code>git clone &lt;url of repository&gt;</code></pre>
        <p>If you want to start working on a new change, first use the following command to get the most up-to-date main branch. In my case, it's already up to date since I just cloned it.</p>
        <img src={git22} alt="" />
        <p>Now, make a new branch, make your changes to the code, and commit them.</p>
        <img src={git23} alt="" />
        <p>Now we will push your changes to the Github repository using the git push command.</p>
        <img src={git24} alt="" />
        <p>Note that if this is your first time pushing, you will get the following error</p>
        <img src={git25} alt="" />
        <p>You will have to copy the command given to you after which the push will work.</p>
        <pre><code>git push --set-upstream origin &lt;name of your branch&gt;</code></pre>
        <img src={git26} alt="" />
        <p>To see your branch on the repository, go to the Github repository page and click on branches (highlighted in blue for me).</p>
        <img src={git27} alt="" />
        <p>Your pushed branch will appear here under Active branches.</p>
        <img src={git28} alt="" />
        <p>Congratulations, you have learned how to use Git (and you may now do the Gitlet project for CS61B).</p>
    </div>
)

export default git;