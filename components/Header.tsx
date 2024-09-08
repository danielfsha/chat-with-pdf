"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ShimmerButton from "./magicui/shimmer-button";

import { Plus } from "@phosphor-icons/react";

type Props = {};

function Header({ }: Props) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between py-2 px-4 bg-white border-b">
      <Link href="/" className="text-xl font-bold">
        pdf.ai
      </Link>

      <SignedOut>
        <SignInButton>
          <ShimmerButton>
            Sign in
          </ShimmerButton>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-between space-x-2">
          <Link
            href="/dashboard"
            className="p-2 px-4"
          >
            My documents
          </Link>

          <Button
            onClick={() => router.push("/dashboard/new")}
            variant="outline"
            className="rounded-full"
            size="icon"
          >
            <Plus size={24} />
          </Button>
          <UserButton
            appearance={{
              elements: {
                rootBox: "w-9 h-9",
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </SignedIn>
    </header>
  );
}

export default Header;
