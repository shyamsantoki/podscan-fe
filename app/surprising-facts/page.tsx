'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Quote, Hash, Sparkle } from 'lucide-react';
import { SurprisingFact } from '@/types/podcast';

export default function SurprisingFactsPage() {
    const [facts, setFacts] = useState<SurprisingFact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFacts();
    }, []);

    const fetchFacts = async () => {
        try {
            const res = await fetch('/api/surprising-facts');
            const data = await res.json();
            if (data.success) {
                setFacts(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="w-10 h-10 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Sparkle className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
                        <h1 className="text-4xl font-light text-neutral-900">
                            Surprising Facts
                        </h1>
                    </div>
                    <p className="text-sm text-neutral-600 max-w-2xl">
                        Interesting insights and unexpected moments discovered across podcast episodes.
                    </p>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="space-y-16">
                    {facts.map((fact) => (
                        <article
                            key={fact._id}
                            className="bg-white border border-neutral-200 p-10"
                        >
                            {/* Podcast / Episode */}
                            <Link
                                href={`/podcast/${fact.episode.episode_id}`}
                                className="flex gap-6 mb-8 group"
                            >
                                <div className="relative w-20 h-20 bg-neutral-100 flex-shrink-0">
                                    <Image
                                        src={fact.podcast.podcast_image}
                                        alt={fact.podcast.podcast_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                                        {fact.podcast.podcast_name}
                                    </p>
                                    <h2 className="text-lg font-light text-neutral-900 group-hover:underline">
                                        {fact.episode.episode_title}
                                    </h2>
                                </div>
                            </Link>

                            {/* Fact Title + Score */}
                            <div className="flex items-start justify-between gap-6 mb-4">
                                <h3 className="text-2xl font-light text-neutral-900">
                                    {fact.title}
                                </h3>

                                <div className="flex items-center gap-2 px-4 py-2 border border-neutral-300">
                                    <Lightbulb className="w-4 h-4 text-neutral-500" />
                                    <span className="text-sm font-medium text-neutral-900">
                                        {fact.score.toFixed(1)} / 10
                                    </span>
                                </div>
                            </div>

                            {/* Explanation */}
                            <p className="text-sm leading-relaxed text-neutral-700 max-w-4xl mb-8">
                                {fact.explanation}
                            </p>

                            {/* Quotes */}
                            {fact.quotes.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Quote className="w-4 h-4 text-neutral-400" />
                                        <span className="text-xs uppercase tracking-wider text-neutral-500">
                                            Notable Quotes
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {fact.quotes.map((quote, idx) => (
                                            <blockquote
                                                key={idx}
                                                className="border-l-2 border-neutral-300 pl-6 text-sm text-neutral-700"
                                            >
                                                “{quote}”
                                            </blockquote>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Keywords */}
                            {fact.keywords.length > 0 && (
                                <div className="pt-6 border-t border-neutral-200">
                                    <div className="flex flex-wrap gap-3">
                                        {fact.keywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-4 py-2 text-xs border border-neutral-300 text-neutral-700"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
