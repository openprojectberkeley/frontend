const subheadings = [
  "Problem Formulation",
  "Data Collection",
  "Data Preparation",
  "Data Exploration",
  "Modeling",
  "Deployment",
];

const datascience = (
  <div>
    <h1>Data Science Guide</h1>
    <p>
      In order to get a good grasp on how to perform data analysis on various
      topics, it is important to know of and understand the Data Science Life
      Cycle. The Data Science Life Cycle refers to the overall process that data
      scientists follow in order to complete a data science project or analysis.
      It consists of the following phases:
    </p>
    {subheadings.map((heading, idx) => {
      return <p>{`${idx + 1}. ${heading}`}</p>;
    })}
    <p>
      You don’t necessarily have to follow the phases in a linear order, and the
      different parts don’t have to be divided to be exactly like above.
      Regardless, they are important constituents that make up a comprehensive
      data analysis. We will go through them in detail, along with additional
      resources that would help you learn more about them.
    </p>
    <br />
    <p>Other important resources:</p>
    <a href="https://ds100.org/course-notes/">
      Data 100 Online Course Textbook
    </a>
    <br />
    <a href="https://web.stanford.edu/~jurafsky/slp3/">
      Natural Language Processing Textbook
    </a>
    <h1>Problem Formulation</h1>
    <p>
      Identify what problem you want to solve or question you want to answer
      through your data analysis. What do you want to do with the data? What
      data do you want to use? How can you obtain your data, and where will you
      obtain your data? What limitations of the data do you need to address?
      What are your ultimate goals for your analysis?
    </p>
    <p>
      Being able to answer all of these questions and more is the key to having
      a successful and meaningful data analysis or project. Make sure that you
      take your time to thoroughly plan out your project!
    </p>
    <h1>Data Collection</h1>
    <p>
      Finding the right datasets for your data science project is a crucial
      step. Whether or not a dataset is right for your analysis depends on a
      variety of factors, such as when it was formulated, how it was collected,
      what type of information is collected, etc! There are two common ways to
      collect your datasets: using existing datasets and web scraping. There are
      various places that you can obtain existing online datasets from, a few
      being:
    </p>
    <ol>
      <li>
        <a href="https://datasetsearch.research.google.com/">
          Google Dataset Search
        </a>
      </li>
      <li>
        <a href="https://www.kaggle.com/">Kaggle</a>
      </li>
      <li>
        <a href="https://data.gov/">Data.gov</a>
      </li>
      <li>
        <a href="https://github.com/awesomedata/awesome-public-datasets">
          Awesome-Public-Datasets
        </a>
      </li>
    </ol>
    <p>
      If you want to collect and formulate your own datasets, a way that you
      could collect digital data is through web scraping. If you want to web
      scrape only data tables on an existing website, you can easily do so with
      Pandas.{" "}
      <a
        href="https://pythonbasics.org/pandas-web-scraping/#:~:text=Pandas%20makes%20it%20easy%20to,a%20table%20from%20any%20webpage. 
"
      >
        Here
      </a>{" "}
      is a tutorial link
    </p>
    <p>
      <a href="https://www.youtube.com/watch?v=5OSzlmpSOZY ">Here</a> is a video
      version
    </p>
    <p>
      Other times, you want to scrape information that isn't already in tables,
      of which the steps would be a little more complicated. The scraping task
      would still be done in Python, using libraries such as Selenium and
      BeautifulSoup. Here is a 30-minute Youtube tutorial on web scraping with
      Python, using a Real Estate website as an example:
    </p>
    <a href="https://www.youtube.com/watch?v=RvCBzhhydNk ">
      https://www.youtube.com/watch?v=RvCBzhhydNk{" "}
    </a>
    <p>
      Additionally, sometimes you encounter JavaScript-rendered web pages. Those
      pages are a little harder to web scrape because it loads dynamically.
      However, there is always a way to work around that. Here is a tutorial
      that you can read on how to web scrape JavaScript-rendered web pages:
    </p>
    <a
      href="https://www.zenrows.com/blog/scraping-javascript-rendered-web-pages#why-is-scraping-javascript-rendered-web-pages-difficult 
"
    >
      https://www.zenrows.com/blog/scraping-javascript-rendered-web-pages#why-is-scraping-javascript-rendered-web-pages-difficult
    </a>
    <h1>Data Preparation</h1>
    <p>
      Once you have collected all the necessary data that you want to use for
      your analysis, you want to organize them in a way that is clean and
      efficient for when the analysis takes place. For instance, you might want
      to identify any outliers, take care of missing values or duplicates, and
      aggregate or re-arrange your data in any way. Using Pandas is a common and
      easy way to take care of all those tasks! You could also use JupyterHub or
      CoLab as easy computational environments to more easily visualize what you
      are doing.
    </p>
    <p>
      <a href="https://towardsdatascience.com/a-complete-pandas-guide-2dc53c77a002">
        Here
      </a>{" "}
      is a comprehensive beginner’s guide to using Pandas
    </p>
    <p>
      <a href="https://pandas.pydata.org/docs/reference/general_functions.html">
        Here
      </a>{" "}
      is a full list of Pandas functions that you can use
    </p>
    <p>
      When using existing datasets, they may be contained in file types such as
      JSON, CSV, and HTML. You could easily use built-in functions such as
      pd.read_csv(), pd.read_json(), pd.read_html() to convert your files into
      Pandas dataframes.
    </p>
    <h1>Data Exploration</h1>
    <p>
      In order to see patterns and trends in data, exploratory data analysis
      comes in handy. This can come in many forms, with some common ones being
      plotting different features against one another, looking at the
      correlation/covariances between features, and principal component
      analysis. This is useful to see which features in your data are useful and
      aren’t redundant. This can go a long way when it comes to training a model
      and having it predict well on unseen data.{" "}
      <a href="https://towardsdatascience.com/an-extensive-guide-to-exploratory-data-analysis-ddd99a03199e ">
        Here's
      </a>{" "}
      an article detailing the EDA process in more depth
    </p>
    <h1>Modeling</h1>
    <p>
      After data is cleaned and visualized, you can use ML if you want to make
      some predictions on future data. I recommend Pytorch because it’s the most
      commonly used framework, so there are lots of online resources and support
      for it, and it’s pretty intuitive to use.{" "}
      <a href="https://medium.com/@ramamurthi96/a-simple-neural-network-model-for-mnist-using-pytorch-4b8b148ecbdc">
        Here's
      </a>{" "}
      a good tutorial on how to get started with Pytorch. From here, you can
      adapt it for your own use case.
    </p>
    <h1>Deployment/Inference</h1>
    <p>
      After training your model, you can deploy it for inference on new data.
      There are lots of ways to do this and there is no one standard procedure.
      One way is to save your model parameters, create a backend using some
      framework such as Flask, Django, Node, etc, and set up an endpoint to
      receive new data. When the backend receives the new data, it can use the
      saved parameters for inference.
    </p>
  </div>
);

export default datascience;
