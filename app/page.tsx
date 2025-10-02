// app/page.tsx
import AddCards from "@/components/AddCards";
import AddPassword from "@/components/AddPassword";
import YourCards from "@/components/YourCards";
import YourPasswords from "@/components/YourPasswords";
import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "NoPass - Home",
  description: "This is homepage of my password manager",
};

export default async function Home() {
  const user = await currentUser();
  console.log(user?.privateMetadata);

  const cards = Array.isArray(user?.privateMetadata?.cards)
    ? user.privateMetadata.cards
    : [];

  const passwords = Array.isArray(user?.privateMetadata?.passwords)
    ? user.privateMetadata.passwords
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Password Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure storage for your credentials and cards
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-12">
          {/* Add forms */}
          <div className="grid lg:grid-cols-2 gap-8">
            <AddCards />
            <AddPassword />
          </div>

          {/* Existing data */}
          <div className="grid lg:grid-cols-2 gap-8">
            <YourCards cards={Array.isArray(user?.privateMetadata.cards)?user?.privateMetadata.cards: [] } />
            {/* Uncomment if you want to show passwords */}
            <YourPasswords passwords={passwords} />
          </div>
        </div>
      </div>
    </div>
  );
}
