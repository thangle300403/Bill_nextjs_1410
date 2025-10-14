"use client";

import { useState, useEffect } from "react";
import ProductList from "../home/ProductListHome";
import { axiosAuth } from "@/lib/axiosAuth";

interface Props {
  players: string[];
}

export default function PlayerSelector({ players }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!selected) return;

    axiosAuth
      .get(`/athlete-gear/${selected}`)
      .then((res) => setProducts(res.data.items))
      .catch((err) => console.error("Failed to fetch gear", err));
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {players.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`border p-3 rounded-lg text-center hover:bg-gray-100 transition ${
              selected === name ? "bg-gray-200 font-bold" : ""
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Dụng cụ được sử dụng bởi {selected}:
          </h2>
          <div>
            <ProductList products={products} currentPage={1} totalPages={1} />
          </div>
        </>
      )}
    </>
  );
}
