'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '../actions/auth'
import { signIn } from 'next-auth/react'
import { Home, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(registerUser, null)

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 top-[-200px] left-[-200px] filter blur-3xl pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-teal-400/5 bottom-[-200px] right-[-200px] filter blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
              PH
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">
              PropertyHub
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-foreground">Create Your Account</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Join the leading Sri Lanka real estate portal
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-border/80 p-6 md:p-8 shadow-2xl">
          <form action={formAction} className="space-y-4">
            {state?.success && (
              <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}

            {state?.message && !state.success && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-semibold">
                {state.message}
              </div>
            )}

            {/* Role Select */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-secondary rounded-xl">
              <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer has-[:checked]:bg-card has-[:checked]:text-foreground text-muted-foreground transition-all">
                <input
                  type="radio"
                  name="role"
                  value="BUYER"
                  defaultChecked
                  className="sr-only"
                />
                <Home className="w-3.5 h-3.5" /> Buyer
              </label>
              <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer has-[:checked]:bg-card has-[:checked]:text-foreground text-muted-foreground transition-all">
                <input type="radio" name="role" value="SELLER" className="sr-only" />
                <UserCheck className="w-3.5 h-3.5" /> Seller
              </label>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                placeholder="E.g. Sajeevan Rodrigo"
              />
              {state?.error?.name && (
                <p className="text-[10px] text-destructive">{state.error.name[0]}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                placeholder="sajeevan@example.com"
              />
              {state?.error?.email && (
                <p className="text-[10px] text-destructive">{state.error.email[0]}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                placeholder="At least 6 characters"
              />
              {state?.error?.password && (
                <p className="text-[10px] text-destructive">{state.error.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Registering...' : 'Register Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 -z-10 border-b border-border"></span>
            <span className="bg-card px-3 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Or Register With
            </span>
          </div>

          {/* Google signup */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full py-2.5 border border-border bg-card hover:bg-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
