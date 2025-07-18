'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Diary, Card } from '@/types';
import AddCardForm from '@/components/AddCardForm';
import CardStack from '@/components/CardStack';
import EditCardModal from '@/components/EditCardModal';
import toast from 'react-hot-toast';

export default function DiaryPage() {
  const params = useParams();
  const { uniqueId } = params;

  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    if (typeof uniqueId === 'string') {
      const fetchDiary = async () => {
        try {
          const res = await fetch(`/api/diaries/${uniqueId}`);
          if (!res.ok) {
            throw new Error('Could not find the diary. Please check the URL.');
          }
          const data = await res.json();
          // Sort cards by creation date, newest first
          data.diary.cards.sort((a: Card, b: Card) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setDiary(data.diary);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDiary();
    }
  }, [uniqueId]);

  const handleCardAdded = (newCard: Card) => {
    toast.success('Card added successfully!');
    setDiary((prevDiary) => {
      if (!prevDiary) return null;
      const updatedCards = [newCard, ...prevDiary.cards];
      return { ...prevDiary, cards: updatedCards };
    });
  };

  const handleDeleteCard = async (cardId: string) => {
    const originalCards = [...(diary?.cards || [])];
    if (!diary) return;

    try {
      const res = await fetch(`/api/diaries/${diary.uniqueId}/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete card. Please try again.');
      }

      setDiary((prevDiary) => {
        if (!prevDiary) return null;
        return {
          ...prevDiary,
          cards: prevDiary.cards.filter((card) => card.id !== cardId),
        };
      });
      toast.success('Card deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete card:', err);
      toast.error('Failed to delete card.');
      setError(err.message);
    }
  };

  const handleOpenEditModal = (card: Card) => {
    setEditingCard(card);
  };

  const handleCloseEditModal = () => {
    setEditingCard(null);
  };

  const handleCardUpdated = (updatedCard: Card) => {
    toast.success('Card updated successfully!');
    setDiary((prevDiary) => {
      if (!prevDiary) return null;
      const updatedCards = prevDiary.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );
      return { ...prevDiary, cards: updatedCards };
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main">
        <p>Loading your diary...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-main">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  if (!diary) {
    return null; // Should not happen if error handling is correct
  }

  return (
    <main className="min-h-screen bg-background text-text-main p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {diary.name}!</h1>
            <p className="text-text-light">Client ID: {diary.clientId}</p>
        </div>

        <AddCardForm uniqueId={diary.uniqueId} onCardAdded={handleCardAdded} />

        <div className="w-full mt-8">
          <CardStack cards={diary.cards} onDelete={handleDeleteCard} onEdit={handleOpenEditModal} />
        </div>

        <EditCardModal
          card={editingCard}
          uniqueId={diary.uniqueId}
          isOpen={!!editingCard}
          onClose={handleCloseEditModal}
          onCardUpdated={handleCardUpdated}
        />
      </div>
    </main>
  );
}
