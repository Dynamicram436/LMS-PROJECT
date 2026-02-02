import Course from "./models/courseSchema.js";

const seedCourses = async () => {
  try {
    // Clear existing courses
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    const engineeringCourse = {
      courseId: "engineering",
      courseName: "Engineering",
      branches: [
        {
          branchId: "cse",
          branchName: "Computer Science Engineering",
          years: [
            {
              yearId: "year1",
              yearName: "1st Year",
              semesters: [
                {
                  semesterId: "sem1",
                  semesterName: "1st Semester",
                  subjects: [
                    {
                      subjectId: "math1",
                      subjectName: "Mathematics I",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Calculus",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Differential Calculus",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Limits and Continuity",
                                  hasExam: true
                                },
                                {
                                  topicId: "topic2",
                                  topicName: "Derivatives",
                                  hasExam: true
                                }
                              ]
                            },
                            {
                              chapterId: "ch2",
                              chapterName: "Integral Calculus",
                              topics: [
                                {
                                  topicId: "topic3",
                                  topicName: "Integration Techniques",
                                  hasExam: true
                                },
                                {
                                  topicId: "topic4",
                                  topicName: "Definite Integrals",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        },
                        {
                          unitId: "unit2",
                          unitName: "Linear Algebra",
                          chapters: [
                            {
                              chapterId: "ch3",
                              chapterName: "Matrices",
                              topics: [
                                {
                                  topicId: "topic5",
                                  topicName: "Matrix Operations",
                                  hasExam: true
                                },
                                {
                                  topicId: "topic6",
                                  topicName: "Determinants",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      subjectId: "physics1",
                      subjectName: "Physics I",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Mechanics",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Kinematics",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Motion in One Dimension",
                                  hasExam: true
                                },
                                {
                                  topicId: "topic2",
                                  topicName: "Motion in Two Dimensions",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  semesterId: "sem2",
                  semesterName: "2nd Semester",
                  subjects: [
                    {
                      subjectId: "math2",
                      subjectName: "Mathematics II",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Differential Equations",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "First Order ODEs",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Separable Equations",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              yearId: "year2",
              yearName: "2nd Year",
              semesters: [
                {
                  semesterId: "sem3",
                  semesterName: "3rd Semester",
                  subjects: [
                    {
                      subjectId: "ds",
                      subjectName: "Data Structures",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Arrays and Linked Lists",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Arrays",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Array Operations",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              yearId: "year3",
              yearName: "3rd Year",
              semesters: [
                {
                  semesterId: "sem5",
                  semesterName: "5th Semester",
                  subjects: [
                    {
                      subjectId: "algo",
                      subjectName: "Algorithms",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Sorting Algorithms",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Basic Sorting",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Bubble Sort",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              yearId: "year4",
              yearName: "4th Year",
              semesters: [
                {
                  semesterId: "sem7",
                  semesterName: "7th Semester",
                  subjects: [
                    {
                      subjectId: "ml",
                      subjectName: "Machine Learning",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Introduction to ML",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Basic Concepts",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Types of Learning",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          branchId: "ece",
          branchName: "Electronics and Communication Engineering",
          years: [
            {
              yearId: "year1",
              yearName: "1st Year",
              semesters: [
                {
                  semesterId: "sem1",
                  semesterName: "1st Semester",
                  subjects: [
                    {
                      subjectId: "ece_math1",
                      subjectName: "Mathematics I",
                      units: [
                        {
                          unitId: "unit1",
                          unitName: "Calculus",
                          chapters: [
                            {
                              chapterId: "ch1",
                              chapterName: "Differential Calculus",
                              topics: [
                                {
                                  topicId: "topic1",
                                  topicName: "Limits and Continuity",
                                  hasExam: true
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    await Course.create(engineeringCourse);
    console.log("Engineering course seeded successfully");

    return {
      success: true,
      message: "Courses seeded successfully"
    };
  } catch (error) {
    console.error("Error seeding courses:", error);
    return {
      success: false,
      message: "Error seeding courses",
      error: error.message
    };
  }
};

export default seedCourses;
