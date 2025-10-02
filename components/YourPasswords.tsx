"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Password {
  id: number;
  siteName: string;
  username: string;
  password: string;
  url?: string;
}

interface YourPasswordsProps {
  passwords?: Password[];
  onDeletePassword?: (id: number) => void;
  onCopySuccess?: (text: string) => void;
}

export default function YourPasswords({
  passwords = [],
  onDeletePassword,
  onCopySuccess,
}: YourPasswordsProps) {
  const router = useRouter();
  // Remove local state - use props directly for real-time updates
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [copyingStates, setCopyingStates] = useState<Record<number, boolean>>({});

  const togglePasswordVisibility = useCallback((id: number): void => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const copyToClipboard = useCallback(async (text: string, id?: number): Promise<void> => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Set copying state for visual feedback
    if (id) {
      setCopyingStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopyingStates(prev => ({ ...prev, [id]: false }));
      }, 1000);
    }

    const fallbackCopy = (): boolean => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        return successful;
      } catch {
        return false;
      }
    };

    try {
      if (window.isSecureContext && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        onCopySuccess?.(text);
      } else {
        const success = fallbackCopy();
        if (success) {
          onCopySuccess?.(text);
        }
      }
    } catch {
      fallbackCopy();
    }
  }, [onCopySuccess]);

  const handleDeletePassword = useCallback((id: number): void => {
    if (onDeletePassword) {
      onDeletePassword(id);
    } else {
      console.log(`Delete password ${id}`);
    }
  }, [onDeletePassword]);

  const handleSiteNavigation = useCallback((url: string): void => {
    if (isValidUrl(url)) {
      router.push(url);
    }
  }, [router]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full max-w-md h-48 overflow-y-auto space-y-3">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-3">
        Your Passwords
      </h2>

      {passwords.length === 0 ? (
        <p className="text-sm text-purple-900/80 dark:text-purple-100/80">
          No passwords added.
        </p>
      ) : (
        passwords.map((item) => (
          <Card
            key={item.id}
            className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900 border border-purple-200 dark:border-purple-700"
          >
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300 truncate">
                    {item.siteName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.username}
                  </p>
                  {item.url && isValidUrl(item.url) && (
                    <div className="flex items-center gap-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate max-w-[10rem]"
                        title={item.url}
                      >
                        {item.url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0.5 h-5 w-5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
                        onClick={() => handleSiteNavigation(item.url!)}
                        title="Navigate to site"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-gray-600 hover:bg-purple-100 dark:hover:bg-purple-800"
                    onClick={() => copyToClipboard(item.username, item.id)}
                    title="Copy username"
                    disabled={copyingStates[item.id]}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-gray-600 hover:bg-red-100 dark:hover:bg-red-800"
                    onClick={() => handleDeletePassword(item.id)}
                    title="Delete password"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Password Section */}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">
                    Password
                  </Label>
                  <div className="font-mono text-sm ml-2 truncate">
                    {visible[item.id] ? item.password : "••••••••••••"}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-gray-600 hover:bg-purple-100 dark:hover:bg-purple-800"
                    onClick={() => togglePasswordVisibility(item.id)}
                    title={visible[item.id] ? "Hide password" : "Show password"}
                  >
                    {visible[item.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-gray-600 hover:bg-purple-100 dark:hover:bg-purple-800"
                    onClick={() => copyToClipboard(item.password, item.id)}
                    title="Copy password"
                    disabled={copyingStates[item.id]}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}






























// "use client";

// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Copy, Trash2, Eye, EyeOff } from "lucide-react";
// import { Label } from "@/components/ui/label";

// interface Password {
//   id: number;
//   siteName: string;
//   username: string;
//   password: string;
//   url?: string;
// }

// export default function YourPasswords({
//   passwords,
// }: {
//   passwords?: Password[];
// }) {
//   const [localPasswords] = useState<Password[]>(passwords ?? []);

//   const [visible, setVisible] = useState<Record<number, boolean>>({});

//   const togglePasswordVisibility = (id: number): void => {
//     setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const copyToClipboard = (text: string): void => {
//     if (typeof window === "undefined" || typeof document === "undefined") return;

//     const fallbackCopy = (): void => {
//       try {
//         const textarea = document.createElement("textarea");
//         textarea.value = text;
//         textarea.setAttribute("readonly", "");
//         textarea.style.position = "fixed";
//         textarea.style.opacity = "0";
//         document.body.appendChild(textarea);
//         textarea.focus();
//         textarea.select();
//         document.execCommand("copy");
//         document.body.removeChild(textarea);
//       } catch {
//         // silently fail
//       }
//     };

//     if (window.isSecureContext && navigator?.clipboard?.writeText) {
//       navigator.clipboard.writeText(text).catch(fallbackCopy);
//     } else {
//       fallbackCopy();
//     }
//   };

//   return (
//     <div className="w-full max-w-md h-48 overflow-y-scroll space-y-3">
//       {/* 🔹 Section Title */}
//       <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-3">
//         Your Passwords
//       </h2>

//       {localPasswords.length === 0 ? (
//         <p className="text-sm text-purple-900/80 dark:text-purple-100/80">
//           No password added.
//         </p>
//       ) : (
//         localPasswords.map((item) => (
//           <Card
//             key={item.id}
//             className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-900 border border-purple-200 dark:border-purple-700"
//           >
//             <CardContent className="p-4">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300">
//                     {item.siteName}
//                   </h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {item.username}
//                   </p>
//                   {item.url ? (
//                     <a
//                       href={item.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs text-blue-500 hover:underline truncate block max-w-[12rem]"
//                     >
//                       {item.url}
//                     </a>
//                   ) : null}
//                 </div>
//                 <div className="flex gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 h-8 w-8 text-gray-600 hover:bg-purple-100"
//                     onClick={() => copyToClipboard(item.username)}
//                     title="Copy username"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 h-8 w-8 text-gray-600 hover:bg-red-100"
//                     onClick={() => console.log(`Delete password ${item.id}`)}
//                     title="Delete password"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Password Section */}
//               <div className="flex items-center gap-2">
//                 <div className="flex-1">
//                   <Label className="text-xs text-gray-500">Password</Label>
//                   <span className="font-mono text-sm ml-2">
//                     {visible[item.id] ? item.password : "••••••••••••"}
//                   </span>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="p-1 h-8 w-8"
//                   onClick={() => togglePasswordVisibility(item.id)}
//                   title={visible[item.id] ? "Hide password" : "Show password"}
//                 >
//                   {visible[item.id] ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="p-1 h-8 w-8"
//                   onClick={() => copyToClipboard(item.password)}
//                   title="Copy password"
//                 >
//                   <Copy className="h-4 w-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }
