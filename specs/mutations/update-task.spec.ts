// const mockFindById = jest.fn();
// const mockFindByIdAndUpdate = jest.fn();

// jest.mock("mongoose", () => ({
//     Types: {
//         ObjectId: {
//             isValid: jest.fn().mockReturnValue(true),
//         },
//     },
// }));

// jest.mock("@/mongoose/schema/task", () => ({
//     __esModule: true,
//     default: {
//         findById: mockFindById,
//         findByIdAndUpdate: mockFindByIdAndUpdate,
//     },
// }));


// beforeAll(() => {
//   const mod = require("@/graphql/resolvers/mutations/update-task");
//   updateTask = mod.updateTask;
// });

// let updateTask: any;

// describe("update-task mutation", () => {
//     beforeEach(() => {
//         mockFindById.mockReset();
//         mockFindByIdAndUpdate.mockReset();
//         const mongoose = require("mongoose");
//         mongoose.Types.ObjectId.isValid.mockReturnValue(true);
//     });

//     it("should update a task successfully", async () => {
//         const mockTask = {
//             id: "testId",
//             taskName: "jest unit test",
//             description: "advocate challenge",
//             isDone: false,
//             priority: 1,
//             tags: ["W3"],
//             save: jest.fn().mockResolvedValue(true),
//         };

//         mockFindById.mockResolvedValue(mockTask);
//         mockFindByIdAndUpdate.mockResolvedValue({
//             ...mockTask,
//             taskName: "updated task",
//             description: "updated description"
//         });

//         const result = await updateTask(
//             {},
//             {
//                 id: "testId",
//                 title: "updated task",
//                 description: "updated description"
//             }
//         );

//         expect(mockFindById).toBeCalledWith("testId");
//         expect(result.taskName).toBe("updated task");
//         expect(result.description).toBe("updated description");
//     });

//     it("should throw if rask not found", async () => {
//         mockFindById.mockResolvedValue(null);
//         await expect(updateTask({}, { id: "invalidId" })).rejects.toThrow(
//             "Task not found"
//         );
//     });

//     it("should throw if task id format is invalid", async () => {
//         const mongoose = require("mongoose");
//         mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);

//         await expect(updateTask({}, { id: "invalid-format" })).rejects.toThrow(
//             "Invalid id"
//         );
//     });

//     it("should throw if update fails", async () => {
//         const mockTask = {
//             id: "mockId",
//             taskName: "old task",
//             description: "old description",
//             isDone: false,
//             priority: 1,
//             tags: ["old tag", "old tag 2"],
//             save: jest.fn().mockResolvedValue(true),
//         };

//         mockFindById.mockResolvedValue(mockTask);
//         mockFindByIdAndUpdate.mockResolvedValue(new Error("database update error"));

//         await expect(
//             updateTask(
//                 {},
//                 {
//                     id: "mockId",
//                     taskName: "updated task"
//                 }
//             )
//         ).rejects.toThrow("failed to update task: database update error");
//     });
// });

// __tests__/update-task.test.ts





jest.mock("@/mongoose/schema/Task", () => {
    const findById = jest.fn();
    const findByIdAndUpdate = jest.fn();

    return {
        __esModule: true,
        default: {
            findById,
            findByIdAndUpdate,
        },
        __mockFindById: findById,
        __mockFindByIdAndUpdate: findByIdAndUpdate,
    };
});

import mongoose from "mongoose";
import { updateTask } from "@/graphql/resolvers/mutations/update-task";

describe("updateTask Mutation", () => {
    let mockFindById: jest.Mock;
    let mockFindByIdAndUpdate: jest.Mock;

    beforeEach(() => {
        const mockedModule = jest.requireMock("@/mongoose/schema/Task");
        mockFindById = mockedModule.__mockFindById;
        mockFindByIdAndUpdate = mockedModule.__mockFindByIdAndUpdate;
        mockFindById.mockReset();
        mockFindByIdAndUpdate.mockReset();
    });

    test("throws error for invalid MongoDB id", async () => {
        const invalidId = "not-a-valid-id";

        await expect(
            updateTask({}, {
                id: invalidId,
                taskName: "Test",
                description: "Test Desc",
                tags: [],
                priority: 1,
                isDone: false,
                userId: "user123"
            })
        ).rejects.toThrow("Invalid id");

        expect(mockFindById).not.toHaveBeenCalled();
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("throws error when userId is missing", async () => {
        const validId = new mongoose.Types.ObjectId().toString();

        await expect(
            updateTask({}, {
                id: validId,
                taskName: "Test",
                description: "Test Desc",
                tags: [],
                priority: 1,
                isDone: false,
                userId: ""
            })
        ).rejects.toThrow("User doesn't exist");

        expect(mockFindById).not.toHaveBeenCalled();
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    test("throws error if task not found", async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        mockFindByIdAndUpdate.mockResolvedValue(null); // simulate not found

        await expect(
            updateTask({}, {
                id: validId,
                taskName: "Test",
                description: "Test Desc",
                tags: [],
                priority: 1,
                isDone: false,
                userId: "user123"
            })
        ).rejects.toThrow("Task not found");

        expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("successfully updates a task", async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        const mockUpdatedTask = {
            _id: validId,
            taskName: "Updated Task",
            description: "Updated Desc",
            tags: ["jest"],
            priority: 2,
            isDone: true,
        };

        mockFindByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

        const result = await updateTask({}, {
            id: validId,
            taskName: "Updated Task",
            description: "Updated Desc",
            tags: ["jest"],
            priority: 2,
            isDone: true,
            userId: "user123"
        });

        expect(result).toEqual(mockUpdatedTask);
        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            validId,
            {
                taskName: "Updated Task",
                description: "Updated Desc",
                tags: ["jest"],
                priority: 2,
                isDone: true,
            },
            { new: true }
        );
    });

    test("handles database error during update", async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        mockFindByIdAndUpdate.mockRejectedValue(new Error("Database failure"));

        await expect(
            updateTask({}, {
                id: validId,
                taskName: "Error Task",
                description: "Fails",
                tags: [],
                priority: 1,
                isDone: false,
                userId: "user123"
            })
        ).rejects.toThrow("Database failure");

        expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
});
