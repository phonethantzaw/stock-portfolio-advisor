"use server";

import { marked } from "marked";

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Client-side
  return '';
};

// Configure marked to use GFM (GitHub Flavored Markdown)
marked.use({
  gfm: true,
  breaks: true
});

interface ChatHistoryResponse {
  id: number;
  userId: string;
  role: string;
  message: string;
  timestamp: string;
}

interface ErrorResponse {
  message: string;
}


export async function deleteChatMessage(id: number, token: string): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/chat/delete?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    
  });

  if (!response.ok) {
    throw new Error('Failed to delete chat message');
  }
}

export async function saveChatMessage(message: string, role: string, token: string): Promise<void> {
  const response = await fetch(`${getApiUrl()}/api/chat/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    body: new URLSearchParams({
      message: message,
      role: role,
  }),

  });

  if (!response.ok) {
    if (response.status === 429) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message);
    }

    throw new Error('Failed to save chat message');
  }
}

export async function getRateLimit(token: string): Promise<number> {
  const response = await fetch(`${getApiUrl()}/api/chat/limit`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch rate limit');
  }

  return response.json();
}

export async function getChatHistory(token: string): Promise<ChatHistoryResponse[]> {
  const response = await fetch(`${getApiUrl()}/api/chat/history`, {
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
    `${getApiUrl()}/api/chat/message?userMessage=${encodeURIComponent(userMessage)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 429) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message);
    }
    throw new Error("Network response was not ok");
  }

  const markdown = await response.text();
  // Add custom table styles
  const rawHtml = await marked(markdown);
  const html = rawHtml
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