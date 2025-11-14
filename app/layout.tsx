import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Text-to-Video Generator Agent',
  description: 'Generate cinematic, production-ready AI video prompts from any idea.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
