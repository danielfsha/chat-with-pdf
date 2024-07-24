"use client";

import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="gap-8 px-8 py-12 mx-auto md:flex md:items-center md:justify-between md:px-12 lg:px-32 max-w-7xl">
        <div className="flex justify-center space-x-6 md:order-2">
          <span className="inline-flex justify-center w-full gap-3 lg:ml-auto md:justify-start md:w-auto">
            <Link
              href="/"
              className="size-6 transition fill-black hover:text-blue-500"
            >
              <span className="sr-only"> github </span>
              <GithubLogo />
            </Link>
            <Link
              href="/"
              className="size-6 transition fill-black hover:text-blue-500"
            >
              <span className="sr-only"> Linkedin </span>
              <LinkedinLogo />
            </Link>
          </span>
        </div>
        <div className="md:order-1" x-data="{ year: new Date().getFullYear() }">
          <span className="text-sm font-medium text-gray-500">
            Copyright © <span x-text="year">2024</span>
            <Link href="#_" className="mx-2 text-blue-500 hover:text-gray-500">
              Daniel Fisseha
            </Link>
            &copy; 2024
          </span>
        </div>
      </div>
    </footer>
  );
}
