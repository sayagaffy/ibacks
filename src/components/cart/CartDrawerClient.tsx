"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { useCartStore } from "@/store/cartStore";
import { useCartDrawerStore } from "@/store/cartDrawerStore";

export function CartDrawerClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, removeItem, updateQuantity } = useCartStore();
  const { open, openDrawer, closeDrawer } = useCartDrawerStore();

  useEffect(() => {
    if (pathname === "/cart") {
      openDrawer();
    }
  }, [pathname, openDrawer]);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartDrawer
      open={open}
      items={items}
      totalAmount={totalAmount}
      onClose={closeDrawer}
      onRemove={removeItem}
      onUpdateQuantity={updateQuantity}
      onCheckout={() => {
        closeDrawer();
        router.push("/checkout");
      }}
    />
  );
}
