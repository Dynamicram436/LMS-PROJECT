
export const subjectsData = [
  {
    id: "CSE",
    name: "Computer Science Engineering",
    category: "CSE",
    description: "Data Structures, Algorithms, Web Development, and AI.",
  },
  {
    id: "ECE",
    name: "Electronics & Communication",
    category: "ECE",
    description: "Digital Electronics, Signals & Systems, and VLSI.",
  },
  {
    id: "Mechanical",
    name: "Mechanical Engineering",
    category: "Mechanical",
    description: "Thermodynamics, Machine Design, and Fluid Mechanics.",
  },
  {
    id: "Civil",
    name: "Civil Engineering",
    category: "Civil",
    description: "Structural Analysis, Surveying, and Construction.",
  },
  {
    id: "EEE",
    name: "Electrical & Electronics",
    category: "EEE",
    description: "Power Systems, Control Systems, and Machines.",
  },
  {
    id: "Diploma",
    name: "Diploma Courses",
    category: "Diploma",
    description: "Fundamental technical skills and practical training.",
  },
];

export const syllabusData = [
  {
    category: "CSE",
    units: [
      {
        id: "cse-u1",
        name: "Unit 1: Programming Foundations",
        topics: [
          { id: 101, name: "Introduction to C++", videoId: "M7lc1UVf-VE", description: "Learn the basics of C++ syntax and logic.", duration: "12 min", difficulty: "Beginner" },
          { id: 102, name: "Data Types & Variables", videoId: "ysz5S6PUM-U", description: "Understanding how information is stored in memory.", duration: "15 min", difficulty: "Beginner" },
          { id: 103, name: "Control Structures", videoId: "M7lc1UVf-VE", description: "Mastering if-else, loops, and branching logic.", duration: "18 min", difficulty: "Beginner" }
        ]
      },
      {
        id: "cse-u2",
        name: "Unit 2: Data Structures",
        topics: [
          { id: 104, name: "Arrays & Linked Lists", videoId: "ysz5S6PUM-U", description: "Linear data structures and their implementations.", duration: "25 min", difficulty: "Intermediate" },
          { id: 105, name: "Stacks & Queues", videoId: "M7lc1UVf-VE", description: "Understanding LIFO and FIFO principles.", duration: "20 min", difficulty: "Intermediate" }
        ]
      },
      {
        id: "cse-u3",
        name: "Unit 3: Algorithms",
        topics: [
          { id: 106, name: "Sorting Algorithms", videoId: "ysz5S6PUM-U", description: "Learn about Bubble, Quick, and Merge sort.", duration: "30 min", difficulty: "Advanced" },
          { id: 107, name: "Search Algorithms", videoId: "M7lc1UVf-VE", description: "Linear search and Binary search optimization.", duration: "22 min", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    category: "ECE",
    units: [
      {
        id: "ece-u1",
        name: "Unit 1: Digital Electronics",
        topics: [
          { id: 201, name: "Logic Gates", videoId: "M7lc1UVf-VE", description: "Fundamentals of Boolean algebra and gates.", duration: "15 min", difficulty: "Beginner" },
          { id: 202, name: "Combinational Circuits", videoId: "ysz5S6PUM-U", description: "Adders, subtractors, and multiplexers.", duration: "20 min", difficulty: "Intermediate" }
        ]
      },
      {
        id: "ece-u2",
        name: "Unit 2: Microprocessors",
        topics: [
          { id: 203, name: "8085 Architecture", videoId: "M7lc1UVf-VE", description: "Deep dive into 8bit microprocessor design.", duration: "25 min", difficulty: "Advanced" },
          { id: 204, name: "Instruction Sets", videoId: "ysz5S6PUM-U", description: "Programming the 8085 processor.", duration: "20 min", difficulty: "Intermediate" }
        ]
      }
    ]
  },
  {
    category: "Mechanical",
    units: [
      {
        id: "mech-u1",
        name: "Unit 1: Thermodynamics",
        topics: [
          { id: 301, name: "Laws of Thermodynamics", videoId: "M7lc1UVf-VE", description: "Understanding energy conservation and entropy.", duration: "20 min", difficulty: "Intermediate" },
          { id: 302, name: "IC Engines", videoId: "ysz5S6PUM-U", description: "How internal combustion engines work.", duration: "18 min", difficulty: "Beginner" }
        ]
      },
      {
        id: "mech-u2",
        name: "Unit 2: Fluid Mechanics",
        topics: [
          { id: 303, name: "Fluid Properties", videoId: "M7lc1UVf-VE", description: "Viscosity, density, and pressure basics.", duration: "15 min", difficulty: "Intermediate" },
          { id: 304, name: "Bernoulli's Principle", videoId: "ysz5S6PUM-U", description: "Understanding fluid flow and energy.", duration: "22 min", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    category: "Civil",
    units: [
      {
        id: "civil-u1",
        name: "Unit 1: Surveying",
        topics: [
          { id: 401, name: "Chain Surveying", videoId: "M7lc1UVf-VE", description: "Traditional methods of measuring land.", duration: "12 min", difficulty: "Beginner" },
          { id: 402, name: "Theodolite & Leveling", videoId: "ysz5S6PUM-U", description: "Advanced angle and level measurements.", duration: "25 min", difficulty: "Advanced" }
        ]
      },
      {
        id: "civil-u2",
        name: "Unit 2: Structural Analysis",
        topics: [
          { id: 403, name: "Beams & Columns", videoId: "M7lc1UVf-VE", description: "Basics of structural load distribution.", duration: "20 min", difficulty: "Intermediate" },
          { id: 404, name: "Truss Design", videoId: "ysz5S6PUM-U", description: "Analyzing bridge and roof structures.", duration: "18 min", difficulty: "Advanced" }
        ]
      }
    ]
  },
  {
    category: "EEE",
    units: [
      {
        id: "eee-u1",
        name: "Unit 1: Network Theory",
        topics: [
          { id: 501, name: "Circuit Laws", videoId: "M7lc1UVf-VE", description: "Kirchhoff's Laws and nodal analysis.", duration: "15 min", difficulty: "Beginner" },
          { id: 502, name: "Theorems", videoId: "ysz5S6PUM-U", description: "Thevenin, Norton, and Superposition.", duration: "20 min", difficulty: "Intermediate" }
        ]
      },
      {
        id: "eee-u2",
        name: "Unit 2: Power Systems",
        topics: [
          { id: 503, name: "Generation", videoId: "M7lc1UVf-VE", description: "How electricity is produced from various sources.", duration: "22 min", difficulty: "Intermediate" },
          { id: 504, name: "Transmission & Distribution", videoId: "ysz5S6PUM-U", description: "Moving power from plants to homes.", duration: "18 min", difficulty: "Beginner" }
        ]
      }
    ]
  },
  {
    category: "Diploma",
    units: [
      {
        id: "dip-u1",
        name: "Unit 1: Basic Engineering",
        topics: [
          { id: 601, name: "Safety Procedures", videoId: "M7lc1UVf-VE", description: "Workshop safety and first aid basics.", duration: "10 min", difficulty: "Beginner" },
          { id: 602, name: "Measurement Tools", videoId: "ysz5S6PUM-U", description: "Using calipers, micrometers, and gauges.", duration: "15 min", difficulty: "Beginner" }
        ]
      }
    ]
  }
];

export const chaptersData = syllabusData.flatMap(branch =>
  branch.units.flatMap(unit =>
    unit.topics.map(topic => ({
      id: topic.id,
      category: branch.category,
      unitId: unit.id,
      unitName: unit.name,
      name: topic.name,
      description: topic.description,
      youtubeIds: [topic.videoId],
      duration: topic.duration,
      difficulty: topic.difficulty,
    }))
  )
);

export const categories = [
  "All",
  "CSE",
  "ECE",
  "Mechanical",
  "Civil",
  "EEE",
  "Diploma",
];
