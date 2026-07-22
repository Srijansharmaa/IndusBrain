import { useState, useCallback, useRef } from "react";

/**
 * Streams `fullText` a few characters at a time and, in parallel,
 * reveals a sequence of graph node ids (used to animate the
 * Knowledge Graph panel while the AI Copilot "thinks").
 */
export function useStreamingText({ onPathStep, onDone } = {}) {
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const timers = useRef([]);

  const start = useCallback((fullText, path = []) => {
    timers.current.forEach(clearInterval);
    timers.current = [];

    setStreaming(true);
    setStreamedText("");

    let pathIndex = 0;
    if (path.length && onPathStep) {
      const pathTimer = setInterval(() => {
        if (pathIndex < path.length) {
          onPathStep(path.slice(0, pathIndex + 1), path[pathIndex]);
          pathIndex++;
        } else {
          clearInterval(pathTimer);
        }
      }, 380);
      timers.current.push(pathTimer);
    }

    let charIndex = 0;
    const textTimer = setInterval(() => {
      charIndex += 4;
      setStreamedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(textTimer);
        setStreaming(false);
        setStreamedText("");
        onDone?.(fullText);
      }
    }, 18);
    timers.current.push(textTimer);
  }, [onPathStep, onDone]);

  return { streaming, streamedText, start };
}
