import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
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

  // 1. PROTEKSI: Cek Sesi Login User
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Silakan login dulu, Bang!" }, 
      { status: 401 }
    );
  }

  try {
    // 2. VALIDASI: Cek apakah user sudah bayar produk ini
    // Memeriksa tabel 'orders' dengan status 'PAID' yang berisi ID produk di items_json
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("status", "PAID")
      .contains("items_json", [{ id: path }])
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: "Lisensi tidak ditemukan. Pastikan pembayaran sudah lunas, Bang!" }, 
        { status: 403 }
      );
    }

    // 3. STORAGE: Ambil file asli dari Private Bucket
    const { data: fileBlob, error: downloadErr } = await supabase.storage
      .from("assets")
      .download(`${path}.zip`);

    if (downloadErr || !fileBlob) {
      throw new Error("Gagal mengambil file dari storage. Hubungi Admin!");
    }

    // 4. LOGGING: Catat riwayat download ke database
    // Gunakan 'upsert' atau 'insert' agar Admin tahu siapa yang download
    const { error: logErr } = await supabase.from("download_logs").insert({
      user_id: session.user.id,
      asset_path: path,
      downloaded_at: new Date().toISOString()
    });

    if (logErr) {
      // Kita log ke console saja, jangan stop proses download hanya karena gagal catat log
      console.error("Gagal mencatat log download:", logErr.message);
    }

    // 5. DELIVERY: Kirim file ke browser untuk di-download
    return new NextResponse(fileBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${path}.zip"`,
        "Cache-Control": "no-store", // Jangan simpan cache agar validasi selalu berjalan
      },
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Download System Error:", errorMessage);

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}