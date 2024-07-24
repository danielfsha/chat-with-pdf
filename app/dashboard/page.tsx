"use client";

import { useState } from "react";

import { GridNine, List } from "@phosphor-icons/react";
import Document from "@/components/Document";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);

  return (
    <main className="wrapper">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className={`grid grid-cols-3 gap-2`}>
        <Document />
      </div>
    </main>
  );
}
