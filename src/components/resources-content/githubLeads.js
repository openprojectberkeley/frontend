import hub1 from "../../images/gitHub/image1.png";
import hub2 from "../../images/gitHub/image2.png";
import hub3 from "../../images/gitHub/image3.png";
import hub4 from "../../images/gitHub/image4.png";
import hub5 from "../../images/gitHub/image5.png";
import hub6 from "../../images/gitHub/image6.png";
import hub7 from "../../images/gitHub/image7.png";
import hub8 from "../../images/gitHub/image8.png";
import hub9 from "../../images/gitHub/image9.png";
import hub10 from "../../images/gitHub/image10.png";
import hub11 from "../../images/gitHub/image11.png";
import hub12 from "../../images/gitHub/image12.png";
import hub13 from "../../images/gitHub/image13.png";
import hub14 from "../../images/gitHub/image14.png";
import hub15 from "../../images/gitHub/image15.png";
import hub16 from "../../images/gitHub/image16.png";
import hub17 from "../../images/gitHub/image17.png";
import hub18 from "../../images/gitHub/image18.png";
import hub19 from "../../images/gitHub/image19.png";
import hub20 from "../../images/gitHub/image20.png";
import hub21 from "../../images/gitHub/image21.png";
import hub22 from "../../images/gitHub/image22.png";

const githubLeads = (
    <div>
        <h1>GitHub (Leads)</h1>
        <p>This tutorial is meant for project leads and it will cover how to set up your Github repository so that you and your teammates can easily manage and store your code online. </p>
        <h2>Prerequisites</h2>
        <ul>
            <li>Git installed + proficiency</li>
            <li>Github account: <a href="https://github.com/" target="_blank" rel="noreferrer">https://github.com/</a></li>
            <li>Text editor (VScode): <a href="https://code.visualstudio.com/download" target="_blank" rel="noreferrer">https://code.visualstudio.com/download</a></li>
        </ul>
        <h2>Setup</h2>
        <p>Go to your GitHub profile</p>
        <p>Select Repositories, and click on “New”</p>
        <img src={hub21}></img>
        <p>Give your repository a name</p>
        <img src={hub18}></img>
        <p>On your computer, create a new folder (this will be for your project)</p>
        <img src={hub6}></img>
        <p>Open the folder in VSCode (several ways to do so)</p>
        <ul>
            <li>File &gt; Open Folder in VSCode</li>
            <li>right click on folder in file explorer</li>
            <li>code . command in the terminal when inside folder</li>
        </ul>
        <img src={hub3}></img>
        <p>Initialize a git repository with the following command in your terminal </p>
        <pre><code>git init</code></pre>
        <img src={hub19}></img>
        <p>Create a new file, such as a README.md, and add some contents</p>
        <img src={hub5}></img>
        <p>Make a commit with your changes with the commands </p>
        <pre><code>git add . <br></br>git commit -m "&lt;message&gt;"</code></pre>
        <img src={hub15}></img>
        <p>Run the three lines of code on the newly created Github repository in your terminal</p>
        <img src={hub20}></img>
        <p>and the result should look similar to this</p>
        <img src={hub9}></img>
        <p>Refresh your page to see the pushed code</p>
        <img src={hub11}></img>
        <p>Click on the project settings &gt; Collaborators, and add all of your teammates accounts to the projects by clicking on the green button “Add people”</p>
        <img src={hub1}></img>
        <p>The people you add will receive an invitation via email that they will need to accept. If they accept the invite, you will see them here.</p>
        <img src={hub16}></img>
        <p>Select Branches &gt; Add branch protection rule, note that the default branch is called “main” here</p>
        <img src={hub2}></img>
        <p>Fill in the name of the default branch and select the following options:</p>
        <img src={hub12}></img>
        <p>OPTIONAL) With the above settings right now, YOU are still able to push to the main branch without making a pull request that requires approval. If you are worried about making a mistake, enable the following option.</p>
        <img src={hub14}></img>
        <p>Scroll to the bottom of the page, and press on Create</p>
        <img src={hub8}></img>
        <p>Make sure the branch protection rule is added and matches your default branch name</p>
        <img src={hub17}></img>
        <h2>Approving Pull Requests</h2>
        <p>When your teammates make changes to your project's code, they will push it to a non-main branch on the Github repository and make a pull request.</p>
        <p>All pull requests will appear under the Pull requests tab.</p>
        <img src={hub13}></img>
        <p>After clicking on one of the pull requests, you will be redirected to the following page.</p>
        <img src={hub22}></img>
        <p>To view what changes your teammate has made, click on the Files changed tab.</p>
        <p>If you want to test whether the code is working without bugs before merging branches, you may use the following commands on your computer to get access to that code.</p>
        <pre><code>git pull <br></br>git checkout &lt;name of branch&gt;</code></pre>
        <p>If you approve of the changes made, click on “add your review” on the Github page (shown to the right of “Review Required” in red). You will be redirected to the following page.</p>
        <img src={hub4}></img>
        <p>After pressing the green Review Changes button, select the following options and click “Submit Review”.</p>
        <img src={hub10}></img>
        <p>You may then merge the pull request.</p>
        <img src={hub7}></img>
        <p>You will now notice that your main branch has been updated.</p>
        <p>Congratulations, you have successfully set up your Github repository and know how to manage it (which looks very nice on your resume).</p>
    </div>
)

export default githubLeads;