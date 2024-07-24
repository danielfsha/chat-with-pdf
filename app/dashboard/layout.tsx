import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ClerkLoaded>
      <Header />
      {children}
    </ClerkLoaded>
  );
};

export default layout;
