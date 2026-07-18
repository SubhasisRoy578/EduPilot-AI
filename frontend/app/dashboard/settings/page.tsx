'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { Bell, Lock, Eye } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Control how we notify you</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox id="emailNotif" defaultChecked />
              <Label htmlFor="emailNotif" className="font-normal cursor-pointer">
                Email notifications for important updates
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="weeklyReport" defaultChecked />
              <Label htmlFor="weeklyReport" className="font-normal cursor-pointer">
                Weekly learning progress report
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="tips" defaultChecked />
              <Label htmlFor="tips" className="font-normal cursor-pointer">
                Tips and recommendations for improvements
              </Label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Privacy</h3>
              <p className="text-sm text-muted-foreground">Control your privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <Label className="font-normal">Profile visibility</Label>
              <Select>
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="displayStats" defaultChecked />
              <Label htmlFor="displayStats" className="font-normal cursor-pointer">
                Display my learning statistics publicly
              </Label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-card border-border/50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-500/5 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your password regularly</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                Change
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="twoFactor" />
              <div>
                <Label htmlFor="twoFactor" className="font-normal cursor-pointer">
                  Enable two-factor authentication
                </Label>
                <p className="text-xs text-muted-foreground">Extra security for your account</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-red-500/5 border border-red-500/10 p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <Button variant="destructive" size="sm">
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
