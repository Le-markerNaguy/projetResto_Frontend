import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AdminSettings {
  // Ajoute ici tous les paramètres que tu veux partager
  theme?: "light" | "dark";
  showSidebar?: boolean;
  notificationVolume?: number; // 0-1
  [key: string]: any;
}

interface AdminSettingsContextType {
  settings: AdminSettings;
  setSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  updateSettings: (patch: Partial<AdminSettings>) => void;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>({
    theme: "light",
    showSidebar: true,
    notificationVolume: 1,
  });

  const updateSettings = (patch: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, setSettings, updateSettings }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const ctx = useContext(AdminSettingsContext);
  if (!ctx) throw new Error("useAdminSettings must be used within AdminSettingsProvider");
  return ctx;
}
