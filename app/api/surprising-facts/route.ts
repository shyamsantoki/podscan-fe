import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    const db = await getDatabase();

    const facts = await db
      .collection('surprise_facts')
      .aggregate([
        {
          $lookup: {
            from: 'firehose_episodes',
            localField: 'episode_id',
            foreignField: 'episode_id',
            as: 'episode',
          },
        },
        { $unwind: '$episode' },

        {
          $project: {
            title: 1,
            explanation: 1,
            score: 1,
            quotes: 1,
            keywords: 1,

            podcast: {
              podcast_id: '$episode.podcast_id',
              podcast_name: '$episode.podcast_name',
              podcast_image: '$episode.podcast_image',
            },

            episode: {
              episode_id: '$episode.episode_id',
              episode_title: '$episode.episode_title',
            },
          },
        },

        { $sort: { score: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    const total = await db.collection('surprise_facts').countDocuments();

    return NextResponse.json({
      success: true,
      data: facts,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching surprising facts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
