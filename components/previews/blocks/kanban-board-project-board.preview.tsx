"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ProjectBoard, type BoardColumn, type BoardTask } from "@/components/motion/project-board";

const columns: BoardColumn[] = [{ id: "planned", title: "Planned" }, { id: "building", title: "In progress" }, { id: "ready", title: "Ready" }];
const avatars = { Ria: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80", Noah: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80", Lea: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80" };
const initial: BoardTask[] = [
  { id: "navigation", columnId: "planned", title: "Simplify the account navigation", description: "Keep the most useful destinations close and give account actions a clearer home.", assignee: "Ria Shah", avatarUrl: avatars.Ria, priority: "high", tags: ["Design"], dueDate: "Oct 12", checklist: [{ id: "map", label: "Map the current destinations", done: true }, { id: "draft", label: "Draft the new navigation", done: false }, { id: "review", label: "Review with the team", done: false }] },
  { id: "uploads", columnId: "planned", title: "Add a clearer upload state", description: "Show progress and make interrupted uploads easy to resume.", assignee: "Noah Park", avatarUrl: avatars.Noah, priority: "medium", tags: ["Product"], dueDate: "Oct 14" },
  { id: "shortcuts", columnId: "planned", title: "Write the keyboard shortcut guide", description: "A short reference for the actions people use most.", priority: "low", tags: ["Docs"] },
  { id: "search", columnId: "building", title: "Improve search result ranking", description: "Bring recent, relevant items to the top without hiding exact matches.", assignee: "Noah Park", avatarUrl: avatars.Noah, priority: "high", tags: ["Engineering"], dueDate: "Oct 10", checklist: [{ id: "weights", label: "Tune the relevance weights", done: true }, { id: "samples", label: "Check common queries", done: false }] },
  { id: "empty", columnId: "building", title: "Refine the empty states", description: "Make the next action obvious when a collection has no items.", assignee: "Ria Shah", avatarUrl: avatars.Ria, priority: "medium", tags: ["Design"], dueDate: "Oct 11" },
  { id: "handoff", columnId: "building", title: "Prepare the release handoff", description: "Collect the final notes, screenshots, and review links.", assignee: "Lea Ortiz", avatarUrl: avatars.Lea, priority: "medium", tags: ["Release"] },
  { id: "settings", columnId: "ready", title: "Group the notification settings", description: "Keep delivery preferences together and make their labels consistent.", assignee: "Lea Ortiz", avatarUrl: avatars.Lea, priority: "medium", tags: ["Product"], dueDate: "Oct 8", checklist: [{ id: "group", label: "Group the preferences", done: true }, { id: "labels", label: "Review the labels", done: true }] },
  { id: "contrast", columnId: "ready", title: "Check contrast in both themes", description: "Review the controls, metadata, and focus states across the workspace.", assignee: "Ria Shah", avatarUrl: avatars.Ria, priority: "high", tags: ["Accessibility"] },
];

export function KanbanProjectBoardPreview() {
  const [boardColumns, setColumns] = useState(columns);
  const [tasks, setTasks] = useState(initial);
  return <div className="w-full p-3 sm:p-6"><ProjectBoard columns={boardColumns} onColumnsChange={setColumns} tasks={tasks} onTasksChange={setTasks} currentUser="Ria Shah" headerActions={<button type="button" aria-label="Reset board" className="grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setColumns(columns); setTasks(initial); }}><RotateCcw className="size-3.5"/></button>}/></div>;
}
