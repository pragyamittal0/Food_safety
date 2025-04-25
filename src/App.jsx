import React, { useState } from 'react';
import { useSpring, animated as a } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import './App.css';

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

const SwipeableCard = ({ question, selectedAnswers, handleAnswer, onSwipe }) => {
  const canSwipe = selectedAnswers[question.index] !== null;
  const [{ x, rot }, api] = useSpring(() => ({ x: 0, rot: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx], direction: [dx], velocity }) => {
      if (!canSwipe) return;

      const trigger = velocity > 0.3;
      if (!down && trigger) {
        api.start({
          x: dx > 0 ? 300 : -300,
          rot: dx * 15,
          immediate: false,
          onRest: () => onSwipe()
        });
      } else {
        api.start({
          x: down ? mx : 0,
          rot: down ? mx / 10 : 0,
          immediate: down
        });
      }
    },
    { enabled: canSwipe }
  );

  return (
    <a.div className="swipeable-card" {...bind()} style={{ x, rotateZ: rot }}>
      <div className="card">
        <img src={question.image} alt="Flashcard" className="image" />
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswers[question.index] === idx;
          const isCorrect = isSelected && idx === (question.answer - 1);
          const isWrong = isSelected && idx !== (question.answer - 1);
          return (
            <button
              key={idx}
              className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              onClick={() => handleAnswer(question.index, idx)}
              disabled={isSelected}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </a.div>
  );
};

export default function App() {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showSummary, setShowSummary] = useState(false);

  const screenCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

  const getVisibleCards = () => {
    const endIndex = startIndex + screenCards;
    const extended = [...questions, ...questions]; // to prevent overflow
    return extended.slice(startIndex, endIndex).map((q, i) => ({
      ...q,
      index: (startIndex + i) % questions.length
    }));
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    const updated = [...selectedAnswers];
    updated[questionIndex] = optionIndex;
    setSelectedAnswers(updated);

    const allAnswered = updated.every((a) => a !== null);
    if (allAnswered) {
      setTimeout(() => setShowSummary(true), 600);
    }
  };

  const handleNext = () => {
    if (!selectedAnswers.slice(startIndex, startIndex + screenCards).includes(null)) {
      const next = (startIndex + screenCards) % questions.length;
      setStartIndex(next);
    }
  };

  const handlePrev = () => {
    const prev = (startIndex - screenCards + questions.length) % questions.length;
    setStartIndex(prev);
  };

  const correctCount = selectedAnswers.filter(
    (ans, i) => ans === (questions[i].answer - 1)
  ).length;

  return (
    <main className="container">
      <h1 className="title">FOOD SAFETY QUIZ</h1>

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
          <div className="carousel-wrapper">
            <div className="carousel">
              {screenCards === 1 ? (
                <SwipeableCard
                  question={getVisibleCards()[0]}
                  selectedAnswers={selectedAnswers}
                  handleAnswer={handleAnswer}
                  onSwipe={handleNext}
                />
              ) : (
                getVisibleCards().map((q) => (
                  <div key={q.index} className="card">
                    <img src={q.image} alt="Flashcard" className="image" />
                    {q.options.map((opt, idx) => {
                      const isSelected = selectedAnswers[q.index] === idx;
                      const isCorrect = isSelected && idx === (q.answer - 1);
                      const isWrong = isSelected && idx !== (q.answer - 1);
                      return (
                        <button
                          key={idx}
                          className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                          onClick={() => handleAnswer(q.index, idx)}
                          disabled={isSelected}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          {screenCards > 1 && (
            <div className="navigation">
              <button onClick={handlePrev} className="nav-button">⬅️</button>
              <button
                onClick={handleNext}
                className="nav-button"
                disabled={selectedAnswers.slice(startIndex, startIndex + screenCards).includes(null)}
              >
                ➡️
              </button>
            </div>
          )}

          <div className="dots">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`dot ${i >= startIndex && i < startIndex + screenCards ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
