import { Link } from 'react-router';

export function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 rounded-lg"
      aria-label="Newsroom — home"
    >
      <span
        aria-hidden
        className="bg-ink text-paper relative flex size-8 items-center justify-center rounded-lg font-serif text-lg font-bold"
      >
        N
        <span className="border-paper bg-accent absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2" />
      </span>
      <span className="font-serif text-[1.375rem] font-bold tracking-tight">Newsroom</span>
    </Link>
  );
}
