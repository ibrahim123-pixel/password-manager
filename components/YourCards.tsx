"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";



async function safeCopyToClipboard(text: string): Promise<boolean> {
  const fallback = () => {
    try {
      if (typeof document === "undefined") return false;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  try {
    if (typeof window === "undefined") return false;
    if (navigator && "clipboard" in navigator && window.isSecureContext) {
      try {
        // @ts-expect-error: TS DOM types may not include clipboard-write
        await navigator.permissions?.query?.({ name: "clipboard-write" });
      } catch {}
      await navigator.clipboard.writeText(text);
      return true;
    }
    return fallback();
  } catch {
    return fallback();
  }
}

type IncomingCard =
  | { id?: string | number; cardName?: string; cardNumber?: string; expiryDate?: string; holderName?: string }
  | { id?: string | number; name?: string; cardNo?: string; expiryDate?: string; holder?: string };

type UICard = {
  id: string | number;
  name: string;
  number: string;
  expiry: string;
  holder: string;
};

function normalizeCards(cards?: IncomingCard[]): UICard[] {
  const source = Array.isArray(cards) ? cards : [];
  return source.map((c, i) => ({
    id: c.id ?? i,
    name: (c as any).cardName ?? (c as any).name ?? "Card",
    number: (c as any).cardNumber ?? (c as any).cardNo ?? "",
    expiry: (c as any).expiryDate ?? "",
    holder: (c as any).holderName ?? (c as any).holder ?? "",
  }));
}

export default function YourCards({ cards }: { cards?: IncomingCard[] }) {
  const list = normalizeCards(cards);

  const handleCopy = async (text: string) => {
    const ok = await safeCopyToClipboard(text);
    if (!ok) console.error("Copy failed (blocked or unsupported).");
  };

  return (
    <div className="w-full max-w-md h-48 overflow-y-scroll space-y-3">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
        Your Cards
      </h2>

      {list.length === 0 ? (
        <p className="text-sm text-blue-900/80 dark:text-blue-100/80">
          No card added.
        </p>
      ) : (
        list.map((card) => (
          <Card
            key={card.id}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0 shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{card.name}</h3>
                  <p className="text-blue-100 text-sm">{card.holder}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    onClick={() => handleCopy(card.number)}
                    title="Copy card number"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-red-500/20 p-1 h-8 w-8"
                    onClick={() => console.log(`Delete card ${card.id}`)}
                    title="Delete card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-lg tracking-wider">{card.number}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Expires</span>
                  <span>{card.expiry || "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
    
  );
}
