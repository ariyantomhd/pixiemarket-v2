import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderID, cartItems } = await req.json();

    // 1. Panggil API PayPal untuk Capture Payment
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const captureData = await response.json();

    if (captureData.status === "COMPLETED") {
      // 2. Jika sukses, update status di DB Supabase
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          paypal_order_id: orderID,
          total_price: captureData.purchase_units[0].payments.captures[0].amount.value,
          status: "PAID",
          items_json: cartItems
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      return NextResponse.json({ status: "success", orderId: order.id });
    }

    return NextResponse.json({ status: "failed", details: captureData }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "PayPal API Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}