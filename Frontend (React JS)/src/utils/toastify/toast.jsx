import React from "react";
import { IoMdClose } from "react-icons/io";

function Toast({ title, description, onClose, variant = "default" }) {
  const variantStyles = {
    default: "bg-green-50 border-green-500 text-green-700",
    destructive: "bg-red-50 border-red-500 text-red-700",
  };

  return (
    <div
      className={`flex items-start justify-between p-4 border rounded-md shadow-md space-x-4 ${variantStyles[variant]}`}
    >
      <div>
        {title && <h4 className="font-bold text-base">{title}</h4>}
        {description && <p className="text-text-base">{description}</p>}
      </div>
      <button onClick={onClose} className="text-text-base">
        <IoMdClose />
      </button>
    </div>
  );
}

export default Toast;
