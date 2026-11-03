# MT1-LABEXAM — Employee Task Management Web Application

This project follows the MT1 Lab Examination instructions. It contains two independent servers:
- Part A: Node.js built-in `http` and `fs` modules on port **3000**.
- Part B: Express.js REST API on port **4000**.

No database is used. Task records are stored in JavaScript arrays and reset when the relevant server restarts.

## 1. Requirements

Install a current LTS version of Node.js (which includes npm). Use a terminal in this project directory.

Check installation:

```bash
node -v
npm -v
```

## 2. Install dependencies

```bash
npm install
```

This installs Express.js and creates `package-lock.json`.

## 3. Run Part A — HTTP and FS modules

Open Terminal 1 in this folder:

```bash
node httpServer.js
```

Expected terminal message:

```text
HTTP Server running at http://localhost:3000
```

Open these addresses in your browser:

| Method | URL | Expected result |
|---|---|---|
| GET | http://localhost:3000/ | Welcome HTML |
| GET | http://localhost:3000/tasks | Employee tasks in JSON |
| GET | http://localhost:3000/about | Application information |
| GET | http://localhost:3000/home | `public/index.html`, read with `fs.readFile()` |
| POST | http://localhost:3000/add-task | Adds a task from JSON body |

### Test POST /add-task

Use EchoAPI or another API client:
- Method: `POST`
- URL: `http://localhost:3000/add-task`
- Body: raw JSON
- Header: `Content-Type: application/json`

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending"
}
```

Expected: HTTP `201 Created` and a success message with the new task. Then refresh `GET http://localhost:3000/tasks` to see it.

Stop Part A with `Ctrl + C` when finished.

## 4. Run Part B — Express REST API

Open Terminal 2 (or reuse Terminal 1 after stopping Part A):

```bash
node expressApp.js
```

Expected terminal message:

```text
Express Server running at http://localhost:4000
```

Keep this server running while testing.

### CRUD endpoints

| Method | URL | Expected result |
|---|---|---|
| GET | `http://localhost:4000/tasks` | All tasks |
| GET | `http://localhost:4000/tasks/1` | Task with ID 1 |
| POST | `http://localhost:4000/tasks` | Creates a task; status 201 |
| PUT | `http://localhost:4000/tasks/1` | Updates task 1 |
| DELETE | `http://localhost:4000/tasks/1` | Deletes task 1 |

For POST and PUT select **Body → raw → JSON** and ensure `Content-Type: application/json`.

### Sample POST body

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending",
  "priority": "Medium"
}
```

Expected response (HTTP 201):

```json
{
  "message": "Task added successfully",
  "task": {
    "id": 4,
    "taskName": "Develop REST API",
    "assignedTo": "Amit Kumar",
    "status": "Pending",
    "priority": "Medium"
  }
}
```

### Sample PUT body

URL: `http://localhost:4000/tasks/1`

```json
{
  "taskName": "Develop Login Page",
  "assignedTo": "Rahul Sharma",
  "status": "Completed",
  "priority": "High"
}
```

Expected: HTTP `200 OK`, with `Task updated successfully`.

### Suggested DELETE test

URL: `http://localhost:4000/tasks/1`

Expected: HTTP `200 OK`, with `Task deleted successfully`. Then call GET `/tasks/1`; it should return HTTP `404 Not Found`.

**Important:** For a clean demonstration, test GET first, then POST with ID 4, PUT ID 1, and DELETE ID 1. The in-memory array is reset when you restart `expressApp.js`.

## 5. Error handling checks

Try these to demonstrate validation:
- Unknown route, e.g. `GET http://localhost:3000/invalid` → 404.
- Unknown Express route, e.g. `GET http://localhost:4000/invalid` → 404.
- Express `GET /tasks/999` → 404.
- POST with a missing required field → 400.
- POST with a duplicate ID → 409.
- Invalid JSON body → 400.

## 6. Screenshots required

Capture screenshots from your own computer and save them in the `screenshots/` folder:
1. HTTP server terminal showing port 3000.
2. Browser showing `/`.
3. Browser showing `/tasks` JSON.
4. Browser showing `/about`.
5. Browser showing `/home` (this demonstrates FS static file serving).
6. Express server terminal showing port 4000.
7. EchoAPI GET all tasks.
8. EchoAPI GET task by ID.
9. EchoAPI POST success (include status 201).
10. EchoAPI PUT success.
11. EchoAPI DELETE success.
12. GitHub repository and commit history.

The screenshots folder contains a checklist only; it does not contain fabricated results.

## 7. GitHub submission

Create a **public or teacher-approved** GitHub repository named `MT1-LABEXAM`. Do not upload `node_modules`.

From the project directory, run:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and use the repository URL shown by GitHub.

After completing and testing Part A:

```bash
git add .
git commit -m "Implement Node HTTP server and FS routing"
git push
```

After completing and testing Part B:

```bash
git add .
git commit -m "Implement Express task CRUD REST API"
git push
```

After adding screenshots:

```bash
git add screenshots
git commit -m "Add lab examination screenshots"
git push
```

## 8. Final submission checklist

- [ ] Repository named `MT1-LABEXAM`
- [ ] `package.json` and `package-lock.json`
- [ ] `httpServer.js`
- [ ] `expressApp.js`
- [ ] `public/index.html`
- [ ] Part A works on port 3000
- [ ] Part B works on port 4000
- [ ] All EchoAPI CRUD tests pass
- [ ] Real screenshots saved in `screenshots/`
- [ ] GitHub commit history visible

## Troubleshooting

**Port already in use:** Stop the other server using `Ctrl + C`, or close the terminal running that server.

**`Cannot find package 'express'`:** Run `npm install` from the folder containing `package.json`.

**`Cannot GET /...` or connection refused:** Confirm the correct server is running and the URL uses the correct port.

**Changes disappear after restart:** This is expected. The lab explicitly requires an in-memory JavaScript array, not a database or permanent storage.
