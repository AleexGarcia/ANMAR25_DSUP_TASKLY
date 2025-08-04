
# ANMAR25_DSUP_TASKLY
Task management system developed during the UOL Compass internship program as part of the ANMAR25_DSUP initiative.
## 🗂 Branches

- `legacy`: Original version delivered at the end of the internship. Preserved for historical comparison.
- `main`: Latest and most stable version, including personal improvements.
- `dev`: Development branch for upcoming features and changes.

## 📝 Project Description
This is a task management application designed to help users organize and track their work more effectively. Unlike basic to-do lists, this app allows for detailed classification of each task, supporting:

- Task categorization (e.g., bug fixing, feature development, documentation)
- Setting priority levels (from low to critical)
- Tracking status (to-do, in progress, done)
- Adding custom notes for extra context on each task

Whether you're managing personal tasks or collaborating on software projects, this system provides a clear and flexible way to stay on top of your responsibilities.

## ⚙️ Environment:
- **Node.js**: `v20.15.1`
- **NestJS**: `11.0.1`
- **TypeORM**: `0.3.22`
- **SQLite3**: `5.1.7`
- **Zod**: `3.24.2`

## 🛠️ Technologies Used
- NestJS — Scalable and efficient Node.js framework
- TypeScript — Strongly-typed JavaScript
- TypeORM + SQLite — ORM and lightweight database for quick - development
- ESLint + Prettier — Code quality and formatting
- Zod — Runtime schema validation

## 🚀 Installation
Make sure you have Node.js and npm installed.
### 1. Clone the repository
```bash
git clone https://github.com/AleexGarcia/ANMAR25_DSUP_TASKLY.git
cd ANMAR25_DSUP_TASKLY
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run database migrations
```bash
npm run migration:run
```
### 4. Start the application
```bash
npm run start:dev
```
## 🌐 API Routes
### Route: `/tasks`
#### 1. Create Task
- Endpoint: `POST /tasks`
- Request Body:
```json
  {
    "title": "Task title",
    "description": "Task description",
    "category": "bug_fixing",
    "priority": "low",
    "status": "todo"
  }
```
- Responses:

Status: `201 Created`
```json
  {
    "id": 1,
    "title": "Task title",
    "description": "Task description",
    "category": "bug_fixing",
    "priority": "low",
    "status": "todo",
    "created_at": "2025-04-22T10:00:00Z",
    "updated_at": "2025-04-22T10:00:00Z"
  }
```
Status: `400 Bad Request`
```json
  {
    "message": [
        "category is required",
        "Title is required",
        "Description is required"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```
#### 2. Get Tasks
- Endpoint: `GET /tasks`
- Query Parameters:
  - **category**: Optional, filter by category.
  - **status**: Optional, filter by task status.
  - **priority**: Optional, filter by task priority.
  - **title**: Optional, search tasks by title.
  - **order**: Optional, order by asc or desc.
  - **limit**: Optional, limit the number of results (default: 5).
  - **page**: Optional, specify the page number (default: 1).
- Query URL:
```plaintext
GET /tasks?category=feature&status=todo&priority=low&title=example&order=asc&limit=5&page=1
```
- Responses:

Status: `200 OK`
```json
{
    "page": 1,
    "total": 0,
    "tasks": []
}
```
Status: `200 OK`
```json
{
    "page": 1,
    "total": 21,
    "tasks": [
        {
            "id": 2,
            "title": "pp1",
            "description": "pasdjk´paskdpasd",
            "status": "todo",
            "priority": "low",
            "category": "feature",
            "created_at": "2025-04-17T16:40:13.000Z",
            "updated_at": "2025-04-17T16:40:13.000Z"
        },
        {
            "id": 3,
            "title": "pp2",
            "description": "pasdjk´paskdpasd",
            "status": "todo",
            "priority": "low",
            "category": "feature",
            "created_at": "2025-04-17T16:40:20.000Z",
            "updated_at": "2025-04-17T16:40:20.000Z"
        },
        {
            "id": 4,
            "title": "pp3",
            "description": "pasdjk´paskdpasd",
            "status": "todo",
            "priority": "low",
            "category": "feature",
            "created_at": "2025-04-17T16:40:23.000Z",
            "updated_at": "2025-04-17T16:40:23.000Z"
        },
        {
            "id": 5,
            "title": "pp4",
            "description": "pasdjk´paskdpasd",
            "status": "todo",
            "priority": "low",
            "category": "feature",
            "created_at": "2025-04-17T16:40:25.000Z",
            "updated_at": "2025-04-17T16:40:25.000Z"
        },
        {
            "id": 6,
            "title": "pp5",
            "description": "pasdjk´paskdpasd",
            "status": "todo",
            "priority": "low",
            "category": "feature",
            "created_at": "2025-04-17T16:40:28.000Z",
            "updated_at": "2025-04-17T16:40:28.000Z"
        }
    ]
}
```
Status: `400 Bad Request`
```json
{
    "message": [
        "Invalid value. Valid category are: bug_fixing|feature|testing|documentation|refactoring|security|configuration_management|code_review|optimization",
        "Invalid value. Valid status are: todo|in_progress|done",
        "Invalid value. Valid priority are: low|medium|high|critical",
        "Title cannot be empty",
        "Order must be either 'asc' or 'desc'",
        "Limit must be a positive number",
        "Page must be a positive number",
        "Page must be greater than or equal to 1"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```
#### 3. Get Task
- Endpoint: `GET /tasks/:id`
- Path Parameter:
  - id: Task ID.
- Responses:
Status: `200 OK`
```json
{
    "id": 17,
    "title": "pp100",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "status": "todo",
    "priority": "low",
    "category": "feature",
    "notes": [
        {
            "id": 7,
            "content": "blablabla",
            "created_at": "2025-04-17T16:54:04.000Z",
            "updated_at": "2025-04-17T16:54:04.000Z"
        }
    ],
    "created_at": "2025-04-17T16:40:48.000Z",
    "updated_at": "2025-04-17T16:40:48.000Z"
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Task not found",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 4. Update Task
- Endpoint: `PUT /tasks/:id`
- Path Parameter:
  - id: Task ID.
- Request Body:
```json
  {
    "title": "Task title",
    "description": "Task description",
    "category": "bug_fixing",
    "priority": "low",
    "status": "todo"
  }
```
- Responses:

Status: `200 OK`
```json
{
    "id": 15,
    "title": "asdasdasd",
    "description": "asdasdasd",
    "status": "in_progress",
    "priority": "medium",
    "category": "bug_fixing",
    "created_at": "2025-04-17T16:40:46.000Z",
    "updated_at": "2025-04-22T14:58:26.000Z"
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "category is required",
    "status is required",
    "priority is required",
    "Title is required",
    "Description is required",
    "Invalid value. Valid category are: bug_fixing|feature|testing|documentation|refactoring|security|configuration_management|code_review|optimization",
    "Invalid value. Valid status are: todo|in_progress|done",
    "Invalid value. Valid priority are: low|medium|high|critical"
  ],
  "error": "Bad Request",
   "statusCode": 400
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Task not found",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 5. Delete Task
- Endpoint: `DELETE /tasks/:id`
- Path Parameter:
  - id: Task ID.
- Responses:

Status: `204 No Content`

Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Task not found",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 6. Get Tasks by Status
- Endpoint: `GET /tasks/status/:status`
- Path Parameter:
  - status: Task status. [todo, in_progress, done]
- Responses:

Status: `200 OK`
```json
[
  {
    "id": 18,
    "title": "teste",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "status": "done",
    "priority": "high",
    "category": "feature",
    "created_at": "2025-04-17T16:40:49.000Z",
    "updated_at": "2025-04-17T17:10:47.000Z"
  },
  {
    "id": 23,
    "title": "teste",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "status": "done",
    "priority": "high",
    "category": "feature",
    "created_at": "2025-04-22T14:41:50.000Z",
    "updated_at": "2025-04-22T14:41:50.000Z"
  }
]
```
Status: `200 OK`
```json
[]
```
Status: `400 Bad Request`
```json
{
  "message": [
    "Invalid value. Valid status are: todo|in_progress|done"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
#### 7. Add Note for Task
- Endpoint: `POST /tasks/:taskId/notes`
- Path Parameter:
  - taskId: Task ID.
- Request Body:
```json
  {
    "title": "Task title",
    "description": "Task description",
    "category": "bug_fixing",
    "priority": "low",
    "status": "todo"
  }
```
- Responses:

Status: `200 OK`
```json
{
  "id": 17,
  "content": "new content",
  "created_at": "2025-04-22T18:08:03.000Z",
  "updated_at": "2025-04-22T18:08:03.000Z",
  "taskId": 17
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "Content is required"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Task not found!",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 8. Get Notes by Task
- Endpoint: `GET /tasks/:taskId/notes`
- Path Parameter:
  - taskId: Task ID.
- Responses:

Status: `200 OK`
```json
[
  {
    "id": 7,
    "content": "blablabla",
    "created_at": "2025-04-17T16:54:04.000Z",
    "updated_at": "2025-04-17T16:54:04.000Z",
    "taskId": 17
  },
  {
    "id": 13,
    "content": "new content",
    "created_at": "2025-04-22T16:33:44.000Z",
    "updated_at": "2025-04-22T17:33:04.000Z",
    "taskId": 17
  }
]
```
Status: `200 OK`
```json
[]
```
Status: `400 Bad Request`
```json
{
    "message": [
        "ID must be a number"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Task not found!",
  "error": "Not Found",
  "statusCode": 404
}
```
### Route: `/notes`
#### 1. Get Note
- Endpoint: `GET /notes/:id`
- Path Parameter:
  - id: Note id.
- Responses:

Status: `200 OK`
```json
{
  "id": 13,
  "content": "adasdasd",
  "created_at": "2025-04-22T16:33:44.000Z",
  "updated_at": "2025-04-22T16:33:44.000Z",
  "taskId": 17
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Note not Found",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 2. Update Note
- Endpoint: `PUT /notes/:id`
- Path Parameter:
  - id: Note id.
- Request Body:
```json
{
  "content": "new content"
}
```
- Responses:

Status: `200 OK`
```json
{
  "id": 13,
  "content": "new content",
  "created_at": "2025-04-22T16:33:44.000Z",
  "updated_at": "2025-04-22T17:30:34.000Z",
  "taskId": 17
}
```
Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Note not Found",
  "error": "Not Found",
  "statusCode": 404
}
```
#### 3. Delete Note
- Endpoint: `DELETE /notes/:id`
- Path Parameter:
  - id: Note id.
- Responses:

Status: `204 No Content`

Status: `400 Bad Request`
```json
{
  "message": [
    "ID must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
Status: `404 Not Found`
```json
{
  "message": "Note not Found",
  "error": "Not Found",
  "statusCode": 404
}
```
