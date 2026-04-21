import Link from "next/link";
import { Button } from "./Button";

export function CartDrawerEmpty() {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7 text-on-surface-variant"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <p className="text-sm text-on-surface-variant mb-4">
        Keranjang masih kosong. Jelajahi koleksi terbaik iBacks.
      </p>
      <Link href="/search">
        <Button variant="secondary">Mulai Belanja</Button>
      </Link>
    </div>
  );
}
