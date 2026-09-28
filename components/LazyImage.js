import { useLayoutEffect, useRef, useState } from "react";

// Shows a shimmer placeholder until the image has loaded, then fades it in
const LazyImage = ({ className = "", children, ...imgProps }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Images the browser already has are complete on mount — show them straight
  // away so they don't flash the shimmer (and the page-transition morph has a flag)
  useLayoutEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={`lazy-image ${loaded ? "is-loaded" : "skeleton"} ${className}`}>
      <img
        ref={imgRef}
        loading="lazy"
        {...imgProps}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {children}
    </div>
  );
};

export default LazyImage;
