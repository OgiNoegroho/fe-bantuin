"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TbBell, TbCheck } from "react-icons/tb";

interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  type?: string;
}

interface NotificationListProps {
  onMarkAllAsRead: () => void;
  onClose: () => void;
  refreshCount: () => void;
}

export default function NotificationList({
  onMarkAllAsRead,
  onClose,
  refreshCount,
}: NotificationListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleItemClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        const token = localStorage.getItem("access_token");
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update UI lokal
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        refreshCount();
      } catch (error) {
        console.error("Error reading notification", error);
      }
    }

    if (notification.link) {
      router.push(notification.link);
      onClose();
    }
  };

  const handleMarkAll = async () => {
    await onMarkAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifikasi</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8"
          onClick={handleMarkAll}
        >
          <TbCheck className="mr-1" /> Tandai dibaca
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Memuat...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <TbBell className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">Belum ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notif.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                      !notif.isRead ? "bg-blue-600" : "bg-transparent"
                    }`}
                  />
                  <div className="space-y-1">
                    <p
                      className={`text-sm ${
                        !notif.isRead
                          ? "font-medium text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
