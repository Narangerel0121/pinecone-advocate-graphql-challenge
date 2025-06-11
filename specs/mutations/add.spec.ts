jest.mock("@/mongoose/schema/task", () => {
    const mockSave = jest.fn();

    const MockTask = jest.fn().mockImplementation(function (this: any, data) {
        Object.assign(this, data);
        this.save = mockSave;
    });
    return {
        __esModule: true,
        default: MockTask,
        __mockSave: mockSave
    };
});

import addTask from "@/graphql/resolvers/mutations/add-task";

describe("add-task mutation", () => {
    let mockSave: jest.Mock;

    beforeEach(() => {
        const mockedModel = jest.requireMock("@/mongoose/schema/task");
        mockSave = mockedModel.__mockSave;
        mockSave.mockReset();
    });

    it("throws error when some required fields are missing", async () => {
        await expect(addTask({}, { taskName: "", description: "", priority: 3, tags: [""] }))
            .rejects.toThrow("All fields are required");
    });

    it("new task added successfully", async () => {
        mockSave.mockImplementation(function (this: any) {
            return Promise.resolve(this);
        });

        const result = await addTask({}, { taskName: "arai2", description: "say arai arai take 5k", tags: ["5k"], priority: 5 });
        expect(result).toBeDefined();
        expect(result.taskName).toBe("arai2");
        expect(result.description).toBe("say arai arai take 5k");
        expect(result.priority).toBe(5);
        expect(result.isDone).toBe(false);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should handle database error", async () => {
        mockSave.mockRejectedValue(new Error("database error"));

        await expect(addTask({}, { taskName: "advocate", description: "trying to use jest", priority: 1, tags: ["jest", "challenge", "important"] }))
            .rejects.toThrow(/database error/);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});