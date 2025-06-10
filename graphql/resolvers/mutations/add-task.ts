import Task from "@/mongoose/schema/Task";

const addTask = async (
  _: unknown,
  { taskName, description, tags, priority }
    : {
      taskName: string;
      description: string;
      tags: string[];
      priority: number
    }
) => {
  if (!taskName || !description || !tags || !priority) {
    throw new Error("All fields are required");
  }
  try {
    const newTask = new Task({
      taskName,
      description,
      isDone: false,
      priority,
      tags
    });

    const savedTask = await newTask.save();
    return savedTask;
  } catch (error: any) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
};

export default addTask;