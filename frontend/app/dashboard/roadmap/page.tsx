"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Sparkles,
  ArrowRight,
  Code,
  Zap,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  StageSelectDialog,
  type LearningStage,
} from "@/components/stage-select-dialog";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
};

export default function Roadmap() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    currentSkill: "beginner",
    hoursPerDay: "3",
    description: "",
  });
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);

  const activeRoadmaps = roadmaps.filter((rm) => rm.status !== "Completed");
  const completedRoadmaps = roadmaps.filter(
    (rm) => rm.status === "Completed",
  );
  const learnedToday = (roadmap: any) => {
  if (!roadmap.last_learned_date) return false;

  const today = new Date().toISOString().split("T")[0];

  return roadmap.last_learned_date === today;
  };

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
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/roadmap/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmaps(response.data);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const title = formData.goal.split(" ").slice(0, 5).join(" ") + "...";

      await axios.post("http://127.0.0.1:8000/roadmap/create",
       {   
         title,
         description: formData.goal,
         hours_per_day: parseInt(formData.hoursPerDay),
       },
       {
        headers: {
        Authorization: `Bearer ${token}`,
       },
       }
       );

      await fetchRoadmaps();
      setShowForm(false);
      setFormData({ goal: "", currentSkill: "beginner", hoursPerDay: "3",description: "",});
    } catch (error: any) {
  console.log(error);

  if (axios.isAxiosError(error)) {
    console.log(error.response);
    console.log(error.response?.data);
    console.log(error.response?.status);
  }

  alert("Failed to create roadmap");
} finally {
      setLoading(false);
    }
  };

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
            <p className="text-muted-foreground">
              Create personalized learning paths to master any skill
            </p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger>Create Roadmap</DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>Create Your Learning Roadmap</DialogTitle>
                <DialogDescription>
                  Tell us what you want to learn and we&apos;ll create a
                  personalized roadmap for you
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Learning Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Learn React.js"
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
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
                  <Label htmlFor="hoursPerDay">Hours Available Per Day</Label>
                  <select
                    value={formData.hoursPerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, hoursPerDay: e.target.value })
                    }
                  >
                    <option value="3">3 hours</option>
                    <option value="5">5 hours</option>
                    <option value="10">10 hours</option>
                    <option value="15">15+ hours</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Any specific focus areas or prerequisites..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-input/50 border-border/50"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-blue-600"
                  >
                    {loading ? "Generating..." : "Generate Roadmap"}
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
      {roadmaps.length === 0 && (
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
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No roadmaps yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first learning roadmap to get started with
              personalized guidance
            </p>
            <Button
              className="bg-primary hover:bg-blue-600"
              onClick={() => setShowForm(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </Card>
        </motion.div>
      )}
      {/* Active Roadmaps */}
      {activeRoadmaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Active Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeRoadmaps.map((roadmap, i) => {
              const Icon = BookOpen;
              return (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <Link href={`/dashboard/roadmap/${roadmap.id}`}>
                    <Card className="group bg-card hover:bg-card/80 border-border/50 hover:border-blue-500/30 p-6 transition-all flex flex-col h-full cursor-pointer">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 opacity-20 group-hover:opacity-30 transition-opacity`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-400 transition">
                        {roadmap.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                        {roadmap.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                        <span className="text-xs text-muted-foreground">
                          {roadmap.status || "Active"}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500/30 hover:bg-blue-500/10 text-blue-400 relative z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openStageDialog(roadmap);
                          }}
                        >
                          Test Skill
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Completed Roadmaps */}
      {completedRoadmaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Completed Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedRoadmaps.map((roadmap, i) => {
              const Icon = BookOpen;
              return (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <Link href={`/dashboard/roadmap/${roadmap.id}`}>
                    <Card className="group bg-card hover:bg-card/80 border-green-500/20 hover:border-green-500/40 p-6 transition-all flex flex-col h-full cursor-pointer">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 opacity-20 group-hover:opacity-30 transition-opacity`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-green-400 transition">
                        {roadmap.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                        {roadmap.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/10 text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Example Roadmaps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Popular Roadmaps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Code,
              title: "Full Stack Development",
              description: "Learn web development from frontend to backend",
              duration: "6-9 months",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Zap,
              title: "AI & Machine Learning",
              description: "Master AI fundamentals and practical applications",
              duration: "4-6 months",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: BookOpen,
              title: "Data Science",
              description: "Learn data analysis, visualization, and insights",
              duration: "5-7 months",
              color: "from-green-500 to-emerald-500",
            },
          ].map((roadmap, i) => {
            const Icon = roadmap.icon;
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {roadmap.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {roadmap.duration}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
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
