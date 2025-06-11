import Task from "@/mongoose/schema/Task"
import mongoose from "mongoose";

export const updateTask = async (
    _: unknown,
    { id, taskName, description, tags, priority, isDone, userId }
        : {
            id: string,
            taskName: string,
            description: string,
            tags: string[],
            priority: number,
            isDone: boolean,
            userId: string
        }
) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid id")
    }

    if (!userId) {
        throw new Error("User doesn't exist")
    }

    const updatedTask = await Task.findByIdAndUpdate(id, { taskName: "Updated Task" }, { new: true });
     if (!updatedTask) {
        throw new Error("Task not found")
    }
    return updatedTask;
}

// import Task from "@/mongoose/schema/Task";
// import mongoose from "mongoose";

// export const updateTask = async (
//     _: unknown,
//     {
//         id,
//         taskName,
//         description,
//         tags,
//         priority,
//         isDone,
//         userId,
//     }: {
//         id: string;
//         taskName: string;
//         description: string;
//         tags: string[];
//         priority: number;
//         isDone: boolean;
//         userId: string;
//     }
// ) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             throw new Error("Invalid id");
//         }

//         if (!userId) {
//             throw new Error("User doesn't exist");
//         }

//         const updatedTask = await Task.findByIdAndUpdate(
//             id,
//             { taskName, description, tags, priority, isDone },
//             { new: true }
//         );

//         if (!updatedTask) {
//             throw new Error("Task not found");
//         }

//         return updatedTask;
//     } catch (error: any) {
//         throw new Error(error.message || "Failed to update task");
//     }
// };
