"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Target,
  Flame,
  CheckCircle,
  ArrowRight,
  Calendar,
  Clock,
  Zap,
  BookOpen,
  Sparkles,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  viewport: { once: true },
};

export default function Dashboard() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [goal, setGoal] = useState("");

  const [roadmap, setRoadmap] = useState("");
  const [recentRoadmaps, setRecentRoadmaps] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://127.0.0.1:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/roadmap/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = response.data
          .sort((a: any, b: any) => b.id - a.id)
          .slice(0, 2);
        setRecentRoadmaps(sorted);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    };
    fetchRoadmaps();
  }, []);
  const generateRoadmap = async () => {
    try {
      setLoading(true);

      const response = await axios.post("http://127.0.0.1:8000/grok/test", {
        goal: goal,
      });

      setRoadmap(response.data.roadmap);

      // Also save it
      const token = localStorage.getItem("token");
      const title = goal.split(" ").slice(0, 5).join(" ") + "..."; // Create a simple title
      await axios.post(
        "http://127.0.0.1:8000/roadmap/create",
        {
          title: title,
          description: goal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Refresh list
      const roadmapsResponse = await axios.get(
        "http://127.0.0.1:8000/roadmap/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const sorted = roadmapsResponse.data
        .sort((a: any, b: any) => b.id - a.id)
        .slice(0, 2);
      setRecentRoadmaps(sorted);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div {...fadeInUp}>
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-border/50 p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to EduPilot, {user.name}
            </h2>
            <p className="text-muted-foreground mb-6">
              You&apos;re on track to master your learning goals. Keep up the
              great work!
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/roadmap">
                <Button className="bg-primary hover:bg-blue-600">
                  View My Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/assessment">
                <Button variant="outline" className="border-border/50">
                  Take Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            icon: Flame,
            label: "Current Streak",
            value: "7 days",
            subtext: "Keep it going!",
            color: "from-orange-500 to-red-500",
          },
          {
            icon: Target,
            label: "Active Roadmaps",
            value: "2",
            subtext: "In progress",
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: CheckCircle,
            label: "Skills Mastered",
            value: "0",
            subtext: "Complete a goal",
            color: "from-green-500 to-emerald-500",
          },
          {
            icon: BookOpen,
            label: "Hours Learned",
            value: "0",
            subtext: "Keep learning",
            color: "from-purple-500 to-pink-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card border-border/50 p-6 hover:border-blue-500/30 transition-all">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 opacity-20`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Learning */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Current Learning
              </h3>
              <Link href="/dashboard/roadmap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View all
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Example: I want to become a Python Developer in 3 months..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />

                <Button
                  onClick={generateRoadmap}
                  disabled={loading || !goal}
                  className="w-full"
                >
                  {loading ? "Generating AI Roadmap..." : "Generate AI Roadmap"}
                </Button>

                {roadmap && (
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3">
                      AI Generated Roadmap
                    </h4>

                    <pre className="whitespace-pre-wrap text-sm">{roadmap}</pre>
                  </Card>
                )}
              </div>
              {/* Recent Roadmaps */}
              {recentRoadmaps.length > 0 ? (
                <div className="space-y-4 mt-6">
                  <h4 className="text-md font-semibold">Recent Roadmaps</h4>
                  {recentRoadmaps.map((rm) => (
                    <Card key={rm.id} className="p-4 border-border/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-foreground">
                            {rm.title}
                          </h5>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {rm.description}
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/assessment?topic=${encodeURIComponent(rm.title)}`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-4 flex-shrink-0"
                          >
                            Test Skill
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-foreground font-medium mb-2">
                    No roadmap started yet
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create your first learning roadmap to get started
                  </p>
                  <Link href="/dashboard/roadmap">
                    <Button size="sm" className="bg-primary hover:bg-blue-600">
                      Create Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <Card className="bg-card border-border/50 p-6 h-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/roadmap">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-blue-500/10"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Roadmap
                </Button>
              </Link>
              <Link href="/dashboard/assessment">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-blue-500/10"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Take Assessment
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-blue-500/10"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Recommendations
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium">
                      Start with React
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Popular and in-demand skill
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <Card className="bg-card border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-foreground font-medium mb-2">No activity yet</p>
            <p className="text-muted-foreground text-sm">
              Start a roadmap or assessment to see activity
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
