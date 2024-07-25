"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ShimmerButton from "./magicui/shimmer-button";

import { FilePlus } from "@phosphor-icons/react";

type Props = {};

function Header({}: Props) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between py-4 px-4 shadow-2xl bg-white shadow-gray-500/10">
      <Link href="/" className="text-xl font-bold gradient__text">
        PDF.AI
      </Link>

      <SignedOut>
        <SignInButton>
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Sign in
            </span>
          </ShimmerButton>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                My documents
              </span>
            </ShimmerButton>
          </Link>

          <Button
            onClick={() => router.push("/dashboard/new")}
            variant="outline"
            className="rounded-full"
            size="icon"
          >
            <FilePlus size={24} />
          </Button>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}

export default Header;
