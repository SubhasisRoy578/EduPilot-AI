'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MapPin, Sparkles, ArrowRight, Code, Zap, BookOpen } from 'lucide-react'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: '0px 0px -50px 0px' },
}

export default function Roadmap() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    goal: '',
    currentSkill: 'beginner',
    hoursPerWeek: '5',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Empty state - no backend
    setShowForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-8 h-8 text-blue-400" />
              Learning Roadmaps
            </h1>
            <p className="text-muted-foreground">Create personalized learning paths to master any skill</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger>
  Create Roadmap
</DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>Create Your Learning Roadmap</DialogTitle>
                <DialogDescription>
                  Tell us what you want to learn and we&apos;ll create a personalized roadmap for you
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Learn React.js"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="bg-input/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSkill">Current Level</Label>
                  <select
  value={formData.currentSkill}
  onChange={(e) =>
    setFormData({
      ...formData,
      currentSkill: e.target.value,
    })
  }
  className="w-full rounded-md border border-border bg-background p-2"
>
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
  <option value="advanced">Advanced</option>
</select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek">Hours Available Per Week</Label>
                  <select
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                  >
                    <option value="3">3 hours</option>
                    <option value="5">5 hours</option>
                    <option value="10">10 hours</option>
                    <option value="15">15+ hours</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Any specific focus areas or prerequisites..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-input/50 border-border/50"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-blue-600">
                    Generate Roadmap
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border/50"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border/50 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No roadmaps yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first learning roadmap to get started with personalized guidance
          </p>
          <Button className="bg-primary hover:bg-blue-600" onClick={() => setShowForm(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Create Your First Roadmap
          </Button>
        </Card>
      </motion.div>

      {/* Example Roadmaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Popular Roadmaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Code,
              title: 'Full Stack Development',
              description: 'Learn web development from frontend to backend',
              duration: '6-9 months',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Zap,
              title: 'AI & Machine Learning',
              description: 'Master AI fundamentals and practical applications',
              duration: '4-6 months',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: BookOpen,
              title: 'Data Science',
              description: 'Learn data analysis, visualization, and insights',
              duration: '5-7 months',
              color: 'from-green-500 to-emerald-500',
            },
          ].map((roadmap, i) => {
            const Icon = roadmap.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <Card className="group bg-card hover:bg-card/80 border-border/50 hover:border-blue-500/30 p-6 cursor-pointer transition-all">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${roadmap.color} flex items-center justify-center mb-4 opacity-20 group-hover:opacity-30 transition-opacity`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-400 transition">
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{roadmap.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{roadmap.duration}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition" />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
