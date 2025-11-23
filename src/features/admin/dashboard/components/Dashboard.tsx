import { PageContainer } from '@/components/admin/PageContainer';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatCurrency';
import { useDashboardQuery } from '../hooks/useDashboard';
import { toast } from 'sonner';

import {
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  CreditCard,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  Plane,
  Package as PackageIcon
} from 'lucide-react';
import type { JSX } from 'react';
import { AdminSpinner } from '@/components/ui/Spinner';

export default function Dashboard() {
  const { data, isLoading, isError, error } = useDashboardQuery();

  if (isError) {
    toast.error('Failed to load dashboard data');
    console.error(error);
  }

  if (isLoading || !data) {
    return (
      <PageContainer>
        <AdminSpinner />
      </PageContainer>
    );
  }

  const statCardClasses =
    "flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100";

  const bubble = (color: string) =>
    `h-10 w-10 flex items-center justify-center rounded-xl bg-${color}-100 text-${color}-700`;

  // Capitalize helper
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  // Icon maps with colored bubble background
  const tripPackageMap: Record<string, { icon: JSX.Element; color: string }> = {
    Trip: {
      icon: <Plane className="h-4 w-4" />,
      color: "blue"
    },
    Package: {
      icon: <PackageIcon className="h-4 w-4" />,
      color: "green"
    }
  };

  const paymentStatusMap: Record<string, { icon: JSX.Element; color: string }> = {
    paid: {
      icon: <CheckCircle className="h-4 w-4" />,
      color: "green"
    },
    pending: {
      icon: <Clock className="h-4 w-4" />,
      color: "yellow"
    },
    partial: {
      icon: <Clock className="h-4 w-4" />,
      color: "blue"
    },
    refunded: {
      icon: <XCircle className="h-4 w-4" />,
      color: "red"
    }
  };

  const paymentTypeMap: Record<string, { icon: JSX.Element; color: string }> = {
    full: {
      icon: <CreditCard className="h-4 w-4" />,
      color: "purple"
    },
    deposit: {
      icon: <Wallet className="h-4 w-4" />,
      color: "orange"
    }
  };

  return (
    <PageContainer>
      <AdminBreadcrumb items={[{ label: 'Dashboard', to: '/admin/dashboard' }]} />
      <PageHeader
        title="Admin Dashboard"
        description="Overview of Safarny performance and insights"
      />

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {/* Revenue */}
        <Card className={statCardClasses}>
          <div className={bubble("green")}>
            <DollarSign />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue (30 days)</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(data.revenueLast30Days)}
            </p>
          </div>
        </Card>

        {/* Bookings */}
        <Card className={statCardClasses}>
          <div className={bubble("blue")}>
            <ShoppingCart />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bookings (30 days)</p>
            <p className="text-2xl font-bold mt-1">{data.bookingsLast30Days}</p>
          </div>
        </Card>

        {/* New Users */}
        <Card className={statCardClasses}>
          <div className={bubble("yellow")}>
            <Users />
          </div>
          <div>
            <p className="text-sm text-gray-500">New Users (30 days)</p>
            <p className="text-2xl font-bold mt-1">{data.newUsersLast30Days}</p>
          </div>
        </Card>

        {/* Trips vs Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <BarChart3 className="h-5 w-5" />
              Trips vs Packages
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.tripsVsPackages.map((item) => {
              const map = tripPackageMap[item._id];
              return (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={bubble(map?.color || "gray")}>
                      {map?.icon}
                    </div>
                    <span>{cap(item._id)}</span>
                  </div>
                  <strong>{item.count}</strong>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <CreditCard className="h-5 w-5" />
              Payment Status
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.paymentStatusStats.map(item => {
              const map = paymentStatusMap[item._id];
              return (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={bubble(map?.color || "gray")}>
                      {map?.icon}
                    </div>
                    <span>{cap(item._id)}</span>
                  </div>
                  <strong>{item.count}</strong>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Payment Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Ticket className="h-5 w-5" />
              Payment Types
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {data.paymentTypeStats.map(item => {
              const map = paymentTypeMap[item._id];
              return (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={bubble(map?.color || "gray")}>
                      {map?.icon}
                    </div>
                    <span>{cap(item._id)}</span>
                  </div>
                  <strong>{item.count}</strong>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}
