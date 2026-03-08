"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { removeAuthSession } from '@/app/actions/auth'; // Import helper yang kita buat di Tahap 1

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>; // Ubah jadi Promise karena akan panggil Server Action
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('pixie-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pixie-user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // 1. Bersihkan state di UI (React)
      setUser(null);
      
      // 2. Bersihkan jejak di browser (LocalStorage)
      localStorage.removeItem('pixie-user');
      localStorage.removeItem('pixie-cart'); // Sekalian bersihkan cart biar aman
      
      // 3. PANGGIL SERVER ACTION (Cabut Tiket di Middleware)
      // Ini bagian yang bikin "Satu Pintu" jadi beneran jalan
      await removeAuthSession();

      // 4. Redirect pakai window.location agar state internal benar-benar "mati"
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login"; // Fallback tetap keluar
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};