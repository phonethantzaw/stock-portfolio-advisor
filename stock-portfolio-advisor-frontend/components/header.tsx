"use client";

import { ModeToggle } from "./ui/mode-toggle";
import { LineChart, LogOut } from "lucide-react";
import { useAuth } from "./auth";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import React from "react";
function Header() {
  const { isAuthenticated, logout, user } = useAuth();

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
          <nav className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <span className="text-sm font-medium">
                {user.preferred_username || user.email || 'User'}
              </span>
            )}
            <ModeToggle />
            {isAuthenticated && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="h-9 w-9"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
