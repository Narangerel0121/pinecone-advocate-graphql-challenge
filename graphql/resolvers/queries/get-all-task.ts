import Task from "@/mongoose/schema/Task";

export const getAllTasks = async () => {
  try {
    const tasks = await Task.find();
    return tasks;
  } catch (error: any) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};