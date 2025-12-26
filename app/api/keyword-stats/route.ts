import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();

    // Aggregate to count facts per keyword
    const keywordStats = await db
      .collection('surprise_facts')
      .aggregate([
        // Unwind the keywords array so each keyword becomes a separate document
        { $unwind: '$keywords' },
        
        // Group by keyword and count
        {
          $group: {
            _id: '$keywords',
            count: { $sum: 1 },
          },
        },
        
        // Sort by count descending
        { $sort: { count: -1 } },
        
        // Rename _id to keyword for clarity
        {
          $project: {
            _id: 0,
            keyword: '$_id',
            count: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      data: keywordStats,
      total: keywordStats.length,
    });
  } catch (error: any) {
    console.error('Error fetching keyword stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}