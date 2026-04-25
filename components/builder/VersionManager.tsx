"use client";

import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useVersionsStore } from "@/lib/store/versions-store";
import { Button } from "@/components/ui/button";

export default function VersionManager(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { versions, saveVersion, loadVersion, deleteVersion } = useVersionsStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent): void {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleSave(): void {
    const name = nameInput.trim() || `Version ${versions.length + 1}`;
    saveVersion(name);
    setNameInput("");
    toast.success(`Saved "${name}"`);
  }

  function handleLoad(id: string, name: string): void {
    loadVersion(id);
    setOpen(false);
    toast.success(`Loaded "${name}"`);
  }

  function handleDelete(id: string, name: string): void {
    deleteVersion(id);
    toast.success(`Deleted "${name}"`);
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        Versions {versions.length > 0 && `(${versions.length})`}
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-72 bg-white rounded-xl border border-zinc-200 shadow-xl z-40 overflow-hidden">
          {/* Save new */}
          <div className="p-3 border-b bg-zinc-50">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">Save current</p>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                placeholder="e.g. Growth PM version"
                className="flex-1 text-xs border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-900/30"
              />
              <Button size="sm" onClick={handleSave} className="text-xs">Save</Button>
            </div>
          </div>

          {/* Version list */}
          <div className="max-h-64 overflow-y-auto">
            {versions.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">No saved versions yet.</p>
            ) : (
              versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-zinc-50 border-b border-zinc-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900 truncate">{v.name}</p>
                    <p className="text-[10px] text-zinc-400">{formatDate(v.savedAt)}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleLoad(v.id, v.name)}
                      className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(v.id, v.name)}
                      className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
