import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';

import {
    usePaginatedTransportationsQuery,
    useDeleteTransportationMutation,
} from '../hooks/useTransportations';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import type { Transportation } from '../types/transportation.type';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import useDebounce from '@/hooks/useDebounce';

export default function TransportationTable() {
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [search, setSearch] = useState('');

    const debouncedSearchTerm = useDebounce(search, 300);

    const { data } = usePaginatedTransportationsQuery({
        page,
        limit,
        keyword: debouncedSearchTerm,
    });

    const deleteMutation = useDeleteTransportationMutation();

    // Optimistic delete with toast
    const handleDeleteConfirmed = useCallback((transport: Transportation) => {
        const loadingId = toast.loading('Deleting...');

        deleteMutation.mutate(transport.id, {
            onSuccess: () => {
                toast.success('Transportation deleted!', { id: loadingId });

                if (data && data.data.length === 1 && page > 1) {
                    setPage((p) => p - 1);
                }
            },
            onError: () => {
                toast.error('Failed to delete transportation.', { id: loadingId });
            },
        });
    }, [deleteMutation, data, page]);

    const columns = useMemo<ColumnDef<Transportation>[]>(() => [
        {
            id: 'index',
            header: '#',
            cell: ({ row }) => (page - 1) * limit + row.index + 1,
        },
        { accessorKey: 'companyName', header: 'Company' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'class', header: 'Class' },
        { accessorKey: 'description', header: 'Description' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const transport = row.original;
                return (
                    <div className="flex gap-2 items-center">
                        {/* Edit button */}
                        <Link to={`/admin/transportations/edit/${transport.id}`}>
                            <Button
                                size="sm"
                                className="flex items-center justify-center w-10 h-10 p-0 rounded-full
                       bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800
                       transition-colors duration-200"
                                aria-label={`Edit ${transport.companyName}`}
                            >
                                <Edit size={16} />
                            </Button>
                        </Link>

                        {/* Delete button */}
                        <DeleteConfirmationDialog
                            trigger={
                                <Button
                                    size="sm"
                                    className="flex items-center justify-center w-10 h-10 p-0 rounded-full
                         bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800
                         transition-colors duration-200"
                                    aria-label={`Delete ${transport.companyName}`}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            }
                            itemName={transport.companyName}
                            onConfirm={() => handleDeleteConfirmed(transport)}
                        />
                    </div>
                );
            },
        }



    ], [handleDeleteConfirmed, page, limit]);

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
                        { label: 'Dashboard', to: '/admin/dashboard' },
                        { label: 'Transportations' },
                    ]}
                />


                {/* Scrollable content */}
                <div className="flex-1 overflow-auto pb-24 mt-4 scroll-smooth">


                    {/* Header + Search */}
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
                        <h1 className="text-2xl font-bold">Transportations</h1>

                        <div className="flex gap-2 flex-wrap md:items-center">
                            <Input
                                placeholder="Search transportations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="md:w-72"
                            />
                            <Link to="/admin/transportations/add">
                                <Button className="flex items-center gap-1" variant="default">
                                    <Plus size={16} />
                                    Create Transportation
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-border text-[15px] shadow-sm">
                        <Table className="[&_tbody_tr:nth-child(even)]:bg-gray-50 dark:[&_tbody_tr:nth-child(even)]:bg-gray-800/40">
                            <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm transition-all h-11">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-left font-bold text-base"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-3">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4">
                                            No transportations found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Sticky pagination footer */}
                <div className="sticky bottom-0 left-0 bg-white dark:bg-gray-900 border-t border-border py-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {data?.paginationResult.numberOfPages || 1}
                    </span>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        >
                            Previous
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            disabled={page === data?.paginationResult.numberOfPages}
                            onClick={() =>
                                setPage((p) =>
                                    Math.min(p + 1, data?.paginationResult.numberOfPages || p)
                                )
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
