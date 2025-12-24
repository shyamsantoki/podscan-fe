import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { PodcastData } from '@/types/podcast';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const podcastId = searchParams.get('podcast_id');
    const episodeId = searchParams.get('episode_id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    const db = await getDatabase();
    const collection = db.collection<PodcastData>('firehose_episodes');

    let query: any = {};

    // Specific ID queries
    if (podcastId) {
      query.podcast_id = podcastId;
    }

    if (episodeId) {
      query.episode_id = episodeId;
    }

    // Search query - case insensitive search across multiple fields
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { episode_title: searchRegex },
        { podcast_name: searchRegex },
        { 'metadata.summary_short': searchRegex },
        { 'metadata.summary_long': searchRegex },
      ];
    }

    // Execute query with pagination
    const podcasts = await collection
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort({ episode_posted_at: -1 })
      .toArray();

    // Get total count for pagination
    const total = await collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: podcasts,
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
    console.error('Error fetching podcasts:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<PodcastData>('firehose_episodes');

    const result = await collection.insertOne(body);

    return NextResponse.json({
      success: true,
      data: {
        insertedId: result.insertedId,
      },
    });
  } catch (error: any) {
    console.error('Error inserting podcast:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}