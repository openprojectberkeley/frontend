const computing = (
    <div>
        <h1>Computing</h1>
        <p>Recommended: Use Google Colab</p>
        <ul>
            <li>GPU Access</li>
            <li>Compatible with Jupyter Notebooks</li>
            <li>Free!</li>
            <li><a href="https://colab.research.google.com/" target="_blank" rel="noreferrer">https://colab.research.google.com/</a></li>
        </ul>
        <p>Or use <a href="https://deepnote.com/" target="_blank" rel="noreferrer">DeepNote</a> for live collaborative coding - it's free for students!</p>
        <p>But if you want more performance and are bottlenecked by Colab's daily GPU usage limit, use AWS Computing (costs reimbursable by Open Project):</p>
        <p>To run your PyTorch code on AWS, you can follow these general steps:</p>
        <ol>
            <li>Create an AWS account:</li>
            <ul>
                <li><a href="https://aws.amazon.com/" target="_blank" rel="noreferrer">https://aws.amazon.com/</a></li>
                <li>Open Project will reimburse your AWS usage for your projects. Please contact us!</li>
            </ul>
            <li>Launch an EC2 instance:</li>
            <ul>
                <li>First, you need to create an Amazon EC2 instance on which you will run your PyTorch code. You can choose an instance type that meets your computational and memory requirements.</li>
                <li>During the setup of the instance, you can specify the security group, key pair, and other settings.</li>
                <li><a href="https://www.youtube.com/watch?v=YB_qanudIzA" target="_blank" rel="noreferrer">https://www.youtube.com/watch?v=YB_qanudIzA</a></li>
            </ul>
            <li>Connect to your EC2 instance:</li>
            <ul>
                <li>Once the instance is launched, you can connect to it using SSH.</li>
                <li>You can find the public IP address of your instance on the EC2 console.</li>
                <li><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html" target="_blank" rel="noreferrer">https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html</a></li>
            </ul>
            <li>Install PyTorch:</li>
            <ul>
                <li>Once you have connected to your instance, you can install PyTorch using pip or conda.</li>
                <li>You can also install other dependencies that your code requires.</li>
                <li>pip install pytorch usually does the trick</li>
            </ul>
            <li>Upload your code and data:</li>
            <ul>
                <li>You can upload your PyTorch code and any data that it requires to your EC2 instance.</li>
                <li>You can use secure copy (SCP) to transfer files from your local machine to the EC2 instance.</li>
                <li><a href="https://docs.aws.amazon.com/managedservices/latest/appguide/qs-file-transfer.html" target="_blank" rel="noreferrer">https://docs.aws.amazon.com/managedservices/latest/appguide/qs-file-transfer.html</a></li>
            </ul>
            <li>Run your PyTorch code:</li>
            <ul>
                <li>Once you have uploaded your code and data, you can run your PyTorch code using the command line interface.</li>
                <li>You can use nohup or screen to run your code in the background and detach from the session.</li>
            </ul>
        </ol>
        <p>Note that this is just a general outline, and the exact steps may vary depending on your specific requirements and use case. Additionally, you may need to configure your instance's networking settings, storage, and other configurations as needed.</p>
    </div>
)

export default computing;