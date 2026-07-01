"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/lib/mock-data";

export function ChatThread({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, from: "professional", text: draft.trim(), time: "agora" },
    ]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-card border border-border bg-bg-card-alt/40 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-1 ${message.from === "professional" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-card px-4 py-2.5 text-sm ${
                message.from === "professional"
                  ? "bg-primary text-slate-950"
                  : "bg-bg-card text-text-primary"
              }`}
            >
              {message.text}
            </div>
            <span className="px-1 text-xs text-text-muted">{message.time}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Mensagem..."
          className="flex-1 rounded-input border border-border bg-bg-card px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit" variant="secondary">
          Enviar
        </Button>
      </form>
    </div>
  );
}
