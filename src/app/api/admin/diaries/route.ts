import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Diary } from '@/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection<Diary>('diaries');

    // Fetch all diaries, but only return essential fields for the list view
    const diaries = await diariesCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            uniqueId: 1,
            name: 1,
            clientId: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ diaries }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch diaries for admin:', error);
    return NextResponse.json({ message: 'Failed to fetch diaries' }, { status: 500 });
  }
}
