import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyIcon?: ReactNode;
  emptyText?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyIcon,
  emptyText = "Məlumat tapılmadı",
  keyExtractor,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-slate-400"
      >
        {emptyIcon}
        <p className="mt-4 text-sm">{emptyText}</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-sm text-slate-700">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "-")}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
