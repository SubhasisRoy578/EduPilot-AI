'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  CheckCircle,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  ChevronRight,
  Brain,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Roadmap',
    href: '/dashboard/roadmap',
    icon: MapPin,
  },
  {
    label: 'Assessment',
    href: '/dashboard/assessment',
    icon: CheckCircle,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
        className="border-r border-border/30 bg-card flex flex-col"
      >
        {/* Logo Area */}
        <div className="h-16 border-b border-border/30 flex items-center justify-between px-4">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground whitespace-nowrap">EduPilot</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-accent/20"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {sidebarOpen && isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-border/30 p-3 space-y-2">
          <Link href="/dashboard/profile">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-auto py-2 px-4 ${
                pathname === '/dashboard/profile'
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'text-muted-foreground hover:bg-accent/10'
              }`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">Profile</span>}
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-auto py-2 px-4 ${
                pathname === '/dashboard/settings'
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'text-muted-foreground hover:bg-accent/10'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">Settings</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-2 px-4 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-border/30 bg-card/50 backdrop-blur-sm px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Welcome back!</p>
              <p className="text-xs text-muted-foreground">Ready to learn?</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">JD</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
