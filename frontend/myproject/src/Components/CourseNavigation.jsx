import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  FileText,
  Target,
} from "lucide-react";

const CourseNavigation = ({ onTopicSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/course");
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (courseId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches`,
      );
      const data = await response.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async (courseId, branchId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years`,
      );
      const data = await response.json();
      if (data.success) {
        setYears(data.data);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (courseId, branchId, yearId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years/${yearId}/semesters`,
      );
      const data = await response.json();
      if (data.success) {
        setSemesters(data.data);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (courseId, branchId, yearId, semesterId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years/${yearId}/semesters/${semesterId}/subjects`,
      );
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (
    courseId,
    branchId,
    yearId,
    semesterId,
    subjectId,
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years/${yearId}/semesters/${semesterId}/subjects/${subjectId}/units`,
      );
      const data = await response.json();
      if (data.success) {
        setUnits(data.data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (
    courseId,
    branchId,
    yearId,
    semesterId,
    subjectId,
    unitId,
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years/${yearId}/semesters/${semesterId}/subjects/${subjectId}/units/${unitId}/chapters`,
      );
      const data = await response.json();
      if (data.success) {
        setChapters(data.data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (
    courseId,
    branchId,
    yearId,
    semesterId,
    subjectId,
    unitId,
    chapterId,
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/course/${courseId}/branches/${branchId}/years/${yearId}/semesters/${semesterId}/subjects/${subjectId}/units/${unitId}/chapters/${chapterId}/topics`,
      );
      const data = await response.json();
      if (data.success) {
        setTopics(data.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedBranch(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setTopics([]);
    fetchBranches(course.courseId);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setTopics([]);
    fetchYears(selectedCourse.courseId, branch.branchId);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setTopics([]);
    fetchSemesters(
      selectedCourse.courseId,
      selectedBranch.branchId,
      year.yearId,
    );
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setTopics([]);
    fetchSubjects(
      selectedCourse.courseId,
      selectedBranch.branchId,
      selectedYear.yearId,
      semester.semesterId,
    );
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setTopics([]);
    fetchUnits(
      selectedCourse.courseId,
      selectedBranch.branchId,
      selectedYear.yearId,
      selectedSemester.semesterId,
      subject.subjectId,
    );
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setSelectedChapter(null);
    setTopics([]);
    fetchChapters(
      selectedCourse.courseId,
      selectedBranch.branchId,
      selectedYear.yearId,
      selectedSemester.semesterId,
      selectedSubject.subjectId,
      unit.unitId,
    );
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setTopics([]);
    fetchTopics(
      selectedCourse.courseId,
      selectedBranch.branchId,
      selectedYear.yearId,
      selectedSemester.semesterId,
      selectedSubject.subjectId,
      selectedUnit.unitId,
      chapter.chapterId,
    );
  };

  const handleTopicSelect = (topic) => {
    const topicData = {
      course: selectedCourse,
      branch: selectedBranch,
      year: selectedYear,
      semester: selectedSemester,
      subject: selectedSubject,
      unit: selectedUnit,
      chapter: selectedChapter,
      topic: topic,
    };
    onTopicSelect(topicData);
  };

  const resetNavigation = () => {
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedChapter(null);
    setBranches([]);
    setYears([]);
    setSemesters([]);
    setSubjects([]);
    setUnits([]);
    setChapters([]);
    setTopics([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="text-blue-600" />
              Course Navigation
            </h1>
            {selectedCourse && (
              <button
                onClick={resetNavigation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            {selectedCourse && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedCourse.courseName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedBranch && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedBranch.branchName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedYear && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedYear.yearName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedSemester && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedSemester.semesterName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedSubject && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedSubject.subjectName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedUnit && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedUnit.unitName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
            {selectedChapter && (
              <>
                <span className="text-blue-600 font-medium">
                  {selectedChapter.chapterName}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
          </div>

          {/* Courses */}
          {!selectedCourse && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  onClick={() => handleCourseSelect(course)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <GraduationCap className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{course.courseName}</h3>
                  <p className="text-blue-100 mt-2">
                    {course.branches?.length || 0} branches available
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Branches */}
          {selectedCourse && !selectedBranch && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch.branchId}
                  onClick={() => handleBranchSelect(branch)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <BookOpen className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{branch.branchName}</h3>
                  <p className="text-green-100 mt-2">
                    {branch.years?.length || 0} years available
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Years */}
          {selectedBranch && !selectedYear && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {years.map((year) => (
                <div
                  key={year.yearId}
                  onClick={() => handleYearSelect(year)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Calendar className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{year.yearName}</h3>
                  <p className="text-purple-100 mt-2">
                    {year.semesters?.length || 0} semesters
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Semesters */}
          {selectedYear && !selectedSemester && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {semesters.map((semester) => (
                <div
                  key={semester.semesterId}
                  onClick={() => handleSemesterSelect(semester)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Layers className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{semester.semesterName}</h3>
                  <p className="text-orange-100 mt-2">
                    {semester.subjects?.length || 0} subjects
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Subjects */}
          {selectedSemester && !selectedSubject && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.subjectId}
                  onClick={() => handleSubjectSelect(subject)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <FileText className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{subject.subjectName}</h3>
                  <p className="text-cyan-100 mt-2">
                    {subject.units?.length || 0} units
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Units */}
          {selectedSubject && !selectedUnit && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit) => (
                <div
                  key={unit.unitId}
                  onClick={() => handleUnitSelect(unit)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Layers className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{unit.unitName}</h3>
                  <p className="text-indigo-100 mt-2">
                    {unit.chapters?.length || 0} chapters
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Chapters */}
          {selectedUnit && !selectedChapter && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <div
                  key={chapter.chapterId}
                  onClick={() => handleChapterSelect(chapter)}
                  className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <FileText className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{chapter.chapterName}</h3>
                  <p className="text-pink-100 mt-2">
                    {chapter.topics?.length || 0} topics
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Topics */}
          {selectedChapter && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <div
                  key={topic.topicId}
                  onClick={() => handleTopicSelect(topic)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                    topic.hasExam
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Target className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold">{topic.topicName}</h3>
                  <p
                    className={`mt-2 ${topic.hasExam ? "text-green-100" : "text-gray-500"}`}
                  >
                    {topic.hasExam ? "Exam Available" : "No Exam"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseNavigation;
