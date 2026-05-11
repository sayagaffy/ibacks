import Image from "next/image";
import { CartDrawerItem } from "./cartTypes";

interface CartDrawerItemProps {
  item: CartDrawerItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartDrawerItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: CartDrawerItemProps) {
  return (
    <div className="flex gap-3 items-center border surface-border rounded-2xl p-3 bg-surface-container">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high relative">
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold line-clamp-2">{item.name}</p>
        <p className="text-xs text-on-surface-variant mt-1">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border surface-border flex items-center justify-center text-on-surface-variant hover:text-primary"
          >
            <span className="text-lg leading-none">-</span>
          </button>
          <span className="text-sm font-semibold w-6 text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border surface-border flex items-center justify-center text-on-surface-variant hover:text-primary"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-red-400 transition-colors"
        aria-label={`Hapus ${item.name}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
