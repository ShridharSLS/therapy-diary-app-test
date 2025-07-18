'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface AddCardFormProps {
  uniqueId: string;
  onCardAdded: (newCard: any) => void;
}

export default function AddCardForm({ uniqueId, onCardAdded }: AddCardFormProps) {
  const [topic, setTopic] = useState('');
  const [tag, setTag] = useState<'Before' | 'After'>('Before');
  const [body, setBody] = useState('<p>Start writing your thoughts...</p>');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!topic || !body) {
      setError('Topic and body are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/diaries/${uniqueId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tag, body }),
      });

      if (!res.ok) {
        throw new Error('Failed to add card. Please try again.');
      }

      const data = await res.json();
      onCardAdded(data.card);
      // Reset form
      setTopic('');
      setTag('Before');
      setBody('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
      <h2 className="text-xl font-bold text-text-main">Add a New Card</h2>
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-text-light mb-1">Topic</label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          placeholder="What's on your mind?"
          maxLength={50} // As per requirements
          required
        />
      </div>
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-text-light mb-1">Tag</label>
        <select
          id="tag"
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
        <label htmlFor="body" className="block text-sm font-medium text-text-light mb-1">Body</label>
        <RichTextEditor content={body} onChange={setBody} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-lg disabled:bg-gray-400"
      >
        {isLoading ? 'Adding...' : 'Add Card'}
      </button>
    </form>
  );
}
