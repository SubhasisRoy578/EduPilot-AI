'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Settings() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        await axios.delete('http://127.0.0.1:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        localStorage.removeItem('token')
        router.push('/auth/signup')
      } catch (error) {
        console.error('Error deleting account', error)
        setErrorMsg('Failed to delete account. Please try again later.')
      }
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      {/* Development Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Info className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Development Notice</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This website is currently in the Development Phase.<br />
                Contact: Soumyadeep Pal, Subhasis Roy.<br />
                Email: soumyadeepp269@gmail.com.<br />
                WhatsApp Only: +91 6291067449.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-red-500/5 border border-red-500/10 p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          {errorMsg && <div className="text-red-500 text-sm mb-4">{errorMsg}</div>}
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This action cannot be undone. Please proceed with caution.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
