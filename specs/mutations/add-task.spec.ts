// jest.mock("@/mongoose/schema/task", () => {
//     const mockSave = jest.fn();

//     const MockTask = jest.fn().mockImplementation(function (this: any, data) {
//         Object.assign(this, data);
//         this.save = mockSave;
//     });

//     return {
//         __esModule: true,
//         default: MockTask,
//         __mockSave: mockSave,
//     };
// });

// import addTask from "@/graphql/resolvers/mutations/add-task";

// describe("addTask Mutation", () => {
//     let mockSave: jest.Mock;

//     beforeEach(() => {
//         const mockedModule = jest.requireMock("@/mongoose/schema/task");
//         mockSave = mockedModule.__mockSave;
//         mockSave.mockReset();
//     });

//     it("throws error when required fields are missing", async () => {
//         await expect(addTask({}, {taskName: "", description: "dev", tags: ["dev"], priority: 3}))
//           .rejects.toThrow("All fields are required");
//       });

//     it("should create a new task successfully", async () => {
//         mockSave.mockImplementation(function (this: any) {
//             return Promise.resolve(this);
//         });

//         const result = await addTask(
//             {},
//             { taskName: "Test Task", description: "Test Description", tags: ["jest"], priority: 1 }
//         );

//         expect(result).toBeDefined();
//         expect(result.taskName).toBe("Test Task");
//         expect(result.description).toBe("Test Description");
//         expect(result.isDone).toBe(false);
//         expect(mockSave).toHaveBeenCalledTimes(1);
//     });

//     it("should handle database errors", async () => {
//         mockSave.mockRejectedValue(new Error("Database error"));

//         await expect(addTask({}, { taskName: "Test Task", description: "Test Description", tags: ["jest"], priority: 1 })).rejects.toThrow(
//             "Database error"
//         );
//         expect(mockSave).toHaveBeenCalledTimes(1);
//     });
// });

jest.mock("@/mongoose/schema/task", () => {
    const mockSave = jest.fn();
  
    const MockTask = jest.fn().mockImplementation(function (this: any, data) {
      Object.assign(this, data);
      this.save = mockSave;
    });
  
    return {
      __esModule: true,
      default: MockTask,
      __mockSave: mockSave,
    };
  });
  
  import addTask from "@/graphql/resolvers/mutations/add-task";
  
  const validTaskInput = {
    taskName: "Test Task",
    description: "Test Description",
    tags: ["jest"],
    priority: 1,
  };
  
  const invalidTaskInput = {
    taskName: "",
    description: "dev",
    tags: ["dev"],
    priority: 3,
  };
  
  const mockedModule = jest.requireMock("@/mongoose/schema/task");
  
  describe("addTask Mutation", () => {
    let mockSave: jest.Mock;
  
    beforeEach(() => {
      mockSave = mockedModule.__mockSave;
      mockSave.mockReset();
    });
  
    // Helper functions for mocking save behavior
    function mockSaveSuccess() {
      mockSave.mockImplementation(async function (this: any) {
        return this;
      });
    }
  
    function mockSaveFailure(errorMessage: string) {
      mockSave.mockRejectedValue(new Error(errorMessage));
    }
  
    it("throws error when required fields are missing", async () => {
      await expect(addTask({}, invalidTaskInput)).rejects.toThrow("All fields are required");
    });
  
    it("should create a new task successfully", async () => {
      mockSaveSuccess();
  
      const result = await addTask({}, validTaskInput);
  
      expect(result).toBeDefined();
      expect(result.taskName).toBe(validTaskInput.taskName);
      expect(result.description).toBe(validTaskInput.description);
      expect(result.isDone).toBe(false);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  
    it("should handle database errors", async () => {
      mockSaveFailure("Database error");
  
      await expect(addTask({}, validTaskInput)).rejects.toThrow("Database error");
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
  