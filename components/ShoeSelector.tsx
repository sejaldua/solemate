"use client";

import { useState, useRef, useEffect } from "react";
import { Shoe } from "@/types";

interface ShoeSelectorProps {
  shoes: Shoe[];
  selectedShoe: Shoe | null;
  onSelect: (shoe: Shoe | null) => void;
  placeholder?: string;
}

export default function ShoeSelector({
  shoes,
  selectedShoe,
  onSelect,
  placeholder = "Search for a shoe...",
}: ShoeSelectorProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 2
    ? shoes
        .filter((s) =>
          (s.model || "").toLowerCase().includes(query.toLowerCase()) ||
          (s.brand || "").toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {selectedShoe ? (
        <div className="flex items-center justify-between border border-neon-green/40 bg-neon-green/5 rounded px-3 py-2">
          <div>
            <span className="text-sm text-text-primary">{selectedShoe.model}</span>
            <span className="text-xs text-text-muted ml-2">{selectedShoe.brand}</span>
          </div>
          <button
            onClick={() => {
              onSelect(null);
              setQuery("");
            }}
            className="text-xs text-text-muted hover:text-neon-red transition-colors ml-2"
          >
            Clear
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary
                     placeholder:text-text-muted focus:border-neon-green/50 focus:outline-none
                     transition-colors"
        />
      )}

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-bg-panel border border-border rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto">
          {filtered.map((shoe) => (
            <button
              key={shoe.id}
              onClick={() => {
                onSelect(shoe);
                setIsOpen(false);
                setQuery("");
              }}
              className="w-full text-left px-3 py-2 hover:bg-bg-hover transition-colors flex items-center gap-3"
            >
              {shoe.image_url && (
                <img
                  src={shoe.image_url}
                  alt={shoe.model}
                  className="w-8 h-8 rounded object-cover bg-bg"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div>
                <div className="text-sm text-text-primary">{shoe.model}</div>
                <div className="text-xs text-text-muted">{shoe.brand} &middot; {shoe.category}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
