import Task from "@/mongoose/schema/Task";

export const getFinishedTasks = async () => {
  try {
    const finishedTasks = await Task.find({ isFinished: true });
    return finishedTasks;
  } catch (error: any) {
    throw new Error(`Failed to fetch finsihed tasks: ${error.message}`);
  }
};