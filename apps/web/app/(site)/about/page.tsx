import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { ProfilePortrait } from '@/components/profile-portrait';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, experience, and how this site was built.',
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="grid items-start gap-12 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="mb-8 text-4xl font-bold tracking-tight">About</h1>
          <div className="max-w-xl space-y-4 text-foreground/80">
            <p>
              I&apos;m Donna Elizabeth Sembrano, a Computer Science graduate from the University
              of San Jose-Recoletos in Cebu, majoring in Artificial Intelligence and Web
              Development. I like building things that actually solve real problems, whether
              that&apos;s a full-stack web app, a machine learning pipeline, or a system that
              brings AI into everyday workflows.
            </p>
            <p>
              My core stack includes Python, JavaScript/TypeScript, React, Next.js, and Django,
              and I enjoy working across the full development process, from architecture to
              deployment. I&apos;m someone who locks in once given a task, and I genuinely enjoy
              the process of figuring things out, whether that&apos;s debugging a tricky issue or
              learning a new tool on the fly.
            </p>
          </div>
        </div>
        <ProfilePortrait variant="hero" size={420} />
      </div>
    </Container>
  );
}
