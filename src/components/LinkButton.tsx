import React from "react";
import clsx from "clsx";
import Link from "next/link";

interface ButtonProps {
  variant?: "filled" | "outlined" | "text";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  children,
  href,
  onClick,
  className,
  ariaLabel,
}) => {
  const baseStyles = "z-20 text-nowrap max-md:w-full group/linkbtn px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    filled: "bg-chambray-800 text-white hover:bg-chambray-700 shadow-md hover:shadow-lg active:scale-95",
    outlined: "border-1 border-chambray-800 text-chambray-800 bg-transparent hover:bg-chambray-100 active:scale-95",
    text: "text-chambray-800 bg-transparent active:scale-95 focus:ring-0 rounded-none !w-fit !p-0 text-lg !gap-0.5 !items-base",
  };

  return (
    <Link
      className={clsx(baseStyles, variants[variant], className)}
      aria-label={ariaLabel}
      onClick={onClick}
      href={href ?? "#"}
    >
      {children}
    </Link>
  );
};

export default Button; 