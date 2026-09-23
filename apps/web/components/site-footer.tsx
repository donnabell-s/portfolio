import { Container } from './container';

const PHONE = '+63 929 195 5342';
const EMAIL = 'donnasembrano03@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/donna-sembrano/';
const GITHUB = 'https://github.com/donnabell-s';

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
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <LinkedInIcon />
            linkedin.com/in/donna-sembrano
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            <GitHubIcon />
            github.com/donnabell-s
          </a>
        </div>
      </Container>
      <Container className="flex flex-col items-center justify-between gap-2 border-t border-black/10 py-6 text-sm text-foreground/60 sm:flex-row dark:border-white/10">
        <p>&copy; {new Date().getFullYear()} Donna Sembrano. Built with Next.js and Express.</p>
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

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001ZM3 9.5h4v11H3v-11Zm6.5 0h3.84v1.5h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v6.46h-4v-5.73c0-1.37-.03-3.12-1.91-3.12-1.92 0-2.21 1.5-2.21 3.02v5.83h-4v-11Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c-5.5 0-10 4.5-10 10a10 10 0 0 0 6.84 9.5c.5.1.68-.22.68-.48v-1.87c-2.78.6-3.37-1.2-3.37-1.2-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.1 2.92.83.09-.65.35-1.1.63-1.35-2.22-.25-4.56-1.1-4.56-4.94 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.41.1 2.66.64.71 1.03 1.6 1.03 2.7 0 3.85-2.35 4.69-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 22 12.2c0-5.5-4.5-10-10-10Z" />
    </svg>
  );
}
