import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const sampleQuestions = [
  // ENGLISH
  {
    category: "English",
    chapterId: 1,
    chapterName: "English - Chapter 1",
    questions: [
      { question: "Which of these is a noun?", options: ["Run", "Beautiful", "Teacher", "Quickly"], correctAnswer: 2 },
      { question: "Choose the correct article: ___ apple a day keeps the doctor away.", options: ["A", "An", "The", "No article"], correctAnswer: 1 },
      { question: "Which sentence is correctly punctuated?", options: ["hello, how are you?", "Hello, how are you?", "Hello how are you", "hello how are you!"], correctAnswer: 1 },
      { question: "Identify the verb in the sentence: 'She runs every morning.'", options: ["She", "Runs", "Every", "Morning"], correctAnswer: 1 },
      { question: "Which word is an adjective? 'The blue sky is clear.'", options: ["The", "Blue", "Sky", "Is"], correctAnswer: 1 },
      { question: "Choose the correct pronoun: '___ is my best friend.'", options: ["He", "Him", "His", "They"], correctAnswer: 0 },
      { question: "What is the opposite of 'Hot'?", options: ["Cold", "Warm", "Boiling", "Sunny"], correctAnswer: 0 }
    ]
  },
  {
    category: "English",
    chapterId: 2,
    chapterName: "English - Chapter 2",
    questions: [
      { question: "Identify the tense: “She is reading a book.”", options: ["Simple Present", "Present Continuous", "Simple Past", "Future Continuous"], correctAnswer: 1 },
      { question: "Choose the correct preposition: He is good ___ maths.", options: ["at", "in", "on", "by"], correctAnswer: 0 },
      { question: "Choose the correct plural form of “child”.", options: ["Childs", "Childes", "Children", "Childrens"], correctAnswer: 2 },
      { question: "Which conjunction joins these: 'Bread ___ butter'", options: ["But", "Or", "And", "Yet"], correctAnswer: 2 },
      { question: "Pick the adverb: 'She sings sweetly.'", options: ["She", "Sings", "Sweetly", "Song"], correctAnswer: 2 },
      { question: "What is the past tense of 'Go'?", options: ["Goed", "Gone", "Went", "Going"], correctAnswer: 2 },
      { question: "A synonym for 'Happy' is:", options: ["Sad", "Angry", "Joyful", "Tired"], correctAnswer: 2 }
    ]
  },
  {
    category: "English",
    chapterId: 3,
    chapterName: "English - Chapter 3",
    questions: [
      { question: "Which is the best opening for a formal letter?", options: ["Hey!", "Dear Sir/Madam,", "Hi friend,", "Hello bro,"], correctAnswer: 1 },
      { question: "Which one is a topic sentence?", options: ["In conclusion, we learned a lot.", "My school library is a wonderful place to study.", "For example, it has many books.", "Also, it is quiet."], correctAnswer: 1 },
      { question: "Which is most important in a paragraph?", options: ["Many emojis", "Random ideas", "Unity and coherence", "Very long words"], correctAnswer: 2 },
      { question: "Which is a polite closing for a formal letter?", options: ["Bye", "See ya", "Yours sincerely", "Cheers"], correctAnswer: 2 },
      { question: "A formal letter should contain:", options: ["Slang words", "Clear Purpose", "Jokes", "Drawings"], correctAnswer: 1 },
      { question: "Which date format is formal?", options: ["12/05/2023", "Today", "Yesterday", "Last week"], correctAnswer: 0 },
      { question: "Who is the 'Recipient'?", options: ["The sender", "The receiver", "The postman", "The paper"], correctAnswer: 1 }
    ]
  },
  {
    category: "English",
    chapterId: 4,
    chapterName: "English - Chapter 4",
    questions: [
      { question: "A moral of a story usually means:", options: ["A joke", "A lesson/message", "A riddle", "A character name"], correctAnswer: 1 },
      { question: "“The wind whispered” is an example of:", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correctAnswer: 2 },
      { question: "The main idea of a poem is called:", options: ["Theme", "Rhyme", "Stanza", "Title"], correctAnswer: 0 },
      { question: "Which rhyming scheme stands for pairs?", options: ["ABAB", "AABB", "ABBA", "None"], correctAnswer: 1 },
      { question: "What is a 'Simile'?", options: ["Comparison using like/as", "Direct comparison", "Giving human traits", "Repetition"], correctAnswer: 0 },
      { question: "Who writes a poem?", options: ["Author", "Poet", "Artist", "Singer"], correctAnswer: 1 },
      { question: "Example of Alliteration:", options: ["Big ball bounce", "Sunny day", "Cat and dog", "Red rose"], correctAnswer: 0 }
    ]
  },

  // TELUGU
  {
    category: "Telugu",
    chapterId: 5,
    chapterName: "Telugu - Chapter 1",
    questions: [
      { question: "భాషలో అర్థాన్ని తెలియజేసే చిన్న భాగం ఏది?", options: ["పదం", "అక్షరం", "వాక్యం", "పుస్తకం"], correctAnswer: 0 },
      { question: "క్రియ అంటే ఏమిటి?", options: ["పని/చర్యను తెలిపేది", "వస్తువును తెలిపేది", "గుణాన్ని తెలిపేది", "స్థలాన్ని తెలిపేది"], correctAnswer: 0 },
      { question: "సమాసం అంటే:", options: ["రెండు పదాల కలయిక", "ఒక పదం విభజన", "వాక్య విరామం", "అక్షర పునరావృతం"], correctAnswer: 0 },
      { question: "పని చేసేవారిని ఏమంటారు?", options: ["కర్త", "కర్మ", "క్రియ", "విశేషణం"], correctAnswer: 0 },
      { question: "తెలుగు వర్ణమాలలో మొదటి అక్షరం?", options: ["అ", "క", "మ", "ర"], correctAnswer: 0 },
      { question: "నామవాచకానికి ఉదాహరణ:", options: ["రాముడు", "వెళ్ళాడు", "అందమైన", "వేగంగా"], correctAnswer: 0 },
      { question: "గుణింతాలు వేటికి ఉంటాయి?", options: ["అచ్చులు", "హల్లులు", "ఉభయాక్షరాలు", "అంకెలు"], correctAnswer: 1 }
    ]
  },
  {
    category: "Telugu",
    chapterId: 6,
    chapterName: "Telugu - Chapter 2",
    questions: [
      { question: "ఏది సర్వనామం?", options: ["నేను", "పుస్తకం", "పండ్లు", "అందంగా"], correctAnswer: 0 },
      { question: "విరామచిహ్నం (,) పేరు ఏమిటి?", options: ["కామా", "పూర్తి విరామం", "ప్రశ్నార్థకం", "ఉద్ధరణచిహ్నం"], correctAnswer: 0 },
      { question: "ఎదురు పదం ఎంచుకోండి: పెద్ద", options: ["చిన్న", "గొప్ప", "అందం", "ఎక్కువ"], correctAnswer: 0 },
      { question: "ఏది విశేషణం?", options: ["ఎర్రని", "పువ్వు", "పూసింది", "తానే"], correctAnswer: 0 },
      { question: "జరిగిపోయిన కాలాన్ని ఏమంటారు?", options: ["భూతకాలం", "వర్తమాన కాలం", "భవిష్యత్ కాలం", "ఏదీకాదు"], correctAnswer: 0 },
      { question: "పర్యాయపదం: అమ్మ", options: ["తల్లి", "చెల్లి", "అక్క", "కోడలు"], correctAnswer: 0 },
      { question: "వచనాలు ఎన్ని?", options: ["2", "3", "4", "5"], correctAnswer: 0 }
    ]
  },
  {
    category: "Telugu",
    chapterId: 7,
    chapterName: "Telugu - Chapter 3",
    questions: [
      { question: "లేఖ రాయడంలో మొదట ఉండేది ఏమిటి?", options: ["తేదీ", "సంతకం", "ముగింపు", "అనుబంధం"], correctAnswer: 0 },
      { question: "వ్యాసానికి ముఖ్యమైనది:", options: ["శీర్షిక", "ఒకే భావం", "క్రమబద్ధత", "పైవన్నీ"], correctAnswer: 3 },
      { question: "సారాంశం అంటే:", options: ["పొడవైన వివరణ", "సంక్షిప్త వివరణ", "కల్పిత కథ", "కావ్యం"], correctAnswer: 1 },
      { question: "లేఖలో గౌరవ వాచకం ఎక్కడ ఉంటుంది?", options: ["ఆరంభంలో", "చివరన", "మధ్యలో", "ఎక్కడా కాదు"], correctAnswer: 0 },
      { question: "ముగింపు లేఖలో ఎక్కడ ఉంటుంది?", options: ["చివరన", "మొదట", "మధ్యలో", "పైన"], correctAnswer: 0 },
      { question: "వ్యాసం దేనితో మొదలుపెట్టాలి?", options: ["ఉపోద్ఘాతం", "ముగింపు", "విషయం", "సందేహం"], correctAnswer: 0 },
      { question: "చేతిరాత ఎలా ఉండాలి?", options: ["గుండ్రంగా", "గజిబిజిగా", "అర్థంకాకుండా", "చాలా చిన్నగా"], correctAnswer: 0 }
    ]
  },

  // HINDI
  {
    category: "Hindi",
    chapterId: 8,
    chapterName: "Hindi - Chapter 1",
    questions: [
      { question: "‘सुंदर’ किस प्रकार का शब्द है?", options: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया"], correctAnswer: 2 },
      { question: "‘मैं’ किस प्रकार का शब्द है?", options: ["संज्ञा", "सर्वनाम", "विशेषण", "अव्यय"], correctAnswer: 1 },
      { question: "कविता का मुख्य भाव कहलाता है:", options: ["लय", "छंद", "भाव", "विराम"], correctAnswer: 2 },
      { question: "‘सूर्य’ का पर्यायवाची शब्द:", options: ["रवि", "चांद", "तారా", "पानी"], correctAnswer: 0 },
      { question: "कविता लिखने वाले को क्या कहते हैं?", options: ["कवि", "लेखक", "गायक", "खिलाड़ी"], correctAnswer: 0 },
      { question: "तुकबंदी वाला शब्द: 'पानी'", options: ["रानी", "घर", "नल", "फल"], correctAnswer: 0 },
      { question: "जिसकी उपमा दी जाए:", options: ["उपमेय", "उपमान", "साधारण धर्म", "वाचक"], correctAnswer: 0 }
    ]
  },
  {
    category: "Hindi",
    chapterId: 9,
    chapterName: "Hindi - Chapter 2",
    questions: [
      { question: "‘विद्यालय’ शब्द का अर्थ क्या है?", options: ["घर", "स्कूल", "बाजार", "खेत"], correctAnswer: 1 },
      { question: "‘वह’ किस प्रकार का शब्द है?", options: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया"], correctAnswer: 1 },
      { question: "गद्य में मुख्य रूप से होता है:", options: ["कथानक/विचार", "छंद", "लय", "तुक"], correctAnswer: 0 },
      { question: "कहानी से हमें क्या मिलती है?", options: ["सीख", "मिठाई", "पैसे", "खिलोना"], correctAnswer: 0 },
      { question: "‘पुस्तक’ का बहुवचन:", options: ["पुस्तकें", "पुस्तक", "पुस्तको", "पुस्तका"], correctAnswer: 0 },
      { question: "नाटक में क्या होता है?", options: ["संवाद", "गीत", "लय", "तुक"], correctAnswer: 0 },
      { question: "गद्य लेखक को क्या कहते हैं?", options: ["लेखक", "कवि", "चित्रकार", "नेता"], correctAnswer: 0 }
    ]
  },
  {
    category: "Hindi",
    chapterId: 10,
    chapterName: "Hindi - Chapter 3",
    questions: [
      { question: "वचन का सही उदाहरण चुनें:", options: ["लड़का-लड़के", "खाना-पीना", "धीरे-धीरे", "सुंदर-सुंदर"], correctAnswer: 0 },
      { question: "कारक का संबंध होता है:", options: ["शब्द और अर्थ", "क्रिया और संज्ञा/सर्वनाम", "लय and छंद", "तुक and मात्रा"], correctAnswer: 1 },
      { question: "‘मैं पढ़ रहा हूँ’ में काल है:", options: ["भूतकाल", "वर्तमान काल", "भविष्यत काल", "अनिश्चित"], correctAnswer: 1 },
      { question: "संज्ञा के कितने भेद मुख्य रूप से माने जाते हैं?", options: ["3", "5", "8", "10"], correctAnswer: 1 },
      { question: "‘माता’ का लिंग बदलिए:", options: ["पिता", "भाई", "బేటా", "చాచా"], correctAnswer: 0 },
      { question: "‘रात’ का विలోమ్ శబ్దం?", options: ["ద్విన్", "సుబహ్", "శ్యామ్", "దోపహర్"], correctAnswer: 0 },
      { question: "జో శబ్దం సంఖ్యా కీ విశేషతా బతాయే, ఉసే క్యా కహతే హై?", options: ["విశేషణ్", "క్రియా", "సర్వనామ్", "అవ్యయ్"], correctAnswer: 0 }
    ]
  },

  // MATHEMATICS
  {
    category: "Mathematics",
    chapterId: 11,
    chapterName: "Maths - Chapter 1",
    questions: [
      { question: "Which of the following is an irrational number?", options: ["2", "0.5", "√2", "3/4"], correctAnswer: 2 },
      { question: "HCF of 12 and 18 is:", options: ["2", "3", "6", "12"], correctAnswer: 2 },
      { question: "Which is a prime number?", options: ["21", "25", "29", "33"], correctAnswer: 2 },
      { question: "LCM of 4 and 5 is:", options: ["9", "10", "20", "25"], correctAnswer: 2 },
      { question: "Which is the smallest even prime number?", options: ["0", "2", "4", "1"], correctAnswer: 1 },
      { question: "Which is a composite number?", options: ["3", "5", "4", "7"], correctAnswer: 2 },
      { question: "Value of √4 is:", options: ["1", "2", "3", "4"], correctAnswer: 1 }
    ]
  },
  {
    category: "Mathematics",
    chapterId: 12,
    chapterName: "Maths - Chapter 2",
    questions: [
      { question: "Degree of polynomial 3x^2 + 2x + 1 is:", options: ["0", "1", "2", "3"], correctAnswer: 2 },
      { question: "If x=2, value of x^2 - 3x + 2 is:", options: ["0", "1", "2", "3"], correctAnswer: 0 },
      { question: "Which is a linear polynomial?", options: ["x^2 + 1", "2x + 5", "x^3 - 2", "x^4"], correctAnswer: 1 },
      { question: "In 5x + 3, what is the coefficient of x?", options: ["5", "3", "1", "0"], correctAnswer: 0 },
      { question: "How many zeros does a quadratic polynomial have at most?", options: ["1", "2", "3", "0"], correctAnswer: 1 },
      { question: "Which is a quadratic polynomial?", options: ["x+1", "x^2+2", "x^3", "5"], correctAnswer: 1 },
      { question: "Zero of x - 5 is:", options: ["0", "5", "-5", "1"], correctAnswer: 1 }
    ]
  },
  {
    category: "Mathematics",
    chapterId: 13,
    chapterName: "Maths - Chapter 3",
    questions: [
      { question: "Sum of angles of a triangle is:", options: ["90°", "180°", "270°", "360°"], correctAnswer: 1 },
      { question: "Radius is ____ of diameter.", options: ["double", "half", "triple", "equal"], correctAnswer: 1 },
      { question: "A circle has how many centres?", options: ["0", "1", "2", "Infinite"], correctAnswer: 1 },
      { question: "Area of a rectangle is:", options: ["l + b", "l x b", "2(l+b)", "side x side"], correctAnswer: 1 },
      { question: "Boundary length of a shape is called:", options: ["Area", "Perimeter", "Volume", "Diameter"], correctAnswer: 1 },
      { question: "A triangle with all sides equal is:", options: ["Isosceles", "Equilateral", "Scalene", "Right"], correctAnswer: 1 },
      { question: "Angle of a right angle is:", options: ["45°", "90°", "180°", "360°"], correctAnswer: 1 }
    ]
  },

  // SCIENCE
  {
    category: "Science",
    chapterId: 14,
    chapterName: "Science (Physics) - Chapter 1",
    questions: [
      { question: "Unit of electric current is:", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswer: 1 },
      { question: "Which device is used to measure electric current?", options: ["Voltmeter", "Ammeter", "Thermometer", "Barometer"], correctAnswer: 1 },
      { question: "The angle of incidence is equal to the angle of:", options: ["refraction", "reflection", "deviation", "dispersion"], correctAnswer: 1 },
      { question: "Unit of resistance is:", options: ["Ohm", "Volt", "Ampere", "Watt"], correctAnswer: 0 },
      { question: "Which is a good conductor?", options: ["Plastic", "Rubber", "Copper", "Wood"], correctAnswer: 2 },
      { question: "Speed of light in vacuum is approx:", options: ["300 km/s", "3000 km/s", "3 x 10^8 m/s", "3 x 10^6 m/s"], correctAnswer: 2 },
      { question: "An insulator is:", options: ["Copper", "Iron", "Rubber", "Aluminum"], correctAnswer: 2 }
    ]
  },
  {
    category: "Science",
    chapterId: 15,
    chapterName: "Science (Chemistry) - Chapter 2",
    questions: [
      { question: "A chemical reaction involves:", options: ["formation of new substances", "only change in size", "only change in color (always)", "no energy change"], correctAnswer: 0 },
      { question: "pH value of a neutral solution is:", options: ["0", "7", "10", "14"], correctAnswer: 1 },
      { question: "Which is an acid?", options: ["NaOH", "HCl", "KOH", "Ca(OH)2"], correctAnswer: 1 },
      { question: "What is the formula of Water?", options: ["H2O", "HO2", "H2O2", "HO"], correctAnswer: 0 },
      { question: "Which is a base?", options: ["HCl", "H2SO4", "NaOH", "HNO3"], correctAnswer: 2 },
      { question: "Rusting of iron is an example of:", options: ["Oxidation", "Reduction", "Evaporation", "Sublimation"], correctAnswer: 0 },
      { question: "A liquid metal at room temperature:", options: ["Iron", "Mercury", "Gold", "Silver"], correctAnswer: 1 }
    ]
  },
  {
    category: "Science",
    chapterId: 16,
    chapterName: "Science (Biology) - Chapter 3",
    questions: [
      { question: "Photosynthesis occurs in:", options: ["mitochondria", "chloroplast", "nucleus", "ribosome"], correctAnswer: 1 },
      { question: "Which gas is released during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctAnswer: 0 },
      { question: "The basic unit of life is:", options: ["tissue", "organ", "cell", "system"], correctAnswer: 2 },
      { question: "Powerhouse of the cell:", options: ["Nucleus", "Mitochondria", "Cytoplasm", "Wall"], correctAnswer: 1 },
      { question: "Human heart has how many chambers?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
      { question: "Red Blood Cells carry:", options: ["Oxygen", "Water", "Food", "Waste"], correctAnswer: 0 },
      { question: "Largest organ in human body:", options: ["Liver", "Heart", "Skin", "Lungs"], correctAnswer: 2 }
    ]
  },

  // SOCIAL STUDIES
  {
    category: "Social Studies",
    chapterId: 17,
    chapterName: "Social - Chapter 1",
    questions: [
      { question: "History mainly studies:", options: ["future plans", "past events", "weather", "math formulas"], correctAnswer: 1 },
      { question: "A timeline shows events in:", options: ["random order", "alphabetical order", "chronological order", "reverse only"], correctAnswer: 2 },
      { question: "An important historical source is:", options: ["Advertisement", "Coins/inscriptions", "Cartoon only", "None"], correctAnswer: 1 },
      { question: "Archaeologists study:", options: ["Stars", "Rocks", "Old remains", "Plants"], correctAnswer: 2 },
      { question: "Manuscripts are written by:", options: ["Machine", "Hand", "Robot", "Printer"], correctAnswer: 1 },
      { question: "AD stands for:", options: ["After Death", "Anno Domini", "All Day", "Ancient Date"], correctAnswer: 1 },
      { question: "An ancient civilization:", options: ["Indus Valley", "Silicon Valley", "Moon Valley", "Green Valley"], correctAnswer: 0 }
    ]
  },
  {
    category: "Social Studies",
    chapterId: 18,
    chapterName: "Social - Chapter 2",
    questions: [
      { question: "Which is a renewable resource?", options: ["Coal", "Petroleum", "Wind", "Natural gas"], correctAnswer: 2 },
      { question: "Weather refers to:", options: ["long-term climate average", "day-to-day atmospheric condition", "only rainfall", "only temperature"], correctAnswer: 1 },
      { question: "Which instrument measures rainfall?", options: ["Barometer", "Rain gauge", "Thermometer", "Hygrometer"], correctAnswer: 1 },
      { question: "A non-renewable resource is:", options: ["Solar energy", "Wind", "Coal", "Tides"], correctAnswer: 2 },
      { question: "The star of our solar system:", options: ["Moon", "Earth", "Sun", "Mars"], correctAnswer: 2 },
      { question: "Shape of the Earth:", options: ["Flat", "Square", "Sphere/Geoid", "Triangle"], correctAnswer: 2 },
      { question: "Map making is called:", options: ["Geography", "Cartography", "Geology", "History"], correctAnswer: 1 }
    ]
  },
  {
    category: "Social Studies",
    chapterId: 19,
    chapterName: "Social - Chapter 3",
    questions: [
      { question: "Democracy means:", options: ["rule by a king", "rule by people", "rule by army", "rule by one party only"], correctAnswer: 1 },
      { question: "A budget is mainly about:", options: ["sports", "income and expenditure", "painting", "music"], correctAnswer: 1 },
      { question: "Fundamental rights are:", options: ["optional", "basic rights of citizens", "only for children", "only for government"], correctAnswer: 1 },
      { question: "Age for voting in India:", options: ["16", "18", "21", "25"], correctAnswer: 1 },
      { question: "Who is the head of the Nation (India)?", options: ["PM", "President", "CM", "Governor"], correctAnswer: 1 },
      { question: "Set of rules for a country:", options: ["Book", "Constitution", "Novel", "Newspaper"], correctAnswer: 1 },
      { question: "National Anthem is:", options: ["Vande Mataram", "Jana Gana Mana", "Sare Jahan Se Acha", "Maa Telugu Talliki"], correctAnswer: 1 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/";
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    // Clear existing exam questions
    await ExamQuestion.deleteMany({});
    console.log("Cleared existing exam questions");

    // Insert sample questions
    await ExamQuestion.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} question sets`);

    console.log("Database seeded successfully!");
    return { success: true, message: `Inserted ${sampleQuestions.length} question sets` };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, message: error.message };
  }
};

export default seedDatabase;
