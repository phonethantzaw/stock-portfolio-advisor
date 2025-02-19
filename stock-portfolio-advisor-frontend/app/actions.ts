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

interface ChatHistoryResponse {
  id: number;
  userId: string;
  role: string;
  message: string;
  timestamp: string;
}

export async function saveChatMessage(message: string, role: string, token: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
    },
    body: new URLSearchParams({
      message: message,
      role: role,
  }),

  });

  if (!response.ok) {
    throw new Error('Failed to save chat message');
  }
}

export async function getChatHistory(token: string): Promise<ChatHistoryResponse[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
}

export async function sendMessage(userMessage: string, token: string): Promise<string> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/message?userMessage=${encodeURIComponent(userMessage)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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