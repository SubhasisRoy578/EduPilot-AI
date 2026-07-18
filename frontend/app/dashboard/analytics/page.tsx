'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Filter,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: '0px 0px -50px 0px' },
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  viewport: { once: true },
}

// Mock data for charts (will be replaced with real API data)
const emptyLineData = [
  { month: 'Jan', hours: 0 },
  { month: 'Feb', hours: 0 },
  { month: 'Mar', hours: 0 },
  { month: 'Apr', hours: 0 },
  { month: 'May', hours: 0 },
  { month: 'Jun', hours: 0 },
]

const emptyBarData = [
  { day: 'Mon', duration: 0 },
  { day: 'Tue', duration: 0 },
  { day: 'Wed', duration: 0 },
  { day: 'Thu', duration: 0 },
  { day: 'Fri', duration: 0 },
  { day: 'Sat', duration: 0 },
  { day: 'Sun', duration: 0 },
]

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Progress Analytics
            </h1>
            <p className="text-muted-foreground">Track your learning journey and growth</p>
          </div>
          <Button variant="outline" className="border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            icon: TrendingUp,
            label: 'Total Learning Hours',
            value: '0 hrs',
            subtext: 'This month',
            trend: '+0%',
          },
          {
            icon: Target,
            label: 'Goals Completed',
            value: '0',
            subtext: 'All time',
            trend: '-',
          },
          {
            icon: Calendar,
            label: 'Learning Days',
            value: '0',
            subtext: 'This month',
            trend: '+0%',
          },
          {
            icon: Clock,
            label: 'Avg. Daily Time',
            value: '0 min',
            subtext: 'Per session',
            trend: '-',
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-green-400">{stat.trend}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Chart */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <Card className="bg-card border-border/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Learning Progress (Last 6 Months)</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-foreground font-medium mb-1">No data available</p>
                <p className="text-sm text-muted-foreground">
                  Your learning progress will appear here once you start learning
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <Card className="bg-card border-border/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Activity</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-foreground font-medium mb-1">No activity this week</p>
                <p className="text-sm text-muted-foreground">
                  Get started with your first learning session to see weekly stats
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Skill Progress */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <Card className="bg-card border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Skill Progress</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-foreground font-medium mb-2">No skills tracked yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create a roadmap and take assessments to start tracking your skill progress
              </p>
              <Button size="sm" className="bg-primary hover:bg-blue-600">
                Create Roadmap
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Assessment History */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <Card className="bg-card border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Assessment History</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-foreground font-medium mb-2">No assessments completed</p>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your first assessment to see your assessment history and scores
            </p>
            <Button size="sm" className="bg-primary hover:bg-blue-600">
              Take Assessment
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI Insights</h3>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              📊 No data available yet. Once you start learning, AI insights will help you:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Identify your learning patterns and optimal times to study</li>
              <li>• Get personalized recommendations based on your progress</li>
              <li>• Receive motivation and encouragement to stay on track</li>
              <li>• Understand where you need to focus your efforts</li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
