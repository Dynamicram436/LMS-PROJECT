import mongoose from "mongoose";
import dotenv from "dotenv";
import ExamQuestion from "./models/examQuestionSchema.js";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const sampleQuestions = [
  // --- CSE TOPICS (101-107) ---
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 101 Video",
    chapterId: 101,
    chapterName: "Introduction to programming",
    year: 1,
    semester: 1,
    subject: "Programming for Problem Solving",
    questions: [
      { qType: "MCQ", qId: "CSE_101_1", qDesc: "Which of these is a programming language?", choices: ["HTML", "C++", "HTTP", "FTP"], correctAns: "C++", explanation: "C++ is a powerful, high-level programming language used for systems and applications, whereas HTML is a markup language and HTTP/FTP are protocols." },
      { qType: "MCQ", qId: "CSE_101_2", qDesc: "Who developed C++?", choices: ["Bjarne Stroustrup", "Dennis Ritchie", "James Gosling", "Guido van Rossum"], correctAns: "Bjarne Stroustrup", explanation: "Bjarne Stroustrup created C++ at Bell Labs in 1979 as an extension of the C language." },
      { qType: "MCQ", qId: "CSE_101_3", qDesc: "Which is not an OOP pillar?", choices: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"], correctAns: "Compilation", explanation: "OOP's four pillars are Abstraction, Encapsulation, Inheritance, and Polymorphism. Compilation is the process of translating code." },
      { qType: "MCQ", qId: "CSE_101_4", qDesc: "Result of 5 + '5' in JS?", choices: ["10", "55", "Error", "NaN"], correctAns: "55", explanation: "In JavaScript, the '+' operator performs string concatenation if one of the operands is a string, so 5 becomes '5' and they join." },
      { qType: "MCQ", qId: "CSE_101_5", qDesc: "What does CPU stand for?", choices: ["Central Processing Unit", "Computer Power Unit", "Core Program Utility", "None"], correctAns: "Central Processing Unit", explanation: "The CPU is the primary component of a computer that acts as its 'brain', performing most of the processing." },
      { qType: "MCQ", qId: "CSE_101_6", qDesc: "Android primarily uses?", choices: ["Swift", "Kotlin", "PHP", "Ruby"], correctAns: "Kotlin", explanation: "While Java was used for years, Google declared Kotlin as the preferred language for Android app development in 2019." },
      { qType: "MCQ", qId: "CSE_101_7", qDesc: "A syntax error is a...?", choices: ["Insect", "Bug", "Feature", "None"], correctAns: "Bug", explanation: "In programming history, a 'bug' refers to any error or flaw that causes a program to fail or behave unexpectedly." },
      { qType: "MCQ", qId: "CSE_101_8", qDesc: "C++ comments symbol?", choices: ["//", "#", "--", "/*"], correctAns: "//", explanation: "// is used for single-line comments in C++, C#, and Java, while /* */ is for multi-line block comments." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 102 Video",
    chapterId: 102,
    chapterName: "Data Types & Variables",
    year: 1,
    semester: 1,
    subject: "Programming for Problem Solving",
    questions: [
      { qType: "MCQ", qId: "CSE_102_1", qDesc: "Size of float in C++?", choices: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], correctAns: "4 bytes", explanation: "In most modern C++ compilers, a float typically occupies 4 bytes (32 bits) of memory, following the IEEE 754 standard." },
      { qType: "MCQ", qId: "CSE_102_2", qDesc: "Which is a boolean value?", choices: ["10", "true", "null", "undefined"], correctAns: "true", explanation: "Boolean data types represent one of two values: true or false." },
      { qType: "MCQ", qId: "CSE_102_3", qDesc: "Keyword for integer type?", choices: ["float", "char", "int", "double"], correctAns: "int", explanation: "The 'int' keyword is used to declare integer variables that store whole numbers without decimals." },
      { qType: "MCQ", qId: "CSE_102_4", qDesc: "Range of signed char?", choices: ["-128 to 127", "0 to 255", "-255 to 255", "None"], correctAns: "-128 to 127", explanation: "A signed char uses 8 bits; with 2's complement representation, the range is -2^7 to (2^7 - 1)." },
      { qType: "MCQ", qId: "CSE_102_5", qDesc: "Which is not a primitive type?", choices: ["int", "double", "string", "bool"], correctAns: "string", explanation: "In C++, 'string' is a class (an object), while int, double, and bool are primitive (built-in) data types." },
      { qType: "MCQ", qId: "CSE_102_6", qDesc: "Declaring a constant in C++ uses?", choices: ["const", "final", "static", "let"], correctAns: "const", explanation: "The 'const' keyword ensures that the value of a variable cannot be modified after its initial assignment." },
      { qType: "MCQ", qId: "CSE_102_7", qDesc: "Size of 'double' in bytes?", choices: ["4", "8", "12", "16"], correctAns: "8", explanation: "A double-precision floating-point number (double) usually takes 8 bytes of memory to provide higher precision than a float." },
      { qType: "MCQ", qId: "CSE_102_8", qDesc: "Type for single character?", choices: ["string", "str", "char", "text"], correctAns: "char", explanation: "The 'char' type is specifically designed to store a single ASCII or small integer character." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 103 Video",
    chapterId: 103,
    chapterName: "Control Structures",
    year: 1,
    semester: 1,
    subject: "Programming for Problem Solving",
    questions: [
      { qType: "MCQ", qId: "CSE_103_1", qDesc: "Which is a loop?", choices: ["if", "for", "switch", "break"], correctAns: "for", explanation: "The 'for' statement creates a loop that consists of three optional expressions, enclosed in parentheses and separated by semicolons." },
      { qType: "MCQ", qId: "CSE_103_2", qDesc: "The loop that runs at least once?", choices: ["while", "for", "do-while", "foreach"], correctAns: "do-while", explanation: "The 'do-while' loop checks the condition at the end of the block, ensuring the code inside executes at least once." },
      { qType: "MCQ", qId: "CSE_103_3", qDesc: "Statement to exit a loop?", choices: ["continue", "exit", "break", "return"], correctAns: "break", explanation: "The 'break' statement immediately terminates the loop it is inside, passing control to the next line of code after the loop." },
      { qType: "MCQ", qId: "CSE_103_4", qDesc: "Logical AND operator?", choices: ["||", "!", "&&", "&"], correctAns: "&&", explanation: "&& is the logical AND operator, which returns true only if both operands are true." },
      { qType: "MCQ", qId: "CSE_103_5", qDesc: "The default case belongs to?", choices: ["if", "for", "switch", "while"], correctAns: "switch", explanation: "In a switch statement, the 'default' case handles any potential values that are not explicitly matched by 'case' labels." },
      { qType: "MCQ", qId: "CSE_103_6", qDesc: "Ternary operator symbol?", choices: ["?:", "??", "!!", "=>"], correctAns: "?:", explanation: "The ternary operator ?: is a shorthand for an if-else statement, taking three operands: condition, result if true, and result if false." },
      { qType: "MCQ", qId: "CSE_103_7", qDesc: "Condition based execution utilizes?", choices: ["while", "loop", "if-else", "static"], correctAns: "if-else", explanation: "The if-else structure allows the program to branch and execute different blocks based on whether a condition is true or false." },
      { qType: "MCQ", qId: "CSE_103_8", qDesc: "Which skips current iteration?", choices: ["break", "continue", "skip", "next"], correctAns: "continue", explanation: "The 'continue' statement stops the current iteration of a loop and starts the next one." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 104 Video",
    chapterId: 104,
    chapterName: "Arrays & Linked Lists",
    year: 1,
    semester: 2,
    subject: "Data Structures",
    questions: [
      { qType: "MCQ", qId: "CSE_104_1", qDesc: "Index of the first element in an array?", choices: ["1", "0", "-1", "Depends"], correctAns: "0", explanation: "In C++ and many other languages, arrays are 0-indexed, meaning the first element is at position 0." },
      { qType: "MCQ", qId: "CSE_104_2", qDesc: "Linked list nodes contain data and...?", choices: ["Index", "Pointer", "Value", "Size"], correctAns: "Pointer", explanation: "Each node in a linked list contains its data and a memory address (pointer) to the next node in the sequence." },
      { qType: "MCQ", qId: "CSE_104_3", qDesc: "Arrays have what type of size?", choices: ["Dynamic", "Fixed", "Infinite", "None"], correctAns: "Fixed", explanation: "Standard arrays are allocated a specific block of memory at declaration, making their size fixed throughout the program execution." },
      { qType: "MCQ", qId: "CSE_104_4", qDesc: "A list where last node points to first?", choices: ["Doubly", "Circular", "Linear", "Stack"], correctAns: "Circular", explanation: "In a circular linked list, the tail's 'next' pointer wraps back to the head node, forming a continuous loop." },
      { qType: "MCQ", qId: "CSE_104_5", qDesc: "Accessing array element by index takes?", choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctAns: "O(1)", explanation: "Arrays allow constant-time access O(1) because the memory address is calculated directly using the base address and index." },
      { qType: "MCQ", qId: "CSE_104_6", qDesc: "Which requires contiguous memory?", choices: ["Linked List", "Array", "Tree", "Graph"], correctAns: "Array", explanation: "Arrays must be stored in a single, unbroken block of memory to allow fast indexing, unlike linked lists which can be scattered." },
      { qType: "MCQ", qId: "CSE_104_7", qDesc: "Structure of a linked list is?", choices: ["Static", "Recursive", "Linear", "Both Recursive & Linear"], correctAns: "Both Recursive & Linear", explanation: "Linked lists are linear in sequence but recursive in definition (a node points to another list)." },
      { qType: "MCQ", qId: "CSE_104_8", qDesc: "Head of a linked list points to?", choices: ["Tail", "NULL", "First Node", "Last Node"], correctAns: "First Node", explanation: "The 'head' pointer acts as the entry point to the list by storing the address of the very first element." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 105 Video",
    chapterId: 105,
    chapterName: "Stacks & Queues",
    year: 1,
    semester: 2,
    subject: "Data Structures",
    questions: [
      { qType: "MCQ", qId: "CSE_105_1", qDesc: "Stack follows which principle?", choices: ["FIFO", "LIFO", "Linear", "Random"], correctAns: "LIFO", explanation: "Stacks use Last-In First-Out (LIFO), meaning the last item added is the first one to be removed." },
      { qType: "MCQ", qId: "CSE_105_2", qDesc: "Queue follows which principle?", choices: ["LIFO", "FIFO", "Ordered", "None"], correctAns: "FIFO", explanation: "Queues use First-In First-Out (FIFO), similar to a line of people where the first person in is served first." },
      { qType: "MCQ", qId: "CSE_105_3", qDesc: "Operation to add element to stack?", choices: ["Pop", "Push", "Enqueue", "Dequeue"], correctAns: "Push", explanation: "The 'push' operation places a new item on the very top of the stack." },
      { qType: "MCQ", qId: "CSE_105_4", qDesc: "Operation to remove from queue?", choices: ["Pop", "Push", "Enqueue", "Dequeue"], correctAns: "Dequeue", explanation: "The 'dequeue' operation removes the item at the front (head) of the queue." },
      { qType: "MCQ", qId: "CSE_105_5", qDesc: "Underflow condition occurs when?", choices: ["Full", "Empty", "One element", "None"], correctAns: "Empty", explanation: "Underflow happens when you attempt to remove (pop/dequeue) an element from a data structure that has no items." },
      { qType: "MCQ", qId: "CSE_105_6", qDesc: "Stack is used in...?", choices: ["Recursion", "Printer Spooling", "Scheduling", "BFS"], correctAns: "Recursion", explanation: "Recursion uses a system stack to keep track of function calls and local variables during execution." },
      { qType: "MCQ", qId: "CSE_105_7", qDesc: "Queue is used in...?", choices: ["DFS", "Printer Spooling", "Undo system", "Expression Eval"], correctAns: "Printer Spooling", explanation: "Queues are ideal for managing tasks like printing, where jobs are processed in the order they were received." },
      { qType: "MCQ", qId: "CSE_105_8", qDesc: "Peeking an element means?", choices: ["Deleting", "Reading without removing", "Adding", "Searching"], correctAns: "Reading without removing", explanation: "The 'peek' or 'top' operation allows you to see the value of the next element in line without actually removing it." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 106 Video",
    chapterId: 106,
    chapterName: "Sorting Algorithms",
    year: 1,
    semester: 2,
    subject: "Data Structures",
    questions: [
      { qType: "MCQ", qId: "CSE_106_1", qDesc: "Complexity of Bubble Sort?", choices: ["O(n)", "O(n^2)", "O(log n)", "O(n log n)"], correctAns: "O(n^2)", explanation: "Bubble sort involves nested loops where each element is compared with every other element, resulting in quadratic time complexity O(n^2)." },
      { qType: "MCQ", qId: "CSE_106_2", qDesc: "Which uses Divide and Conquer?", choices: ["Bubble", "Selection", "Merge Sort", "Insertion"], correctAns: "Merge Sort", explanation: "Merge Sort recursively splits the array into two halves, sorts them, and then merges them back together." },
      { qType: "MCQ", qId: "CSE_106_3", qDesc: "Quick Sort pivot is used for?", choices: ["Sorting", "Partitioning", "Merging", "Searching"], correctAns: "Partitioning", explanation: "The pivot is used to rearrange the array so that all elements smaller than the pivot are on the left and larger ones are on the right." },
      { qType: "MCQ", qId: "CSE_106_4", qDesc: "Best case for Insertion Sort?", choices: ["Reverse", "Random", "Sorted", "None"], correctAns: "Sorted", explanation: "If the array is already sorted, Insertion Sort only needs to make O(n) comparisons without any swaps." },
      { qType: "MCQ", qId: "CSE_106_5", qDesc: "In-place sorting algorithm?", choices: ["Merge Sort", "Quick Sort", "Radix Sort", "None"], correctAns: "Quick Sort", explanation: "Quick Sort sorts the array by swapping elements within the original space, unlike Merge Sort which requires extra auxiliary memory." },
      { qType: "MCQ", qId: "CSE_106_6", qDesc: "Which algorithm is stable?", choices: ["Quick", "Heap", "Merge", "Selection"], correctAns: "Merge", explanation: "A stable sort preserves the relative order of elements with equal keys. Merge Sort is inherently stable." },
      { qType: "MCQ", qId: "CSE_106_7", qDesc: "Sorting by repeatedly finding minimum?", choices: ["Bubble", "Selection", "Quick", "Merge"], correctAns: "Selection", explanation: "Selection Sort works by finding the smallest element in the unsorted portion and swapping it with the first unsorted element." },
      { qType: "MCQ", qId: "CSE_106_8", qDesc: "Radix sort sorts based on?", choices: ["Comparison", "Digits/Keys", "Pivots", "Heaps"], correctAns: "Digits/Keys", explanation: "Radix sort is a non-comparative sorting algorithm that groups elements by their individual digits or bits." }
    ]
  },
  {
    category: "CSE",
    course: "Computer Science Engineering",
    video: "Topic 107 Video",
    chapterId: 107,
    chapterName: "Search Algorithms",
    year: 1,
    semester: 2,
    subject: "Data Structures",
    questions: [
      { qType: "MCQ", qId: "CSE_107_1", qDesc: "Complexity of Linear Search?", choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctAns: "O(n)", explanation: "Linear search checks every element one by one from the beginning, so in the worst case, it takes time proportional to the number of elements N." },
      { qType: "MCQ", qId: "CSE_107_2", qDesc: "Binary Search requires array to be?", choices: ["Unsorted", "Sorted", "Small", "Empty"], correctAns: "Sorted", explanation: "Binary search works by repeatedly halving the search range, which is only possible if the data is ordered." },
      { qType: "MCQ", qId: "CSE_107_3", qDesc: "Complexity of Binary Search?", choices: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctAns: "O(log n)", explanation: "Because binary search halves the search space at each step, it reaches the target in logarithmic time O(log n)." },
      { qType: "MCQ", qId: "CSE_107_4", qDesc: "Worst case for Binary Search?", choices: ["Middle", "Not present", "First", "Any"], correctAns: "Not present", explanation: "The absolute worst case is when the item isn't in the list at all, requiring the maximum number of splits." },
      { qType: "MCQ", qId: "CSE_107_5", qDesc: "Linear search works on?", choices: ["Arrays", "Linked Lists", "Both", "Only Sorted"], correctAns: "Both", explanation: "Since it only requires sequential access, linear search can be applied to any linear collection like arrays or linked lists." },
      { qType: "MCQ", qId: "CSE_107_6", qDesc: "Searching in a hash table takes (avg)?", choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctAns: "O(1)", explanation: "Hash tables facilitate average constant time O(1) lookups by mapping keys directly to memory buckets." },
      { qType: "MCQ", qId: "CSE_107_7", qDesc: "Binary search uses which approach?", choices: ["Greedy", "Dynamic", "Divide & Conquer", "Random"], correctAns: "Divide & Conquer", explanation: "Binary search 'divides' the problem into two halves and 'conquers' by focusing only on the relevant half." },
      { qType: "MCQ", qId: "CSE_107_8", qDesc: "Hashing collision solution?", choices: ["Chaining", "Linear Probing", "Both", "None"], correctAns: "Both", explanation: "Chaining (using linked lists) and Linear Probing (finding the next open slot) are standard ways to handle hash collisions." }
    ]
  },

  // --- ECE TOPICS (201-204) ---
  {
    category: "ECE",
    course: "Electronics & Communication",
    video: "Topic 201 Video",
    chapterId: 201,
    chapterName: "Logic Gates",
    year: 2,
    semester: 1,
    subject: "Switching Theory & Logic Design",
    questions: [
      { qType: "MCQ", qId: "ECE_201_1", qDesc: "Which gate inverts input?", choices: ["AND", "OR", "NOT", "XOR"], correctAns: "NOT", explanation: "The NOT gate (inverter) always outputs the opposite of its input bit." },
      { qType: "MCQ", qId: "ECE_201_2", qDesc: "AND gate output is HIGH when?", choices: ["All HIGH", "One HIGH", "All LOW", "None"], correctAns: "All HIGH", explanation: "For an AND gate, the output is only boolean 1 (HIGH) if every single input is also HIGH." },
      { qType: "MCQ", qId: "ECE_201_3", qDesc: "Which is a Universal Gate?", choices: ["AND", "XOR", "NAND", "OR"], correctAns: "NAND", explanation: "NAND and NOR are universal because any other logic gate (AND, OR, NOT) can be constructed using just these gates." },
      { qType: "MCQ", qId: "ECE_201_4", qDesc: "Bits in a Nibble?", choices: ["4", "8", "16", "2"], correctAns: "4", explanation: "A nibble is a four-bit aggregation, or half an octet (byte)." },
      { qType: "MCQ", qId: "ECE_201_5", qDesc: "Exclusive OR gate symbol?", choices: ["AND", "XOR", "NOR", "NOT"], correctAns: "XOR", explanation: "The XOR gate outputs HIGH only when the inputs are different (one HIGH, one LOW)." },
      { qType: "MCQ", qId: "ECE_201_6", qDesc: "Binary (1010) in Decimal?", choices: ["8", "10", "12", "14"], correctAns: "10", explanation: "Binary 1010 is calculated as (1*2^3) + (0*2^2) + (1*2^1) + (0*2^0) = 8 + 0 + 2 + 0 = 10." },
      { qType: "MCQ", qId: "ECE_201_7", qDesc: "OR gate output is LOW when?", choices: ["All LOW", "All HIGH", "One HIGH", "None"], correctAns: "All LOW", explanation: "An OR gate output is LOW (0) only if every input is LOW; otherwise, it is HIGH." },
      { qType: "MCQ", qId: "ECE_201_8", qDesc: "Gray code is also called...?", choices: ["Binary", "ASCII", "Unit Distance Code", "None"], correctAns: "Unit Distance Code", explanation: "Gray code is a unit distance code because only one bit changes at a time between successive values." }
    ]
  },
  {
    category: "ECE",
    course: "Electronics & Communication",
    video: "Topic 202 Video",
    chapterId: 202,
    chapterName: "Combinational Circuits",
    year: 2,
    semester: 1,
    subject: "Switching Theory & Logic Design",
    questions: [
      { qType: "MCQ", qId: "ECE_202_1", qDesc: "Circuit that adds two bits?", choices: ["Full Adder", "Half Adder", "MUX", "DEMUX"], correctAns: "Half Adder", explanation: "A Half Adder performs the addition of two binary bits and produces 'Sum' and 'Carry' outputs." },
      { qType: "MCQ", qId: "ECE_202_2", qDesc: "How many inputs in a Full Adder?", choices: ["1", "2", "3", "4"], correctAns: "3", explanation: "A Full Adder takes three inputs: two significant bits and an incoming carry bit from a previous stage." },
      { qType: "MCQ", qId: "ECE_202_3", qDesc: "Data selector is another name for?", choices: ["Encoder", "Decoder", "Multiplexer", "Comparator"], correctAns: "Multiplexer", explanation: "A Multiplexer (MUX) is called a data selector because it selects one input from many and forwards it to a single output line." },
      { qType: "MCQ", qId: "ECE_202_4", qDesc: "Circuit with many inputs one output?", choices: ["DEMUX", "MUX", "Decoder", "Register"], correctAns: "MUX", explanation: "Multiplexers handle N inputs and use select lines to determine which one is passed to the single output." },
      { qType: "MCQ", qId: "ECE_202_5", qDesc: "A 4-to-1 MUX has how many select lines?", choices: ["1", "2", "3", "4"], correctAns: "2", explanation: "The number of select lines S required for N inputs is 2^S = N. Since 2^2 = 4, 2 select lines are needed." },
      { qType: "MCQ", qId: "ECE_202_6", qDesc: "Opposite of Encoder?", choices: ["MUX", "Decoder", "Flip Flop", "Latch"], correctAns: "Decoder", explanation: "While an encoding circuit converts 2^N inputs to N bits, a decoder converts N bits back into 2^N unique outputs." },
      { qType: "MCQ", qId: "ECE_202_7", qDesc: "Which circuit compares two magnitudes?", choices: ["Adder", "Comparator", "Subtractor", "ALU"], correctAns: "Comparator", explanation: "A digital comparator takes two binary numbers and determines if one is greater than, less than, or equal to the other." },
      { qType: "MCQ", qId: "ECE_202_8", qDesc: "BCD to 7-segment is a...?", choices: ["Encoder", "Decoder", "MUX", "DEMUX"], correctAns: "Decoder", explanation: "This circuit decodes a 4-bit binary-coded decimal (BCD) into the 7-segment display patterns for decimal digits 0-9." }
    ]
  },
  {
    category: "ECE",
    course: "Electronics & Communication",
    video: "Topic 203 Video",
    chapterId: 203,
    chapterName: "8085 Architecture",
    year: 2,
    semester: 1,
    subject: "Switching Theory & Logic Design",
    questions: [
      { qType: "MCQ", qId: "ECE_203_1", qDesc: "8085 is a how many bit processor?", choices: ["4", "8", "16", "32"], correctAns: "8", explanation: "The Intel 8085 is an 8-bit general-purpose microprocessor capable of addressing 64 KB of memory." },
      { qType: "MCQ", qId: "ECE_203_2", qDesc: "Address bus size of 8085?", choices: ["8 bit", "16 bit", "20 bit", "32 bit"], correctAns: "16 bit", explanation: "The 8085 has a 16-bit address bus, which allows it to address up to 2^16 = 65,536 (64K) memory locations." },
      { qType: "MCQ", qId: "ECE_203_3", qDesc: "Which is the 8-bit accumulator?", choices: ["B", "C", "A", "H"], correctAns: "A", explanation: "The 'A' register is the accumulator, which is the primary register used for arithmetic and logical operations." },
      { qType: "MCQ", qId: "ECE_203_4", qDesc: "Number of flags in 8085?", choices: ["3", "5", "8", "10"], correctAns: "5", explanation: "The 8085 flag register contains 5 flags: Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), and Carry (CY)." },
      { qType: "MCQ", qId: "ECE_203_5", qDesc: "Stack pointer is a...?", choices: ["8 bit", "16 bit", "Register", "Bus"], correctAns: "16 bit", explanation: "The Stack Pointer (SP) is a 16-bit register that stores the address of the last byte entered into the stack." },
      { qType: "MCQ", qId: "ECE_203_6", qDesc: "Which is a non-maskable interrupt?", choices: ["RST 7.5", "TRAP", "INTR", "RST 5.5"], correctAns: "TRAP", explanation: "TRAP is the only non-maskable interrupt in the 8085, meaning its execution cannot be disabled by program control." },
      { qType: "MCQ", qId: "ECE_203_7", qDesc: "Number of pins in 8085?", choices: ["20", "40", "64", "100"], correctAns: "40", explanation: "The 8085 is a 40-pin Dual In-line Package (DIP) integrated circuit." },
      { qType: "MCQ", qId: "ECE_203_8", qDesc: "ALU stands for?", choices: ["All Logic Unit", "Arithmetic Logic Unit", "Analog Local Unit", "None"], correctAns: "Arithmetic Logic Unit", explanation: "ALU stands for Arithmetic Logic Unit, the part of the CPU responsible for mathematical calculations and logical decisions." }
    ]
  },
  {
    category: "ECE",
    course: "Electronics & Communication",
    video: "Topic 204 Video",
    chapterId: 204,
    chapterName: "Instruction Sets",
    year: 2,
    semester: 1,
    subject: "Switching Theory & Logic Design",
    questions: [
      { qType: "MCQ", qId: "ECE_204_1", qDesc: "MOV A, B is which type?", choices: ["Data Transfer", "Arithmetic", "Logical", "Branching"], correctAns: "Data Transfer", explanation: "MOV (Move) instructions are used to transfer data between registers or between memory and registers." },
      { qType: "MCQ", qId: "ECE_204_2", qDesc: "ADD B instruction affects?", choices: ["Accumulator", "Flags", "Both", "None"], correctAns: "Both", explanation: "Arithmetic instructions like ADD update the result in the accumulator and reflect the outcome status in the flag register." },
      { qType: "MCQ", qId: "ECE_204_3", qDesc: "MVI A, 32H is...?", choices: ["Immediate", "Direct", "Indirect", "Implied"], correctAns: "Immediate", explanation: "MVI (Move Immediate) includes the actual data 32H within the instruction opcode itself." },
      { qType: "MCQ", qId: "ECE_204_4", qDesc: "Which skips current execution?", choices: ["HLT", "NOP", "JMP", "CALL"], correctAns: "NOP", explanation: "NOP (No Operation) performs no function except to consume one machine cycle for timing delays." },
      { qType: "MCQ", qId: "ECE_204_5", qDesc: "CMA instruction performs?", choices: ["1's complement", "2's complement", "ADD", "SUB"], correctAns: "1's complement", explanation: "CMA (Complement Accumulator) flips every bit in the accumulator (0 to 1 and vice versa)." },
      { qType: "MCQ", qId: "ECE_204_6", qDesc: "Logical AND instruction?", choices: ["ANA", "ORA", "XRA", "INR"], correctAns: "ANA", explanation: "ANA (AND Accumulator) performs a bitwise AND operation between the accumulator and a specified register or memory location." },
      { qType: "MCQ", qId: "ECE_204_7", qDesc: "Instruction used for subroutines?", choices: ["JMP", "CALL", "RET", "Both CALL & RET"], correctAns: "Both CALL & RET", explanation: "CALL is used to jump to a subroutine, and RET is used to return to the main program after the subroutine finishes." },
      { qType: "MCQ", qId: "ECE_204_8", qDesc: "Addressing mode of MOV A, M?", choices: ["Register", "Direct", "Register Indirect", "Immediate"], correctAns: "Register Indirect", explanation: "MOV A, M uses the HL register pair as a pointer to memory, which is known as register indirect addressing." }
    ]
  },

  // --- MECHANICAL TOPICS (301-304) ---
  {
    category: "Mechanical",
    course: "Mechanical Engineering",
    video: "Topic 301 Video",
    chapterId: 301,
    chapterName: "Laws of Thermodynamics",
    year: 2,
    semester: 1,
    subject: "Thermodynamics",
    questions: [
      { qType: "MCQ", qId: "MECH_301_1", qDesc: "First law relates to?", choices: ["Entropy", "Enthalpy", "Energy conservation", "Mass"], correctAns: "Energy conservation", explanation: "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another." },
      { qType: "MCQ", qId: "MECH_301_2", qDesc: "Law defining Temperature?", choices: ["1st", "2nd", "3rd", "Zeroth"], correctAns: "Zeroth", explanation: "The Zeroth Law states that if two systems are in thermal equilibrium with a third system, they are in equilibrium with each other, defining temperature." },
      { qType: "MCQ", qId: "MECH_301_3", qDesc: "Concept introduced by 2nd Law?", choices: ["Heat", "Work", "Entropy", "Volume"], correctAns: "Entropy", explanation: "The Second Law introduces entropy as a measure of system disorder and dictates the direction of spontaneous processes." },
      { qType: "MCQ", qId: "MECH_301_4", qDesc: "Unit of Entropy?", choices: ["J/K", "W", "Pa", "N"], correctAns: "J/K", explanation: "Entropy is defined as heat transfer divided by temperature, so its SI unit is Joules per Kelvin (J/K)." },
      { qType: "MCQ", qId: "MECH_301_5", qDesc: "Process with constant Volume?", choices: ["Isothermal", "Isochoric", "Isobaric", "Adiabatic"], correctAns: "Isochoric", explanation: "An isochoric (or isovolumetric) process is one in which the volume of the system remains constant." },
      { qType: "MCQ", qId: "MECH_301_6", qDesc: "No heat transfer process?", choices: ["Adiabatic", "Isentropic", "Both", "None"], correctAns: "Both", explanation: "An adiabatic process has no heat transfer (Q=0). An isentropic process is both adiabatic and reversible." },
      { qType: "MCQ", qId: "MECH_301_7", qDesc: "Ideal gas equation?", choices: ["PV=nRT", "P/V=T", "PV=Constant", "None"], correctAns: "PV=nRT", explanation: "The ideal gas law relates pressure (P), volume (V), amount (n), and temperature (T) using the universal gas constant R." },
      { qType: "MCQ", qId: "MECH_301_8", qDesc: "Entropy of universe always...?", choices: ["Decreases", "Increases", "Stays constant", "Zeroes"], correctAns: "Increases", explanation: "According to the Second Law, the total entropy of an isolated system (like the universe) can never decrease over time." }
    ]
  },
  {
    category: "Mechanical",
    course: "Mechanical Engineering",
    video: "Topic 302 Video",
    chapterId: 302,
    chapterName: "IC Engines",
    year: 2,
    semester: 2,
    subject: "Thermal Engineering I",
    questions: [
      { qType: "MCQ", qId: "MECH_302_1", qDesc: "IC engine stands for?", choices: ["Internal Combustion", "Initial Core", "Inner Cool", "None"], correctAns: "Internal Combustion", explanation: "IC stands for Internal Combustion, where the burning of fuel occurs inside the engine's main body." },
      { qType: "MCQ", qId: "MECH_302_2", qDesc: "Cycle used in Petrol engines?", choices: ["Diesel", "Otto", "Rankine", "Carnot"], correctAns: "Otto", explanation: "Petrol (SI) engines operate on the Otto cycle, which consists of isochoric heat addition and rejection." },
      { qType: "MCQ", qId: "MECH_302_3", qDesc: "Cycle used in Diesel engines?", choices: ["Otto", "Diesel", "Dual", "Stirling"], correctAns: "Diesel", explanation: "Diesel (CI) engines operate on the Diesel cycle, characterized by constant pressure heat addition." },
      { qType: "MCQ", qId: "MECH_302_4", qDesc: "Engine where ignition is by a spark?", choices: ["CI Engine", "SI Engine", "Steam", "Gas turbine"], correctAns: "SI Engine", explanation: "SI stands for Spark Ignition. These engines use a spark plug to ignite the air-fuel mixture." },
      { qType: "MCQ", qId: "MECH_302_5", qDesc: "Compression ratio for Petrol?", choices: ["6-10", "15-20", "20-30", "1-2"], correctAns: "6-10", explanation: "Petrol engines have lower compression ratios (usually 6 to 10) to prevent pre-ignition or 'knocking'." },
      { qType: "MCQ", qId: "MECH_302_6", qDesc: "Compression ratio for Diesel?", choices: ["6-10", "15-25", "2-5", "100"], correctAns: "15-25", explanation: "Diesel engines require high compression ratios (15 to 25) to generate enough heat for compression ignition." },
      { qType: "MCQ", qId: "MECH_302_7", qDesc: "The strokes in 4-stroke engine occur in?", choices: ["1 rev", "2 rev", "3 rev", "4 rev"], correctAns: "2 rev", explanation: "In a 4-stroke engine, one complete cycle (Suction, Compression, Power, Exhaust) takes two revolutions of the crankshaft." },
      { qType: "MCQ", qId: "MECH_302_8", qDesc: "Purpose of Flywheel?", choices: ["Storage of Energy", "Cooling", "Lubrication", "Starting"], correctAns: "Storage of Energy", explanation: "A flywheel stores rotational energy during the power stroke and releases it during the other three strokes to maintain smooth motion." }
    ]
  },
  {
    category: "Mechanical",
    course: "Mechanical Engineering",
    video: "Topic 303 Video",
    chapterId: 303,
    chapterName: "Fluid Properties",
    year: 2,
    semester: 1,
    subject: "Fluid Mechanics",
    questions: [
      { qType: "MCQ", qId: "MECH_303_1", qDesc: "Resistance of fluid to flow?", choices: ["Density", "Viscosity", "Surface Tension", "Pressure"], correctAns: "Viscosity" },
      { qType: "MCQ", qId: "MECH_303_2", qDesc: "Unit of Kinematic Viscosity?", choices: ["Stoke", "Poise", "Pascal", "Newton"], correctAns: "Stoke" },
      { qType: "MCQ", qId: "MECH_303_3", qDesc: "Fluid with no viscosity is?", choices: ["Ideal", "Real", "Newtonian", "Non-Newtonian"], correctAns: "Ideal" },
      { qType: "MCQ", qId: "MECH_303_4", qDesc: "Density of Water (kg/m3)?", choices: ["100", "500", "1000", "10000"], correctAns: "1000" },
      { qType: "MCQ", qId: "MECH_303_5", qDesc: "Mass per unit Volume is?", choices: ["Weight", "Density", "Gravity", "Pressure"], correctAns: "Density" },
      { qType: "MCQ", qId: "MECH_303_6", qDesc: "Surface tension is caused by?", choices: ["Cohesion", "Adhesion", "Gravity", "Friction"], correctAns: "Cohesion" },
      { qType: "MCQ", qId: "MECH_303_7", qDesc: "Capillary rise is due to?", choices: ["Adhesion", "Cohesion", "Both", "None"], correctAns: "Both" },
      { qType: "MCQ", qId: "MECH_303_8", qDesc: "Specific gravity of Mercury?", choices: ["1", "13.6", "0.8", "5"], correctAns: "13.6" }
    ]
  },
  {
    category: "Mechanical",
    course: "Mechanical Engineering",
    video: "Topic 304 Video",
    chapterId: 304,
    chapterName: "Bernoulli's Principle",
    year: 2,
    semester: 1,
    subject: "Fluid Mechanics",
    questions: [
      { qType: "MCQ", qId: "MECH_304_1", qDesc: "Bernoulli's relates energy in?", choices: ["Solids", "Gases", "Fluids", "Heat"], correctAns: "Fluids" },
      { qType: "MCQ", qId: "MECH_304_2", qDesc: "Flow type Bernoulli's assume?", choices: ["Laminar", "Turbulent", "Steady/Incompressible", "Random"], correctAns: "Steady/Incompressible" },
      { qType: "MCQ", qId: "MECH_304_3", qDesc: "Sum of Pressure, Kinetic, Potential energy is?", choices: ["Varying", "Zero", "Constant", "Infinite"], correctAns: "Constant" },
      { qType: "MCQ", qId: "MECH_304_4", qDesc: "Venturimeter measures?", choices: ["Pressure", "Density", "Discharge", "Force"], correctAns: "Discharge" },
      { qType: "MCQ", qId: "MECH_304_5", qDesc: "Orifice meter is used for?", choices: ["Viscosity", "Velocity", "Discharge", "Temp"], correctAns: "Discharge" },
      { qType: "MCQ", qId: "MECH_304_6", qDesc: "Pitot tube measures?", choices: ["Pressure", "Static Head", "Velocity", "Flow"], correctAns: "Velocity" },
      { qType: "MCQ", qId: "MECH_304_7", qDesc: "Pressure head unit?", choices: ["m", "kg", "Pa", "Watt"], correctAns: "m" },
      { qType: "MCQ", qId: "MECH_304_8", qDesc: "Euler's equation is based on?", choices: ["Newton's 2nd Law", "Mass", "Entropy", "Work"], correctAns: "Newton's 2nd Law" }
    ]
  },

  // --- CIVIL TOPICS (401-404) ---
  {
    category: "Civil",
    course: "Civil Engineering",
    video: "Topic 401 Video",
    chapterId: 401,
    chapterName: "Chain Surveying",
    year: 2,
    semester: 1,
    subject: "Surveying",
    questions: [
      { qType: "MCQ", qId: "CIVIL_401_1", qDesc: "Principle of surveying?", choices: ["Part to Whole", "Whole to Part", "Line to Point", "None"], correctAns: "Whole to Part" },
      { qType: "MCQ", qId: "CIVIL_401_2", qDesc: "Length of Gunter's Chain?", choices: ["33ft", "66ft", "100ft", "20m"], correctAns: "66ft" },
      { qType: "MCQ", qId: "CIVIL_401_3", qDesc: "Modular brick size?", choices: ["19x9x9 cm", "20x10x10 cm", "23x11x7 cm", "None"], correctAns: "19x9x9 cm" },
      { qType: "MCQ", qId: "CIVIL_401_4", qDesc: "Angle between meridian and line?", choices: ["Dip", "Bearing", "Azimuth", "Declination"], correctAns: "Bearing" },
      { qType: "MCQ", qId: "CIVIL_401_5", qDesc: "Instrument for right angles?", choices: ["Cross staff", "Chain", "Level", "Prism"], correctAns: "Cross staff" },
      { qType: "MCQ", qId: "CIVIL_401_6", qDesc: "Equal elevation line?", choices: ["Contour", "Grade", "Slope", "Datum"], correctAns: "Contour" },
      { qType: "MCQ", qId: "CIVIL_401_7", qDesc: "Ratio of stress/strain?", choices: ["Elasticity", "Plasticity", "Ductility", "None"], correctAns: "Elasticity" },
      { qType: "MCQ", qId: "CIVIL_401_8", qDesc: "Survey for land boundaries?", choices: ["Topographical", "Cadastral", "Mining", "Hydrographic"], correctAns: "Cadastral" }
    ]
  },
  {
    category: "Civil",
    course: "Civil Engineering",
    video: "Topic 402 Video",
    chapterId: 402,
    chapterName: "Theodolite & Leveling",
    year: 2,
    semester: 1,
    subject: "Surveying",
    questions: [
      { qType: "MCQ", qId: "CIVIL_402_1", qDesc: "Theodolite measures which angles?", choices: ["Horizontal", "Vertical", "Both", "None"], correctAns: "Both" },
      { qType: "MCQ", qId: "CIVIL_402_2", qDesc: "Size of theodolite is specified by?", choices: ["Height", "Weight", "Lower Plate Dia", "Upper Plate Dia"], correctAns: "Lower Plate Dia" },
      { qType: "MCQ", qId: "CIVIL_402_3", qDesc: "Process of rotating telescope 180 deg?", choices: ["Swinging", "Transiting", "Plunging", "Both Transit & Plunge"], correctAns: "Both Transit & Plunge" },
      { qType: "MCQ", qId: "CIVIL_402_4", qDesc: "Leveling determines relative...?", choices: ["Distances", "Heights/Elevations", "Angels", "Azimuths"], correctAns: "Heights/Elevations" },
      { qType: "MCQ", qId: "CIVIL_402_5", qDesc: "Back sight is the first reading after?", choices: ["Level set", "Last reading", "Turning point", "Ending"], correctAns: "Level set" },
      { qType: "MCQ", qId: "CIVIL_402_6", qDesc: "Rise and Fall method is for?", choices: ["Angels", "Elevation Calc", "Chain", "None"], correctAns: "Elevation Calc" },
      { qType: "MCQ", qId: "CIVIL_402_7", qDesc: "Bench mark is a point of known?", choices: ["Distance", "Elevation", "Slope", "Density"], correctAns: "Elevation" },
      { qType: "MCQ", qId: "CIVIL_402_8", qDesc: "Temporary adjustment of theodolite?", choices: ["Centering", "Leveling", "Parallax removal", "All of the above"], correctAns: "All of the above" }
    ]
  },
  {
    category: "Civil",
    course: "Civil Engineering",
    video: "Topic 403 Video",
    chapterId: 403,
    chapterName: "Beams & Columns",
    year: 2,
    semester: 1,
    subject: "Strength of Materials I",
    questions: [
      { qType: "MCQ", qId: "CIVIL_403_1", qDesc: "Structural member subjected to bending?", choices: ["Column", "Tension member", "Beam", "Truss"], correctAns: "Beam" },
      { qType: "MCQ", qId: "CIVIL_403_2", qDesc: "Column subjected to axial compression?", choices: ["Short Column", "Long Column", "Both", "None"], correctAns: "Both" },
      { qType: "MCQ", qId: "CIVIL_403_3", qDesc: "Bending moment is maximum at?", choices: ["Ends", "Support", "Point where SF is zero", "Center"], correctAns: "Point where SF is zero" },
      { qType: "MCQ", qId: "CIVIL_403_4", qDesc: "Unit of Moment of Inertia?", choices: ["m2", "m3", "m4", "m"], correctAns: "m4" },
      { qType: "MCQ", qId: "CIVIL_403_5", qDesc: "Pure bending occurs when?", choices: ["SF is zero", "BM is zero", "Torque added", "None"], correctAns: "SF is zero" },
      { qType: "MCQ", qId: "CIVIL_403_6", qDesc: "Long columns fail by?", choices: ["Crushing", "Buckling", "Tension", "Shear"], correctAns: "Buckling" },
      { qType: "MCQ", qId: "CIVIL_403_7", qDesc: "Short columns fail by?", choices: ["Crushing", "Buckling", "Elasticity", "None"], correctAns: "Crushing" },
      { qType: "MCQ", qId: "CIVIL_403_8", qDesc: "Cantilever beam is fixed at?", choices: ["One end", "Both ends", "Multiple points", "Nowhere"], correctAns: "One end" }
    ]
  },
  {
    category: "Civil",
    course: "Civil Engineering",
    video: "Topic 404 Video",
    chapterId: 404,
    chapterName: "Truss Design",
    year: 2,
    semester: 2,
    subject: "Structural Analysis I",
    questions: [
      { qType: "MCQ", qId: "CIVIL_404_1", qDesc: "Truss is a framework of...?", choices: ["Rigid rods", "Flexible cables", "Flat plates", "Walls"], correctAns: "Rigid rods" },
      { qType: "MCQ", qId: "CIVIL_404_2", qDesc: "Ideal truss assumes joints are?", choices: ["Fixed", "Pinned", "Welded", "Sliding"], correctAns: "Pinned" },
      { qType: "MCQ", qId: "CIVIL_404_3", qDesc: "Truss subjected to loads at?", choices: ["Midpoint", "Joints only", "Bottom only", "Ends"], correctAns: "Joints only" },
      { qType: "MCQ", qId: "CIVIL_404_4", qDesc: "Method of joints uses which laws?", choices: ["Newton's", "Equilibrium", "Laws of motion", "None"], correctAns: "Equilibrium" },
      { qType: "MCQ", qId: "CIVIL_404_5", qDesc: "A perfectly rigid truss should satisfy?", choices: ["m = 2j - 3", "m = 3j - 2", "j = 2m - 3", "None"], correctAns: "m = 2j - 3" },
      { qType: "MCQ", qId: "CIVIL_404_6", qDesc: "Member in tension is a...?", choices: ["Tie", "Strut", "Column", "Support"], correctAns: "Tie" },
      { qType: "MCQ", qId: "CIVIL_404_7", qDesc: "Member in compression is a...?", choices: ["Tie", "Strut", "Beam", "Hinge"], correctAns: "Strut" },
      { qType: "MCQ", qId: "CIVIL_404_8", qDesc: "Roof truss provides coverage for?", choices: ["Walls", "Span", "Foundation", "Stairs"], correctAns: "Span" }
    ]
  },

  // --- EEE TOPICS (501-504) ---
  {
    category: "EEE",
    course: "Electrical & Electronics",
    video: "Topic 501 Video",
    chapterId: 501,
    chapterName: "Circuit Laws",
    year: 1,
    semester: 2,
    subject: "Electrical Circuit Analysis I",
    questions: [
      { qType: "MCQ", qId: "EEE_501_1", qDesc: "Unit of Power?", choices: ["Ampere", "Volt", "Watt", "Ohm"], correctAns: "Watt" },
      { qType: "MCQ", qId: "EEE_501_2", qDesc: "KCL conservation of?", choices: ["Energy", "Mass", "Charge", "Flux"], correctAns: "Charge" },
      { qType: "MCQ", qId: "EEE_501_3", qDesc: "Ideal Voltmeter Resistance?", choices: ["Zero", "100", "Infinite", "1"], correctAns: "Infinite" },
      { qType: "MCQ", qId: "EEE_501_4", qDesc: "Ohm's Law valid for?", choices: ["Semis", "Conductors", "Diodes", "None"], correctAns: "Conductors" },
      { qType: "MCQ", qId: "EEE_501_5", qDesc: "Unit of Capacitance?", choices: ["Farad", "Henry", "Tesla", "Ohm"], correctAns: "Farad" },
      { qType: "MCQ", qId: "EEE_501_6", qDesc: "Transformer principle?", choices: ["Self Induction", "Mutual Induction", "Static", "Dynamic"], correctAns: "Mutual Induction" },
      { qType: "MCQ", qId: "EEE_501_7", qDesc: "Highest conductivity?", choices: ["Cu", "Au", "Ag", "Al"], correctAns: "Ag" },
      { qType: "MCQ", qId: "EEE_501_8", qDesc: "Power factor Pure Inductive?", choices: ["1", "0", "0.5", "None"], correctAns: "0" }
    ]
  },
  {
    category: "EEE",
    course: "Electrical & Electronics",
    video: "Topic 502 Video",
    chapterId: 502,
    chapterName: "Network Theorems",
    year: 1,
    semester: 2,
    subject: "Electrical Circuit Analysis I",
    questions: [
      { qType: "MCQ", qId: "EEE_502_1", qDesc: "Thevenin's voltage is open circuit?", choices: ["Yes", "No", "Depends", "None"], correctAns: "Yes" },
      { qType: "MCQ", qId: "EEE_502_2", qDesc: "Norton's current is short circuit?", choices: ["Yes", "No", "Always", "Yes"], correctAns: "Yes" },
      { qType: "MCQ", qId: "EEE_502_3", qDesc: "Superposition theorem applies to?", choices: ["Linear", "Non-linear", "Both", "None"], correctAns: "Linear" },
      { qType: "MCQ", qId: "EEE_502_4", qDesc: "Max Power Transfer when Rl equals?", choices: ["Rth", "2Rth", "Zero", "Infinity"], correctAns: "Rth" },
      { qType: "MCQ", qId: "EEE_502_5", qDesc: "Thevenin's theorem equivalent is a voltage source and...?", choices: ["Series Res", "Parallel Res", "Capacitor", "None"], correctAns: "Series Res" },
      { qType: "MCQ", qId: "EEE_502_6", qDesc: "Norton's equivalent uses?", choices: ["Parallel Res", "Series Res", "Inductor", "Hinge"], correctAns: "Parallel Res" },
      { qType: "MCQ", qId: "EEE_502_7", qDesc: "Reciprocity theorem is for?", choices: ["Active networks", "Passive networks", "Single source", "None"], correctAns: "Single source" },
      { qType: "MCQ", qId: "EEE_502_8", qDesc: "Nodal analysis uses which law?", choices: ["KVL", "KCL", "Faraday's", "Lenz's"], correctAns: "KCL" }
    ]
  },
  {
    category: "EEE",
    course: "Electrical & Electronics",
    video: "Topic 503 Video",
    chapterId: 503,
    chapterName: "Power Generation",
    year: 2,
    semester: 2,
    subject: "Power Systems I",
    questions: [
      { qType: "MCQ", qId: "EEE_503_1", qDesc: "Main source for Thermal Power?", choices: ["Coal", "Uranium", "Water", "Wind"], correctAns: "Coal" },
      { qType: "MCQ", qId: "EEE_503_2", qDesc: "Hydro Power converts which energy?", choices: ["Solar", "Potential/Kinetic", "Nuclear", "Chemical"], correctAns: "Potential/Kinetic" },
      { qType: "MCQ", qId: "EEE_503_3", qDesc: "Nuclear reactor fuel is?", choices: ["Uranium", "Petrol", "Natural Gas", "None"], correctAns: "Uranium" },
      { qType: "MCQ", qId: "EEE_503_4", qDesc: "Solar cells are made of?", choices: ["Silicon", "Aluminum", "Iron", "Gold"], correctAns: "Silicon" },
      { qType: "MCQ", qId: "EEE_503_5", qDesc: "Rankine cycle is for which plant?", choices: ["Nuclear", "Thermal", "Hydro", "Solar"], correctAns: "Thermal" },
      { qType: "MCQ", qId: "EEE_503_6", qDesc: "Wind energy is?", choices: ["Renewable", "Non-renewable", "Limited", "None"], correctAns: "Renewable" },
      { qType: "MCQ", qId: "EEE_503_7", qDesc: "Penstock is used in?", choices: ["Thermal", "Hydro", "Diesel", "None"], correctAns: "Hydro" },
      { qType: "MCQ", qId: "EEE_503_8", qDesc: "Moderator in nuclear plant is?", choices: ["Graphite/Water", "Steel", "Lead", "Coal"], correctAns: "Graphite/Water" }
    ]
  },
  {
    category: "EEE",
    course: "Electrical & Electronics",
    video: "Topic 504 Video",
    chapterId: 504,
    chapterName: "Transmission & Distribution",
    year: 2,
    semester: 2,
    subject: "Power Systems I",
    questions: [
      { qType: "MCQ", qId: "EEE_504_1", qDesc: "Primary transmission voltage is usually?", choices: ["Low", "Medium", "High/Extra High", "None"], correctAns: "High/Extra High" },
      { qType: "MCQ", qId: "EEE_504_2", qDesc: "Transmission conductors are usually?", choices: ["ACSR", "Copper", "Insulated", "None"], correctAns: "ACSR" },
      { qType: "MCQ", qId: "EEE_504_3", qDesc: "Distribution link between...?", choices: ["Plat-Grid", "Substation-Consumer", "Grid-Substation", "None"], correctAns: "Substation-Consumer" },
      { qType: "MCQ", qId: "EEE_504_4", qDesc: "Step-down transformers are used at?", choices: ["Generating plant", "Substations", "Consumers", "Grid"], correctAns: "Substations" },
      { qType: "MCQ", qId: "EEE_504_5", qDesc: "Inductance in lines causes?", choices: ["Voltage drop", "Reactance", "Both", "None"], correctAns: "Both" },
      { qType: "MCQ", qId: "EEE_504_6", qDesc: "Insulators used in lines are?", choices: ["Porcelain", "Rubber", "PVC", "Steel"], correctAns: "Porcelain" },
      { qType: "MCQ", qId: "EEE_504_7", qDesc: "Single phase distribution is for?", choices: ["Industry", "Domestic", "Traction", "None"], correctAns: "Domestic" },
      { qType: "MCQ", qId: "EEE_504_8", qDesc: "Skin effect is present in?", choices: ["DC", "AC", "Both", "None"], correctAns: "AC" }
    ]
  },

  // --- DIPLOMA TOPICS (601-602) ---
  {
    category: "Diploma",
    course: "Diploma Courses",
    video: "Topic 601 Video",
    chapterId: 601,
    chapterName: "Safety Procedures",
    year: 2,
    semester: 1,
    subject: "Safety Procedures",
    questions: [
      { qType: "MCQ", qId: "DIP_601_1", qDesc: "Which is a simple machine?", choices: ["Lever", "Car", "Laptop", "Engine"], correctAns: "Lever" },
      { qType: "MCQ", qId: "DIP_601_2", qDesc: "Safety sign color code RED?", choices: ["Warning", "Danger/Prohibition", "Safety", "Info"], correctAns: "Danger/Prohibition" },
      { qType: "MCQ", qId: "DIP_601_3", qDesc: "PPE stands for?", choices: ["Personal Protective Equip", "Power Port", "Public Prop", "None"], correctAns: "Personal Protective Equip" },
      { qType: "MCQ", qId: "DIP_601_4", qDesc: "Hand tool example?", choices: ["Screw", "Hammer", "Board", "Table"], correctAns: "Hammer" },
      { qType: "MCQ", qId: "DIP_601_5", qDesc: "SI unit of length?", choices: ["cm", "m", "km", "mile"], correctAns: "m" },
      { qType: "MCQ", qId: "DIP_601_6", qDesc: "Join two metals process?", choices: ["Welding", "Painting", "Cutting", "None"], correctAns: "Welding" },
      { qType: "MCQ", qId: "DIP_601_7", qDesc: "CO2 extinguisher for?", choices: ["Wood", "Paper", "Electrical", "Water"], correctAns: "Electrical" },
      { qType: "MCQ", qId: "DIP_601_8", qDesc: "Metric system base 10?", choices: ["Yes", "No", "Maybe", "Sometimes"], correctAns: "Yes" }
    ]
  },
  {
    category: "Diploma",
    course: "Diploma Courses",
    video: "Topic 602 Video",
    chapterId: 602,
    chapterName: "Measurement Tools",
    year: 2,
    semester: 1,
    subject: "Measurement Tools",
    questions: [
      { qType: "MCQ", qId: "DIP_602_1", qDesc: "Vernier Calliper measures?", choices: ["Internal/External dimensions", "Temperature", "Weight", "Speed"], correctAns: "Internal/External dimensions" },
      { qType: "MCQ", qId: "DIP_602_2", qDesc: "Least count of metric Micrometer?", choices: ["0.1 mm", "0.01 mm", "0.001 mm", "1 mm"], correctAns: "0.01 mm" },
      { qType: "MCQ", qId: "DIP_602_3", qDesc: "Tool for measuring very small gaps?", choices: ["Feeler gauge", "Ruler", "Tape", "Level"], correctAns: "Feeler gauge" },
      { qType: "MCQ", qId: "DIP_602_4", qDesc: "Compass is for measuring?", choices: ["Length", "Angles/Directions", "Depth", "Volume"], correctAns: "Angles/Directions" },
      { qType: "MCQ", qId: "DIP_602_5", qDesc: "Spirit level is for checking?", choices: ["Horizontalness", "Verticality", "Weight", "Both Horizontal/Vertical"], correctAns: "Both Horizontal/Vertical" },
      { qType: "MCQ", qId: "DIP_602_6", qDesc: "Try square is used to check?", choices: ["45 deg", "90 deg", "180 deg", "None"], correctAns: "90 deg" },
      { qType: "MCQ", qId: "DIP_602_7", qDesc: "The scale division on vernier is?", choices: ["Vernier Scale", "Main Scale", "Both", "Circular"], correctAns: "Both" },
      { qType: "MCQ", qId: "DIP_602_8", qDesc: "Anemometer measures?", choices: ["Wind Speed", "Draft", "Pressure", "Voltage"], correctAns: "Wind Speed" }
    ]
  },
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
    console.log(`Successfully seeded ${sampleQuestions.length} topic assessments with 8 questions each into MongoDB.`);

    console.log("Database seeded successfully!");
    return { success: true, message: `Inserted ${sampleQuestions.length} question sets` };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, message: error.message };
  }
};

export default seedDatabase;
