import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { nanoid } from 'nanoid';
import { Diary, Card } from '@/types';

export async function POST(request: Request, { params }: { params: { uniqueId: string } }) {
  try {
    const { uniqueId } = params;
    const { topic, tag, body } = await request.json();

    if (!topic || !tag || !body) {
      return NextResponse.json({ message: 'Missing required card fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection<Diary>('diaries');

    const newCard: Card = {
      id: nanoid(),
      topic,
      tag,
      body,
      createdAt: new Date().toISOString(),
    };

    const result = await diariesCollection.updateOne(
      { uniqueId },
      { $push: { cards: newCard } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Diary not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ card: newCard }, { status: 201 });
  } catch (error) {
    console.error('Failed to add card:', error);
    return NextResponse.json({ message: 'Failed to add card' }, { status: 500 });
  }
}
