import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Setting } from "@/lib/types";
import type { SettingMap } from "@/lib/site-settings";
import { onSiteSettingsRefresh } from "@/lib/catalog-events";

interface SiteSettingsContextType {
  settings: SettingMap;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

function rowsToSettings(rows: Setting[]) {
  const next: SettingMap = {};
  rows.forEach((row) => {
    next[row.key] = row.value as SettingMap[string];
  });
  return next;
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("settings").select().order("key", { ascending: true });
    setSettings(rowsToSettings(((data as Setting[]) ?? [])));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();

    const removeLocalListener = onSiteSettingsRefresh(() => {
      void refresh();
    });

    const channel = supabase
      .channel("mevaq-site-settings-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      removeLocalListener();
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return context;
}
