export default function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      <path
        d="M50 6 L88 20 V48 C88 70 72 86 50 94 C28 86 12 70 12 48 V20 Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M50 6 L88 20 V48 C88 70 72 86 50 94 C28 86 12 70 12 48 V20 Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M34 50 L45 61 L67 37"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
