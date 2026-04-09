import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount =
      typeof body?.amount === "number"
        ? body.amount
        : Number(body?.amount) || 0;
    const rawItems: unknown[] = Array.isArray(body?.items) ? body.items : [];
    const items = rawItems
      .map((item: unknown) => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const id = record.id;
        const name = typeof record.name === "string" ? record.name : "Item";
        const quantity =
          typeof record.quantity === "number"
            ? record.quantity
            : Number(record.quantity);
        const price =
          typeof record.price === "number"
            ? record.price
            : Number(record.price);
        if (!id || !Number.isFinite(quantity) || !Number.isFinite(price))
          return null;
        return { id, name, quantity, price };
      })
      .filter(
        (
          item,
        ): item is {
          id: string | number;
          name: string;
          quantity: number;
          price: number;
        } => Boolean(item),
      );

    const XENDIT_API_KEY =
      process.env.XENDIT_SECRET_KEY || "xnd_development_dummy";

    // Create Basic Auth from Secret Key
    const authString = Buffer.from(XENDIT_API_KEY + ":").toString("base64");

    // Minimal Required Xendit Params for v2/invoices
    const payload = {
      external_id: `INV-${Date.now()}`,
      amount: amount,
      description: `Invoice for ${items.length} items from iBacks E-commerce`,
      invoice_duration: 86400, // 24 hours
      currency: "IDR",
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: "Electronics/Accessories",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${item.id}`,
      })),
      success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart?status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart?status=failed`,
      should_send_email: true,
    };

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Xendit Error:", data);
      return NextResponse.json(
        { error: "Gagal membuat invoice", details: data },
        { status: 400 },
      );
    }

    // data.invoice_url is the target to redirect the user to checkout UI from Xendit
    return NextResponse.json({ invoiceUrl: data.invoice_url, id: data.id });
  } catch (error: unknown) {
    console.error("Checkout Handler Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
