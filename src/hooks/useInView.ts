"use client"

import { useState, useEffect, useRef } from "react"

interface UseInViewOptions {
  /** The root margin around the viewport used when calculating intersections */
  rootMargin?: string
  /** Threshold at which the callback is triggered (0-1) */
  threshold?: number | number[]
  /** Whether to only trigger once */
  triggerOnce?: boolean,
  /** External ref to observe */
  externalRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Hook to detect when an element is in the viewport
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  rootMargin = "0px",
  threshold = 0,
  triggerOnce = false,
  externalRef,
}: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const internalRef = useRef<T | null>(null)
  const ref = externalRef || internalRef;
  const enteredViewport = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Skip if we've already triggered once and triggerOnce is true
    if (triggerOnce && enteredViewport.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementInView = entry.isIntersecting

        // Update state only if needed
        if (isElementInView !== isInView) {
          setIsInView(isElementInView)

          // If element has entered viewport and triggerOnce is true, mark it
          if (isElementInView && triggerOnce) {
            enteredViewport.current = true
          }
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [isInView, rootMargin, threshold, triggerOnce, ref])

  return { ref, isInView }
} 