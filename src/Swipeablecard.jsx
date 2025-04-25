import React from 'react';
import { useSpring, animated as a } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

export default function SwipeableCard({ children, onSwipe, index }) {
  const [{ x, rot }, api] = useSpring(() => ({ x: 0, rot: 0 }));

  const bind = useDrag(({ down, movement: [mx], direction: [dx], velocity }) => {
    const trigger = velocity > 0.2;

    if (!down && trigger) {
      api.start({
        x: dx > 0 ? 300 : -300,
        rot: dx * 15,
        immediate: false,
        onRest: () => onSwipe(dx > 0 ? 'right' : 'left')
      });
    } else {
      api.start({
        x: down ? mx : 0,
        rot: down ? mx / 10 : 0,
        immediate: down
      });
    }
  });

  return (
    <a.div
      className="swipeable-card"
      {...bind()}
      style={{
        x,
        rotateZ: rot,
        touchAction: 'pan-y'
      }}
    >
      {children}
    </a.div>
  );
}
