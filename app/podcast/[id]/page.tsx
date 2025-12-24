'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    Star,
    Play,
    Download,
    Share2,
    Mic,
    Building2,
    TrendingUp,
    Shield,
    ExternalLink,
    Globe,
    Mail,
    Radio,
    Hash,
    BarChart3,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { PodcastData } from '@/types/podcast';
import { format } from 'date-fns';

export default function PodcastDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [podcast, setPodcast] = useState<PodcastData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchPodcast(params.id as string);
        }
    }, [params.id]);

    const fetchPodcast = async (id: string) => {
        try {
            const response = await fetch(`/api/podcasts/${id}`);
            const data = await response.json();
            if (data.success) {
                setPodcast(data.data);
            }
        } catch (error) {
            console.error('Error fetching podcast:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="w-12 h-12 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!podcast) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-light text-neutral-900 mb-6">Episode Not Found</h2>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm uppercase tracking-wider hover:bg-neutral-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                        Back to Library
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="bg-white border border-neutral-200 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-12">
                        {/* Left Column - Image & Actions */}
                        <div className="lg:col-span-4">
                            <div className="relative w-full aspect-square bg-neutral-100 mb-8">
                                <Image
                                    src={podcast.podcast_image}
                                    alt={podcast.podcast_name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-8">
                                <a
                                    href={podcast.episode_audio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-neutral-900 text-white px-6 py-4 text-sm uppercase tracking-wider hover:bg-neutral-700 transition-colors flex items-center justify-center gap-3"
                                >
                                    <Play className="w-4 h-4" strokeWidth={1.5} />
                                    Play Episode
                                </a>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="border border-neutral-300 px-4 py-3 flex items-center justify-center gap-2 hover:border-neutral-900 transition-colors">
                                        <Download className="w-4 h-4 text-neutral-700" strokeWidth={1.5} />
                                        <span className="text-neutral-700 text-xs uppercase tracking-wider">Save</span>
                                    </button>
                                    <button className="border border-neutral-300 px-4 py-3 flex items-center justify-center gap-2 hover:border-neutral-900 transition-colors">
                                        <Share2 className="w-4 h-4 text-neutral-700" strokeWidth={1.5} />
                                        <span className="text-neutral-700 text-xs uppercase tracking-wider">Share</span>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4 pt-8 border-t border-neutral-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-neutral-500">Language</span>
                                    <span className="text-sm text-neutral-900 font-medium uppercase">{podcast.podcast_language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-neutral-500">Region</span>
                                    <span className="text-sm text-neutral-900 font-medium uppercase">{podcast.podcast_region}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-neutral-500">Total Episodes</span>
                                    <span className="text-sm text-neutral-900 font-medium">{podcast.podcast_episode_count.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-neutral-500">Has Guests</span>
                                    {podcast.podcast_has_guests ? (
                                        <CheckCircle2 className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-neutral-500">Has Sponsors</span>
                                    {podcast.podcast_has_sponsors ? (
                                        <CheckCircle2 className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-8">
                            {/* Title */}
                            <div className="mb-8">
                                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-3 font-medium">
                                    {podcast.podcast_name}
                                </p>
                                <h1 className="text-4xl font-light text-neutral-900 leading-tight mb-6">
                                    {podcast.episode_title}
                                </h1>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pb-10 border-b border-neutral-200">
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                                        <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-wider">Posted</span>
                                    </div>
                                    <p className="text-sm text-neutral-900">
                                        {format(new Date(podcast.episode_posted_at), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-wider">Duration</span>
                                    </div>
                                    <p className="text-sm text-neutral-900">
                                        {formatDuration(podcast.episode_duration)}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                                        <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-wider">Listeners</span>
                                    </div>
                                    <p className="text-sm text-neutral-900">
                                        {podcast.podcast_audience_size.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-neutral-500 mb-2">
                                        <Star className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span className="text-xs uppercase tracking-wider">Rating</span>
                                    </div>
                                    <p className="text-sm text-neutral-900">
                                        {podcast.podcast_itunes_rating_average}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-10">
                                <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4 font-medium">
                                    Episode Summary
                                </h2>
                                <p className="text-sm leading-relaxed text-neutral-700 mb-4">
                                    {podcast.metadata.summary_long}
                                </p>
                                {podcast.metadata.summary_keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {podcast.metadata.summary_keywords.slice(0, 8).map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs text-neutral-600 border border-neutral-300"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Categories */}
                            <div>
                                <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-4 font-medium">
                                    Categories
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {podcast.episode_categories.map((category) => (
                                        <span
                                            key={category.category_id}
                                            className="px-3 py-1.5 text-xs uppercase tracking-wider text-neutral-700 border border-neutral-300 font-medium"
                                        >
                                            {category.category_name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Comparison */}
                <section className="bg-white border border-neutral-200 p-12 mb-8">
                    <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                        Ratings Across Platforms
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* iTunes Ratings */}
                        <div className="border-l-2 border-neutral-900 pl-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Radio className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                                <h3 className="text-sm uppercase tracking-wider text-neutral-900 font-medium">Apple Podcasts</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-light text-neutral-900">{podcast.podcast_itunes_rating_average}</span>
                                    <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" strokeWidth={0} />
                                </div>
                                <p className="text-sm text-neutral-500">
                                    {podcast.podcast_itunes_rating_count_precise} ratings
                                </p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Bracket: {podcast.podcast_itunes_rating_count}
                                </p>
                            </div>
                        </div>

                        {/* Spotify Ratings */}
                        <div className="border-l-2 border-neutral-900 pl-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Radio className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                                <h3 className="text-sm uppercase tracking-wider text-neutral-900 font-medium">Spotify</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-light text-neutral-900">{podcast.podcast_spotify_rating_average}</span>
                                    <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" strokeWidth={0} />
                                </div>
                                <p className="text-sm text-neutral-500">
                                    {podcast.podcast_spotify_rating_count_precise} ratings
                                </p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Bracket: {podcast.podcast_spotify_rating_count_precise}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Podcast Information */}
                <section className="bg-white border border-neutral-200 p-12 mb-8">
                    <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                        Podcast Information
                    </h2>
                    <div className="space-y-6">
                        {podcast.podcast_url && (
                            <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                                    <span className="text-sm text-neutral-500">Website</span>
                                </div>
                                <a
                                    href={podcast.podcast_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-neutral-900 hover:underline flex items-center gap-2"
                                >
                                    Visit Podcast
                                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </a>
                            </div>
                        )}

                        {podcast.podcast_rss_feed_url && (
                            <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <Radio className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                                    <span className="text-sm text-neutral-500">RSS Feed</span>
                                </div>
                                <a
                                    href={podcast.podcast_rss_feed_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-neutral-900 hover:underline flex items-center gap-2"
                                >
                                    Subscribe via RSS
                                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </a>
                            </div>
                        )}

                        {podcast.podcast_email && (
                            <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                                    <span className="text-sm text-neutral-500">Contact</span>
                                </div>
                                <div className="text-right">
                                    {podcast.podcast_email.split(',').map((email, idx) => (
                                        <a
                                            key={idx}
                                            href={`mailto:${email.trim()}`}
                                            className="text-sm text-neutral-900 hover:underline block"
                                        >
                                            {email.trim()}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            {podcast.podcast_itunes_id && (
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-2">iTunes ID</span>
                                    <span className="text-sm text-neutral-900 font-mono">{podcast.podcast_itunes_id}</span>
                                </div>
                            )}
                            {podcast.podcast_spotify_id && (
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-neutral-500 block mb-2">Spotify ID</span>
                                    <span className="text-sm text-neutral-900 font-mono">{podcast.podcast_spotify_id}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Hosts Section */}
                {podcast.metadata.hosts.length > 0 && (
                    <section className="bg-white border border-neutral-200 p-12 mb-8">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                            Hosts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {podcast.metadata.hosts.map((host, index) => (
                                <div key={index} className="border-l-2 border-neutral-900 pl-6">
                                    <h3 className="text-xl font-light text-neutral-900 mb-2">
                                        {host.host_name}
                                    </h3>
                                    {host.host_company && (
                                        <p className="text-sm text-neutral-500">
                                            {host.host_company}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sponsors Section */}
                {podcast.metadata.sponsors.length > 0 && (
                    <section className="bg-white border border-neutral-200 p-12 mb-8">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                            Sponsors
                        </h2>
                        <div className="space-y-6">
                            {podcast.metadata.sponsors.map((sponsor, index) => (
                                <div key={index} className="flex items-start justify-between pb-6 border-b border-neutral-200 last:border-0 last:pb-0">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-light text-neutral-900 mb-1">
                                            {sponsor.sponsor_name}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mb-2">
                                            {sponsor.sponsor_product_mentioned}
                                        </p>
                                        {sponsor.sponsor_is_commercial && (
                                            <span className="inline-block px-2 py-1 text-xs uppercase tracking-wider text-neutral-600 border border-neutral-300">
                                                Commercial
                                            </span>
                                        )}
                                    </div>
                                    {sponsor.sponsor_url && (
                                        <a
                                            href={sponsor.sponsor_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 p-2 border border-neutral-300 hover:border-neutral-900 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4 text-neutral-700" strokeWidth={1.5} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Topics Section */}
                {podcast.topics.length > 0 && (
                    <section className="bg-white border border-neutral-200 p-12 mb-8">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                            Topics Discussed
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {podcast.topics.map((topic) => (
                                <span
                                    key={topic.topic_id}
                                    className="px-4 py-2 text-xs text-neutral-700 border border-neutral-300 hover:border-neutral-900 transition-colors cursor-pointer"
                                >
                                    {topic.topic_name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Podcast Categories */}
                {podcast.podcast_categories.length > 0 && (
                    <section className="bg-white border border-neutral-200 p-12 mb-8">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                            Podcast Categories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {podcast.podcast_categories.map((category) => (
                                <span
                                    key={category.category_id}
                                    className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-700 border border-neutral-300 font-medium"
                                >
                                    {category.category_name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Brand Safety */}
                <section className="bg-white border border-neutral-200 p-12">
                    <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">
                        Brand Safety Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Framework</p>
                            <p className="text-sm text-neutral-900 font-medium">
                                {podcast.metadata.brand_safety.framework}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Risk Level</p>
                            <p className="text-sm text-neutral-900 font-medium capitalize">
                                {podcast.metadata.brand_safety.risk_level}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Recommendation</p>
                            <p className="text-sm text-neutral-900 font-medium capitalize">
                                {podcast.metadata.brand_safety.recommendation}
                            </p>
                        </div>
                    </div>

                    {podcast.metadata.is_branded && (
                        <div className="pt-8 border-t border-neutral-200">
                            <div className="flex items-start gap-4">
                                <BarChart3 className="w-5 h-5 text-neutral-500 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-neutral-900 font-medium mb-2">
                                        Branded Content Analysis
                                    </h3>
                                    <p className="text-sm text-neutral-700 mb-2">
                                        Confidence Score: {(podcast.metadata.is_branded_confidence_score * 100).toFixed(0)}%
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        {podcast.metadata.is_branded_confidence_reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}