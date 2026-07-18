'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 bg-card border-border/50 backdrop-blur-sm">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input/50 border-border/50 focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-blue-600 mt-6">
                Send Reset Link <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
              <p className="text-muted-foreground">
                We&apos;ve sent a password reset link to{' '}
                <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-sm">
              <p className="text-foreground mb-2">
                The link will expire in 1 hour. If you don&apos;t see it, check your spam folder.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full border-border/50"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>

            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}
