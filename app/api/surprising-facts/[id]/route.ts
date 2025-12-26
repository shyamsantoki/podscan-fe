import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SurpriseData } from '@/types/podcast';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let fact;

    const db = await getDatabase();
    const collection = db.collection<SurpriseData>('surprise_facts');

    fact = await collection.findOne({ _id: new ObjectId(id) });

    if (!fact) {
      fact = await collection.findOne({ episode_id: id });
      if (!fact) {
        return NextResponse.json(
          {
            success: false,
            error: 'Surprising fact not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: fact,
    });
  } catch (error: any) {
    console.error('Error fetching surprising fact:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
