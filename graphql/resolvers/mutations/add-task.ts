import { Task } from "@/mongoose/schema/Task";

export const addTask = async (
  _: unknown,
  args: {
    taskName: string;
    description: string;
    priority: number;
    tags: string[];
  },
  context: any
) => {
  const userId = context.userId
  const existingUser = await Task.findById(userId);

  if (!existingUser) {
    throw new Error("User not found.");
  }

  const { taskName, description, priority, tags = [] } = args;

  if (description === taskName) {
    throw new Error("Description cannot be the same as task name.");
  }

  if (description.length < 10) {
    throw new Error("Description must be at least 10 characters long.");
  }

  if (tags.length > 5) {
    throw new Error("You can only provide up to 5 tags");
  }

  if (priority < 1 || priority > 5) {
    throw new Error("Priority muset be between 1 and 5.");
  }

  const existingTask = await Task.findOne({ taskName, userId });
  if (existingTask) {
    throw new Error("Task must be unique per user");
  }

  const newTask = await Task.create({
    taskName,
    description,
    priority,
    tags,
    userId,
    isDone: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newTask;
}

