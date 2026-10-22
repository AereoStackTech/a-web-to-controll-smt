import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { LanguageProvider } from '@/lib/i18n/language-context';

export const metadata: Metadata = {
  title: 'OpsPulse — Operations, Task & File Workspace',
  description: 'Internal team operations, project tracking, task execution board, and centralized file asset workspace.',
  openGraph: {
    title: 'OpsPulse — Operations, Task & File Workspace',
    description: 'Internal team operations, project tracking, task execution board, and centralized file asset workspace.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpsPulse — Operations, Task & File Workspace',
    description: 'Internal team operations, project tracking, task execution board, and centralized file asset workspace.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
