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
    <div className="flex flex-col h-[250px] w-[200px] items-center justify-center gap-2">
      <div
      onClick={handleClick}
      className="bg-white border w-full h-full rounded-xl flex flex-col items-center justify-center hover:bg-black hover:text-white space-y-3 transition-all"
    >
      <Plus size={32} />
      </div>
      <p className="text-center text-sm text-gray-500">Create a new document</p>
    </div>
  );
}

export default PlaceholderDocument;
