const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) => {
  const variantClass = variant === "secondary" ? "ui-button--secondary" : "";
  return (
    <button
      type={type}
      className={`ui-button ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

