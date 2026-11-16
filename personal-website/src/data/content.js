/* ==========================================================
   EDIT THIS FILE to update your website. No other file needs
   to change when you add a project, job, skill, or course.

   To add a project: copy one block inside `projects`, paste it
   at the TOP of the list (newest first), and edit the text.
   `link` is optional; delete the line if there is no demo.
   ========================================================== */
const SITE = {
  name: "Cathy Lei",
  email: "cathy.lei2004@gmail.com",
  github: "https://github.com/cathyleii",
  githubLabel: "github.com/cathyleii",
  location: "Vancouver, B.C., Canada",

  intro: "Third-year student at UBC studying <strong>Computer Science and Bioinformatics</strong>. I build web apps, machine learning tools, and a programming language, and I teach people how to code (and play piano).",

  about: [
    "I\u2019m studying Integrated Sciences at the University of British Columbia, combining computer science with bioinformatics. I like projects where software meets something human: a journaling app that picks music for your mood, a model that screens MRI scans, a language for drawing graphs.",
    "I also spend a lot of time teaching. I\u2019m an undergraduate teaching assistant for software construction, I\u2019ve guided kids through game development as a Code Sensei, and I\u2019ve taught piano for years."
  ],

  education: {
    degree: "BSc in Integrated Sciences: Computer Science and Bioinformatics",
    school: "University of British Columbia",
    graduation: "Expected graduation: May 2027"
  },

  projects: [
    {
      title: "graphdsl",
      when: "October 2026",
      kind: "Academic",
      stack: "Java, ANTLR, GraphStream",
      bullets: [
        "Designed a domain-specific language for graph visualization. Users build graphs in code with custom node types, edge operators, variables, loops, and other control flow.",
        "Used GraphStream to render the graphs dynamically.",
        "Implemented the evaluator and interpreter, and co-developed the module that translates ANTLR syntax trees into the internal AST.",
        "Wrote test suites for the evaluator, and ran user studies on an MVP to collect feedback."
      ]
    },
    {
      title: "Soundmind",
      when: "June 2025",
      kind: "Personal project",
      stack: "Python, Flask, HTML/CSS, Spotipy API, Hugging Face DistilRoBERTa",
      link: { label: "Live demo", url: "https://soundmind.onrender.com/" },
      bullets: [
        "A full-stack wellness app that reads a journal entry, detects the strongest emotion, and recommends mood-matched songs.",
        "Uses the DistilRoBERTa emotion classifier for sentiment analysis, hosted on Hugging Face Spaces and called through the Gradio client.",
        "Uses the Spotipy API to pull a fitting playlist and return randomized tracks."
      ]
    },
    {
      title: "SmartMRI",
      when: "May 2025",
      kind: "Personal project",
      stack: "Python, FastAI, HTML/CSS, JavaScript",
      link: { label: "Live demo", url: "https://cathyleii.github.io/SmartMRI/" },
      bullets: [
        "A web app that predicts the presence of brain tumors from MRI images using a fine-tuned ResNet34 model built with FastAI.",
        "Upload your own image or pick a sample scan to get a prediction in real time.",
        "Model served from Hugging Face Spaces through the Gradio client, with a responsive front end."
      ]
    },
    {
      title: "PawPortal",
      when: "April 2025",
      kind: "Academic",
      stack: "PHP, Oracle, SQL, JavaScript",
      bullets: [
        "A relational database for a pet adoption and shelter system, covering shelters, adoptions, donations, and medical records.",
        "Implemented insertion, deletion, update, selection, join, and division queries, with dynamic execution from user input.",
        "Sanitized all input to prevent SQL injection."
      ]
    }
  ],

  experience: [
    {
      title: "Undergraduate Teaching Assistant",
      org: "University of British Columbia, Vancouver",
      when: "Jan 2026 \u2013 present",
      bullets: [
        "Mentor students in core software construction ideas: refactoring, testability, and design patterns.",
        "Co-lead interactive lab sections in TypeScript and Java.",
        "Grade programming projects with detailed feedback, and invigilate exams."
      ]
    },
    {
      title: "Code Sensei",
      org: "Code Ninjas, North Vancouver",
      when: "Jun 2025 \u2013 Mar 2026",
      bullets: [
        "Taught game development with block-based coding, JavaScript, C#, and Unity to students from elementary to high school, emphasizing logic, creativity, and debugging.",
        "Reported student progress daily to the Center Manager and gave parents feedback after each session.",
        "Led hands-on demo sessions that helped drive program enrollment."
      ]
    },
    {
      title: "Private Piano Teacher",
      when: "Dec 2020 \u2013 May 2023, Jan 2025 \u2013 present",
      bullets: [
        "Teach beginner to intermediate students one-on-one and in groups.",
        "Tailor lessons to each student\u2019s needs, trying different approaches on the topics they find hardest.",
        "Guide students through theory worksheets, scales, and exercises with encouraging, specific feedback."
      ]
    }
  ],

  volunteer: [
    {
      title: "Front-end Developer",
      org: "The CornerStore Society, Vancouver",
      when: "Mar 2026 \u2013 Sep 2026",
      bullets: [
        "Built the main front-end interface in JavaScript for a community platform where local organizations and small businesses promote their events and products.",
        "Worked with a designer to turn UI mock-ups into a working site."
      ]
    }
  ],

  skills: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "R", "HTML/CSS", "Unity"],

  courses: [
    "Applied Machine Learning",
    "Advanced Software Engineering",
    "Intermediate Algorithm Design and Analysis",
    "Parallel Computation",
    "Statistical Modelling for Data Science",
    "Introduction to Human Computer Interaction Methods"
  ]
};
export default SITE;
