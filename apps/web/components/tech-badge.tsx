export function TechBadge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-foreground/70 dark:border-white/15">
      {children}
    </span>
  );
}
