"use client";

import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="wrapper w-full flex flex-col-reverse items-center justify-center py-12 space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
      <span className="inline-flex justify-center gap-3">
        <Link
          href="https://github.com/danielfsha/"
          className="size-6 transition fill-black hover:text-purple-500"
        >
          <span className="sr-only"> github </span>
          <GithubLogo size={32} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/daniel-fisseha-b1b74b203/"
          className="size-6 transition fill-black hover:text-purple-500"
        >
          <span className="sr-only"> Linkedin </span>
          <LinkedinLogo size={32} />
        </Link>
      </span>
      <span className="font-medium text-gray-500">
        <span x-text="year">2024</span>
        <Link
          href="https://danielfisseha.vercel.app"
          className="mx-2 gradient__text"
        >
          Daniel Fisseha
        </Link>
      </span>
    </footer>
  );
}
