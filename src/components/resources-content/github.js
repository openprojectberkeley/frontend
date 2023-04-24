import hubL1 from "../../images/hubLeads/hubL (1).png";
import hubL2 from "../../images/hubLeads/hubL (2).png";
import hubL3 from "../../images/hubLeads/hubL (3).png";
import hubL4 from "../../images/hubLeads/hubL (4).png";
import hubL5 from "../../images/hubLeads/hubL (5).png";
import hubL6 from "../../images/hubLeads/hubL (6).png";
import hubL7 from "../../images/hubLeads/hubL (7).png";
import hubL8 from "../../images/hubLeads/hubL (8).png";
import hubL9 from "../../images/hubLeads/hubL (9).png";
import hubL10 from "../../images/hubLeads/hubL (10).png";
import hubL11 from "../../images/hubLeads/hubL (11).png";
import hubL12 from "../../images/hubLeads/hubL (12).png";
import hubL13 from "../../images/hubLeads/hubL (13).png";
import hubL14 from "../../images/hubLeads/hubL (14).png";
import hubL15 from "../../images/hubLeads/hubL (15).png";
import hubL16 from "../../images/hubLeads/hubL (16).png";
import hubL17 from "../../images/hubLeads/hubL (17).png";
import hubL18 from "../../images/hubLeads/hubL (18).png";

const github = (
    <div>
        <h1>GitHub</h1>
        <p>This tutorial is meant for team members to set up their device in order to contribute code to their project. </p>
        <h2>Prerequisites</h2>
        <ul>
            <li>Github account: <a href="https://github.com/" target="_blank" rel="noreferrer">https://github.com/</a></li>
            <li>Git installed + proficiency</li>
            <li>Text editor (VScode): <a href="https://code.visualstudio.com/download" target="_blank" rel="noreferrer">https://code.visualstudio.com/download</a></li>
            <li>An email invite from project lead via Github</li>
        </ul>
        <h2>Setup</h2>
        <p>Check your email with an invite from your project lead to collaborate on Github, and click on “accept or decline”</p>
        <img src={hubL7}></img>
        <p>If you do not have a Github account, you will be prompted to create one. Otherwise, skip to next step.</p>
        <img src={hubL11}></img>
        <p>Accept the invitation</p>
        <img src={hubL18}></img>
        <p>You will then be sent to the following page, copy the URL at the top of the browser page</p>
        <img src={hubL12}></img>
        <p>Open VSCode, and do Ctrl+` to open the terminal (if that doesn’t work you may pull it up from the purple bar below or by selecting “New Terminal”)</p>
        <img src={hubL1}></img>
        <p>Change your current path to wherever you want to create a folder with your team’s code using the cd command. Mine will be in the Downloads folder.</p>
        <p>After you are there, use the git clone command to copy the code from the Github repository.</p>
        <pre><code>git clone &lt;URL&gt;</code></pre>
        <img src={hubL5}></img>
        <p>Run the following command in the terminal to enter the folder</p>
        <pre><code>cd &lt;name of project&gt;</code></pre>
        <p>To open the folder, go to File &gt; Open Folder &gt; Select Project Folder in the VScode menu at the top</p>
        <img src={hubL9}></img>
        <p>This will open a new VScode window, and there will be files listed on the left. (for me it’s only one file called README.md)</p>
        <img src={hubL14}></img>
        <p>Create a new branch with a new name and switch to that branch. </p>
        <img src={hubL13}></img>
        <p>Now, you have everything setup and you can start making changes to the files. The next part is to learn how to move your changes to the Github repository.</p>
        <h2>Sending Your Changes to GitHub</h2>
        <p>After making a commit on your own branch like shown below</p>
        <img src={hubL6}></img>
        <p>Run the following command</p>
        <pre><code>git push --set-upstream origin &lt;name of your branch&gt;</code></pre>
        <p>And you should get a similar message</p>
        <img src={hubL15}></img>
        <p>After doing this once, you don’t have to use that last command anymore. You may simply use the following command:</p>
        <pre><code>git push</code></pre>
        <p>If you receive the following error, you are on the main branch. You may only push changes from non-main branches.</p>
        <img src={hubL17}></img>
        <p>To make a request to merge the code from your branch to the main branch, you will need to make a pull request. Select the green button “New pull request”</p>
        <img src={hubL4}></img>
        <p>Select the name of your branch</p>
        <img src={hubL8}></img>
        <p>Select “Create pull request”</p>
        <img src={hubL3}></img>
        <p>You may change the name of your pull request (PR) here. Afterwards, press the button “create pull request”</p>
        <img src={hubL2}></img>
        <p>You will notice the following on your page (if your project lead set up your project correctly)</p>
        <img src={hubL10}></img>
        <p>After the project lead approves your request, you will see that change to the following</p>
        <img src={hubL16}></img>
        <p>You may now press the button “merge pull request” and “confirm merge”. This will update the main branch to include the new code that you have written.</p>
        <p>Congratulations, you have successfully contributed code to your team (and you may now add this to your resume)</p>
    </div>
)

export default github;