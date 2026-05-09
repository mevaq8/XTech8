import { useState } from "react";

interface StatusToggleProps {
  isActive: boolean;
  onChange: (active: boolean) => void;
  disabled?: boolean;
}

export function StatusToggle({ isActive, onChange, disabled = false }: StatusToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onChange(!isActive);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        isActive ? "bg-emerald-500" : "bg-slate-300"
      } ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
