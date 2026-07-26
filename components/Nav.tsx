import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-seal flex items-center justify-center text-white text-xs font-bold">
            ✓
          </span>
          <span className="font-display font-semibold tracking-tight text-ink">BuildProof</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/#projects" className="hover:text-ink transition-colors">
            Projects
          </Link>
          <Link href="/#verification" className="hover:text-ink transition-colors">
            How it works
          </Link>
        </nav>
      </div>
    </header>
  );
}
