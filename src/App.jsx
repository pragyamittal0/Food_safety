import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PowerBIReport from './PowerBiReport'; // Make sure the file name matches exactly (case sensitive)

import img1 from './assets/age_verification.png';
import img2 from './assets/alcohol.png';
import img3 from './assets/blood.png';
import img4 from './assets/first_step.png';
import img5 from './assets/food_safety.png';
import img6 from './assets/gloves.png';
import img7 from './assets/guest.png';
import img8 from './assets/handwash.png';
import img9 from './assets/idk.png';
import img10 from './assets/minor.png';
import img11 from './assets/sds.png';
import img12 from './assets/struggle.png';
import img13 from './assets/temp.png';

const questions = [
  { image: img1, options: ['Credit card', 'Student ID', 'Drivers license', 'Business card'], answer: 3 },
  { image: img2, options: ['A food safety certification', 'Permission from a manager', 'Responsible Alcohol Service Training', 'Only a verbal agreement with the guest'], answer: 3 },
  { image: img3, options: ['Gloves only', 'Eye protection only', 'Gloves, eye protection, and apron', 'Hairnet and gloves'], answer: 3 },
  { image: img4, options: ['Spray sanitizer', 'Remove visible food debris', 'Dry the surface', 'Wipe with a paper towel'], answer: 2 },
  { image: img5, options: ['145°F (63°C)', '150°F (66°C)', '160°F (71°C)', '165°F (74°C)'], answer: 4 },
  { image: img6, options: ['Every hour', 'After handling raw food or switching tasks', 'Only after handling allergens', 'When your shift ends'], answer: 2 },
  { image: img7, options: ['Ask them to wait', 'Apologize and correct it', 'Call the manager', 'Offer a discount immediately'], answer: 2 },
  { image: img8, options: ['Rinse', 'Scrub for 20 seconds', 'Use warm water', 'Dry on your apron'], answer: 4 },
  { image: img9, options: ['Guess based on what seems right', 'Say “I’m not sure” and walk away', 'Tell them to check the menu again', 'Politely say you are not sure and get the correct answer from someone who knows'], answer: 4 },
  { image: img10, options: ['True', 'Only if they look old enough', 'Ask first', 'False'], answer: 4 },
  { image: img11, options: ['Sanitation Documentation Standard', 'Safety Data Sheet', 'Service Delivery Statement', 'Supplier Disclosure Summary'], answer: 2 },
  { image: img12, options: ['Keep working your station', 'Report it after your shift', 'Tell your supervisor and ask them if you can offer help ', 'Tell your supervisor'], answer: 3 },
  { image: img13, options: ['1 hour', '4 hours', '2 hours', '6 hours'], answer: 3 }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);
  const [showReport, setShowReport] = useState(false); // 👈 New state to control report
  const wrapperRef = useRef(null);

  const handleAnswer = (index, selected) => {
    const updated = [...selectedAnswers];
    updated[index] = selected;
    setSelectedAnswers(updated);

    const allAnswered = updated.every((a) => a !== null);
    if (allAnswered) {
      setTimeout(() => setShowSummary(true), 500);
    }
  };

  const handleNext = () => {
    if (selectedAnswers[currentIndex] !== null) {
      setCurrentIndex((prev) => (prev + 1) % questions.length);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const correctCount = selectedAnswers.filter(
    (ans, i) => ans === (questions[i].answer - 1)
  ).length;

  // Swipe gestures
  useEffect(() => {
    const container = wrapperRef.current;
    let startX = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      if (Math.abs(delta) > 50) {
        delta < 0 ? handleNext() : handlePrev();
      }
    };

    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentIndex, selectedAnswers]);

  return (
    <main className="container">
      <div className="top-bar">
        <h1 className="title">FOOD SAFETY QUIZ</h1>
        <button className="report-button" onClick={() => setShowReport(true)}>
          View Report
        </button>
      </div>

      {/* Show Report or Quiz based on showReport */}
      {showReport ? (
        <PowerBIReport onClose={() => setShowReport(false)} />
      ) : (
        <>
          {showSummary ? (
            <div className="summary">
              <div className="summary-box">
                <h2>Quiz Completed 🎉</h2>
                <p>
                  You got <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> correct!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="carousel-wrapper" ref={wrapperRef}>
                <div className="carousel">
                  <div className="card">
                    <img src={questions[currentIndex].image} alt="Question" className="image" />
                    {questions[currentIndex].options.map((opt, i) => {
                      const isSelected = selectedAnswers[currentIndex] === i;
                      const isCorrect = isSelected && i === (questions[currentIndex].answer - 1);
                      const isWrong = isSelected && i !== (questions[currentIndex].answer - 1);
                      return (
                        <button
                          key={i}
                          className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                          onClick={() => handleAnswer(currentIndex, i)}
                          disabled={isSelected}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="navigation">
                <button onClick={handlePrev} className="nav-button">⬅️</button>
                <button onClick={handleNext} className="nav-button" disabled={selectedAnswers[currentIndex] === null}>➡️</button>
              </div>

              <div className="dots">
                {questions.map((_, i) => (
                  <span key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
