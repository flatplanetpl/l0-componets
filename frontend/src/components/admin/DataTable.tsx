'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { SearchField } from '../ui/choiceFields';

export interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface Action<T> {
  name: string;
  handler: (item: T) => void;
  icon?: ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  title?: string;
  onAdd?: () => void;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  selectableRows?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  getRowId?: (item: T, index: number) => string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onExport?: () => void;
}

type SortDirection = 'asc' | 'desc';

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  title = 'Data Table',
  onAdd,
  onSearch,
  searchPlaceholder = 'Search...',
  loading,
  selectableRows,
  onSelectionChange,
  getRowId,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onExport,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRowMap, setSelectedRowMap] = useState<Record<string, boolean>>({});

  const rowId = (item: T, index: number) => {
    if (getRowId) return getRowId(item, index);
    if (typeof item.id === 'string' || typeof item.id === 'number') {
      return String(item.id);
    }
    return String(index);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setPage(1);
    onSearch?.(term);
  };

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (valueA === valueB) return 0;
        const order = valueA > valueB ? 1 : -1;
        return sortDirection === 'asc' ? order : -order;
      })
    : data;

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const allSelected = selectableRows && paginatedData.length > 0 && paginatedData.every((item, index) => selectedRowMap[rowId(item, startIndex + index)]);

  const computeSelectedItems = (map: Record<string, boolean>) =>
    sortedData.filter((item, index) => map[rowId(item, index)]);

  const toggleRow = (item: T, index: number) => {
    const id = rowId(item, index);
    setSelectedRowMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      onSelectionChange?.(computeSelectedItems(next));
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!selectableRows) return;
    if (allSelected) {
      setSelectedRowMap((prev) => {
        const next = { ...prev };
        paginatedData.forEach((item, index) => {
          const id = rowId(item, startIndex + index);
          delete next[id];
        });
        onSelectionChange?.(computeSelectedItems(next));
        return next;
      });
    } else {
      setSelectedRowMap((prev) => {
        const next = { ...prev };
        paginatedData.forEach((item, index) => {
          const id = rowId(item, startIndex + index);
          next[id] = true;
        });
        onSelectionChange?.(computeSelectedItems(next));
        return next;
      });
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <div className="flex flex-wrap items-center gap-3">
          {onSearch !== undefined && (
            <SearchField
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="w-64"
            />
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Eksportuj
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Dodaj nowy
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              {selectableRows && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Zaznacz wszystkie"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${
                    column.align === 'right'
                      ? 'text-right'
                      : column.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => column.sortable && toggleSort(column.key)}
                    className={`inline-flex items-center gap-1 ${column.sortable ? 'cursor-pointer select-none' : 'cursor-default'}`}
                  >
                    {column.title}
                    {column.sortable && sortKey === column.key && (
                      <span aria-hidden="true">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Akcje
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length ? 1 : 0) + (selectableRows ? 1 : 0)} className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Wczytywanie danych…
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length ? 1 : 0) + (selectableRows ? 1 : 0)} className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Brak danych do wyświetlenia.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIndex) => {
                const globalIndex = startIndex + rowIndex;
                const id = rowId(item, globalIndex);
                const rowSelected = !!selectedRowMap[id];
                return (
                  <tr key={id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/70 ${rowSelected ? 'bg-blue-50/60 dark:bg-blue-500/10' : ''}`}>
                    {selectableRows && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={rowSelected}
                          onChange={() => toggleRow(item, globalIndex)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          aria-label="Zaznacz wiersz"
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-sm text-slate-600 dark:text-slate-300 ${
                          column.align === 'right'
                            ? 'text-right'
                            : column.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {actions.map((action, actionIndex) => {
                            const iconKey = action.name?.toLowerCase().trim() ?? '';
                            const defaultIcon = defaultActionIcons[iconKey] ?? <MoreHorizontal className="h-4 w-4" />;
                            return (
                              <button
                                key={actionIndex}
                                onClick={() => action.handler(item)}
                                className="text-blue-600 transition hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                                title={action.name}
                              >
                                {action.icon ?? defaultIcon}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > pageSize && (
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-muted-foreground dark:border-slate-700 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span>Wierszy na stronę:</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {startIndex + 1}–{Math.min(startIndex + pageSize, sortedData.length)} z {sortedData.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={clampedPage === 1}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
              >
                Poprzednia
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={clampedPage === totalPages}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-50 dark:border-slate-600"
              >
                Następna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultActionIcons: Record<string, ReactNode> = {
  edit: <Pencil className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  remove: <Trash2 className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  details: <Eye className="h-4 w-4" />,
};
