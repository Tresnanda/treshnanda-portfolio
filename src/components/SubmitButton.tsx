"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Check } from "lucide-react";

export function SubmitButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all`}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
