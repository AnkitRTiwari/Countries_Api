import { useEffect, useState } from "react";

export default function useWindow() {
  const [dim, setDim] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      setDim({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);
  return [dim, setDim];
}
