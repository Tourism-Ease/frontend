import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
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
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Users,
  CircleUser,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  usePaginatedUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../hooks/useUsers";
import type { User } from "../types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmModal } from "./ConfirmModal";

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = usePaginatedUsersQuery({
    page,
    limit,
    keyword: debouncedSearch,
  });

  const deleteMutation = useDeleteUserMutation();
  const toggleStatusMutation = useToggleUserStatusMutation();

  // Show error toast if data fetching fails
  if (error) {
    toast.error("Failed to load users", {
      description: "Please try refreshing the page.",
    });
  }

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirmed = useCallback(() => {
    if (!userToDelete) return;

    deleteMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
        // Success toast is handled in the mutation hook
        if (data && data.data.length === 1 && page > 1) setPage((p) => p - 1);
      },
      onError: () => {
        // Error toast is handled in the mutation hook
        setDeleteModalOpen(false);
        setUserToDelete(null);
      },
    });
  }, [deleteMutation, userToDelete, data, page]);

  const handleToggleStatus = useCallback(
    (user: User) => {
      toggleStatusMutation.mutate({
        id: user.id,
        active: !user.active,
      });
    },
    [toggleStatusMutation]
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "employee":
        return <Users className="h-4 w-4" />;
      default:
        return <CircleUser className="h-4 w-4" />;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                {/* Show user image if available */}
                {user.avatarUrl && (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span className="truncate max-w-[180px]">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {getRoleIcon(row.original.role)}
            <Badge
              variant={
                row.original.role === "admin"
                  ? "default"
                  : row.original.role === "employee"
                  ? "secondary"
                  : "outline"
              }
              className="capitalize"
            >
              {row.original.role}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <Badge
              variant={row.original.active ? "default" : "destructive"}
              className="w-fit cursor-pointer"
              onClick={() => handleToggleStatus(row.original)}
            >
              {row.original.active ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={row.original.isEmailVerified ? "default" : "secondary"}
              className="w-fit"
            >
              {row.original.isEmailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        ),
      },
      {
        id: "joined",
        header: "Joined",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {formatDate(row.original.createdAt)}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-2">
              {/* Edit Button */}
              <Link to={`/admin/users/edit/${user.id}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">
                    Edit {user.firstName} {user.lastName}
                  </span>
                </Button>
              </Link>

              {/* Delete Button */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={() => handleDeleteClick(user)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">
                  Delete {user.firstName} {user.lastName}
                </span>
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDeleteClick, handleToggleStatus]
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalUsers = data?.paginationResult.totalDocs || 0;
  const totalPages = data?.paginationResult.numberOfPages || 1;

  return (
    <>
      <PageContainer>
        <div className="flex flex-col min-h-[85vh]">
          <AdminBreadcrumb
            items={[
              { label: "Dashboard", to: "/admin/dashboard" },
              { label: "Users" },
            ]}
          />

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your team members and their account permissions.
                {isLoading && " Loading..."}
              </p>
            </div>

            <Link to="/admin/users/add">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CircleUser className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.data.filter((user) => user.active).length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.data.filter((user) => user.role === "admin")
                      .length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.data.filter((user) => user.role === "employee")
                      .length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing</span>
                <span className="font-semibold">{data?.data.length || 0}</span>
                <span>of</span>
                <span className="font-semibold">{totalUsers}</span>
                <span>users</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/80">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="py-4 font-semibold text-gray-900"
                        >
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
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
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
                      <TableCell
                        colSpan={columns.length}
                        className="py-12 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Users className="h-12 w-12 text-gray-300" />
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              No users found
                            </p>
                            <p className="text-gray-500">
                              {search
                                ? "Try adjusting your search criteria"
                                : "Get started by creating your first user"}
                            </p>
                          </div>
                          {!search && (
                            <Link to="/admin/users/add">
                              <Button className="mt-2 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add User
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold">{page}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                    {" • "}
                    <span className="font-semibold">{totalUsers}</span> total
                    users
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="flex items-center gap-2"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <Button
                              key={pageNumber}
                              variant={
                                page === pageNumber ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        }
                      )}
                      {totalPages > 5 && <span className="px-2">...</span>}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="flex items-center gap-2"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirmed}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
        type="delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
