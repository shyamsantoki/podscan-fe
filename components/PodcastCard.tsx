'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Users, Star } from 'lucide-react';
import { PodcastData } from '@/types/podcast';
import { formatDistance } from 'date-fns';

interface PodcastCardProps {
    podcast: PodcastData;
    index?: number;
}

export default function PodcastCard({ podcast, index = 0 }: PodcastCardProps) {
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const postedDate = new Date(podcast.episode_posted_at);
    const timeAgo = formatDistance(postedDate, new Date(), { addSuffix: true });

    return (
        <article className="group bg-white border border-neutral-200 hover:border-neutral-900 transition-colors duration-300">
            <div className="flex gap-8 p-8">
                {/* Podcast Image */}
                <Link
                    href={`/podcast/${podcast.episode_id}`}
                    className="relative flex-shrink-0"
                >
                    <div className="relative w-48 h-48 bg-neutral-100 overflow-hidden">
                        <Image
                            src={podcast.podcast_image}
                            alt={podcast.podcast_name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 192px"
                        />
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Title and Podcast Name */}
                    <div className="mb-6">
                        <Link href={`/podcast/${podcast.episode_id}`}>
                            <h2 className="text-2xl font-light text-neutral-900 mb-3 leading-tight line-clamp-2 group-hover:text-neutral-600 transition-colors">
                                {podcast.episode_title}
                            </h2>
                        </Link>
                        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                            {podcast.podcast_name}
                        </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 mb-6 text-xs text-neutral-500 uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{formatDuration(podcast.episode_duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{podcast.podcast_audience_size.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-neutral-600 mb-6 line-clamp-2">
                        {podcast.metadata.summary_short}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-auto">
                        {podcast.episode_categories.slice(0, 4).map((category) => (
                            <span
                                key={category.category_id}
                                className="px-3 py-1 text-xs uppercase tracking-wider text-neutral-700 border border-neutral-300 font-medium"
                            >
                                {category.category_name}
                            </span>
                        ))}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center gap-8 pt-6 mt-6 border-t border-neutral-200">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" strokeWidth={0} />
                                <span className="text-sm font-medium text-neutral-900">
                                    {podcast.podcast_itunes_rating_average}
                                </span>
                            </div>
                            <span className="text-xs text-neutral-500">
                                {podcast.podcast_itunes_rating_count_precise} ratings
                            </span>
                        </div>

                        {podcast.metadata.has_sponsors && (
                            <span className="px-3 py-1 text-xs uppercase tracking-wider text-neutral-700 border border-neutral-300 font-medium">
                                Sponsored
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}