'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types';
import CardItem from './CardItem';

interface CardStackProps {
  cards: Card[];
  onDelete: (cardId: string) => void;
  onEdit: (card: Card) => void;
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function CardStack({ cards, onDelete, onEdit }: CardStackProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const cardIndex = page % cards.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <p className="text-text-light">You haven&apos;t added any cards yet. Use the form above to get started.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute w-full max-w-lg"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <CardItem card={cards[cardIndex]} onDelete={onDelete} onEdit={onEdit} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button onClick={() => paginate(-1)} className="bg-primary text-white p-2 rounded-full shadow-lg">
          &#8592;
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <button onClick={() => paginate(1)} className="bg-primary text-white p-2 rounded-full shadow-lg">
          &#8594;
        </button>
      </div>
    </div>
  );
}
