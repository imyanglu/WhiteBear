import { useRef } from "react";
export default function useLast<T>(fn: T) {
  const funRef = useRef(fn);
  funRef.current = fn;
  return funRef;
}