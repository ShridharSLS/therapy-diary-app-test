import React from 'react';
import { Card } from '@/types';

interface CardItemProps {
  card: Card;
  onDelete: (cardId: string) => void;
  onEdit: (card: Card) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onDelete, onEdit }) => {
  const tagColor = card.tag === 'Before' ? 'bg-accent-light' : 'bg-secondary-light';
  const tagTextColor = card.tag === 'Before' ? 'text-accent-dark' : 'text-secondary-dark';

  return (
    <div className={`p-4 rounded-lg shadow-md ${tagColor}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-text-main">{card.topic}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tagColor} ${tagTextColor}`}>
            {card.tag}
          </span>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => onEdit(card)}
            className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(card.id)}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: card.body }} />
      <p className="text-xs text-text-light mt-4 text-right">
        {new Date(card.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default CardItem;
