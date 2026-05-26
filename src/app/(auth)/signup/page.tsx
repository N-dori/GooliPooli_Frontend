'use client';

import { SignupSchema, type SignupInput } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignup } from '@/lib/hooks/useAuth';

export default function SignupPage() {
  const signup = useSignup();
  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Start managing pool operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={form.handleSubmit((data) => signup.mutate(data))}
          className="space-y-3"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" autoComplete="username" {...form.register('username')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register('password')}
            />
          </div>
          <Button type="submit" className="w-full" disabled={signup.isPending}>
            {signup.isPending ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
