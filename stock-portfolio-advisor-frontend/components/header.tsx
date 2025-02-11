"use client";

import { ModeToggle } from "./ui/mode-toggle";
import { LineChart } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center space-x-2">
          <LineChart className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            Stock Portfolio Advisor
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
