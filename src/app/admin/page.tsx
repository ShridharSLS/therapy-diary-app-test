'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Diary } from '@/types';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// We only get partial data for the list view
type DiaryListItem = Pick<Diary, 'uniqueId' | 'name' | 'clientId' | 'createdAt'>;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // To track which diary is being deleted

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (status === 'authenticated') {
    const fetchDiaries = async () => {
      try {
        const res = await fetch('/api/admin/diaries');
        if (!res.ok) {
          throw new Error('Failed to fetch diaries');
        }
        const data: { diaries: DiaryListItem[] } = await res.json();
        setDiaries(data.diaries);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching diaries.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
    }
  }, [status, router]);

  const handleDeleteDiary = async (uniqueId: string) => {
    if (!window.confirm('Are you sure you want to delete this diary? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(uniqueId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/diaries/${uniqueId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the diary. Please try again.');
      }

      // Remove the diary from the local state to update the UI
      setDiaries((prevDiaries) => prevDiaries.filter((diary) => diary.uniqueId !== uniqueId));
      toast.success('Diary deleted successfully!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error('Failed to delete diary.');
      } else {
        setError('An unknown error occurred while deleting the diary.');
        toast.error('An unknown error occurred.');
      }
    } finally {
      setIsDeleting(null);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main">
        <p>Loading...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main">
        <p>Loading diaries...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main">
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-main p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diaries.length > 0 ? (
                diaries.map((diary) => (
                  <tr key={diary.uniqueId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{diary.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{diary.clientId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(diary.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <Link href={`/diary/${diary.uniqueId}`} className="text-primary hover:text-primary-dark">
                        View
                      </Link>
                      <button 
                        onClick={() => handleDeleteDiary(diary.uniqueId)}
                        disabled={isDeleting === diary.uniqueId}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                      >
                        {isDeleting === diary.uniqueId ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No diaries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
