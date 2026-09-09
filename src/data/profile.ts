export const profile = {
  name: "Divya Prakash",
  role: "Data Analyst",
  focus: "SQL, Python, Tableau & Snowflake",
  email: "divyaprakash2999@gmail.com",
  location: "United States · Open to relocate",
  github: "https://github.com/divyaprakash29",
  linkedin: "https://www.linkedin.com/in/divya-prakash29/",
  resume: "/CV.pdf",
  intro: "I turn complex data into actionable insights with SQL, Python, Tableau, and Snowflake. Two years of experience analyzing user behavior, measuring chatbot performance, and automating reporting.",
  lede: "I’m a Data Analyst with two years of experience connecting complex datasets to business decisions. At Prodapt Solutions, I analyzed conversational AI interactions to understand where users dropped off and help teams improve self-service experiences.",
  aboutHeadline: "From complex data to clear decisions.",
  educationSummary: "My background includes an M.S. in Information Systems from Northeastern University (May 2026) and a B.E. in Information Science from Jyothy Institute of Technology (June 2021). My work spans statistical analysis, data modeling, automated reporting, and machine learning.",
  contactHeadline: "Let’s turn data into better decisions.",
};

// All claims, metrics, and project links come from DivyaPrakash_Resume_DA.pdf.
export const stats = [
  { value: "2", label: "Years of Experience" },
  { value: "30M+", label: "Transactions Analyzed" },
  { value: "30%", label: "Less Reporting Time" },
];

export const experience = [
  {
    company: "Prodapt Solutions",
    location: "India",
    title: "Data Analyst",
    dates: "Oct 2021 – Aug 2023",
    highlights: [
      { text: "Analyzed customer service chatbot logs in Snowflake with SQL and Python to identify user drop-off trends and inform product changes.", stat: "−20% user abandonment" },
      { text: "Designed Tableau dashboards tracking intent recognition accuracy, escalation rate, session duration, and self-service resolution for product and engineering teams.", stat: null },
      { text: "Partnered with product and engineering teams on A/B testing and statistical analysis to validate a new chatbot prompt structure.", stat: "+25% self-service resolution" },
      { text: "Automated daily chatbot telemetry pipelines in Snowflake using dbt, transforming raw interactions into analytics-ready datasets.", stat: "−30% manual reporting turnaround" },
      { text: "Maintained dbt models and SQL transformations in GitHub, documenting data sources and dependencies to improve data quality, governance, and lineage.", stat: null },
    ],
  },
  {
    company: "Tech Fortune Technologies",
    location: "India",
    title: "Machine Learning Intern",
    dates: "Mar 2021 – Apr 2021",
    highlights: [
      { text: "Built wine-quality classifiers across 1,599 samples using Python and scikit-learn, comparing Random Forest, SVM, KNN, Decision Tree, and Logistic Regression.", stat: "90% test accuracy" },
      { text: "Engineered an ML pipeline with StandardScaler, GridSearchCV, cross-validation, and an 80/20 train-test split to prevent data leakage and improve generalization.", stat: "88.5% cross-validation accuracy" },
      { text: "Explored feature relationships and class imbalance with Pandas, Matplotlib, and Seaborn, restructuring the target into a binary classification problem.", stat: null },
    ],
  },
];

export const projects = [
  {
    slug: "ecommerce-analytics",
    tag: "E-Commerce Customer Behavior & Product Demand Analytics",
    desc: "Purchasing patterns, customer segments, and product demand insights from 30M+ e-commerce transactions.",
    detail: "Used EDA, RFM segmentation, and K-Means clustering to support retention and marketing. Compared Logistic Regression, Decision Tree, and Random Forest models to inform inventory and demand planning.",
    stack: ["Python", "Pandas", "NumPy", "scikit-learn", "RFM", "K-Means"],
    stat: "0.84 ROC-AUC with Random Forest",
    href: "https://github.com/divyaprakash29/E-Commerce-Customer-Behavior-Product-Demand-Analytics",
  },
  {
    slug: "ai-governance",
    tag: "Secure AI Governance Engine",
    desc: "A RAG-powered compliance reasoning system with 100% citation groundedness and 91%+ accuracy.",
    detail: "Combined document chunking, embeddings, and vector search with ReAct agent workflows. Validated the system with 28 unit tests and 5 integration tests.",
    stack: ["Python", "GPT-4o", "LangChain", "LangGraph", "ChromaDB", "Docker", "RAG"],
    stat: "80% reduction in prompt token usage",
    href: "https://github.com/divyaprakash29/Secure_AI_Governance_Engine",
  },
  {
    slug: "cloud-native-webapp",
    tag: "Cloud Native Webapp",
    desc: "A scalable Python backend with automated AWS infrastructure and zero-downtime deployments.",
    detail: "Integrated FastAPI and REST APIs with AWS services including S3, RDS, and CloudWatch. Automated infrastructure and deployments with Terraform, Packer-built AMIs, and GitHub Actions, with encryption and centralized logging.",
    stack: ["Python", "FastAPI", "AWS", "Terraform", "Packer", "GitHub Actions"],
    stat: null,
    href: "https://github.com/orgs/CSYE6225-DivyaPrakash/repositories",
  },
];

export type Project = (typeof projects)[number];

export const skills = [
  { group: "Languages & Databases", items: ["Python", "SQL", "R", "PostgreSQL", "MySQL", "Oracle", "MongoDB", "PL/SQL", "Excel"] },
  { group: "Analysis & Machine Learning", items: ["Pandas", "NumPy", "scikit-learn", "Jupyter Notebooks", "EDA", "A/B Testing", "Statistical Analysis", "Data Modeling"] },
  { group: "Visualization & Reporting", items: ["Tableau", "Power BI", "Matplotlib", "Seaborn", "KPI Dashboards", "Automated Reporting"] },
  { group: "Cloud Platforms", items: ["Snowflake", "AWS EC2", "AWS S3", "AWS Lambda", "Azure"] },
  { group: "Pipelines & Orchestration", items: ["dbt", "Airflow", "Docker", "FastAPI"] },
  { group: "Tools & Collaboration", items: ["Git", "GitHub", "Jira", "Data Quality", "Data Lineage"] },
];

export const aboutViews = {
  analyst: [
    { key: "role", value: "Data Analyst" },
    { key: "based", value: "United States" },
    { key: "mobility", value: "Open to relocate" },
    { key: "toolkit", value: "SQL, Python, Tableau, Snowflake" },
    { key: "focus", value: "User behavior & conversational AI analytics" },
  ],
  education: [
    { key: "master’s", value: "M.S. Information Systems" },
    { key: "university", value: "Northeastern University · May 2026" },
    { key: "bachelor’s", value: "B.E. Information Science" },
    { key: "institute", value: "Jyothy Institute of Technology · June 2021" },
  ],
};
