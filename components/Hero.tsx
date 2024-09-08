"use client";

import { useRouter } from "next/navigation";


import ShimmerButton from "@/components/magicui/shimmer-button";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col h-[85vh] w-full items-center justify-center bg-background space-y-4">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-bold tracking-tighter text-black dark:text-white lg:text-8xl">
        Chat with PDFs
      </p>
      <p className="text-center text-xl font-medium tracking-tighter text-grey-600 dark:text-white opacity-70 w-full lg:max-w-[60%]">
        Make PDFs interactive and engaging. Ask questions, clarify doubts, and
        get answers directly within the document.
      </p>
      <ShimmerButton
        onClick={() => router.push("/dashboard")}
        className="shadow-2xl"
      >
        Get Started now
      </ShimmerButton>
    </div>
  );
};

export default Hero;
