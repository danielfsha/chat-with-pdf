import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ShimmerButton from "./magicui/shimmer-button";

type Props = {};

function Header({}: Props) {
  return (
    <header className="flex items-center justify-between py-2 px-4">
      <h1 className="text-xl font-bold">PDF Chat</h1>

      <SignedOut>
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Sign in
          </span>
        </ShimmerButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default Header;
