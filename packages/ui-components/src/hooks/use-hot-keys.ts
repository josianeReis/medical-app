import { useEffect } from "react";

type HotkeyTuple = [string, (event: KeyboardEvent) => void];

function matchKey(event: KeyboardEvent, key: string) {
  return event.key.toLowerCase() === key.toLowerCase();
}

export function useHotkeys(hotkeys: HotkeyTuple[]) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      for (const [key, callback] of hotkeys) {
        if (matchKey(event, key)) {
          event.preventDefault();
          callback(event);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkeys]);
}
