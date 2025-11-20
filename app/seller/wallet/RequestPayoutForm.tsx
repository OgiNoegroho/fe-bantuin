"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface PayoutAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface RequestPayoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  balance: number;
  accounts: PayoutAccount[];
}

export default function RequestPayoutForm({
  open,
  onOpenChange,
  onSuccess,
  balance,
  accounts,
}: RequestPayoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = Number(amount);
    if (numAmount < 50000) {
      setError("Minimal penarikan adalah Rp 50.000");
      return;
    }
    if (numAmount > balance) {
      setError("Saldo tidak mencukupi");
      return;
    }
    if (!selectedAccount) {
      setError("Silakan pilih rekening tujuan");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/wallet/payout-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: numAmount,
          payoutAccountId: selectedAccount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAmount("");
        setSelectedAccount("");
        onOpenChange(false);
        onSuccess();
      } else {
        setError(data.message || "Gagal memproses penarikan");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tarik Dana</DrawerTitle>
          <DrawerDescription>
            Minimal penarikan Rp 50.000. Proses 1-3 hari kerja.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label>Rekening Tujuan</Label>
            {accounts.length > 0 ? (
              <Select
                onValueChange={setSelectedAccount}
                value={selectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih rekening" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-red-500">
                Anda belum memiliki rekening. Silakan tambah rekening terlebih
                dahulu.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Penarikan (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              min={50000}
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Saldo tersedia: Rp {balance.toLocaleString("id-ID")}
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DrawerFooter className="px-0 pt-2">
            <Button
              type="submit"
              disabled={
                loading || accounts.length === 0 || Number(amount) > balance
              }
            >
              {loading ? "Memproses..." : "Tarik Dana"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
