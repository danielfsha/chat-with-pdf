import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ClerkLoaded>
      <div className="flex-1 bg-gray-50 w-screen overflow-x-hidden flex flex-col">
        <Header />
        {children}
      </div>
    </ClerkLoaded>
  );
};

export default layout;
