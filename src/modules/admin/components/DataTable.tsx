import React from "react";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "danger" | "primary";
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  onSort,
  sortKey,
  sortDirection,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-neutral-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-neutral-100" : ""
                  }`}
                  onClick={() =>
                    column.sortable && onSort && onSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-primary-600">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-neutral-50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] ?? "-")}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {actions.map((action, index) => {
                        if (action.show && !action.show(item)) return null;

                        const variantClasses = {
                          default:
                            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
                          danger:
                            "text-neutral-600 hover:text-red-600 hover:bg-red-50",
                          primary:
                            "text-neutral-600 hover:text-primary-600 hover:bg-primary-50",
                        };

                        return (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              variantClasses[action.variant || "default"]
                            }`}
                            title={action.label}
                          >
                            {action.icon || <MoreVertical size={18} />}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Common action presets
export const commonActions = {
  edit: <Edit size={18} />,
  delete: <Trash2 size={18} />,
  view: <Eye size={18} />,
};
