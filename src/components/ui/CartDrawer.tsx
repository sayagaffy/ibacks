import { Button } from "./Button";
import { CartDrawerEmpty } from "./CartDrawerEmpty";
import { CartDrawerItemRow } from "./CartDrawerItem";
import { CartDrawerItem } from "./cartTypes";

interface CartDrawerProps {
  open: boolean;
  items: CartDrawerItem[];
  totalAmount: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  totalAmount,
  onClose,
  onRemove,
  onUpdateQuantity,
  onCheckout,
}: CartDrawerProps) {
  const hasItems = items.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Tutup keranjang"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang Belanja"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface text-on-surface border-l surface-border shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b surface-border">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
              Cart
            </p>
            <h2 className="text-lg font-semibold">Keranjang Anda</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="Tutup"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-72px)]">
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!hasItems && <CartDrawerEmpty />}

            {hasItems && (
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <CartDrawerItemRow
                    key={item.id}
                    item={item}
                    onRemove={onRemove}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>
            )}
          </div>

          {hasItems && (
            <div className="border-t surface-border px-5 py-4 bg-surface">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-on-surface-variant">
                  Subtotal ({items.length} item)
                </span>
                <span className="font-semibold">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <Button className="w-full" variant="primary" onClick={onCheckout}>
                Lanjut ke Checkout
              </Button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
