"use client";

import { useRouter } from "next/navigation";

import { FilePlus, Plus } from "@phosphor-icons/react";

type Props = {};

function PlaceholderDocument({ }: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard/new");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white h-[250px] border rounded-xl flex flex-col items-center justify-center hover:bg-black hover:text-white space-y-3"
    >
      <Plus size={32} />
      <h1 className="text-center text-sm font-bold">Create new document</h1>
    </div>
  );
}

export default PlaceholderDocument;
