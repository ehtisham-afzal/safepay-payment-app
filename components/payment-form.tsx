'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentSchema } from '@/lib/safepay';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface PaymentFormProps {
  apiKey: string;
  isTestMode?: boolean;
  onError?: (error: Error) => void;
}

export function PaymentForm({ apiKey, isTestMode = true, onError }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      amount: 0,
      currency: 'PKR',
      description: '',
      customer: {
        name: '',
        email: '',
        phone: '',
      },
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to SafePay's hosted checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error as Error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PKR">PKR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </form>
    </Form>
  );
} 