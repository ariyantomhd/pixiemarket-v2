// src/types/user.ts

export interface User {
    id: string | number;
    username: string; // Tambahkan ini karena kita pakai di Register/Login
    name: string;     // Nama lengkap (bisa diambil dari username saat pertama daftar)
    email: string;
    avatar_url?: string; // Samakan dengan kolom SQL yang tadi (avatar_url)
    role: 'user' | 'admin';
    created_at?: string | Date;
}

// Tambahan: Helper untuk Auth Response dari API
export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string; // Jika nanti Abang pakai JWT
    message?: string;
}