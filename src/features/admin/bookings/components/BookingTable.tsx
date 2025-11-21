import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import useDebounce from "@/hooks/useDebounce";
import { BOOKINGS_QK, usePaginatedBookingsQuery } from "../hooks/useBookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/axios";
import { toast } from "sonner";
import type { Booking } from "../types/booking.type";
import { CheckCircle, Trash2 } from "lucide-react";

export default function BookingTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = usePaginatedBookingsQuery({
    page,
    limit,
    keyword: debouncedSearch,
  });

  const cancelMutation = useMutation<void, Error, string>({
    mutationFn: (id) => http.patch(`/bookings/${id}/cancel`),
    onSuccess: () => {
      toast.success("Booking canceled successfully!");
      queryClient.invalidateQueries([...BOOKINGS_QK]);
    },
    onError: () => toast.error("Failed to cancel booking."),
  });

  const confirmMutation = useMutation<void, Error, string>({
    mutationFn: (id) => http.put(`/bookings/${id}/confirm`, {}),
    onSuccess: () => {
      toast.success("Booking confirmed successfully!");
      queryClient.invalidateQueries([...BOOKINGS_QK]);
    },
    onError: (err) => {
      console.log("Confirm error:", err);
      toast.error("Failed to confirm booking.");
    },
  });

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        id: "index",
        header: "#",
        cell: ({ row }) => (page - 1) * limit + row.index + 1,
      },
      { accessorKey: "bookingNumber", header: "Booking Number" },
      { accessorKey: "bookingType", header: "Type" },
      {
        id: "title",
        header: "Title",
        cell: ({ row }) => row.original.item?.title || "-",
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment Status",
        cell: ({ row }) => {
          const status = row.original.bookingStatus;
          const statusClasses =
            status === "cancelled"
              ? "bg-red-100 text-red-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700";

          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: "bookingStatus",
        header: "Booking Status",
        cell: ({ row }) => {
          const status = row.original.bookingStatus;
          const statusClasses =
            status === "cancelled"
              ? "bg-red-100 text-red-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700";

          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {/* Cancel Icon */}
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                cancelMutation.mutate(row.original.id);
              }}
              disabled={cancelMutation.isLoading}
            >
              <Trash2 size={18} />
            </Button>

            {/* Confirm Icon */}
            <Button
              size="sm"
              variant="ghost"
              className="text-green-600 hover:bg-green-100"
              onClick={(e) => {
                e.stopPropagation();
                confirmMutation.mutate(row.original.id);
              }}
              disabled={confirmMutation.isLoading}
            >
              <CheckCircle size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [page, limit, cancelMutation.isLoading, confirmMutation.isLoading]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[85vh]">
        <AdminBreadcrumb
          items={[
            { label: "Dashboard", to: "/admin/dashboard" },
            { label: "Bookings" },
          ]}
        />
        <div className="flex-1 overflow-auto pb-24 mt-4">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Bookings</h1>
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-72"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border shadow-sm">
            {isLoading ? (
              <div className="p-4 text-center">Loading bookings...</div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          navigate(`/admin/bookings/${row.original.id}`)
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t py-3 flex justify-between">
          <span>
            Page {page} of {data?.paginationResult.numberOfPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data?.paginationResult.numberOfPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
