import * as React from "react";

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild }) {
  return children;
}

export function DropdownMenuContent({ children }) {
  return (
    <div className="absolute z-50 mt-2 bg-white border rounded shadow-md p-2 right-0">
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
