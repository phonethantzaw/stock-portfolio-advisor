"use server";

import { marked } from "marked";

// Configure marked to use GFM (GitHub Flavored Markdown)
marked.use({
  gfm: true,
  breaks: true,
  mangle: false,
  headerIds: false,
  pedantic: false,
});

export async function sendMessage(userMessage: string): Promise<string> {
  const response = await fetch(
    `http://localhost:8080/chat?userMessage=${encodeURIComponent(userMessage)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const markdown = await response.text();
  // Add custom table styles
  const html = marked(markdown)
    .replace(
      /<table>/g,
      '<table class="min-w-full border-collapse my-4 bg-muted/50 rounded overflow-hidden"'
    )
    .replace(
      /<th/g,
      '<th class="border border-muted-foreground/20 px-4 py-2 text-left font-semibold bg-muted"'
    )
    .replace(
      /<td/g,
      '<td class="border border-muted-foreground/20 px-4 py-2"'
    );

  return html;
}