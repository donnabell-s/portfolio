import { Container } from './container';

const PHONE = '+63 929 195 5342';
const EMAIL = 'donnasembrano03@gmail.com';

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-16 border-t border-black/10 dark:border-white/10">
      <Container className="py-12">
        <h2 className="mb-4 text-xl font-semibold">Contact</h2>
        <div className="space-y-2 text-sm text-foreground/70">
          <a
            href={`tel:${PHONE.replace(/\s+/g, '')}`}
            className="flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <PhoneIcon />
            {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <MailIcon />
            {EMAIL}
          </a>
        </div>
      </Container>
      <Container className="flex flex-col items-center justify-between gap-2 border-t border-black/10 py-6 text-sm text-foreground/60 sm:flex-row dark:border-white/10">
        <p>&copy; {new Date().getFullYear()} Donna Sembrano. Built with Next.js and Express.</p>
        <a
          href="https://github.com/donnabell-s/portfolio"
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

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.5 2.5.8 3.8.9.6 0 1 .5 1 1v3.4c0 .6-.5 1-1 1C10.6 21.3 2.7 13.4 2.7 3.8c0-.6.5-1 1-1H7c.6 0 1 .4 1 1 .1 1.3.4 2.6.9 3.8.1.4.1.8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m3.5 6 7.4 6a1.7 1.7 0 0 0 2.2 0l7.4-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
