import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Diary } from '@/types';

export async function DELETE(request: Request, context: { params: { uniqueId: string } }) {
  try {
    const { uniqueId } = context.params;

    if (!uniqueId) {
      return NextResponse.json({ message: 'Missing diary ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('therapy-diary');
    const diariesCollection = db.collection<Diary>('diaries');

    const result = await diariesCollection.deleteOne({ uniqueId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Diary not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Diary deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete diary:', error);
    return NextResponse.json({ message: 'Failed to delete diary' }, { status: 500 });
  }
}
