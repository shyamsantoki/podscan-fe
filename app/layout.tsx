import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Podcast Library',
    description: 'Discover and explore podcast content',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}