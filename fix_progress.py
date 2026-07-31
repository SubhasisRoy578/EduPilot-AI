import re

def update_roadmap_cards(file_path):
    with open(file_path, "r") as f:
        content = f.read()

    # Replacement for Active Roadmaps to show progress and multi-level test buttons
    progress_ui = """                            <div className="w-full flex-1 min-w-[200px] mt-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{rm.completed_weeks || 0} / {rm.total_weeks || 8} Weeks</span>
                                <span>{Math.round(((rm.completed_weeks || 0) / (rm.total_weeks || 8)) * 100)}%</span>
                              </div>
                              <Progress value={((rm.completed_weeks || 0) / (rm.total_weeks || 8)) * 100} className="h-1.5" />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {[
                                { stage: "just_started", label: "Week 1 Test" },
                                { stage: "mediocre", label: "Week 3 Test" },
                                { stage: "almost_complete", label: "Week 5 Test" },
                                { stage: "completed", label: "Week 8 Test" },
                              ].map((test, idx) => {
                                const isUnlocked = true; // Could base on completed_weeks if strict progression needed
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
                            </div>"""

    # For dashboard/page.tsx:
    if "dashboard/page.tsx" in file_path:
        # My previous script failed to match this due to spacing or formatting changes.
        # Let's target the exact structure:
        search_pattern = r'<Button\s+size="sm"\s+variant="outline"\s+className="ml-4 flex-shrink-0"\s+onClick=\{\(\) => openStageDialog\(rm\)\}\s+>\s+Test Skill\s+</Button>'
        content = re.sub(search_pattern, progress_ui, content)

    with open(file_path, "w") as f:
        f.write(content)

update_roadmap_cards("frontend/app/dashboard/page.tsx")
