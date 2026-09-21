import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ChapterThemeProvider } from '@/components/ThemeContext';

const queryClient = new QueryClient();

export function GlobalProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ChapterThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* Toast Provider Placeholder */}
        </QueryClientProvider>
      </ChapterThemeProvider>
    </ThemeProvider>
  );
}
