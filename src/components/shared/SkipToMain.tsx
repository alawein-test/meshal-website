import { cn } from '@/lib/utils';

export const SkipToMain = () => {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'fixed top-4 left-4 z-[100]',
        'px-4 py-2 rounded-md',
        'bg-primary text-primary-foreground',
        'font-medium text-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-transform duration-200',
        'focus:translate-y-0 -translate-y-full'
      )}
    >
      Skip to main content
    </a>
  );
};

export default SkipToMain;
