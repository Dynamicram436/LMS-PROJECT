import mongoose from "mongoose";
import dotenv from "dotenv";
import CourseStructure from "./models/courseStructureSchema.js";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const courseStructureData = [
    {
        branch: "CSE",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Mathematics I", "Physics", "Programming for Problem Solving", "Basic Electrical Engineering"] },
                    { semester: 2, subjects: ["Mathematics II", "Chemistry", "English", "Data Structures"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Digital Logic Design", "Mathematical Foundations of Computer Science", "Python Programming", "Java Programming"] },
                    { semester: 2, subjects: ["Computer Organization", "Database Management Systems", "Operating Systems", "Software Engineering"] }
                ]
            },
            {
                year: 3,
                semesters: [
                    { semester: 1, subjects: ["Computer Networks", "Web Technologies", "Formal Languages & Automata Theory", "Data Warehousing & Mining"] },
                    { semester: 2, subjects: ["Compiler Design", "Artificial Intelligence", "Information Security", "Machine Learning"] }
                ]
            },
            {
                year: 4,
                semesters: [
                    { semester: 1, subjects: ["Cloud Computing", "Big Data Analytics", "Cyber Security", "Internet of Things"] },
                    { semester: 2, subjects: ["Major Project", "Professional Ethics", "Distributed Systems"] }
                ]
            }
        ]
    },
    {
        branch: "ECE",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Mathematics I", "Physics", "C Programming", "Engineering Graphics"] },
                    { semester: 2, subjects: ["Mathematics II", "Chemistry", "Basic Electrical Engineering", "Network Analysis"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Electronic Devices & Circuits", "Signals & Systems", "Switching Theory & Logic Design", "Probability Theory"] },
                    { semester: 2, subjects: ["Analog Communications", "Pulse & Digital Circuits", "Control Systems", "EM Waves"] }
                ]
            }
        ]
    },
    {
        branch: "Mechanical",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Mathematics I", "Engineering Mechanics", "Engineering Graphics", "Physics"] },
                    { semester: 2, subjects: ["Mathematics II", "Chemistry", "Programming for Problem Solving", "Workshop Practice"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Thermodynamics", "Materials Science", "Mechanics of Solids", "Fluid Mechanics"] },
                    { semester: 2, subjects: ["Kinematics of Machinery", "Thermal Engineering I", "Manufacturing Processes", "Machine Drawing"] }
                ]
            }
        ]
    },
    {
        branch: "Civil",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Mathematics I", "Engineering Physics", "Engineering Mechanics", "English"] },
                    { semester: 2, subjects: ["Mathematics II", "Engineering Chemistry", "Computer Programming", "Engineering Graphics"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Strength of Materials I", "Surveying", "Building Materials & Construction", "Fluid Mechanics"] },
                    { semester: 2, subjects: ["Strength of Materials II", "Structural Analysis I", "Hydraulics", "Concrete Technology"] }
                ]
            }
        ]
    },
    {
        branch: "EEE",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Mathematics I", "Applied Physics", "C Programming", "Engineering Graphics"] },
                    { semester: 2, subjects: ["Mathematics II", "Chemistry", "Electrical Circuit Analysis I", "English"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Electrical Circuit Analysis II", "Electrical Machines I", "Electro Magnetic Fields", "Analog Electronics"] },
                    { semester: 2, subjects: ["Electrical Machines II", "Power Systems I", "Control Systems", "Digital Electronics"] }
                ]
            }
        ]
    },
    {
        branch: "Diploma",
        years: [
            {
                year: 1,
                semesters: [
                    { semester: 1, subjects: ["Basic Mathematics", "Basic Physics", "Basic Chemistry", "English"] },
                    { semester: 2, subjects: ["Applied Mathematics", "Applied Physics", "Applied Chemistry", "Engineering Drawing"] }
                ]
            },
            {
                year: 2,
                semesters: [
                    { semester: 1, subjects: ["Safety Procedures", "Measurement Tools", "Workshop Technology"] },
                    { semester: 2, subjects: ["Industrial Management", "Environmental Science"] }
                ]
            }
        ]
    }
];

const seedCourseStructure = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL || "mongodb+srv://bhargavramgomatham_db_user:436465@cluster0.lc2qwz1.mongodb.net/";
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to MongoDB");

        // Clear existing
        await CourseStructure.deleteMany({});
        console.log("Cleared existing course structures");

        // Insert new
        await CourseStructure.insertMany(courseStructureData);
        console.log(`Successfully seeded course structures for ${courseStructureData.length} branches.`);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedCourseStructure();
