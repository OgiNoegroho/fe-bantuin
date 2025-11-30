"use client";

import Image from "next/image";
import Link from "next/link";
import { TbShoppingBag } from "react-icons/tb";
import type { ServicePreview } from "@/contexts/ChatContext";

interface ServiceBubbleProps {
  service: ServicePreview;
  isMe: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const ServiceBubble = ({ service, isMe }: ServiceBubbleProps) => {
  return (
    <div
      className="mb-2 mt-1 overflow-hidden rounded-xs border bg-white p-2 shadow-sm 
        w-[75vw] sm:w-[320px]"
    >
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          ) : (
            <TbShoppingBag className="h-8 w-8 m-4 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <p className="text-xs font-medium line-clamp-2 text-gray-800 leading-tight">
            {service.title}
          </p>
          <p className="text-sm font-bold text-primary mt-1">
            {formatPrice(service.price)}
          </p>
        </div>
      </div>

      <div className="mt-2 border-t pt-1.5">
        <Link href={`/services/${service.id}`} className="block w-full">
          <p className="text-[10px] text-gray-500 text-center cursor-pointer hover:text-primary transition-colors py-1 hover:underline">
            Lihat detail jasa
          </p>
        </Link>
      </div>
    </div>
  );
};
