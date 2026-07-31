'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Profile() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/signin')
        return
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = response.data
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setEmail(data.email || '')
        setBio(data.bio || '')
      } catch (error) {
        console.error('Error fetching profile', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setErrorMsg('')
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await axios.put(
        'http://127.0.0.1:8000/me',
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          bio: bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setMsg('Profile updated successfully! Refresh the page to see changes in the layout.')
    } catch (error) {
      console.error('Error updating profile', error)
      setErrorMsg('Failed to update profile.')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 p-8">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-3xl font-semibold text-white">
                {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'U'}
              </span>
            </div>
            <Button variant="outline" className="border-border/50">
              Change Avatar
            </Button>
          </div>

          {msg && <div className="text-green-500 mb-4">{msg}</div>}
          {errorMsg && <div className="text-red-500 mb-4">{errorMsg}</div>}

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-input/50 border-border/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-input/50 border-border/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-input/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-primary hover:bg-blue-600">Save Changes</Button>
              <Button type="button" variant="outline" className="border-border/50" onClick={() => window.location.reload()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
