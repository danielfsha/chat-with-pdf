import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ClerkLoaded>
      <div className="bg-gray-50 h-screen w-screen overflow-x-hidden">
        <Header />
        {children}
      </div>
    </ClerkLoaded>
  );
};

export default layout;
