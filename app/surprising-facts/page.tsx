'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    Quote,
    Hash,
    Radio,
    Search,
    Loader2,
} from 'lucide-react';

interface SurprisingFact {
    _id: string;
    title: string;
    explanation: string;
    score: number;
    quotes: string[];
    keywords: string[];
    podcast: {
        podcast_id: string;
        podcast_name: string;
        podcast_image: string;
    };
    episode: {
        episode_id: string;
        episode_title: string;
    };
}

interface PaginationInfo {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
}

/* ---------------- Page ---------------- */

export default function SurprisingFactsPage() {
    const [facts, setFacts] = useState<SurprisingFact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [factsPerPage, setFactsPerPage] = useState(10);

    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        limit: 10,
        skip: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchFacts();
    }, [currentPage, factsPerPage, debouncedSearchTerm]);

    const fetchFacts = async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * factsPerPage;
            const params = new URLSearchParams({
                limit: factsPerPage.toString(),
                skip: skip.toString(),
            });

            // Add search parameter if exists
            if (debouncedSearchTerm.trim()) {
                params.append('search', debouncedSearchTerm.trim());
            }

            const response = await fetch(`/api/surprising-facts?${params}`);
            const data = await response.json();

            if (data.success) {
                setFacts(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching surprising facts:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToNextPage = () => {
        if (pagination.hasMore) {
            goToPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 7;
        const totalPages = pagination.totalPages;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const indexOfFirstFact = pagination.skip + 1;
    const indexOfLastFact = Math.min(
        pagination.skip + pagination.limit,
        pagination.total
    );

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Radio className="w-8 h-8 text-neutral-900" strokeWidth={1.5} />
                        <h1 className="text-4xl font-light text-neutral-900">
                            Surprising Facts
                        </h1>
                    </div>
                    <p className="text-sm text-neutral-600 max-w-2xl">
                        A curated collection of unexpected insights discovered across podcast
                        episodes.
                    </p>
                </div>
            </header>

            {/* Stats Bar */}
            <section className="border-b border-neutral-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-light text-neutral-900 mb-1">
                                {pagination.total.toLocaleString()}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                                {debouncedSearchTerm ? 'Search Results' : 'Total Facts'}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-light text-neutral-900 mb-1">
                                {pagination.totalPages.toLocaleString()}
                            </div>
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                                Pages Available
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Controls */}
            <section className="bg-white border-b border-neutral-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400"
                                strokeWidth={1.5}
                            />
                            <input
                                type="text"
                                placeholder="Search surprising facts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white text-neutral-900 pl-11 pr-4 py-3 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
                            />
                            {searchTerm !== debouncedSearchTerm && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <Loader2
                                        className="w-4 h-4 text-neutral-400 animate-spin"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Results per page */}
                        <div className="flex items-center gap-3">
                            <label className="text-xs uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                                Show
                            </label>
                            <select
                                value={factsPerPage}
                                onChange={(e) => {
                                    setFactsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                disabled={loading}
                                className="bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-xs uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                                per page
                            </span>
                        </div>
                    </div>

                    {/* Results info */}
                    {!loading && facts.length > 0 && (
                        <div className="mt-4 text-xs text-neutral-500">
                            Showing {indexOfFirstFact}–{indexOfLastFact} of{' '}
                            {pagination.total.toLocaleString()}{' '}
                            {pagination.total === 1 ? 'result' : 'results'}
                            {debouncedSearchTerm && (
                                <span className="ml-2">
                                    for "
                                    <span className="text-neutral-900">{debouncedSearchTerm}</span>
                                    "
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-neutral-500">
                            Loading surprising facts...
                        </p>
                    </div>
                ) : facts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-sm mb-2">
                            {debouncedSearchTerm
                                ? `No facts found matching "${debouncedSearchTerm}".`
                                : 'No surprising facts available.'}
                        </p>
                        {debouncedSearchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-sm text-neutral-900 underline hover:no-underline mt-4"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Facts list */}
                        <div className="space-y-16 mb-16">
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

                                    {/* Fact title + score */}
                                    <div className="flex items-start justify-between gap-6 mb-4">
                                        <h3 className="text-2xl font-light text-neutral-900 max-w-3xl">
                                            {fact.title}
                                        </h3>

                                        <div className="flex items-center gap-2 px-4 py-2 border border-neutral-300 bg-white">
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
                                        <div className="mb-10">
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
                                                        className="border-l-2 border-neutral-300 pl-6 text-sm text-neutral-700 leading-relaxed"
                                                    >
                                                        "{quote}"
                                                    </blockquote>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Keywords */}
                                    {fact.keywords.length > 0 && (
                                        <div className="pt-6 border-t border-neutral-200">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Hash className="w-4 h-4 text-neutral-400" />
                                                <span className="text-xs uppercase tracking-wider text-neutral-500">
                                                    Related Keywords
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {fact.keywords.map((keyword, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-4 py-2 text-xs text-neutral-700 border border-neutral-300 bg-white"
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

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="space-y-6">
                                <nav className="flex items-center justify-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft
                                            className="w-4 h-4 text-neutral-700"
                                            strokeWidth={1.5}
                                        />
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((pageNumber, index) => (
                                        <React.Fragment key={index}>
                                            {pageNumber === '...' ? (
                                                <span className="px-3 py-2 text-neutral-400 text-sm">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => goToPage(pageNumber as number)}
                                                    className={`px-4 py-2 text-sm border transition-colors ${currentPage === pageNumber
                                                            ? 'bg-neutral-900 text-white border-neutral-900'
                                                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={goToNextPage}
                                        disabled={!pagination.hasMore}
                                        className="p-2 border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight
                                            className="w-4 h-4 text-neutral-700"
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                </nav>

                                {/* Page info */}
                                <div className="text-center">
                                    <p className="text-xs text-neutral-500">
                                        Page {currentPage} of {pagination.totalPages}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
