"use client";

import { useRouter } from "next/navigation";

import { FilePlus } from "@phosphor-icons/react";

type Props = {};

function PlaceholderDocument({}: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/dashboard/new");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white h-[250px] border shadow-xl rounded-xl shadow-gray-500/10 flex flex-col items-center justify-center hover:bg-[#7303c0] hover:text-white space-y-3"
    >
      <FilePlus size={32} />
      <h1 className="text-center text-sm font-bold">Create new document</h1>
    </div>
  );
}

export default PlaceholderDocument;
