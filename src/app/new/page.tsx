'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewDiaryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ clientId: '', name: '', gender: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newDiary, setNewDiary] = useState<{ uniqueId: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.clientId || !formData.name || !formData.gender) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create diary. Please try again.');
      }

      const data = await res.json();
      setNewDiary(data.diary);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (newDiary) {
    const diaryUrl = `${window.location.origin}/diary/${newDiary.uniqueId}`;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Diary is Ready!</h1>
          <p className="text-text-light mb-4">Please save this URL. This is the only way to access your diary.</p>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <p className="text-lg font-mono break-all">{diaryUrl}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(diaryUrl)}
            className="w-full mb-4 bg-secondary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg"
          >
            Copy URL
          </button>
          <button
            onClick={() => router.push(`/diary/${newDiary.uniqueId}`)}
            className="w-full bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg"
          >
            Go to Therapy Diary
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Create Your Diary</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-text-light mb-2">Client ID</label>
            <input
              type="text"
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Enter your client ID"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-text-light mb-2">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 shadow-lg disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate Diary Link'}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-text-light hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
