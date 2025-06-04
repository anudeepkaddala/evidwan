import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorQuiz.css';
import Navbar from "../home/Navbar.tsx";


interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  courseId: string;
  questions: Question[];
}

const InstructorQuiz: React.FC = () => {
  const courseId  = localStorage.getItem("courseID") || 'null';
  const [questions, setQuestions] = useState<Question[]>(
    Array.from({ length: 10 }, () => ({ question: '', options: ['', '', '', ''], answer: '' }))
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizCreated, setQuizCreated] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleQuestionChange = (value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (optIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (questions.some(q => !q.question.trim() || q.options.some(opt => !opt.trim()) || !q.answer.trim())) {
      alert('Please fill in all fields for all questions.');
      return;
    }

    const quizzes: Quiz[] = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzes.push({ id: Date.now(), courseId: courseId || '', questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    setQuizCreated(true);
  };

  const handleGoHome = () => {
    navigate('/instructor/home');
  };

  return (
    <>
    <Navbar role="instructor" />
    <div className="add-quiz-page">
      <div className="quiz-container">
        {quizCreated ? (
          <div className="success-message">
            <h2>Quiz Created Successfully!</h2>
            <button onClick={handleGoHome} className="home-button">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <h2 className="quiz-title">Add Quiz for Course ID: {courseId}</h2>
            <div className="question-container">
              <h3 className="question-title">Question {currentQuestionIndex + 1}</h3>
              <input
                value={questions[currentQuestionIndex].question}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuestionChange(e.target.value)}
                placeholder="Enter the question"
                className="input-field"
              />
              {questions[currentQuestionIndex].options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  value={opt}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange(optIndex, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="input-field"
                />
              ))}
              <input
                value={questions[currentQuestionIndex].answer}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleAnswerChange(e.target.value)}
                placeholder="Correct Answer"
                className="input-field"
              />
            </div>
            <div className="navigation-buttons">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="nav-button"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="nav-button"
              >
                Next
              </button>
            </div>
            {currentQuestionIndex === questions.length - 1 && (
              <button onClick={handleSubmit} className="submit-quiz-button">
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

export default InstructorQuiz;