"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  StageSelectDialog,
  type LearningStage,
} from "@/components/stage-select-dialog";
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
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    streak: 0,
  });

  const [goal, setGoal] = useState("");

  const [roadmap, setRoadmap] = useState("");
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // Stage selection dialog state for "Test Skill"
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);

  const activeRoadmaps = roadmaps.filter((rm) => rm.status !== "Completed");
  const completedRoadmaps = roadmaps.filter(
    (rm) => rm.status === "Completed",
  );

  const openStageDialog = (rm: any) => {
    setSelectedRoadmap(rm);
    setStageDialogOpen(true);
  };

  const handleStageSelect = (stage: LearningStage) => {
    if (!selectedRoadmap) return;
    setStageDialogOpen(false);
    router.push(
      `/dashboard/assessment?topic=${encodeURIComponent(selectedRoadmap.title)}&stage=${stage}&roadmap_id=${selectedRoadmap.id}`,
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://127.0.0.1:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser({
          name: `${response.data.first_name} ${response.data.last_name}`,
          email: response.data.email,
          role: response.data.role,
          streak: response.data.streak,
        });
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
        const sorted = response.data.sort((a: any, b: any) => b.id - a.id);
        setRoadmaps(sorted);
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
      const createResponse = await axios.post(
        "http://127.0.0.1:8000/roadmap/create",
        {
          title: title,
          description: goal,
          hours_per_day: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update the list immediately with the newly created roadmap
      // (no page refresh needed)
      setRoadmaps((prev) => [createResponse.data, ...prev]);
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
            value: `${user.streak || 0} days`,
            subtext: "Keep it going!",
            color: "from-orange-500 to-red-500",
          },
          {
            icon: Target,
            label: "Active Roadmaps",
            value: `${activeRoadmaps.length}`,
            subtext: "In progress",
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: CheckCircle,
            label: "Completed Roadmaps",
            value: `${completedRoadmaps.length}`,
            subtext:
              completedRoadmaps.length > 0
                ? "Great progress!"
                : "Complete a goal",
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

              {/* Today's Learning Section */}
              {activeRoadmaps.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-md font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Today's Learning
                  </h4>
                  {activeRoadmaps.map((rm) => (
                    <Card key={`daily-${rm.id}`} className="p-4 border-yellow-500/20 bg-yellow-500/5">
                      <div className="flex flex-col gap-2">
                        <h5 className="font-medium text-foreground">{rm.title}</h5>
                        <p className="text-sm text-muted-foreground">Today's suggested lesson: Keep progressing on your roadmap.</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" onClick={() => handleLearnToday(rm.id)}>
                            Learnt Today's Lesson
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleNotYet(rm.id)}>
                            Not Yet (Learn Now)
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Active & Completed Roadmaps */}
              {roadmaps.length > 0 ? (
                <div className="space-y-6 mt-6">
                  {activeRoadmaps.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        Active Roadmaps
                      </h4>
                      {activeRoadmaps.slice(0, 3).map((rm) => (
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
                                                        <div className="w-full flex-1 min-w-[200px] mt-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{rm.completed_weeks || 0} / {rm.total_weeks || 8} Weeks</span>
                                <span>{Math.round(((rm.completed_weeks || 0) / (rm.total_weeks || 8)) * 100)}%</span>
                              </div>
                              <Progress value={((rm.completed_weeks || 0) / (rm.total_weeks || 8)) * 100} className="h-1.5" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {[
                                { stage: "just_started", label: "Week 1 Test", req_weeks: 0 },
                                { stage: "mediocre", label: "Week 3 Test", req_weeks: 1 },
                                { stage: "almost_complete", label: "Week 5 Test", req_weeks: 3 },
                                { stage: "completed", label: "Week 8 Test", req_weeks: 5 },
                              ].map((test, idx) => {
                                const isUnlocked = (rm.completed_weeks || 0) >= test.req_weeks;
                                return (
                                  <Button
                                    key={idx}
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-500/30 hover:bg-blue-500/10 text-blue-400 relative z-10"
                                    disabled={!isUnlocked}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      router.push(`/dashboard/assessment?topic=${encodeURIComponent(rm.title)}&stage=${test.stage}&roadmap_id=${rm.id}`);
                                    }}
                                  >
                                    {test.label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {completedRoadmaps.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Completed Roadmaps
                      </h4>
                      {completedRoadmaps.slice(0, 3).map((rm) => (
                        <Card
                          key={rm.id}
                          className="p-4 border-green-500/20 bg-green-500/5"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-foreground">
                                {rm.title}
                              </h5>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {rm.description}
                              </p>
                            </div>
                            <span className="ml-4 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium bg-green-500/10 text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
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

      {/* Learning Stage Selection Dialog (Test Skill) */}
      <StageSelectDialog
        open={stageDialogOpen}
        onOpenChange={setStageDialogOpen}
        skillName={selectedRoadmap?.title}
        onSelect={handleStageSelect}
      />
    </div>
  );
}
