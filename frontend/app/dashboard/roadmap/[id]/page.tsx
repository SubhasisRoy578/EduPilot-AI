"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Lightbulb, MapPin, Target, TriangleAlert, Video, Calendar, Navigation, ArrowLeft, ArrowRight } from "lucide-react";

export default function RoadmapDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [studyGuide, setStudyGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmapAndGuide = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch roadmap details
        const rmResponse = await axios.get(`http://127.0.0.1:8000/roadmap/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoadmap(rmResponse.data);

        // Fetch AI study guide based on the roadmap description (goal)
        const aiResponse = await axios.post("http://127.0.0.1:8000/grok/study-guide", {
          goal: rmResponse.data.description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (aiResponse.data.error) {
          setError("Failed to generate AI study guide.");
        } else {
          setStudyGuide(aiResponse.data);
        }
      } catch (err: any) {
        console.error("Error fetching roadmap detail:", err);
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoadmapAndGuide();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Generating your personalized study guide with AI...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="text-center py-12">
        <TriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{error || "Roadmap not found"}</h2>
        <Button onClick={() => router.push("/dashboard/roadmap")} variant="outline">
          Back to Roadmaps
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-400" />
              {roadmap.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
              {roadmap.description}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${roadmap.status === "Completed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
              {roadmap.status}
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              {roadmap.hours_per_day} hours / day
            </p>
          </div>
        </div>
      </motion.div>

      {studyGuide && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-8">

          {/* Motivation Banner */}
          {studyGuide.motivational_message && (
             <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6 text-center">
               <p className="text-lg font-medium text-blue-100 italic">"{studyGuide.motivational_message}"</p>
             </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: The Path (Weeks) */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Navigation className="w-6 h-6 text-blue-400" />
                Your Learning Path
              </h2>

              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {studyGuide.weeks?.map((week: any, index: number) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-blue-500 bg-background group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Target className="w-5 h-5" />
                    </div>
                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border-border/50 hover:border-blue-500/30 transition-all">
                      <h3 className="text-lg font-bold text-blue-400 mb-1">{week.week}</h3>
                      <h4 className="font-semibold text-foreground mb-3">{week.topic}</h4>

                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tasks</p>
                        <ul className="space-y-1">
                          {week.tasks?.map((task: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Practice</p>
                        <p className="text-sm text-muted-foreground">{week.practice}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Resources & Tips */}
            <div className="space-y-6">
              <Card className="p-6 bg-card border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-purple-400" />
                  Top Resources
                </h3>
                <ul className="space-y-3">
                  {studyGuide.resources?.map((res: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 bg-purple-500/5 p-3 rounded-md">
                      <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      {res}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Important Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {studyGuide.important_concepts?.map((concept: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      {concept}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <TriangleAlert className="w-5 h-5 text-red-400" />
                  Common Mistakes
                </h3>
                <ul className="space-y-2">
                  {studyGuide.common_mistakes?.map((mistake: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span> {mistake}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-card border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Strategy & Revision
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Practice Strategy</h4>
                    <p className="text-sm text-muted-foreground">{studyGuide.practice_strategy}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Revision Schedule</h4>
                    <p className="text-sm text-muted-foreground">{studyGuide.revision_schedule}</p>
                  </div>
                  {studyGuide.exam_tips && studyGuide.exam_tips.length > 0 && (
                     <div>
                       <h4 className="text-sm font-semibold text-foreground mb-1">Pro Tips</h4>
                       <ul className="space-y-1">
                         {studyGuide.exam_tips.map((tip: string, i: number) => (
                           <li key={i} className="text-xs text-muted-foreground">- {tip}</li>
                         ))}
                       </ul>
                     </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Motivational Speech */}
          {studyGuide.motivational_speech && (
            <Card className="p-8 bg-card border-border/50 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Lightbulb className="w-6 h-6 text-orange-400" />
                A Word of Inspiration
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed italic relative z-10">
                "{studyGuide.motivational_speech}"
              </p>
            </Card>
          )}

        </motion.div>
      )}
    </div>
  );
}
