"use client";

import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  StageSelectDialog,
  LEARNING_STAGES,
  type LearningStage,
} from "@/components/stage-select-dialog";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
};

export default function Assessment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentContent />
    </Suspense>
  );
}

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  viewport: { once: true },
};

function AssessmentContent() {
  const searchParams = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizStatus, setQuizStatus] = useState<"idle" | "taking" | "result">(
    "idle",
  );
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  // Learning stage selection (Test Skill flow)
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [pendingSkill, setPendingSkill] = useState("");
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(
    null,
  );
  const [roadmapId, setRoadmapId] = useState<number | null>(null);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const stage = searchParams.get("stage");
    const roadmapIdParam = searchParams.get("roadmap_id");

    if (topic && quizStatus === "idle" && !quizData && !isLoading) {
      const parsedRoadmapId = roadmapIdParam
        ? parseInt(roadmapIdParam, 10)
        : null;
      setRoadmapId(Number.isNaN(parsedRoadmapId as number) ? null : parsedRoadmapId);

      const validStage = LEARNING_STAGES.find((s) => s.value === stage);
      if (validStage) {
        // Stage already chosen (e.g. via Test Skill dialog on another page)
        startAssessment(topic, validStage.value);
      } else {
        // Ask the user for their learning stage first
        setPendingSkill(topic);
        setStageDialogOpen(true);
      }
    }
  }, [searchParams]);

  // Called after the user picks a skill: ask for their learning stage
  const requestStage = (skill: string) => {
    setShowDialog(false);
    setPendingSkill(skill);
    setStageDialogOpen(true);
  };

  const handleStageSelect = (stage: LearningStage) => {
  console.log("handleStageSelect called");
  console.log("Stage:", stage);
  console.log("Pending Skill:", pendingSkill);


  setStageDialogOpen(false);

  if (pendingSkill) {
    startAssessment(pendingSkill, stage);
  } else {
    alert("pendingSkill is empty");
  }
};

  const startAssessment = async (skill: string, stage: LearningStage) => {
  console.log("startAssessment called");
  console.log("Skill:", skill);
  console.log("Stage:", stage);

  setSelectedSkill(skill);
  setSelectedStage(stage);
  setShowDialog(false);
  setStageDialogOpen(false);
  setIsLoading(true);

  try {
    const response = await fetch(
      "http://localhost:8000/assessment/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          topic: skill,
          stage: stage,
        }),
      }
    );

    console.log("Status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to generate assessment");
    }

    const data = await response.json();

    console.log("Assessment Response:", data);

    setQuizData(data);
    setQuizStatus("taking");
    setCurrentQuestionIndex(0);
    setAnswers({});
  } catch (error) {
    console.error("Assessment Error:", error);
  } finally {
    setIsLoading(false);
  }
};
  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const submitAssessment = async () => {
    if (!quizData) return;
    setIsLoading(true);

    // Calculate score locally (since we trust the frontend here for simplicity)
    let score = 0;
    quizData.questions.forEach((q: any) => {
      if (answers[q.id] === q.correct_answer) {
        score++;
      }
    });

    try {
      const response = await fetch("http://localhost:8000/assessment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          topic: quizData.topic,
          score,
          total_questions: quizData.questions.length,
          stage: selectedStage,
          roadmap_id: roadmapId,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit assessment");
      const data = await response.json();
      setResult(data);
      setQuizStatus("result");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="text-muted-foreground">
              Evaluate your skills and identify gaps
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-md text-white">
             
                <Sparkles className="w-4 h-4 mr-2" />
                Start Assessment
              
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
                  "JavaScript Fundamentals",
                  "React.js",
                  "Python Basics",
                  "Data Structures",
                  "SQL Databases",
                  "Web Development",
                ].map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    className="w-full justify-start border-border/50 h-auto py-3 hover:bg-blue-500/10"
                    onClick={() => requestStage(skill)}
                    disabled={isLoading}
                  >
                    {skill}
                  </Button>
                ))}

                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                  <Input
                    placeholder="Or enter any custom topic..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (customTopic.trim()) {
                        requestStage(customTopic.trim());
                      }
                    }}
                    disabled={!customTopic.trim() || isLoading}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {isLoading && quizStatus === "idle" && (
        <Card className="bg-card border-border/50 p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Generating Assessment...
          </h3>
          <p className="text-muted-foreground">
            Please wait while our AI creates a personalized quiz for you.
          </p>
        </Card>
      )}

      {/* Quiz Taking State */}
      {quizStatus === "taking" && quizData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border/50 p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quizData.questions.length}
                </span>
                <span className="text-sm font-medium text-blue-400 flex items-center gap-2">
                  {selectedSkill}
                  {selectedStage && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        LEARNING_STAGES.find(
                          (s) => s.value === selectedStage,
                        )?.badgeClass || "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {
                        LEARNING_STAGES.find((s) => s.value === selectedStage)
                          ?.difficulty
                      }
                    </span>
                  )}
                </span>
              </div>
              <Progress
                value={
                  ((currentQuestionIndex + 1) / quizData.questions.length) * 100
                }
                className="mb-6"
              />
              <h3 className="text-xl font-semibold text-foreground">
                {quizData.questions[currentQuestionIndex].question}
              </h3>
            </div>

            <div className="space-y-3 mb-8">
              {quizData.questions[currentQuestionIndex].options.map(
                (option: string, i: number) => (
                  <Button
                    key={i}
                    variant={
                      answers[quizData.questions[currentQuestionIndex].id] ===
                      option
                        ? "default"
                        : "outline"
                    }
                    className={`w-full justify-start h-auto py-4 px-6 text-left whitespace-normal ${
                      answers[quizData.questions[currentQuestionIndex].id] ===
                      option
                        ? "bg-blue-600 hover:bg-blue-700 border-transparent text-white"
                        : "border-border/50 hover:bg-blue-500/10"
                    }`}
                    onClick={() =>
                      handleOptionSelect(
                        quizData.questions[currentQuestionIndex].id,
                        option,
                      )
                    }
                  >
                    <span className="mr-4 inline-block w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </Button>
                ),
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </Button>
              {currentQuestionIndex < quizData.questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  disabled={
                    !answers[quizData.questions[currentQuestionIndex].id]
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={submitAssessment}
                  disabled={
                    !answers[quizData.questions[currentQuestionIndex].id] ||
                    isLoading
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Submitting..." : "Submit Assessment"}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results State */}
      {quizStatus === "result" && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border/50 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Assessment Complete!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              You scored{" "}
              <span className="font-bold text-white">{result.score}</span> out
              of {result.total_questions} on {result.topic}
            </p>

            <div className="bg-blue-500/10 rounded-lg p-6 text-left mb-8 max-w-2xl mx-auto border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                AI Recommendations
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {result.recommendations ||
                  "Great job! Keep practicing to improve your skills further."}
              </p>
            </div>

            <Button
              onClick={() => {
                setQuizStatus("idle");
                setResult(null);
                setQuizData(null);
              }}
              className="bg-primary hover:bg-blue-600"
            >
              Take Another Assessment
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && quizStatus === "idle" && (
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
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No assessments taken
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your first assessment to identify your skill level and
              receive personalized recommendations
            </p>
            <Button
              className="bg-primary hover:bg-blue-600"
              onClick={() => setShowDialog(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take Your First Assessment
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Assessment Preview */}
      {!isLoading && quizStatus === "idle" && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Available Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "JavaScript Fundamentals",
                questions: 20,
                duration: "15 mins",
                difficulty: "Beginner",
                icon: "📝",
              },
              {
                title: "React.js Intermediate",
                questions: 25,
                duration: "20 mins",
                difficulty: "Intermediate",
                icon: "⚛️",
              },
              {
                title: "Python Basics",
                questions: 20,
                duration: "15 mins",
                difficulty: "Beginner",
                icon: "🐍",
              },
              {
                title: "Data Structures",
                questions: 30,
                duration: "25 mins",
                difficulty: "Advanced",
                icon: "📊",
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
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        assessment.difficulty === "Beginner"
                          ? "bg-green-500/10 text-green-400"
                          : assessment.difficulty === "Intermediate"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
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

                  <Button
                    className="w-full bg-primary hover:bg-blue-600 group-hover:bg-blue-600"
                    size="sm"
                  >
                    Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Assessment Benefits */}
      {!isLoading && quizStatus === "idle" && (
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
                "Identify your current skill level accurately",
                "Get personalized recommendations based on results",
                "Track progress over time with historical data",
                "Receive badges and certificates upon completion",
                "Understand exactly what you need to improve",
              ].map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}
      <StageSelectDialog
        open={stageDialogOpen}
        onOpenChange={setStageDialogOpen}
        onSelect={handleStageSelect}
      />
    </div>
  );
}

