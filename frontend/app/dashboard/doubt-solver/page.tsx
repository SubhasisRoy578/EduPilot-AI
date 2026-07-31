"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Bot, Send, User } from "lucide-react";
import axios from "axios";

export default function DoubtSolverPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/doubt-solver", {
        question: question
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAnswer("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-400" />
          AI Doubt Solver
        </h1>
        <p className="text-muted-foreground text-lg">
          Ask me educational doubts, programming questions, mathematics, science, interview preparation, productivity, study planning, and general learning-related doubts.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            <strong>Notice:</strong> AI responses are not stored. Conversations are forgotten after you leave this page.
          </p>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-card border-border/50 p-6 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              placeholder="e.g., Explain the concept of recursion in programming, or how can I improve my study routine?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] resize-none bg-background border-border/50 focus:border-blue-500"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!question.trim() || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>
          </form>

          {answer && (
            <div className="mt-4 pt-6 border-t border-border/50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 bg-background rounded-lg p-5 border border-border/30">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{answer}</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
