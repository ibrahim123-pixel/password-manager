"use server";

import { auth, createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

interface Cards {
  id: string;
  cardNo: string;
  expiryDate: string;
  cvv: number;
  createdAt: string;
}

interface Password {
  id: string;
  websiteUrl: string;
  username: string;
  password: string;
  createdAt: string;
}

export async function addCardServer(
  cardNo: string,
  expiryDate: string,
  cvv: number
) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await clerkClient.users.getUser(userId);
  const existingCards: Cards[] = Array.isArray(user.privateMetadata?.cards)
    ? (user.privateMetadata.cards as Cards[])
    : [];

  const newCard: Cards = {
    id: crypto.randomUUID(),
    cardNo,
    expiryDate,
    cvv, // In production, encrypt this!
    createdAt: new Date().toISOString()
  };

  const updatedCards = [...existingCards, newCard];

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      cards: updatedCards,
    },
  });

  return { success: true, message: "Card saved successfully" };
}

export async function addPasswordServer(
  websiteUrl: string,
  username: string,
  password: string
) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await clerkClient.users.getUser(userId);
  const existingPasswords: Password[] = Array.isArray(user.privateMetadata?.passwords)
    ? (user.privateMetadata.passwords as Password[])
    : [];

  const newPassword: Password = {
    id: crypto.randomUUID(),
    websiteUrl,
    username,
    password, // In production, encrypt this!
    createdAt: new Date().toISOString()
  };

  const updatedPasswords = [...existingPasswords, newPassword];

  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      passwords: updatedPasswords,
    },
  });

  return { success: true, message: "Password saved successfully" };
}