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
    course: "English Course",
    video: "Chapter 1 Video",
    chapterId: 1,
    chapterName: "English - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "ENG_CH1_Q1", qDesc: "Which of these is a noun?", choices: ["Run", "Beautiful", "Teacher", "Quickly"], correctAns: "Teacher" },
      { qType: "MCQ", qId: "ENG_CH1_Q2", qDesc: "Choose the correct article: ___ apple a day keeps the doctor away.", choices: ["A", "An", "The", "No article"], correctAns: "An" },
      { qType: "MCQ", qId: "ENG_CH1_Q3", qDesc: "Which sentence is correctly punctuated?", choices: ["hello, how are you?", "Hello, how are you?", "Hello how are you", "hello how are you!"], correctAns: "Hello, how are you?" },
      { qType: "MCQ", qId: "ENG_CH1_Q4", qDesc: "Identify the verb in the sentence: 'She runs every morning.'", choices: ["She", "Runs", "Every", "Morning"], correctAns: "Runs" },
      { qType: "MCQ", qId: "ENG_CH1_Q5", qDesc: "Which word is an adjective? 'The blue sky is clear.'", choices: ["The", "Blue", "Sky", "Is"], correctAns: "Blue" },
      { qType: "MCQ", qId: "ENG_CH1_Q6", qDesc: "Choose the correct pronoun: '___ is my best friend.'", choices: ["He", "Him", "His", "They"], correctAns: "He" },
      { qType: "MCQ", qId: "ENG_CH1_Q7", qDesc: "What is the opposite of 'Hot'?", choices: ["Cold", "Warm", "Boiling", "Sunny"], correctAns: "Cold" }
    ]
  },
  {
    category: "English",
    course: "English Course",
    video: "Chapter 2 Video",
    chapterId: 2,
    chapterName: "English - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "ENG_CH2_Q1", qDesc: "Identify the tense: “She is reading a book.”", choices: ["Simple Present", "Present Continuous", "Simple Past", "Future Continuous"], correctAns: "Present Continuous" },
      { qType: "MCQ", qId: "ENG_CH2_Q2", qDesc: "Choose the correct preposition: He is good ___ maths.", choices: ["at", "in", "on", "by"], correctAns: "at" },
      { qType: "MCQ", qId: "ENG_CH2_Q3", qDesc: "Choose the correct plural form of “child”.", choices: ["Childs", "Childes", "Children", "Childrens"], correctAns: "Children" },
      { qType: "MCQ", qId: "ENG_CH2_Q4", qDesc: "Which conjunction joins these: 'Bread ___ butter'", choices: ["But", "Or", "And", "Yet"], correctAns: "And" },
      { qType: "MCQ", qId: "ENG_CH2_Q5", qDesc: "Pick the adverb: 'She sings sweetly.'", choices: ["She", "Sings", "Sweetly", "Song"], correctAns: "Sweetly" },
      { qType: "MCQ", qId: "ENG_CH2_Q6", qDesc: "What is the past tense of 'Go'?", choices: ["Goed", "Gone", "Went", "Going"], correctAns: "Went" },
      { qType: "MCQ", qId: "ENG_CH2_Q7", qDesc: "A synonym for 'Happy' is:", choices: ["Sad", "Angry", "Joyful", "Tired"], correctAns: "Joyful" }
    ]
  },
  {
    category: "English",
    course: "English Course",
    video: "Chapter 3 Video",
    chapterId: 3,
    chapterName: "English - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "ENG_CH3_Q1", qDesc: "Which is the best opening for a formal letter?", choices: ["Hey!", "Dear Sir/Madam,", "Hi friend,", "Hello bro,"], correctAns: "Dear Sir/Madam," },
      { qType: "MCQ", qId: "ENG_CH3_Q2", qDesc: "Which one is a topic sentence?", choices: ["In conclusion, we learned a lot.", "My school library is a wonderful place to study.", "For example, it has many books.", "Also, it is quiet."], correctAns: "My school library is a wonderful place to study." },
      { qType: "MCQ", qId: "ENG_CH3_Q3", qDesc: "Which is most important in a paragraph?", choices: ["Many emojis", "Random ideas", "Unity and coherence", "Very long words"], correctAns: "Unity and coherence" },
      { qType: "MCQ", qId: "ENG_CH3_Q4", qDesc: "Which is a polite closing for a formal letter?", choices: ["Bye", "See ya", "Yours sincerely", "Cheers"], correctAns: "Yours sincerely" },
      { qType: "MCQ", qId: "ENG_CH3_Q5", qDesc: "A formal letter should contain:", choices: ["Slang words", "Clear Purpose", "Jokes", "Drawings"], correctAns: "Clear Purpose" },
      { qType: "MCQ", qId: "ENG_CH3_Q6", qDesc: "Which date format is formal?", choices: ["12/05/2023", "Today", "Yesterday", "Last week"], correctAns: "12/05/2023" },
      { qType: "MCQ", qId: "ENG_CH3_Q7", qDesc: "Who is the 'Recipient'?", choices: ["The sender", "The receiver", "The postman", "The paper"], correctAns: "The receiver" }
    ]
  },
  {
    category: "English",
    course: "English Course",
    video: "Chapter 4 Video",
    chapterId: 4,
    chapterName: "English - Chapter 4",
    questions: [
      { qType: "MCQ", qId: "ENG_CH4_Q1", qDesc: "A moral of a story usually means:", choices: ["A joke", "A lesson/message", "A riddle", "A character name"], correctAns: "A lesson/message" },
      { qType: "MCQ", qId: "ENG_CH4_Q2", qDesc: "“The wind whispered” is an example of:", choices: ["Simile", "Metaphor", "Personification", "Alliteration"], correctAns: "Personification" },
      { qType: "MCQ", qId: "ENG_CH4_Q3", qDesc: "The main idea of a poem is called:", choices: ["Theme", "Rhyme", "Stanza", "Title"], correctAns: "Theme" },
      { qType: "MCQ", qId: "ENG_CH4_Q4", qDesc: "Which rhyming scheme stands for pairs?", choices: ["ABAB", "AABB", "ABBA", "None"], correctAns: "AABB" },
      { qType: "MCQ", qId: "ENG_CH4_Q5", qDesc: "What is a 'Simile'?", choices: ["Comparison using like/as", "Direct comparison", "Giving human traits", "Repetition"], correctAns: "Comparison using like/as" },
      { qType: "MCQ", qId: "ENG_CH4_Q6", qDesc: "Who writes a poem?", choices: ["Author", "Poet", "Artist", "Singer"], correctAns: "Poet" },
      { qType: "MCQ", qId: "ENG_CH4_Q7", qDesc: "Example of Alliteration:", choices: ["Big ball bounce", "Sunny day", "Cat and dog", "Red rose"], correctAns: "Big ball bounce" }
    ]
  },

  // TELUGU
  {
    category: "Telugu",
    course: "Telugu Course",
    video: "Chapter 1 Video",
    chapterId: 5,
    chapterName: "Telugu - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "TEL_CH5_Q1", qDesc: "భాషలో అర్థాన్ని తెలియజేసే చిన్న భాగం ఏది?", choices: ["పదం", "అక్షరం", "వాక్యం", "పుస్తకం"], correctAns: "పదం" },
      { qType: "MCQ", qId: "TEL_CH5_Q2", qDesc: "క్రియ అంటే ఏమిటి?", choices: ["పని/చర్యను తెలిపేది", "వస్తువును తెలిపేది", "గుణాన్ని తెలిపేది", "స్థలాన్ని తెలిపేది"], correctAns: "పని/చర్యను తెలిపేది" },
      { qType: "MCQ", qId: "TEL_CH5_Q3", qDesc: "సమాసం అంటే:", choices: ["రెండు పదాల కలయిక", "ఒక పదం విభజన", "వాక్య విరామం", "అక్షర పునరావృతం"], correctAns: "రెండు పదాల కలయిక" },
      { qType: "MCQ", qId: "TEL_CH5_Q4", qDesc: "పని చేసేవారిని ఏమంటారు?", choices: ["కర్త", "కర్మ", "క్రియ", "విశేషణం"], correctAns: "కర్త" },
      { qType: "MCQ", qId: "TEL_CH5_Q5", qDesc: "తెలుగు వర్ణమాలలో మొదటి అక్షరం?", choices: ["అ", "క", "మ", "ర"], correctAns: "అ" },
      { qType: "MCQ", qId: "TEL_CH5_Q6", qDesc: "నామవాచకానికి ఉదాహరణ:", choices: ["రాముడు", "వెళ్ళాడు", "అందమైన", "వేగంగా"], correctAns: "రాముడు" },
      { qType: "MCQ", qId: "TEL_CH5_Q7", qDesc: "గుణింతాలు వేటికి ఉంటాయి?", choices: ["అచ్చులు", "హల్లులు", "ఉభయాక్షరాలు", "అంకెలు"], correctAns: "హల్లులు" }
    ]
  },
  {
    category: "Telugu",
    course: "Telugu Course",
    video: "Chapter 2 Video",
    chapterId: 6,
    chapterName: "Telugu - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "TEL_CH6_Q1", qDesc: "ఏది సర్వనామం?", choices: ["నేను", "పుస్తకం", "పండ్లు", "అందంగా"], correctAns: "నేను" },
      { qType: "MCQ", qId: "TEL_CH6_Q2", qDesc: "విరామచిహ్నం (,) పేరు ఏమిటి?", choices: ["కామా", "పూర్తి విరామం", "ప్రశ్నార్థకం", "ఉద్ధరణచిహ్నం"], correctAns: "కామా" },
      { qType: "MCQ", qId: "TEL_CH6_Q3", qDesc: "ఎదురు పదం ఎంచుకోండి: పెద్ద", choices: ["చిన్న", "గొప్ప", "అందం", "ఎక్కువ"], correctAns: "చిన్న" },
      { qType: "MCQ", qId: "TEL_CH6_Q4", qDesc: "ఏది విశేషణం?", choices: ["ఎర్రని", "పువ్వు", "పూసింది", "తానే"], correctAns: "ఎర్రని" },
      { qType: "MCQ", qId: "TEL_CH6_Q5", qDesc: "జరిగిపోయిన కాలాన్ని ఏమంటారు?", choices: ["భూతకాలం", "వర్తమాన కాలం", "భవిష్యత్ కాలం", "ఏదీకాదు"], correctAns: "భూతకాలం" },
      { qType: "MCQ", qId: "TEL_CH6_Q6", qDesc: "పర్యాయపదం: అమ్మ", choices: ["తల్లి", "చెల్లి", "అక్క", "కోడలు"], correctAns: "తల్లి" },
      { qType: "MCQ", qId: "TEL_CH6_Q7", qDesc: "వచనాలు ఎన్ని?", choices: ["2", "3", "4", "5"], correctAns: "2" }
    ]
  },
  {
    category: "Telugu",
    course: "Telugu Course",
    video: "Chapter 3 Video",
    chapterId: 7,
    chapterName: "Telugu - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "TEL_CH7_Q1", qDesc: "లేఖ రాయడంలో మొదట ఉండేది ఏమిటి?", choices: ["తేదీ", "సంతకం", "ముగింపు", "అనుబంధం"], correctAns: "తేదీ" },
      { qType: "MCQ", qId: "TEL_CH7_Q2", qDesc: "వ్యాసానికి ముఖ్యమైనది:", choices: ["శీర్షిక", "ఒకే భావం", "క్రమబద్ధత", "పైవన్నీ"], correctAns: "పైవన్నీ" },
      { qType: "MCQ", qId: "TEL_CH7_Q3", qDesc: "సారాంశం అంటే:", choices: ["పొడవైన వివరణ", "సంక్షిప్త వివరణ", "కల్పిత కథ", "కావ్యం"], correctAns: "సంక్షిప్త వివరణ" },
      { qType: "MCQ", qId: "TEL_CH7_Q4", qDesc: "లేఖలో గౌరవ వాచకం ఎక్కడ ఉంటుంది?", choices: ["ఆరంభంలో", "చివరన", "మధ్యలో", "ఎక్కడా కాదు"], correctAns: "ఆరంభంలో" },
      { qType: "MCQ", qId: "TEL_CH7_Q5", qDesc: "ముగింపు లేఖలో ఎక్కడ ఉంటుంది?", choices: ["చివరన", "మొదట", "మధ్యలో", "పైన"], correctAns: "చివరన" },
      { qType: "MCQ", qId: "TEL_CH7_Q6", qDesc: "వ్యాసం దేనితో మొదలుపెట్టాలి?", choices: ["ఉపోద్ఘాతం", "ముగింపు", "విషయం", "సందేహం"], correctAns: "ఉపోద్ఘాతం" },
      { qType: "MCQ", qId: "TEL_CH7_Q7", qDesc: "చేతిరాత ఎలా ఉండాలి?", choices: ["గుండ్రంగా", "గజిబిజిగా", "అర్థంకాకుండా", "చాలా చిన్నగా"], correctAns: "గుండ్రంగా" }
    ]
  },

  // HINDI
  {
    category: "Hindi",
    course: "Hindi Course",
    video: "Chapter 1 Video",
    chapterId: 8,
    chapterName: "Hindi - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "HIN_CH8_Q1", qDesc: "‘सुंदर’ किस प्रकार का शब्द है?", choices: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया"], correctAns: "विशेषण" },
      { qType: "MCQ", qId: "HIN_CH8_Q2", qDesc: "‘मैं’ किस प्रकार का शब्द है?", choices: ["संज्ञा", "सर्वनाम", "विशेषण", "अव्यय"], correctAns: "सर्वनाम" },
      { qType: "MCQ", qId: "HIN_CH8_Q3", qDesc: "कविता का मुख्य भाव कहलाता है:", choices: ["लय", "छंद", "भाव", "विराम"], correctAns: "भाव" },
      { qType: "MCQ", qId: "HIN_CH8_Q4", qDesc: "‘सूर्य’ का पर्यायवाची शब्द:", choices: ["रवि", "चांद", "తారా", "पानी"], correctAns: "रवि" },
      { qType: "MCQ", qId: "HIN_CH8_Q5", qDesc: "कविता लिखने वाले को क्या कहते हैं?", choices: ["कवि", "लेखक", "गायक", "खिलाड़ी"], correctAns: "कवि" },
      { qType: "MCQ", qId: "HIN_CH8_Q6", qDesc: "तुकबंदी वाला शब्द: 'पानी'", choices: ["रानी", "घर", "नल", "फल"], correctAns: "रानी" },
      { qType: "MCQ", qId: "HIN_CH8_Q7", qDesc: "जिसकी उपमा दी जाए:", choices: ["उपमेय", "उपमान", "साधारण धर्म", "वाचक"], correctAns: "उपमेय" }
    ]
  },
  {
    category: "Hindi",
    course: "Hindi Course",
    video: "Chapter 2 Video",
    chapterId: 9,
    chapterName: "Hindi - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "HIN_CH9_Q1", qDesc: "‘विद्यालय’ शब्द का अर्थ क्या है?", choices: ["घर", "स्कूल", "बाजार", "खेत"], correctAns: "स्कूल" },
      { qType: "MCQ", qId: "HIN_CH9_Q2", qDesc: "‘वह’ किस प्रकार का शब्द है?", choices: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया"], correctAns: "सर्वनाम" },
      { qType: "MCQ", qId: "HIN_CH9_Q3", qDesc: "गद्य में मुख्य रूप से होता है:", choices: ["कथानक/विचार", "छंद", "लय", "तुक"], correctAns: "कथानक/विचार" },
      { qType: "MCQ", qId: "HIN_CH9_Q4", qDesc: "कहानी से हमें क्या मिलती है?", choices: ["सीख", "मिठाई", "पैसे", "खिलोना"], correctAns: "सीख" },
      { qType: "MCQ", qId: "HIN_CH9_Q5", qDesc: "‘पुस्तक’ का बहुवचन:", choices: ["पुस्तकें", "पुस्तक", "पुस्तको", "पुस्तका"], correctAns: "पुस्तकें" },
      { qType: "MCQ", qId: "HIN_CH9_Q6", qDesc: "नाटक में क्या होता है?", choices: ["संवाद", "गीत", "लय", "तुक"], correctAns: "संवाद" },
      { qType: "MCQ", qId: "HIN_CH9_Q7", qDesc: "गद्य लेखक को क्या कहते हैं?", choices: ["लेखक", "कवि", "चित्रकार", "नेता"], correctAns: "लेखक" }
    ]
  },
  {
    category: "Hindi",
    course: "Hindi Course",
    video: "Chapter 3 Video",
    chapterId: 10,
    chapterName: "Hindi - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "HIN_CH10_Q1", qDesc: "वचन का सही उदाहरण चुनें:", choices: ["लड़का-लड़के", "खाना-पीना", "धीरे-धीरे", "सुंदर-सुंदर"], correctAns: "लड़का-लड़के" },
      { qType: "MCQ", qId: "HIN_CH10_Q2", qDesc: "कारक का संबंध होता है:", choices: ["शब्द और अर्थ", "क्रिया और संज्ञा/सर्वनाम", "लय and छंद", "तुक and मात्रा"], correctAns: "क्रिया और संज्ञा/सर्वनाम" },
      { qType: "MCQ", qId: "HIN_CH10_Q3", qDesc: "‘मैं पढ़ रहा हूँ’ में काल है:", choices: ["भूतकाल", "वर्तमान काल", "भविष्यत काल", "अनिश्चित"], correctAns: "वर्तमान काल" },
      { qType: "MCQ", qId: "HIN_CH10_Q4", qDesc: "संज्ञा के कितने भेद मुख्य रूप से माने जाते हैं?", choices: ["3", "5", "8", "10"], correctAns: "5" },
      { qType: "MCQ", qId: "HIN_CH10_Q5", qDesc: "‘माता’ का लिंग बदलिए:", choices: ["पिता", "भाई", "బేటా", "చాచా"], correctAns: "पिता" },
      { qType: "MCQ", qId: "HIN_CH10_Q6", qDesc: "‘रात’ का वిలోమ్ शब्दं?", choices: ["ద్విన్", "సుబహ్", "శ్యామ్", "దోపహర్"], correctAns: "ద్విన్" },
      { qType: "MCQ", qId: "HIN_CH10_Q7", qDesc: "जो शब्दं संख्या की विशेषता बताये, उसे क्या कहते है?", choices: ["విశేషణ్", "క్రియా", "సర్వనామ్", "అవ్యయ్"], correctAns: "విశేషణ్" }
    ]
  },

  // MATHEMATICS
  {
    category: "Mathematics",
    course: "Mathematics Course",
    video: "Chapter 1 Video",
    chapterId: 11,
    chapterName: "Maths - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "MATH_CH11_Q1", qDesc: "Which of the following is an irrational number?", choices: ["2", "0.5", "√2", "3/4"], correctAns: "√2" },
      { qType: "MCQ", qId: "MATH_CH11_Q2", qDesc: "HCF of 12 and 18 is:", choices: ["2", "3", "6", "12"], correctAns: "6" },
      { qType: "MCQ", qId: "MATH_CH11_Q3", qDesc: "Which is a prime number?", choices: ["21", "25", "29", "33"], correctAns: "29" },
      { qType: "MCQ", qId: "MATH_CH11_Q4", qDesc: "LCM of 4 and 5 is:", choices: ["9", "10", "20", "25"], correctAns: "20" },
      { qType: "MCQ", qId: "MATH_CH11_Q5", qDesc: "Which is the smallest even prime number?", choices: ["0", "2", "4", "1"], correctAns: "2" },
      { qType: "MCQ", qId: "MATH_CH11_Q6", qDesc: "Which is a composite number?", choices: ["3", "5", "4", "7"], correctAns: "4" },
      { qType: "MCQ", qId: "MATH_CH11_Q7", qDesc: "Value of √4 is:", choices: ["1", "2", "3", "4"], correctAns: "2" }
    ]
  },
  {
    category: "Mathematics",
    course: "Mathematics Course",
    video: "Chapter 2 Video",
    chapterId: 12,
    chapterName: "Maths - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "MATH_CH12_Q1", qDesc: "Degree of polynomial 3x^2 + 2x + 1 is:", choices: ["0", "1", "2", "3"], correctAns: "2" },
      { qType: "MCQ", qId: "MATH_CH12_Q2", qDesc: "If x=2, value of x^2 - 3x + 2 is:", choices: ["0", "1", "2", "3"], correctAns: "0" },
      { qType: "MCQ", qId: "MATH_CH12_Q3", qDesc: "Which is a linear polynomial?", choices: ["x^2 + 1", "2x + 5", "x^3 - 2", "x^4"], correctAns: "2x + 5" },
      { qType: "MCQ", qId: "MATH_CH12_Q4", qDesc: "In 5x + 3, what is the coefficient of x?", choices: ["5", "3", "1", "0"], correctAns: "5" },
      { qType: "MCQ", qId: "MATH_CH12_Q5", qDesc: "How many zeros does a quadratic polynomial have at most?", choices: ["1", "2", "3", "0"], correctAns: "2" },
      { qType: "MCQ", qId: "MATH_CH12_Q6", qDesc: "Which is a quadratic polynomial?", choices: ["x+1", "x^2+2", "x^3", "5"], correctAns: "x^2+2" },
      { qType: "MCQ", qId: "MATH_CH12_Q7", qDesc: "Zero of x - 5 is:", choices: ["0", "5", "-5", "1"], correctAns: "5" }
    ]
  },
  {
    category: "Mathematics",
    course: "Mathematics Course",
    video: "Chapter 3 Video",
    chapterId: 13,
    chapterName: "Maths - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "MATH_CH13_Q1", qDesc: "Sum of angles of a triangle is:", choices: ["90°", "180°", "270°", "360°"], correctAns: "180°" },
      { qType: "MCQ", qId: "MATH_CH13_Q2", qDesc: "Radius is ____ of diameter.", choices: ["double", "half", "triple", "equal"], correctAns: "half" },
      { qType: "MCQ", qId: "MATH_CH13_Q3", qDesc: "A circle has how many centres?", choices: ["0", "1", "2", "Infinite"], correctAns: "1" },
      { qType: "MCQ", qId: "MATH_CH13_Q4", qDesc: "Area of a rectangle is:", choices: ["l + b", "l x b", "2(l+b)", "side x side"], correctAns: "l x b" },
      { qType: "MCQ", qId: "MATH_CH13_Q5", qDesc: "Boundary length of a shape is called:", choices: ["Area", "Perimeter", "Volume", "Diameter"], correctAns: "Perimeter" },
      { qType: "MCQ", qId: "MATH_CH13_Q6", qDesc: "A triangle with all sides equal is:", choices: ["Isosceles", "Equilateral", "Scalene", "Right"], correctAns: "Equilateral" },
      { qType: "MCQ", qId: "MATH_CH13_Q7", qDesc: "Angle of a right angle is:", choices: ["45°", "90°", "180°", "360°"], correctAns: "90°" }
    ]
  },

  // SCIENCE
  {
    category: "Science",
    course: "Science Course",
    video: "Physics Chapter 1 Video",
    chapterId: 14,
    chapterName: "Science (Physics) - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "SCI_CH14_Q1", qDesc: "Unit of electric current is:", choices: ["Volt", "Ampere", "Ohm", "Watt"], correctAns: "Ampere" },
      { qType: "MCQ", qId: "SCI_CH14_Q2", qDesc: "Which device is used to measure electric current?", choices: ["Voltmeter", "Ammeter", "Thermometer", "Barometer"], correctAns: "Ammeter" },
      { qType: "MCQ", qId: "SCI_CH14_Q3", qDesc: "The angle of incidence is equal to the angle of:", choices: ["refraction", "reflection", "deviation", "dispersion"], correctAns: "reflection" },
      { qType: "MCQ", qId: "SCI_CH14_Q4", qDesc: "Unit of resistance is:", choices: ["Ohm", "Volt", "Ampere", "Watt"], correctAns: "Ohm" },
      { qType: "MCQ", qId: "SCI_CH14_Q5", qDesc: "Which is a good conductor?", choices: ["Plastic", "Rubber", "Copper", "Wood"], correctAns: "Copper" },
      { qType: "MCQ", qId: "SCI_CH14_Q6", qDesc: "Speed of light in vacuum is approx:", choices: ["300 km/s", "3000 km/s", "3 x 10^8 m/s", "3 x 10^6 m/s"], correctAns: "3 x 10^8 m/s" },
      { qType: "MCQ", qId: "SCI_CH14_Q7", qDesc: "An insulator is:", choices: ["Copper", "Iron", "Rubber", "Aluminum"], correctAns: "Rubber" }
    ]
  },
  {
    category: "Science",
    course: "Science Course",
    video: "Chemistry Chapter 2 Video",
    chapterId: 15,
    chapterName: "Science (Chemistry) - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "SCI_CH15_Q1", qDesc: "A chemical reaction involves:", choices: ["formation of new substances", "only change in size", "only change in color (always)", "no energy change"], correctAns: "formation of new substances" },
      { qType: "MCQ", qId: "SCI_CH15_Q2", qDesc: "pH value of a neutral solution is:", choices: ["0", "7", "10", "14"], correctAns: "7" },
      { qType: "MCQ", qId: "SCI_CH15_Q3", qDesc: "Which is an acid?", choices: ["NaOH", "HCl", "KOH", "Ca(OH)2"], correctAns: "HCl" },
      { qType: "MCQ", qId: "SCI_CH15_Q4", qDesc: "What is the formula of Water?", choices: ["H2O", "HO2", "H2O2", "HO"], correctAns: "H2O" },
      { qType: "MCQ", qId: "SCI_CH15_Q5", qDesc: "Which is a base?", choices: ["HCl", "H2SO4", "NaOH", "HNO3"], correctAns: "NaOH" },
      { qType: "MCQ", qId: "SCI_CH15_Q6", qDesc: "Rusting of iron is an example of:", choices: ["Oxidation", "Reduction", "Evaporation", "Sublimation"], correctAns: "Oxidation" },
      { qType: "MCQ", qId: "SCI_CH15_Q7", qDesc: "A liquid metal at room temperature:", choices: ["Iron", "Mercury", "Gold", "Silver"], correctAns: "Mercury" }
    ]
  },
  {
    category: "Science",
    course: "Science Course",
    video: "Biology Chapter 3 Video",
    chapterId: 16,
    chapterName: "Science (Biology) - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "SCI_CH16_Q1", qDesc: "Photosynthesis occurs in:", choices: ["mitochondria", "chloroplast", "nucleus", "ribosome"], correctAns: "chloroplast" },
      { qType: "MCQ", qId: "SCI_CH16_Q2", qDesc: "Which gas is released during photosynthesis?", choices: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctAns: "Oxygen" },
      { qType: "MCQ", qId: "SCI_CH16_Q3", qDesc: "The basic unit of life is:", choices: ["tissue", "organ", "cell", "system"], correctAns: "cell" },
      { qType: "MCQ", qId: "SCI_CH16_Q4", qDesc: "Powerhouse of the cell:", choices: ["Nucleus", "Mitochondria", "Cytoplasm", "Wall"], correctAns: "Mitochondria" },
      { qType: "MCQ", qId: "SCI_CH16_Q5", qDesc: "Human heart has how many chambers?", choices: ["2", "3", "4", "5"], correctAns: "4" },
      { qType: "MCQ", qId: "SCI_CH16_Q6", qDesc: "Red Blood Cells carry:", choices: ["Oxygen", "Water", "Food", "Waste"], correctAns: "Oxygen" },
      { qType: "MCQ", qId: "SCI_CH16_Q7", qDesc: "Largest organ in human body:", choices: ["Liver", "Heart", "Skin", "Lungs"], correctAns: "Skin" }
    ]
  },

  // SOCIAL STUDIES
  {
    category: "Social Studies",
    course: "Social Studies Course",
    video: "Chapter 1 Video",
    chapterId: 17,
    chapterName: "Social - Chapter 1",
    questions: [
      { qType: "MCQ", qId: "SOC_CH17_Q1", qDesc: "History mainly studies:", choices: ["future plans", "past events", "weather", "math formulas"], correctAns: "past events" },
      { qType: "MCQ", qId: "SOC_CH17_Q2", qDesc: "A timeline shows events in:", choices: ["random order", "alphabetical order", "chronological order", "reverse only"], correctAns: "chronological order" },
      { qType: "MCQ", qId: "SOC_CH17_Q3", qDesc: "An important historical source is:", choices: ["Advertisement", "Coins/inscriptions", "Cartoon only", "None"], correctAns: "Coins/inscriptions" },
      { qType: "MCQ", qId: "SOC_CH17_Q4", qDesc: "Archaeologists study:", choices: ["Stars", "Rocks", "Old remains", "Plants"], correctAns: "Old remains" },
      { qType: "MCQ", qId: "SOC_CH17_Q5", qDesc: "Manuscripts are written by:", choices: ["Machine", "Hand", "Robot", "Printer"], correctAns: "Hand" },
      { qType: "MCQ", qId: "SOC_CH17_Q6", qDesc: "AD stands for:", choices: ["After Death", "Anno Domini", "All Day", "Ancient Date"], correctAns: "Anno Domini" },
      { qType: "MCQ", qId: "SOC_CH17_Q7", qDesc: "An ancient civilization:", choices: ["Indus Valley", "Silicon Valley", "Moon Valley", "Green Valley"], correctAns: "Indus Valley" }
    ]
  },
  {
    category: "Social Studies",
    course: "Social Studies Course",
    video: "Chapter 2 Video",
    chapterId: 18,
    chapterName: "Social - Chapter 2",
    questions: [
      { qType: "MCQ", qId: "SOC_CH18_Q1", qDesc: "Which is a renewable resource?", choices: ["Coal", "Petroleum", "Wind", "Natural gas"], correctAns: "Wind" },
      { qType: "MCQ", qId: "SOC_CH18_Q2", qDesc: "Weather refers to:", choices: ["long-term climate average", "day-to-day atmospheric condition", "only rainfall", "only temperature"], correctAns: "day-to-day atmospheric condition" },
      { qType: "MCQ", qId: "SOC_CH18_Q3", qDesc: "Which instrument measures rainfall?", choices: ["Barometer", "Rain gauge", "Thermometer", "Hygrometer"], correctAns: "Rain gauge" },
      { qType: "MCQ", qId: "SOC_CH18_Q4", qDesc: "A non-renewable resource is:", choices: ["Solar energy", "Wind", "Coal", "Tides"], correctAns: "Coal" },
      { qType: "MCQ", qId: "SOC_CH18_Q5", qDesc: "The star of our solar system:", choices: ["Moon", "Earth", "Sun", "Mars"], correctAns: "Sun" },
      { qType: "MCQ", qId: "SOC_CH18_Q6", qDesc: "Shape of the Earth:", choices: ["Flat", "Square", "Sphere/Geoid", "Triangle"], correctAns: "Sphere/Geoid" },
      { qType: "MCQ", qId: "SOC_CH18_Q7", qDesc: "Map making is called:", choices: ["Geography", "Cartography", "Geology", "History"], correctAns: "Cartography" }
    ]
  },
  {
    category: "Social Studies",
    course: "Social Studies Course",
    video: "Chapter 3 Video",
    chapterId: 19,
    chapterName: "Social - Chapter 3",
    questions: [
      { qType: "MCQ", qId: "SOC_CH19_Q1", qDesc: "Democracy means:", choices: ["rule by a king", "rule by people", "rule by army", "rule by one party only"], correctAns: "rule by people" },
      { qType: "MCQ", qId: "SOC_CH19_Q2", qDesc: "A budget is mainly about:", choices: ["sports", "income and expenditure", "painting", "music"], correctAns: "income and expenditure" },
      { qType: "MCQ", qId: "SOC_CH19_Q3", qDesc: "Fundamental rights are:", choices: ["optional", "basic rights of citizens", "only for children", "only for government"], correctAns: "basic rights of citizens" },
      { qType: "MCQ", qId: "SOC_CH19_Q4", qDesc: "Age for voting in India:", choices: ["16", "18", "21", "25"], correctAns: "18" },
      { qType: "MCQ", qId: "SOC_CH19_Q5", qDesc: "Who is the head of the Nation (India)?", choices: ["PM", "President", "CM", "Governor"], correctAns: "President" },
      { qType: "MCQ", qId: "SOC_CH19_Q6", qDesc: "Set of rules for a country:", choices: ["Book", "Constitution", "Novel", "Newspaper"], correctAns: "Constitution" },
      { qType: "MCQ", qId: "SOC_CH19_Q7", qDesc: "National Anthem is:", choices: ["Vande Mataram", "Jana Gana Mana", "Sare Jahan Se Acha", "Maa Telugu Talliki"], correctAns: "Jana Gana Mana" }
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
