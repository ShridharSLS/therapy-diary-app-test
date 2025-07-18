import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Diary } from '@/types';

export async function GET(request: Request, { params }: { params: { uniqueId: string } }) {
  try {
    const { uniqueId } = params;

    if (!uniqueId) {
      return NextResponse.json({ message: 'Missing diary ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection('diaries');

    const diary = await diariesCollection.findOne({ uniqueId });

    if (!diary) {
      return NextResponse.json({ message: 'Diary not found' }, { status: 404 });
    }

    return NextResponse.json({ diary }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch diary:', error);
    return NextResponse.json({ message: 'Failed to fetch diary' }, { status: 500 });
  }
}
