"use client";

import { useState } from "react";

import { GridNine, List } from "@phosphor-icons/react";
import Document from "@/components/Document";
import PlaceholderDocument from "../../components/PlaceholderDocument";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);

  return (
    <main className="wrapper">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}>
        {/* placeholder / create new doucment */}
        <PlaceholderDocument />
        {/* <Document /> */}
      </div>
    </main>
  );
}
