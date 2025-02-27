'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  className?: string;
  loop?: boolean;
  speed?: number;
  delay?: number;
}

export function TypingAnimation({
  text,
  className,
  loop = true,
  speed = 100,
  delay = 500,
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1000); // Pause at the end for 1 second
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (text.length + 1));
        return;
      }

      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, speed / 2);
    } else {
      if (currentIndex >= text.length) {
        if (loop) {
          setIsPaused(true);
        }
        return;
      }

      timeout = setTimeout(() => {
        setDisplayText(displayText + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, isPaused, text, loop, speed]);

  return (
    <div className={cn('inline-flex items-center', className)}>
      <span>{displayText}</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-0.5 inline-block w-1.5 h-4 bg-current"
      />
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1 items-center", className)}>
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-current"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-current"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-current"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}
