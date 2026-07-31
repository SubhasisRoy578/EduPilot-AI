"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const LEARNING_STAGES = [
  {
    value: "just_started",
    label: "Just Started Learning",
    difficulty: "Easy",
    description: "I'm new to this topic and only know the basics",
    badgeClass: "bg-green-500/10 text-green-400",
  },
  {
    value: "mediocre",
    label: "Mediocre",
    difficulty: "Medium",
    description: "I know the fundamentals and some practical usage",
    badgeClass: "bg-yellow-500/10 text-yellow-400",
  },
  {
    value: "almost_complete",
    label: "Almost Complete",
    difficulty: "Hard",
    description: "I'm comfortable with most of this topic",
    badgeClass: "bg-orange-500/10 text-orange-400",
  },
  {
    value: "completed",
    label: "Completed Learning",
    difficulty: "Expert",
    description: "I've finished learning — test my mastery",
    badgeClass: "bg-red-500/10 text-red-400",
  },
] as const;

export type LearningStage = (typeof LEARNING_STAGES)[number]["value"];

interface StageSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName?: string;
  onSelect: (stage: LearningStage) => void;
}

export function StageSelectDialog({
  open,
  onOpenChange,
  skillName,
  onSelect,
}: StageSelectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>What&apos;s your current learning stage?</DialogTitle>
          <DialogDescription>
            {skillName
              ? `Choose how far along you are with "${skillName}". Your assessment difficulty will match your stage.`
              : "Choose how far along you are. Your assessment difficulty will match your stage."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {LEARNING_STAGES.map((stage) => (
            <Button
              key={stage.value}
              variant="outline"
              className="w-full justify-between border-border/50 h-auto py-3 px-4 hover:bg-blue-500/10 text-left"
              onClick={() => onSelect(stage.value)}
            >
              <span className="flex flex-col items-start gap-0.5">
                <span className="font-medium text-foreground">
                  {stage.label}
                </span>
                <span className="text-xs text-muted-foreground whitespace-normal">
                  {stage.description}
                </span>
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-3 ${stage.badgeClass}`}
              >
                {stage.difficulty}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
