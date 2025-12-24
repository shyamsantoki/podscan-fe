import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PodcastData } from '@/types/podcast';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const db = await getDatabase();
    const collection = db.collection<PodcastData>('firehose_episodes');

    let podcast;

    // Try to find by ObjectId first
    if (ObjectId.isValid(id)) {
      podcast = await collection.findOne({ _id: new ObjectId(id) });
    }

    // If not found, try episode_id
    if (!podcast) {
      podcast = await collection.findOne({ episode_id: id });
    }

    if (!podcast) {
      return NextResponse.json(
        {
          success: false,
          error: 'Podcast episode not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: podcast,
    });
  } catch (error: any) {
    console.error('Error fetching podcast:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}