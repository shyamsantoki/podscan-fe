import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    const search = searchParams.get('search') || '';
    const keyword = searchParams.get('keyword') || '';

    const db = await getDatabase();

    // Build the match stage for filtering
    const matchStage: any = {};

    // Add keyword filter if provided
    if (keyword) {
      matchStage.keywords = keyword;
    }

    // Build the aggregation pipeline
    const pipeline: any[] = [
      // First match stage for keyword filtering (before lookup for better performance)
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),

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
    ];

    // Add search filter (after lookup so we can search episode/podcast fields)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { explanation: { $regex: search, $options: 'i' } },
            { 'podcast.podcast_name': { $regex: search, $options: 'i' } },
            { 'episode.episode_title': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Add sorting, skip, and limit
    pipeline.push(
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute the aggregation
    const facts = await db
      .collection('surprise_facts')
      .aggregate(pipeline)
      .toArray();

    // Get total count with the same filters
    const countPipeline: any[] = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ];

    // If search is active, we need to join and then filter for accurate count
    if (search) {
      countPipeline.push(
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
          $match: {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { explanation: { $regex: search, $options: 'i' } },
              { 'episode.podcast_name': { $regex: search, $options: 'i' } },
              { 'episode.episode_title': { $regex: search, $options: 'i' } },
            ],
          },
        }
      );
    }

    countPipeline.push({ $count: 'total' });

    const countResult = await db
      .collection('surprise_facts')
      .aggregate(countPipeline)
      .toArray();

    const total = countResult.length > 0 ? countResult[0].total : 0;

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
