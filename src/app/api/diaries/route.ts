import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const { clientId, name, gender } = await request.json();

    if (!clientId || !name || !gender) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection('diaries');

    let uniqueId;
    let isUnique = false;

    // Ensure the generated ID is unique
    while (!isUnique) {
      uniqueId = nanoid(10); // Generate a 10-character ID
      const existingDiary = await diariesCollection.findOne({ uniqueId });
      if (!existingDiary) {
        isUnique = true;
      }
    }

    const newDiary = {
      clientId,
      name,
      gender,
      uniqueId,
      cards: [],
      createdAt: new Date(),
    };

    await diariesCollection.insertOne(newDiary);

    return NextResponse.json({ diary: newDiary }, { status: 201 });
  } catch (error) {
    console.error('Failed to create diary:', error);
    return NextResponse.json({ message: 'Failed to create diary' }, { status: 500 });
  }
}
