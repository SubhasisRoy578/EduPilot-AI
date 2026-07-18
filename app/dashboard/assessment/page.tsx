'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

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

export default function Assessment() {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              Skill Assessment
            </h1>
            <p className="text-muted-foreground">Evaluate your skills and identify gaps</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-blue-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>Select a Skill to Assess</DialogTitle>
                <DialogDescription>
                  Choose the skill you want to be evaluated on
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {[
                  'JavaScript Fundamentals',
                  'React.js',
                  'Python Basics',
                  'Data Structures',
                  'SQL Databases',
                  'Web Development',
                ].map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    className="w-full justify-start border-border/50 h-auto py-3 hover:bg-blue-500/10"
                    onClick={() => {
                      setSelectedSkill(skill)
                      setShowDialog(false)
                    }}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
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
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No assessments taken</h3>
          <p className="text-muted-foreground mb-6">
            Start your first assessment to identify your skill level and receive personalized recommendations
          </p>
          <Button className="bg-primary hover:bg-blue-600" onClick={() => setShowDialog(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Take Your First Assessment
          </Button>
        </Card>
      </motion.div>

      {/* Assessment Preview */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'JavaScript Fundamentals',
              questions: 20,
              duration: '15 mins',
              difficulty: 'Beginner',
              icon: '📝',
            },
            {
              title: 'React.js Intermediate',
              questions: 25,
              duration: '20 mins',
              difficulty: 'Intermediate',
              icon: '⚛️',
            },
            {
              title: 'Python Basics',
              questions: 20,
              duration: '15 mins',
              difficulty: 'Beginner',
              icon: '🐍',
            },
            {
              title: 'Data Structures',
              questions: 30,
              duration: '25 mins',
              difficulty: 'Advanced',
              icon: '📊',
            },
          ].map((assessment, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="group bg-card hover:bg-card/80 border-border/50 hover:border-blue-500/30 p-6 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{assessment.icon}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    assessment.difficulty === 'Beginner'
                      ? 'bg-green-500/10 text-green-400'
                      : assessment.difficulty === 'Intermediate'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {assessment.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-blue-400 transition">
                  {assessment.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    {assessment.questions} questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {assessment.duration}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-blue-600 group-hover:bg-blue-600" size="sm">
                  Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Assessment Benefits */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <Card className="bg-blue-500/5 border border-blue-500/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            Why Take Assessments?
          </h3>
          <ul className="space-y-3">
            {[
              'Identify your current skill level accurately',
              'Get personalized recommendations based on results',
              'Track progress over time with historical data',
              'Receive badges and certificates upon completion',
              'Understand exactly what you need to improve',
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>
    </div>
  )
}
