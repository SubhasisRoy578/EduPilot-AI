'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Sparkles, Brain, Target, Zap, BookOpen, BarChart3, Shield } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  viewport: { once: true },
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function Home() {
  return (
    <main className="w-full overflow-hidden bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">EduPilot</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How it works
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition">
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-blue-600">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Learning Coach
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              AI-powered personalized learning roadmaps and skill assessments tailored to your goals. Master any skill faster with intelligent guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-blue-600 text-base px-8">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
            >
              {[
                { label: 'Active Learners', value: '50K+' },
                { label: 'Avg. Skill Gain', value: '3x' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat, i) => (
                <motion.div key={i} variants={staggerItem} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI platform provides comprehensive learning tools to accelerate your growth
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Target,
                title: 'Personalized Roadmaps',
                desc: 'AI-generated learning paths customized to your goals and experience level',
              },
              {
                icon: Brain,
                title: 'Smart Assessment',
                desc: 'Adaptive quizzes that identify skill gaps and recommend next steps',
              },
              {
                icon: BarChart3,
                title: 'Progress Analytics',
                desc: 'Track your learning journey with detailed insights and milestones',
              },
              {
                icon: Zap,
                title: 'Real-time Guidance',
                desc: 'AI assistant provides instant help and personalized recommendations',
              },
              {
                icon: BookOpen,
                title: 'Resource Library',
                desc: 'Curated courses, tutorials, and materials for every learning path',
              },
              {
                icon: Shield,
                title: 'Verified Skills',
                desc: 'Get recognized certifications upon completing your learning goals',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card className="group h-full p-6 bg-card hover:bg-card/80 border-border/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-blue-500/5 border-t border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How EduPilot Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with your personalized learning journey in three simple steps
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Define Your Goal',
                desc: 'Tell us what you want to learn and your current experience level. Our AI analyzes your input.',
              },
              {
                step: '02',
                title: 'Get Your Roadmap',
                desc: 'Receive a personalized learning roadmap with curated resources, milestones, and estimated time.',
              },
              {
                step: '03',
                title: 'Master & Grow',
                desc: 'Follow your roadmap, complete assessments, track progress, and achieve your learning goals.',
              },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 text-2xl font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Loved by Learners Everywhere
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people who&apos;ve transformed their careers with EduPilot
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer',
                avatar: '👩‍💻',
                text: 'EduPilot helped me transition from frontend to full-stack development. The personalized roadmap was exactly what I needed!',
              },
              {
                name: 'Marcus Johnson',
                role: 'Product Manager',
                avatar: '👨‍💼',
                text: 'I completed my AI fundamentals course 3x faster than traditional methods. The AI guidance is incredibly helpful.',
              },
              {
                name: 'Lisa Patel',
                role: 'Data Analyst',
                avatar: '👩‍🔬',
                text: 'The skill assessments helped me identify gaps in my knowledge that I didn\'t even know existed.',
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card className="p-6 bg-card border-border/50 backdrop-blur-sm h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground flex-1">"{testimonial.text}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of learners accelerating their careers with AI-powered guidance
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-blue-600 text-base px-8">
                Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Follow</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Twitter</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">EduPilot</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2024 EduPilot AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
