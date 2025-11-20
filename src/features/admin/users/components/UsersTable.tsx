import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Mail, Phone, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import useDebounce from '@/hooks/useDebounce';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { usePaginatedUsersQuery, useDeleteUserMutation } from '../hooks/useUsers';
import type { User } from '../types/user.type';

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data } = usePaginatedUsersQuery({ page, limit, keyword: debouncedSearch });
  const deleteMutation = useDeleteUserMutation();

  const handleDelete = useCallback((user: User) => {
    const loadingId = toast.loading('Deleting user...');
    deleteMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success('User deleted!', { id: loadingId });
        if (data && data.data.length === 1 && page > 1) setPage(p => p - 1);
      },
      onError: () => toast.error('Failed to delete user.', { id: loadingId }),
    });
  }, [deleteMutation, data, page]);

  const columns = useMemo<ColumnDef<User>[]>(() => [
    { id: 'index', header: '#', cell: ({ row }) => (page - 1) * limit + row.index + 1 },
    {
      accessorKey: 'fullName',
      header: 'Name & Contact',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.firstName} {row.original.lastName}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Mail size={14} />{row.original.email}</div>
          {row.original.phone && <div className="flex items-center gap-1 text-sm text-muted-foreground"><Phone size={14} />{row.original.phone}</div>}
        </div>
      )
    },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.original.active ? 'default' : 'destructive'}>{row.original.active ? 'Active' : 'Inactive'}</Badge>
          <Badge variant={row.original.isEmailVerified ? 'default' : 'secondary'}>{row.original.isEmailVerified ? 'Verified' : 'Unverified'}</Badge>
        </div>
    ) },
    { id: 'actions', header: 'Actions', cell: ({ row }) => (
        <div className="flex gap-2">
          <Link to={`/admin/users/edit/${row.original.id}`}><Button size="sm"><Edit size={16} /></Button></Link>
          <DeleteConfirmationDialog
            trigger={<Button size="sm"><Trash2 size={16} /></Button>}
            itemName={`${row.original.firstName} ${row.original.lastName}`}
            onConfirm={() => handleDelete(row.original)}
          />
        </div>
    ) }
  ], [page, limit, handleDelete]);

  const table = useReactTable({ data: data?.data || [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <PageContainer>
      <div className="flex flex-col min-h-[85vh]">
        <AdminBreadcrumb items={[{ label: 'Dashboard', to: '/admin/dashboard' }, { label: 'Users' }]} />
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6 mt-4">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <div className="flex gap-2 flex-wrap md:items-center">
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="md:w-72" />
            <Link to="/admin/users/add">
              <Button className="flex items-center gap-1" variant="default">
                <Plus size={16} /> Add User
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border text-[15px] shadow-sm">
          <Table className="[&_tbody_tr:nth-child(even)]:bg-gray-50 dark:[&_tbody_tr:nth-child(even)]:bg-gray-800/40">
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm transition-all h-11">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="text-left font-bold text-base">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {row.getVisibleCells().map(cell => <TableCell key={cell.id} className="py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="sticky bottom-0 left-0 bg-white dark:bg-gray-900 border-t border-border py-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Page {page} of {data?.paginationResult.numberOfPages || 1}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page === (data?.paginationResult.numberOfPages || 1)} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
