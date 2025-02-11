import React from 'react'
import { Github } from 'lucide-react'
import { Button } from './ui/button'

function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Built with ❤️ by{' '}
          <a
            href="https://github.com/phonethantzaw"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Phone
          </a>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
        >
          <a
            href="https://github.com/phonethantzaw/stock-portfolio-advisor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </div>
    </footer>
  );
}

export default Footer
