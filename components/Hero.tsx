"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import ShimmerButton from "@/components/magicui/shimmer-button";

const Hero = () => {
  return (
    <div className="relative flex flex-col h-[65vh] w-full items-center justify-center bg-background space-y-4">
      <p className="z-10 whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter text-black dark:text-white">
        Unlocking Insights from your
        <span className="gradient__text"> PDFs</span> with
        <span className="gradient__text"> AI</span>
      </p>
      <p className="text-center text-xl font-medium tracking-tighter text-grey-600 dark:text-white opacity-70 w-full lg:max-w-[60%]">
        Make PDFs interactive and engaging. Ask questions, clarify doubts, and
        get answers directly within the document.
      </p>
      <Link
        href="/dashboard"
        className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg"
      >
        <ShimmerButton className="shadow-2xl">Get Started now</ShimmerButton>
      </Link>
      <GridPattern
        width={100}
        height={100}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
    </div>
  );
};

export default Hero;
