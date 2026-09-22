import type { Metadata } from 'next';
import { Container } from '@/components/container';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, experience, and how this site was built.',
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">About</h1>
      <div className="max-w-2xl space-y-4 text-foreground/80">
        <p>
          I'm a full-stack developer who enjoys taking a project from a blank database schema to
          a deployed, working product. My background spans PHP, Django, and .NET, and this site
          itself is built on a stack I wanted to get hands-on with: a Node.js/Express API and a
          Next.js frontend.
        </p>
        <p>
          Rather than faking a demo, this portfolio <em>is</em> the demo — it has a real
          authenticated admin panel backing the project list you're browsing, a contact form with
          server-side abuse protection, and a Postgres database, all running on free hosting
          tiers with no ongoing cost.
        </p>
        <p>
          Older projects are presented as case studies with screenshots rather than live demos,
          since paying to keep several small apps running around the clock isn't a good trade —
          but every one of them links to its full source on GitHub.
        </p>
      </div>
    </Container>
  );
}
