import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const tasks = [
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

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON in request body."));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (req.method === "GET" && pathname === "/") {
    return sendHtml(res, 200, `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Employee Task Management</title></head>
<body><h1>Welcome to Employee Task Management Application</h1>
<p>Node.js HTTP server is working successfully.</p>
<p>Visit <a href="/tasks">/tasks</a>, <a href="/about">/about</a> or <a href="/home">/home</a>.</p>
</body></html>`);
  }

  if (req.method === "GET" && pathname === "/tasks") {
    return sendJson(res, 200, tasks);
  }

  if (req.method === "POST" && pathname === "/add-task") {
    try {
      const newTask = await readRequestBody(req);
      const requiredFields = ["id", "taskName", "assignedTo", "status"];
      const missingFields = requiredFields.filter(
        field => newTask[field] === undefined || newTask[field] === null || String(newTask[field]).trim() === ""
      );

      if (missingFields.length > 0) {
        return sendJson(res, 400, {
          message: "Missing required task details.",
          missingFields
        });
      }

      if (!Number.isInteger(Number(newTask.id)) || Number(newTask.id) <= 0) {
        return sendJson(res, 400, { message: "Task id must be a positive integer." });
      }

      if (tasks.some(task => task.id === Number(newTask.id))) {
        return sendJson(res, 409, { message: "A task with this ID already exists." });
      }

      const taskToAdd = {
        id: Number(newTask.id),
        taskName: String(newTask.taskName).trim(),
        assignedTo: String(newTask.assignedTo).trim(),
        status: String(newTask.status).trim()
      };
      if (newTask.priority !== undefined) taskToAdd.priority = String(newTask.priority).trim();

      tasks.push(taskToAdd);
      return sendJson(res, 201, {
        message: "Task added successfully",
        task: taskToAdd
      });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  if (req.method === "GET" && pathname === "/about") {
    return sendHtml(res, 200, `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>About</title></head>
<body><h1>About Employee Task Management</h1>
<p>This application helps manage employee tasks, assignments and task status.</p>
<p>Part A demonstrates Node.js HTTP routing and the FS module.</p></body></html>`);
  }

  if (req.method === "GET" && pathname === "/home") {
    const indexPath = path.join(__dirname, "public", "index.html");
    return fs.readFile(indexPath, "utf8", (error, html) => {
      if (error) {
        console.error("Unable to read public/index.html:", error);
        return sendJson(res, 500, { message: "Unable to load the home page." });
      }
      return sendHtml(res, 200, html);
    });
  }

  return sendJson(res, 404, { message: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
