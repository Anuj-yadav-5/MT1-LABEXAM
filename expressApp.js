import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: 3,
    taskName: "Test Employee Module",
    assignedTo: "Amit Kumar",
    status: "Completed",
    priority: "Low"
  }
];

const requiredFields = ["id", "taskName", "assignedTo", "status", "priority"];

function validateTask(task) {
  const missingFields = requiredFields.filter(
    field => task[field] === undefined || task[field] === null || String(task[field]).trim() === ""
  );
  return missingFields;
}

// GET /tasks - Retrieve all employee tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve one task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ message: "Task ID must be a positive integer." });
  }

  const task = tasks.find(item => item.id === taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json(task);
});

// POST /tasks - Add a new task
app.post("/tasks", (req, res) => {
  const newTask = req.body;

  if (!newTask || typeof newTask !== "object" || Array.isArray(newTask)) {
    return res.status(400).json({ message: "Request body must be a JSON object." });
  }

  const missingFields = validateTask(newTask);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "All task fields are required.",
      missingFields
    });
  }

  const taskId = Number(newTask.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ message: "Task ID must be a positive integer." });
  }

  if (tasks.some(task => task.id === taskId)) {
    return res.status(409).json({ message: "A task with this ID already exists." });
  }

  const taskToAdd = {
    id: taskId,
    taskName: String(newTask.taskName).trim(),
    assignedTo: String(newTask.assignedTo).trim(),
    status: String(newTask.status).trim(),
    priority: String(newTask.priority).trim()
  };

  tasks.push(taskToAdd);
  return res.status(201).json({
    message: "Task added successfully",
    task: taskToAdd
  });
});

// PUT /tasks/:id - Update an existing task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ message: "Task ID must be a positive integer." });
  }

  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const updates = req.body;
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return res.status(400).json({ message: "Request body must be a JSON object." });
  }

  const updatedTask = { ...tasks[taskIndex], ...updates, id: taskId };
  const missingFields = validateTask(updatedTask);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Updated task is missing required fields.",
      missingFields
    });
  }

  updatedTask.taskName = String(updatedTask.taskName).trim();
  updatedTask.assignedTo = String(updatedTask.assignedTo).trim();
  updatedTask.status = String(updatedTask.status).trim();
  updatedTask.priority = String(updatedTask.priority).trim();

  tasks[taskIndex] = updatedTask;
  return res.status(200).json({
    message: "Task updated successfully",
    task: updatedTask
  });
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ message: "Task ID must be a positive integer." });
  }

  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  return res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Handle malformed JSON and other Express errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON in request body." });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
