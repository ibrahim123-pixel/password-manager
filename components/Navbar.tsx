"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/button";
import { SignInButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react";

const Navbar: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const navClasses = isDark
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-gray-900";
  const mobileBg = isDark ? "bg-gray-900" : "bg-white";
  const linkHover = isDark ? "hover:text-gray-300" : "hover:text-gray-600";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <nav className={`${navClasses} shadow-md`}>
      <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="font-bold text-2xl tracking-wider">NoPass</div>

        {/* Nav Links - Desktop */}
        <ul className="hidden md:flex md:gap-8">
          <li>
            <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
              Home
            </a>
          </li>
          <li>
            <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
              About
            </a>
          </li>
          <li>
            <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
              Services
            </a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl ml-2"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${mobileBg} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <a href="#" className={`${linkHover} px-2 py-2 rounded block`}>
                Home
              </a>
            </li>
            <li>
              <a href="#" className={`${linkHover} px-2 py-2 rounded block`}>
                About
              </a>
            </li>
            <li>
              <a href="#" className={`${linkHover} px-2 py-2 rounded block`}>
                Services
              </a>
            </li>
          </ul>
          
          {/* Mobile Auth Buttons */}
          <div className="flex items-center justify-center space-x-3 p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


















































// "use client";

// import React, { useState, useEffect } from "react";
// import { Sun, Moon } from "lucide-react";
// import { useTheme } from "next-themes";
// import { Button } from "@/components/button";
// import { SignInButton } from "@clerk/nextjs";
// import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react";

// const Navbar: React.FC = () => {
//   const { setTheme, resolvedTheme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const isDark = resolvedTheme === "dark";
//   const navClasses = isDark
//     ? "bg-gray-900 text-white"
//     : "bg-gray-100 text-gray-900";
//   const mobileBg = isDark ? "bg-gray-900" : "bg-white";
//   const linkHover = isDark ? "hover:text-gray-300" : "hover:text-gray-600";

//   const toggleTheme = () => {
//     const newTheme = isDark ? "light" : "dark";
//     setTheme(newTheme);
//   };

//   return (
//     <nav className={`${navClasses} shadow-md`}>
//       <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
//         {/* Logo */}
//         <div className="font-bold text-2xl tracking-wider">NoPass</div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden text-2xl"
//           onClick={() => setIsOpen((prev) => !prev)}
//           aria-label="Toggle menu"
//         >
//           &#9776;
//         </button>

//         {/* Nav Links */}
//         <ul
//           className={`flex flex-col md:flex-row md:gap-8 gap-4 md:static absolute md:top-auto top-14 left-0 w-full md:w-auto ${mobileBg} md:bg-transparent p-4 md:p-0 transition-all duration-200 ${
//             isOpen ? "flex" : "hidden md:flex"
//           }`}
//         >
//           <li>
//             <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
//               Home
//             </a>
//           </li>
//           <li>
//             <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
//               About
//             </a>
//           </li>
//           <li>
//             <a href="#" className={`${linkHover} px-2 py-1 rounded block`}>
//               Services
//             </a>
//           </li>
//         </ul>

//         {/* Right Section */}
//         <div className="flex items-center space-x-4">
//           {/* Theme Toggle */}
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label="Toggle theme"
//             onClick={toggleTheme}
//           >
//             {isDark ? (
//               <Moon className="h-5 w-5" />
//             ) : (
//               <Sun className="h-5 w-5" />
//             )}
//           </Button>

//           {/* Auth Buttons */}
//           <SignedOut>
//             <SignInButton />
//             <SignUpButton>
//               <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
//                 Sign Up
//               </button>
//             </SignUpButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
