import React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function IconButton({
  icon,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button className={`icon-button ${className}`.trim()} {...props}>
      {icon}
      {children}
    </button>
  );
}

