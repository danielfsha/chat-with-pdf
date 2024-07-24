import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

type Props = {};

function Header({}: Props) {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default Header;
