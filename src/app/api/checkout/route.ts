import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface CartItem {
  id: string;
  quantity: number;
}

export async function POST(req: Request) {
  // 1. Await cookies-nya dulu Bang
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const { items }: { items: CartItem[] } = await req.json();
    const productIds = items.map((i) => i.id);

    const { data: products, error: fetchErr } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (fetchErr || !products) throw new Error("Products not found");

    const totalAmount = items.reduce((acc: number, item: CartItem) => {
      const p = products.find((dbP) => dbP.id === item.id);
      return acc + (p?.price || 0) * item.quantity;
    }, 0);

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        total_price: totalAmount,
        status: "PENDING",
        items_json: items 
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    return NextResponse.json({ orderId: order.id, total: totalAmount });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}