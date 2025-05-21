import { useEffect } from "react";


/**
 * useClickOutside - Custom hook to detect clicks outside a referenced element.
 *
 * param ref - A React ref pointing to the DOM element to monitor.
 * param handler - A function to call when a click/touch is detected outside the element.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
) {
  useEffect(() => {
    // Event listener that checks if the click/touch occurred outside the element
    const listener = (event: MouseEvent | TouchEvent) => {
      // If ref is not set or the event target is inside the ref, do nothing
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      // Otherwise, call the handler
      handler();
    };

    // Listen for both mouse and touch interactions
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup listeners when the component unmounts or dependencies change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
