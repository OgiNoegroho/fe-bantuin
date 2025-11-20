"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TbWallet,
  TbCreditCard,
  TbClockHour4,
  TbCheck,
  TbX,
  TbPlus,
} from "react-icons/tb";
import AddPayoutAccountForm from "./AddPayoutAccountForm";
import RequestPayoutForm from "./RequestPayoutForm";

interface WalletBalance {
  balance: number;
}

interface PayoutAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isPrimary: boolean;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
  account: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

const WalletPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showRequestPayout, setShowRequestPayout] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else if (!user?.isSeller) {
        router.push("/seller/activate");
      } else {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [balanceRes, accountsRes, requestsRes] = await Promise.all([
        fetch("/api/wallet/balance", { headers }),
        fetch("/api/wallet/payout-accounts", { headers }),
        fetch("/api/wallet/payout-requests", { headers }),
      ]);

      const [balanceData, accountsData, requestsData] = await Promise.all([
        balanceRes.json(),
        accountsRes.json(),
        requestsRes.json(),
      ]);

      if (balanceData.success) setBalance(balanceData.data);
      if (accountsData.success) setAccounts(accountsData.data);
      if (requestsData.success) setRequests(requestsData.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { icon: any; color: string; text: string }
    > = {
      PENDING: {
        icon: TbClockHour4,
        color: "bg-yellow-100 text-yellow-700",
        text: "Pending",
      },
      COMPLETED: {
        icon: TbCheck,
        color: "bg-green-100 text-green-700",
        text: "Selesai",
      },
      REJECTED: {
        icon: TbX,
        color: "bg-red-100 text-red-700",
        text: "Ditolak",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Dompet Saya</h1>
          <Button onClick={() => setShowRequestPayout(true)}>
            <TbWallet className="mr-2" />
            Tarik Dana
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="bg-linear-to-br from-primary to-secondary text-white">
          <CardHeader>
            <CardTitle className="text-white">Saldo Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {balance ? formatCurrency(balance.balance) : "Rp 0"}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="accounts">
          <TabsList>
            <TabsTrigger value="accounts">Rekening Bank</TabsTrigger>
            <TabsTrigger value="requests">Riwayat Penarikan</TabsTrigger>
          </TabsList>

          {/* Payout Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowAddAccount(true)}>
                <TbPlus className="mr-2" />
                Tambah Rekening
              </Button>
            </div>

            {accounts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <TbCreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Belum ada rekening
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tambahkan rekening bank untuk menarik dana
                  </p>
                  <Button onClick={() => setShowAddAccount(true)}>
                    <TbPlus className="mr-2" />
                    Tambah Rekening
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <TbCreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      {account.isPrimary && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                          Utama
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payout Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <TbClockHour4 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Belum ada penarikan
                  </h3>
                  <p className="text-muted-foreground">
                    Riwayat penarikan akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">
                            {formatCurrency(request.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(request.requestedAt)}
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Ke: {request.account.bankName} -{" "}
                          {request.account.accountNumber}
                        </p>
                        {request.adminNotes && (
                          <p className="mt-2 text-red-600">
                            Catatan: {request.adminNotes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Forms */}
        <AddPayoutAccountForm
          open={showAddAccount}
          onOpenChange={setShowAddAccount}
          onSuccess={fetchData}
        />
        <RequestPayoutForm
          open={showRequestPayout}
          onOpenChange={setShowRequestPayout}
          onSuccess={fetchData}
          balance={balance?.balance || 0}
          accounts={accounts}
        />
      </div>
    </SellerLayout>
  );
};

export default WalletPage;
