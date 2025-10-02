"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, CreditCard } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addCardServer } from "@/actions/action";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Zod Schema
const formSchema = z.object({
  cardName: z.string().min(2, { message: "Card name is required" }),
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{13,19}$/, { message: "Card number must be 13–19 digits (no spaces)" })
    .refine(
      (value) => {
        // Luhn algorithm
        let sum = 0;
        let double = false;
        for (let i = value.length - 1; i >= 0; i--) {
          let digit = parseInt(value[i], 10);
          if (double) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          double = !double;
        }
        return sum % 10 === 0;
      },
      { message: "Invalid card number" }
    ),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Must be in MM/YY format",
    })
    .refine(
      (value) => {
        const [month, year] = value.split("/").map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        return year > currentYear || (year === currentYear && month >= currentMonth);
      },
      { message: "Card has expired" }
    ),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
  holderName: z.string().min(2, { message: "Cardholder name is required" }),
});

function AddCards() {
  const { user } = useUser();
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      holderName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Card Added:", values);

    if (!user) {
      console.error("No user found. Please log in.");
      return;
    }

    try {
      await addCardServer(
        values.cardNumber.replace(/\s+/g, ""), // remove spaces before save
        values.expiryDate,
        parseInt(values.cvv),
        values.holderName,
        user.id // ✅ added back
      );
      toast.success("Card Added!");
      form.reset({
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        holderName: "",
      });
      router.refresh()
      console.log("Card saved successfully!");
    } catch (err) {
      console.error("Error saving card:", err);
    }
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Plus className="h-5 w-5" /> Add Credit Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal Visa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890123456"
                      maxLength={19}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" maxLength={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" /> Add Card
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddCards;
