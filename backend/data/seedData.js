export const seedCandidates = [
  {
    id: "candidate-1",
    name: "Maya Patel",
    headline: "Frontend engineer building thoughtful product experiences",
    about:
      "Frontend engineer with four years of experience turning complex workflows into calm, accessible interfaces. I care about performance, product thinking, and shipping work that helps people.",
    skills: ["React", "TypeScript", "Accessibility", "Design Systems"],
    education: "B.Tech in Computer Science, VIT University",
    location: "Bengaluru, India",
    preferredWorkMode: "HYBRID",
    preferredRoles: ["Frontend Engineer", "Product Engineer"],
    availability: "IMMEDIATELY",
    portfolioUrl: "https://mayapatel.dev",
    githubUrl: "https://github.com/mayapatel",
  },
  {
    id: "candidate-2",
    name: "Arjun Mehta",
    headline: "Full-stack developer focused on reliable web platforms",
    about:
      "Full-stack developer who enjoys owning features from database design to polished UI. I build dependable systems with a pragmatic approach to testing and observability.",
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    education: "B.Sc. in Software Engineering, Manipal Institute",
    location: "Pune, India",
    preferredWorkMode: "REMOTE",
    preferredRoles: ["Full-stack Engineer", "Backend Engineer"],
    availability: "ONE_MONTH",
    portfolioUrl: "https://arjunmehta.dev",
    githubUrl: "https://github.com/arjunmehta",
  },
  {
    id: "candidate-3",
    name: "Sofia Williams",
    headline: "Product designer who makes complex tools feel simple",
    about:
      "Product designer with a research-led practice and a soft spot for developer tools. I collaborate closely with engineering to make useful, inclusive products.",
    skills: ["Product Design", "Figma", "User Research", "Prototyping"],
    education: "MFA in Interaction Design, California College of the Arts",
    location: "Austin, United States",
    preferredWorkMode: "REMOTE",
    preferredRoles: ["Product Designer", "UX Designer"],
    availability: "IMMEDIATELY",
    portfolioUrl: "https://sofiawilliams.design",
    githubUrl: "",
  },
  {
    id: "candidate-4",
    name: "Noah Chen",
    headline: "Data engineer turning messy data into useful decisions",
    about:
      "Data engineer with experience designing pipelines and analytics foundations for growing teams. I enjoy working at the intersection of data quality, developer experience, and business impact.",
    skills: ["Python", "SQL", "Airflow", "Snowflake"],
    education: "B.S. in Computer Science, University of Washington",
    location: "Seattle, United States",
    preferredWorkMode: "HYBRID",
    preferredRoles: ["Data Engineer", "Analytics Engineer"],
    availability: "THREE_MONTHS",
    portfolioUrl: "https://noahchen.io",
    githubUrl: "https://github.com/noahchen",
  },
  {
    id: "candidate-5",
    name: "Leila Hassan",
    headline: "Mobile engineer crafting fast, friendly mobile products",
    about:
      "Mobile engineer who has shipped consumer and B2B apps across iOS and Android. I love simple APIs, thoughtful motion, and teams that learn in public.",
    skills: ["React Native", "Swift", "Kotlin", "Mobile UX"],
    education: "B.Eng. in Computer Engineering, University of Toronto",
    location: "Toronto, Canada",
    preferredWorkMode: "ONSITE",
    preferredRoles: ["Mobile Engineer", "React Native Engineer"],
    availability: "ONE_MONTH",
    portfolioUrl: "https://leilahassan.dev",
    githubUrl: "https://github.com/leilahassan",
  },
];

const candidateDetails = {
  "candidate-1": {
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    pronouns: "she/her",
    experience: [
      {
        id: "experience-1",
        title: "Frontend Engineer",
        company: "Northstar Labs",
        startDate: "2023-04",
        endDate: "",
        description: "Building accessible workflow tools and a shared React design system.",
      },
      {
        id: "experience-2",
        title: "Software Engineer",
        company: "Brightline Studio",
        startDate: "2021-06",
        endDate: "2023-03",
        description: "Shipped customer-facing web products for early-stage teams.",
      },
    ],
    projects: [
      {
        id: "project-1",
        title: "Northstar workflow builder",
        description: "A calmer way for operations teams to automate repeatable work.",
        status: "CURRENT",
        techStack: ["React", "TypeScript", "Storybook"],
        projectUrl: "https://mayapatel.dev/workflow-builder",
        mediaUrl: "",
      },
      {
        id: "project-2",
        title: "Inclusive component library",
        description: "A documented, accessible component system for a growing product team.",
        status: "COMPLETED",
        techStack: ["React", "CSS", "Accessibility"],
        projectUrl: "https://mayapatel.dev/design-system",
        mediaUrl: "",
      },
    ],
    featuredPostIds: ["post-1", "post-5"],
  },
  "candidate-2": {
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    pronouns: "he/him",
    experience: [
      {
        id: "experience-3",
        title: "Full-stack Developer",
        company: "Northstar Labs",
        startDate: "2022-08",
        endDate: "",
        description: "Owning product features across the Node.js API and React application.",
      },
    ],
    projects: [
      {
        id: "project-3",
        title: "Launch checklist platform",
        description: "A lightweight release workflow used by distributed product teams.",
        status: "CURRENT",
        techStack: ["Node.js", "React", "PostgreSQL"],
        projectUrl: "https://arjunmehta.dev/launch",
        mediaUrl: "",
      },
    ],
    featuredPostIds: ["post-2"],
  },
  "candidate-3": {
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    pronouns: "she/her",
    experience: [
      {
        id: "experience-4",
        title: "Product Designer",
        company: "Goodfolk Health",
        startDate: "2022-01",
        endDate: "",
        description: "Designing patient-first experiences with clinicians and engineers.",
      },
    ],
    projects: [
      {
        id: "project-4",
        title: "Care journey redesign",
        description: "A research-backed redesign that made care planning easier to understand.",
        status: "COMPLETED",
        techStack: ["Figma", "Research", "Prototyping"],
        projectUrl: "https://sofiawilliams.design/care",
        mediaUrl: "",
      },
    ],
    featuredPostIds: ["post-3"],
  },
  "candidate-4": {
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    pronouns: "he/him",
    experience: [
      {
        id: "experience-5",
        title: "Data Engineer",
        company: "Orbit Finance",
        startDate: "2021-09",
        endDate: "",
        description: "Designing reliable pipelines and analytics foundations for finance teams.",
      },
    ],
    projects: [
      {
        id: "project-5",
        title: "Data quality observatory",
        description: "A practical set of checks that helps teams trust their reporting.",
        status: "CURRENT",
        techStack: ["Python", "Airflow", "Snowflake"],
        projectUrl: "https://noahchen.io/data-quality",
        mediaUrl: "",
      },
    ],
    featuredPostIds: ["post-4"],
  },
  "candidate-5": {
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    pronouns: "she/her",
    experience: [
      {
        id: "experience-6",
        title: "Mobile Engineer",
        company: "Goodfolk Health",
        startDate: "2023-02",
        endDate: "",
        description: "Shipping a fast, accessible mobile experience for members.",
      },
    ],
    projects: [
      {
        id: "project-6",
        title: "Goodfolk mobile app",
        description: "A cross-platform care companion focused on clarity and speed.",
        status: "CURRENT",
        techStack: ["React Native", "Kotlin", "Mobile UX"],
        projectUrl: "https://leilahassan.dev/goodfolk",
        mediaUrl: "",
      },
    ],
    featuredPostIds: ["post-6"],
  },
};

seedCandidates.forEach((candidate) => {
  Object.assign(candidate, candidateDetails[candidate.id]);
});

export const seedCompanies = [
  {
    id: "company-1",
    name: "Northstar Labs",
    description:
      "Northstar Labs builds tools that help modern teams make better decisions with less operational noise. We are a small, product-minded team with a global customer base.",
    industry: "Developer Tools",
    location: "Bengaluru, India",
    website: "https://northstarlabs.example.com",
    companySize: "11-50",
  },
  {
    id: "company-2",
    name: "Goodfolk Health",
    description:
      "Goodfolk Health is making everyday care easier to access. Our designers, clinicians, and engineers work together on digital products that put people first.",
    industry: "Healthcare Technology",
    location: "Austin, United States",
    website: "https://goodfolkhealth.example.com",
    companySize: "51-200",
  },
  {
    id: "company-3",
    name: "Orbit Finance",
    description:
      "Orbit Finance is building a more transparent financial operating system for independent businesses. We value clear thinking, responsible defaults, and high ownership.",
    industry: "Fintech",
    location: "Toronto, Canada",
    website: "https://orbitfinance.example.com",
    companySize: "201-500",
  },
];

export const seedOpportunities = [
  {
    id: "opportunity-1",
    candidate: "candidate-1",
    company: "company-1",
    roleTitle: "Senior Frontend Engineer",
    description:
      "Own the next generation of our workflow builder and help establish a shared component architecture across the product.",
    location: "Bengaluru, India",
    workMode: "HYBRID",
    compensation: "₹28–36 LPA",
    message:
      "Maya, your work on accessible interfaces stood out to our team. We would love to show you what we are building.",
    status: "PENDING",
    respondedAt: null,
  },
  {
    id: "opportunity-2",
    candidate: "candidate-2",
    company: "company-1",
    roleTitle: "Full-stack Product Engineer",
    description:
      "Partner with product and design to ship customer-facing features across our React and Node.js platform.",
    location: "Remote",
    workMode: "REMOTE",
    compensation: "$110k–$135k USD",
    message:
      "Arjun, we are looking for someone who enjoys the whole feature lifecycle. Your platform work feels like a strong match.",
    status: "ACCEPTED",
    respondedAt: "2026-09-12T10:00:00.000Z",
  },
  {
    id: "opportunity-3",
    candidate: "candidate-3",
    company: "company-2",
    roleTitle: "Product Designer",
    description:
      "Lead discovery and product design for a new patient experience, from early research through launch.",
    location: "Austin, United States",
    workMode: "REMOTE",
    compensation: "$120k–$145k USD",
    message:
      "Sofia, Goodfolk is looking for a designer who can make sensitive workflows feel more human. We think your approach could be a great fit.",
    status: "PENDING",
    respondedAt: null,
  },
  {
    id: "opportunity-4",
    candidate: "candidate-4",
    company: "company-3",
    roleTitle: "Data Platform Engineer",
    description:
      "Build the reliable data foundations that help independent businesses understand their financial health.",
    location: "Toronto, Canada",
    workMode: "HYBRID",
    compensation: "$125k–$150k CAD",
    message:
      "Noah, your focus on data quality is exactly what our platform team needs as we scale.",
    status: "DECLINED",
    respondedAt: "2026-09-09T10:00:00.000Z",
  },
  {
    id: "opportunity-5",
    candidate: "candidate-5",
    company: "company-2",
    roleTitle: "React Native Engineer",
    description:
      "Help us bring our care experience to mobile with a fast, accessible app used by thousands of members.",
    location: "Toronto, Canada",
    workMode: "ONSITE",
    compensation: "$115k–$140k CAD",
    message:
      "Leila, we are impressed by the mobile products you have shipped. Would you be open to an introduction?",
    status: "PENDING",
    respondedAt: null,
  },
  {
    id: "opportunity-6",
    candidate: "candidate-1",
    company: "company-3",
    roleTitle: "Frontend Platform Engineer",
    description:
      "Improve the frontend platform, developer tooling, and design system used by product teams across Orbit.",
    location: "Remote",
    workMode: "REMOTE",
    compensation: "$120k–$150k CAD",
    message:
      "We noticed your design systems work and would love to discuss how you think about frontend foundations.",
    status: "DECLINED",
    respondedAt: "2026-09-05T10:00:00.000Z",
  },
];

export const seedPosts = [
  {
    id: "post-1",
    authorId: "candidate-1",
    type: "PROJECT",
    content:
      "I have been working on a calmer workflow builder for operations teams. The biggest lesson so far: removing one decision can be more valuable than adding five features.",
    mediaUrl: "",
    mediaType: "",
    projectTitle: "Northstar workflow builder",
    projectStatus: "CURRENT",
    projectUrl: "https://mayapatel.dev/workflow-builder",
    comments: [
      {
        id: "comment-1",
        authorId: "candidate-3",
        body: "This is such a good product principle. The before and after is lovely.",
        createdAt: "2026-09-18T12:10:00.000Z",
      },
    ],
    reactions: [
      { candidateId: "candidate-2", type: "LIKE" },
      { candidateId: "candidate-3", type: "LIKE" },
      { candidateId: "candidate-5", type: "CELEBRATE" },
    ],
    createdAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "post-2",
    authorId: "candidate-2",
    type: "TEXT",
    content:
      "A small shipping habit I keep coming back to: write the API response shape before writing the controller. It keeps product conversations concrete and makes the frontend partnership much smoother.",
    mediaUrl: "",
    mediaType: "",
    projectTitle: "",
    projectStatus: "",
    projectUrl: "",
    comments: [],
    reactions: [
      { candidateId: "candidate-1", type: "INSIGHTFUL" },
      { candidateId: "candidate-4", type: "LIKE" },
    ],
    createdAt: "2026-09-16T14:30:00.000Z",
  },
  {
    id: "post-3",
    authorId: "candidate-3",
    type: "VIDEO",
    content:
      "Sharing a short walkthrough of the research behind our care journey redesign. Designing for moments of uncertainty means making the next step feel visible.",
    mediaUrl: "https://www.youtube.com/watch?v=demo-care-journey",
    mediaType: "VIDEO",
    projectTitle: "Care journey redesign",
    projectStatus: "COMPLETED",
    projectUrl: "https://sofiawilliams.design/care",
    comments: [
      {
        id: "comment-2",
        authorId: "candidate-5",
        body: "The way you explain the research-to-interface connection is excellent.",
        createdAt: "2026-09-15T08:10:00.000Z",
      },
    ],
    reactions: [
      { candidateId: "candidate-1", type: "CELEBRATE" },
      { candidateId: "candidate-5", type: "LIKE" },
    ],
    createdAt: "2026-09-15T07:45:00.000Z",
  },
  {
    id: "post-4",
    authorId: "candidate-4",
    type: "PROJECT",
    content:
      "The data quality observatory is now checking freshness, schema drift, and ownership in one place. Reliable data is less about a perfect pipeline and more about useful feedback loops.",
    mediaUrl: "",
    mediaType: "",
    projectTitle: "Data quality observatory",
    projectStatus: "CURRENT",
    projectUrl: "https://noahchen.io/data-quality",
    comments: [],
    reactions: [
      { candidateId: "candidate-2", type: "INSIGHTFUL" },
      { candidateId: "candidate-3", type: "LIKE" },
    ],
    createdAt: "2026-09-12T16:20:00.000Z",
  },
  {
    id: "post-5",
    authorId: "candidate-1",
    type: "VIDEO",
    content:
      "A quick look at the accessibility checks we use before a component enters our shared library. Small defaults make a big difference for the people using the product.",
    mediaUrl: "https://www.youtube.com/watch?v=demo-accessibility",
    mediaType: "VIDEO",
    projectTitle: "Inclusive component library",
    projectStatus: "COMPLETED",
    projectUrl: "https://mayapatel.dev/design-system",
    comments: [],
    reactions: [
      { candidateId: "candidate-3", type: "INSIGHTFUL" },
      { candidateId: "candidate-4", type: "LIKE" },
    ],
    createdAt: "2026-09-10T11:00:00.000Z",
  },
  {
    id: "post-6",
    authorId: "candidate-5",
    type: "TEXT",
    content:
      "This week I am testing how much faster a mobile care flow feels when the interface answers one question at a time. Looking forward to sharing what we learn.",
    mediaUrl: "",
    mediaType: "",
    projectTitle: "Goodfolk mobile app",
    projectStatus: "CURRENT",
    projectUrl: "https://leilahassan.dev/goodfolk",
    comments: [],
    reactions: [
      { candidateId: "candidate-1", type: "LIKE" },
      { candidateId: "candidate-2", type: "CELEBRATE" },
    ],
    createdAt: "2026-09-08T10:25:00.000Z",
  },
];
