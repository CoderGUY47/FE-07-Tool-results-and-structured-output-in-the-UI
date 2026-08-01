import type { Metadata } from 'next';
import { Google_Sans_Flex } from 'next/font/google';
import './globals.css';

const gflexFont = Google_Sans_Flex({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tool Results & Structured Output UI',
  description: 'Generative UI demonstration of AI tools, Zod schemas, 4-state lifecycle UI, and designed error handling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gflexFont.variable} ${gflexFont.className} h-full antialiased`}>
      <body className={`${gflexFont.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
