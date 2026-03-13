"use client";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Link from "next/link";
type VendorRow = { id: string; name: string; tags: string[]; owner: string; billing: string; currency: string; renewalDate: string; seats: string; monthly: string; annual: string };
export function VendorsTable({ data }: { data: VendorRow[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useMemo<ColumnDef<VendorRow>[]>(() => [
    { accessorKey: "name", header: "Vendor", cell: ({ row }) => <Link href={`/vendors/${row.original.id}`} className="font-medium hover:underline">{row.original.name}</Link> },
    { accessorKey: "tags", header: "Tags", cell: ({ row }) => row.original.tags.join(", ") || "—" }, { accessorKey: "owner", header: "Owner" }, { accessorKey: "billing", header: "Billing" }, { accessorKey: "currency", header: "Currency" }, { accessorKey: "monthly", header: "Monthly" }, { accessorKey: "annual", header: "Annual" }, { accessorKey: "renewalDate", header: "Renewal" }, { accessorKey: "seats", header: "Seats" }
  ], []);
  const table = useReactTable({ data, columns, state: { globalFilter }, onGlobalFilterChange: setGlobalFilter, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), globalFilterFn: (row, _columnId, filterValue) => Object.values(row.original).join(" ").toLowerCase().includes(String(filterValue).toLowerCase()) });
  return <div className="rounded-2xl border bg-white p-4"><div className="mb-4 flex items-center justify-between gap-4"><input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="w-80 rounded-xl border px-3 py-2 text-sm" placeholder="Search vendors" /></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead>{table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id} className="border-b text-left text-slate-500">{headerGroup.headers.map((header) => <th key={header.id} className="pb-3">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map((row) => <tr key={row.id} className="border-b last:border-0">{row.getVisibleCells().map((cell) => <td key={cell.id} className="py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table></div></div>;
}
