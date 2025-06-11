const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

jest.mock("mongoose", () => ({
    Types: {
        ObjectId: {
            isValid: jest.fn().mockReturnValue(true),
        },
    },
}));

jest.mock("@/mongoose/schema/task", () => ({
    __esModule: true,
    default: {
        findById: mockFindById,
        findByIdAndUpdate: mockFindByIdAndUpdate,
    },
}));


beforeAll(() => {
  const mod = require("@/graphql/resolvers/mutations/update-task");
  updateTask = mod.updateTask;
});

let updateTask: any;

describe("update-task mutation", () => {
    beforeEach(() => {
        mockFindById.mockReset();
        mockFindByIdAndUpdate.mockReset();
        const mongoose = require("mongoose");
        mongoose.Types.ObjectId.isValid.mockReturnValue(true);
    });

    it("should update a task successfully", async () => {
        const mockTask = {
            id: "testId",
            taskName: "jest unit test",
            description: "advocate challenge",
            isDone: false,
            priority: 1,
            tags: ["W3"],
            save: jest.fn().mockResolvedValue(true),
        };

        mockFindById.mockResolvedValue(mockTask);
        mockFindByIdAndUpdate.mockResolvedValue({
            ...mockTask,
            taskName: "updated task",
            description: "updated description"
        });

        const result = await updateTask(
            {},
            {
                id: "testId",
                title: "updated task",
                description: "updated description"
            }
        );

        expect(mockFindById).toBeCalledWith("testId");
        expect(result.taskName).toBe("updated task");
        expect(result.description).toBe("updated description");
    });

    it("should throw if rask not found", async () => {
        mockFindById.mockResolvedValue(null);
        await expect(updateTask({}, { id: "invalidId" })).rejects.toThrow(
            "Task not found"
        );
    });

    it("should throw if task id format is invalid", async () => {
        const mongoose = require("mongoose");
        mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);

        await expect(updateTask({}, { id: "invalid-format" })).rejects.toThrow(
            "Invalid id"
        );
    });

    it("should throw if update fails", async () => {
        const mockTask = {
            id: "mockId",
            taskName: "old task",
            description: "old description",
            isDone: false,
            priority: 1,
            tags: ["old tag", "old tag 2"],
            save: jest.fn().mockResolvedValue(true),
        };

        mockFindById.mockResolvedValue(mockTask);
        mockFindByIdAndUpdate.mockResolvedValue(new Error("database update error"));

        await expect(
            updateTask(
                {},
                {
                    id: "mockId",
                    taskName: "updated task"
                }
            )
        ).rejects.toThrow("failed to update task: database update error");
    });
});
