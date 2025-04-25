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

export default function App() {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const [{ x, rot, opacity }, api] = useSpring(() => ({
    x: 0, rot: 0, opacity: 1
  }));

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswered(true);

    if (i === questions[index].answer - 1) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const nextCard = () => {
    if (!answered) return;

    api.start({ x: 300, opacity: 0, rot: 15 });

    setTimeout(() => {
      setSelected(null);
      setAnswered(false);
      api.set({ x: 0, opacity: 1, rot: 0 });

      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        setShowSummary(true);
      }
    }, 300);
  };

  const bind = useDrag(
    ({ down, movement: [mx], direction: [dx], velocity }) => {
      if (!answered) return;

      const trigger = velocity > 0.3;

      if (!down && trigger) {
        api.start({
          x: dx > 0 ? 300 : -300,
          rot: dx * 15,
          immediate: false,
          onRest: () => nextCard()
        });
      } else {
        api.start({ x: down ? mx : 0, rot: down ? mx / 10 : 0, immediate: down });
      }
    },
    { enabled: answered }
  );

  const current = questions[index];
  const next = questions[index + 1];

  return (
    <main className="container">
      <h1 className="title">FOOD SAFETY QUIZ</h1>

      {showSummary ? (
        <div className="summary">
          <div className="summary-box">
            <h2>Quiz Completed 🎉</h2>
            <p>You got <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> correct!</p>
          </div>
        </div>
      ) : (
        <div className="stack-container">
          {next && (
            <div className="card card--next">
              <img src={next.image} alt="Next" className="image" />
            </div>
          )}

          <a.div className="swipeable-card" {...bind()} style={{ x, rotateZ: rot, opacity }}>
            <div className="card card--top">
              <img src={current.image} alt="Current" className="image" />
              {current.options.map((opt, i) => {
                const isCorrect = selected === i && i === (current.answer - 1);
                const isWrong = selected === i && i !== (current.answer - 1);
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </a.div>

          <button className="nav-button" onClick={nextCard} disabled={!answered}>
            ➡️ Next
          </button>
        </div>
      )}
    </main>
  );
}
