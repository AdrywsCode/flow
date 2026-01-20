export const taskStatuses = ["todo", "doing", "done"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "A fazer",
  doing: "Em andamento",
  done: "Concluido"
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
