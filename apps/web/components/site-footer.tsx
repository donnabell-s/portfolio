import { Container } from './container';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/10 dark:border-white/10">
      <Container className="flex flex-col items-center justify-between gap-2 py-8 text-sm text-foreground/60 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Donna Sembrano. Built with Next.js and Express.</p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          GitHub
        </a>
      </Container>
    </footer>
  );
}
