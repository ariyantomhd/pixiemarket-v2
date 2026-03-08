import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { getProductImage } from '@/lib/utils'; // Helper untuk handle URL Supabase

// Interface untuk item di dalam keranjang
export interface CartItem extends Pick<Product, 'id' | 'name' | 'price' | 'slug'> {
  image_url: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  purchasedItems: CartItem[]; // Koleksi permanen untuk Dashboard
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  removeItem: (id: number | string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  completePurchase: (selectedIds: (number | string)[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      purchasedItems: [],
      isOpen: false,

      // Mengatur buka/tutup Drawer Keranjang
      setOpen: (open) => set({ isOpen: open }),

      // Logika Menambah Barang ke Keranjang
      addItem: (product) => set((state) => {
        // 1. Cek apakah produk sudah ada di keranjang
        const existing = state.items.find((item) => item.id === product.id);
        
        // Jika sudah ada, cukup buka keranjang tanpa menambah item baru
        if (existing) return { ...state, isOpen: true };

        // 2. Olah gambar menggunakan helper agar menjadi URL Absolute yang valid
        // Mengubah ["recipe.png"] menjadi "https://rdbch.../recipe.png"
        const thumbnail = getProductImage(product.images);

        // 3. Buat objek item baru sesuai interface CartItem
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          slug: product.slug,
          image_url: thumbnail,
          quantity: 1,
        };

        // Tambahkan ke array items dan otomatis buka drawer
        return { 
          items: [...state.items, newItem],
          isOpen: true 
        };
      }),

      // Menghapus satu item dari keranjang
      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

      // Menghapus semua isi keranjang
      clearCart: () => set({ items: [] }),

      // Menghitung total harga semua item di keranjang
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },

      // Fungsi Sakti: Memindahkan item dari Keranjang ke Dashboard (Koleksi Permanen)
      completePurchase: (selectedIds) => set((state) => {
        const bought = state.items.filter((item) => selectedIds.includes(item.id));
        
        return {
          purchasedItems: [...state.purchasedItems, ...bought],
          items: state.items.filter((item) => !selectedIds.includes(item.id)),
          isOpen: false
        };
      }),
    }),
    { 
      name: 'pixie-cart-storage', // Nama key di Local Storage browser
      partialize: (state) => ({ 
        items: state.items, 
        purchasedItems: state.purchasedItems 
      }),
    }
  )
);