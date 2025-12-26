'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hash, Radio, Search, Loader2 } from 'lucide-react';

interface KeywordStat {
    keyword: string;
    count: number;
}

export default function KeywordsPage() {
    const [keywords, setKeywords] = useState<KeywordStat[]>([]);
    const [filteredKeywords, setFilteredKeywords] = useState<KeywordStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchKeywords();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredKeywords(keywords);
        } else {
            const filtered = keywords.filter((k) =>
                k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredKeywords(filtered);
        }
    }, [searchTerm, keywords]);

    const fetchKeywords = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/keyword-stats');
            const data = await response.json();

            if (data.success) {
                setKeywords(data.data);
                setFilteredKeywords(data.data);
            }
        } catch (error) {
            console.error('Error fetching keyword stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalFacts = keywords.reduce((sum, k) => sum + k.count, 0);

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Hash className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
                        <h1 className="text-4xl font-light text-neutral-900">Keywords</h1>
                    </div>
                    <p className="text-sm text-neutral-600 max-w-2xl">
                        Explore surprising facts by topic and keyword
                    </p>
                </div>
            </header>

            {/* Stats Bar */}
            <section className="border-b border-neutral-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-light text-neutral-900 mb-1">
                                {keywords.length.toLocaleString()}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                                Unique Keywords
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-light text-neutral-900 mb-1">
                                {totalFacts.toLocaleString()}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                                Total Facts Tagged
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="bg-white border-b border-neutral-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
                            strokeWidth={1.5}
                        />
                        <input
                            type="text"
                            placeholder="Search keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white text-neutral-900 pl-11 pr-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
                        />
                    </div>

                    {!loading && filteredKeywords.length > 0 && (
                        <div className="mt-4 text-xs text-neutral-500">
                            Showing {filteredKeywords.length} of {keywords.length} keywords
                            {searchTerm && (
                                <span className="ml-2">
                                    matching "<span className="text-neutral-900">{searchTerm}</span>"
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-neutral-500">Loading keywords...</p>
                    </div>
                ) : filteredKeywords.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-sm mb-2">
                            {searchTerm
                                ? `No keywords found matching "${searchTerm}".`
                                : 'No keywords available.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-sm text-neutral-900 underline hover:no-underline mt-4"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredKeywords.map((stat) => (
                            <Link
                                key={stat.keyword}
                                href={`/surprising-facts?keyword=${encodeURIComponent(
                                    stat.keyword
                                )}`}
                                className="bg-white border border-neutral-200 p-6 hover:border-neutral-900 transition-colors group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-light text-neutral-900 mb-2 group-hover:underline truncate">
                                            {stat.keyword}
                                        </h3>
                                        <p className="text-xs uppercase tracking-wider text-neutral-500">
                                            {stat.count} {stat.count === 1 ? 'fact' : 'facts'}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-12 h-12 border border-neutral-300 bg-white flex items-center justify-center">
                                        <span className="text-sm font-medium text-neutral-900">
                                            {stat.count}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}