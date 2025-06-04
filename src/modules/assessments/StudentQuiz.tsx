import React, { useState, useEffect } from 'react';
import './StudentQuiz.css';
import Navbar from "../home/Navbar.tsx";
import quizData from './Quizzes.json';

const StudentQuiz: React.FC = () => {
  const courseId = localStorage.getItem('courseID') || 'null';

  // State for all quizzes (from JSON and localStorage)
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Get quizzes from JSON file
    const jsonCourse = quizData.find(course => course.courseId === courseId);
    const jsonQuizzes = jsonCourse?.quizzes || [];

    // Get quizzes from localStorage (added by instructor)
    const localQuizzesRaw = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const localCourseQuiz = localQuizzesRaw.find((q: any) => q.courseId === courseId);
    const localQuizzes = localCourseQuiz?.questions || [];

    // Combine both
    const combined = [...jsonQuizzes, ...localQuizzes];
    setAllQuizzes(combined);
    setSelectedAnswers(Array(combined.length).fill(null));
  }, [courseId]);

  const handleOptionChange = (questionIndex: number, option: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    allQuizzes.forEach((q, index) => {
      // Support both correctAnswer (JSON) and answer (Instructor)
      const correct = q.correctAnswer || q.answer;
      if (selectedAnswers[index] === correct) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar role="student" />
      <div className="take-quiz-page">
        <div className="quiz-container second-color">
          {submitted ? (
            <div className="result-container">
              <h2>Quiz Submitted!</h2>
              <p>Your Score: <strong>{score}</strong> / {allQuizzes.length}</p>
            </div>
          ) : (
            <>
              <h2 className="quiz-title">Quiz</h2>
              {allQuizzes.length === 0 && <p>No quiz found for this course.</p>}
              {allQuizzes.map((q, index) => (
                <div key={index} className="question-container">
                  <h3 className="question-title">{index + 1}. {q.question}</h3>
                  {q.options && q.options.map((option: string, optIndex: number) => (
                    <label key={optIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => handleOptionChange(index, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              {allQuizzes.length > 0 && (
                <button onClick={handleSubmit} className="submit-button third-color">
                  Submit Quiz
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentQuiz;