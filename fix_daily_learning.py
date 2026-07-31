import re
import os

filepath = 'frontend/app/dashboard/page.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Make sure to import toast
if 'import { toast } from' not in content:
    content = content.replace('import { Button } from "@/components/ui/button";', 'import { Button } from "@/components/ui/button";\nimport { toast } from "sonner";')

if "const handleLearnToday" not in content:
    inject_func = """  const handleLearnToday = async (roadmapId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/roadmap/${roadmapId}/learn-today`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Great job! Analytics updated.");
        // Reload to update progress
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.detail || "Failed to log learning");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleNotYet = (roadmapId: number) => {
    router.push(`/dashboard/roadmap/${roadmapId}`);
  };

  const activeRoadmaps = roadmaps.filter((rm) => rm.status !== "Completed");
  const completedRoadmaps = roadmaps.filter((rm) => rm.status === "Completed");"""

    content = content.replace("""  const activeRoadmaps = roadmaps.filter((rm) => rm.status !== "Completed");
  const completedRoadmaps = roadmaps.filter((rm) => rm.status === "Completed");""", inject_func)

daily_section = """
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
"""

if "Today's Learning Section" not in content:
    content = content.replace('{/* Active & Completed Roadmaps */}', daily_section + '\n              {/* Active & Completed Roadmaps */}')

with open(filepath, 'w') as f:
    f.write(content)
print("Applied daily learning to dashboard")
