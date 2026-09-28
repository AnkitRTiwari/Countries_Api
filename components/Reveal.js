import useReveal from "../utilis/useReveal";

// Fades its content up the first time it scrolls into view
const Reveal = ({ as: Tag = "div", className = "", delay = 0, children, ...rest }) => {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
