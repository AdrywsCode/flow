export const taskStatuses = ["todo", "doing", "done"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "A fazer",
  doing: "Em andamento",
  done: "Concluido"
};

export const taskStatusBadgeClasses: Record<TaskStatus, string> = {
  todo: "bg-blue-100 text-blue-900 border-blue-100",
  doing: "bg-amber-100 text-amber-900 border-amber-100",
  done: "bg-emerald-100 text-emerald-900 border-emerald-100"
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta"
};

export const docLanguages = ["html", "css", "js"] as const;
export const docVisibilities = ["personal", "public"] as const;

export type DocLanguage = (typeof docLanguages)[number];
export type DocVisibility = (typeof docVisibilities)[number];
