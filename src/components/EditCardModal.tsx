'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/types';
import RichTextEditor from './RichTextEditor';

interface EditCardModalProps {
  card: Card | null;
  uniqueId: string;
  isOpen: boolean;
  onClose: () => void;
  onCardUpdated: (updatedCard: Card) => void;
}

export default function EditCardModal({ card, uniqueId, isOpen, onClose, onCardUpdated }: EditCardModalProps) {
  const [topic, setTopic] = useState('');
  const [tag, setTag] = useState<'Before' | 'After'>('Before');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (card) {
      setTopic(card.topic);
      setTag(card.tag);
      setBody(card.body);
    }
  }, [card]);

  if (!isOpen || !card) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/diaries/${uniqueId}/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tag, body }),
      });

      if (!res.ok) {
        throw new Error('Failed to update card. Please try again.');
      }

      const data = await res.json();
      onCardUpdated(data.card);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-text-main mb-4">Edit Card</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic-edit" className="block text-sm font-medium text-text-light mb-1">Topic</label>
            <input
              type="text"
              id="topic-edit"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              maxLength={50}
              required
            />
          </div>
          <div>
            <label htmlFor="tag-edit" className="block text-sm font-medium text-text-light mb-1">Tag</label>
            <select
              id="tag-edit"
              value={tag}
              onChange={(e) => setTag(e.target.value as 'Before' | 'After')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            >
              <option value="Before">Before</option>
              <option value="After">After</option>
            </select>
          </div>
          <div>
            <label htmlFor="body-edit" className="block text-sm font-medium text-text-light mb-1">Body</label>
            <RichTextEditor content={body} onChange={setBody} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-text-main font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-lg disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
