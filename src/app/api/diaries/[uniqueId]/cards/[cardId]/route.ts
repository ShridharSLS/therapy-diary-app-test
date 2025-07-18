import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Diary } from '@/types';
import { UpdateFilter } from 'mongodb';

export async function PUT(request: Request, { params }: { params: { uniqueId: string; cardId: string } }) {
  try {
    const { uniqueId, cardId } = params;
    const { topic, tag, body } = await request.json();

    if (!topic || !tag || !body) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection<Diary>('diaries');

    const result = await diariesCollection.updateOne(
      { uniqueId, 'cards.id': cardId },
      {
        $set: {
          'cards.$.topic': topic,
          'cards.$.tag': tag,
          'cards.$.body': body,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Diary or card not found' }, { status: 404 });
    }

    // Fetch the updated card to return it
    const updatedDiary = await diariesCollection.findOne({ uniqueId });
    const updatedCard = updatedDiary?.cards.find(card => card.id === cardId);

    return NextResponse.json({ card: updatedCard }, { status: 200 });
  } catch (error) {
    console.error('Failed to update card:', error);
    return NextResponse.json({ message: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { uniqueId: string; cardId: string } }) {
  try {
    const { uniqueId, cardId } = params;

    if (!uniqueId || !cardId) {
      return NextResponse.json({ message: 'Missing diary or card ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection<Diary>('diaries');

    const result = await diariesCollection.updateOne(
      { uniqueId },
      { $pull: { cards: { id: cardId } } } as UpdateFilter<Diary> // Use 'as any' to bypass strict typing issues with $pull
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Diary or card not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Card deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete card:', error);
    return NextResponse.json({ message: 'Failed to delete card' }, { status: 500 });
  }
}
