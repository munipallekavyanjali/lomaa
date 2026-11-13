# 💧 CHROMA • Liquid Glassmorphism Retro Task Management (with JWT Auth)

A full-stack Task Management application featuring a **pure liquid glassmorphism theme with retro colors**, built with **React**, modern **Node.js + Express (ES Modules `import`)**, **JWT Authentication**, and a **SQLite database** ready for instant connection in **DBeaver**.

---

## ✨ Features

- **JWT Authentication & User Pipeline Isolation**:
  - Encrypted password hashing with `bcryptjs`.
  - Secure JSON Web Token generation & verification middleware.
  - Dedicated user accounts with customizable retro avatar auras (`retro-cyan`, `retro-violet`, `retro-sunset`, `retro-mint`, `retro-gold`, `retro-coral`).
  - Tasks are isolated per user account with foreign key relations (`tasks.user_id -> users.id`).
  - Quick **1-Click Demo Login** (`retro_pilot` / `password123`) for instant testing.
- **Pure Liquid Glassmorphism UI**:
  - Continuous morphing organic liquid blobs and caustics in retro synthwave/vaporwave hues.
  - Interactive cursor refraction trail simulating liquid water under glass.
  - Curvilinear translucent panels with specular light reflection overlays.
  - Chromatic dispersion borders and retro neon rim auras.
  - Web Audio API synthesizer for fluid water-drop and retro chords on actions (toggleable).
- **Full CRUD Capabilities**:
  - **Create**: Add tasks with Title, Description, Priority, Category, Due Date, and Retro Aura.
  - **Read**: View pipeline in responsive **Fluid Grid View** or **Retro Kanban Columns** (`Pending`, `In Progress`, `Completed`).
  - **Update**: Edit full task details or single-click status progression (`Pending` ➔ `In Progress` ➔ `Completed`).
  - **Delete**: Liquid confirmation modal with bubble pop acoustic feedback.
- **Fluid Stats & Filter Bar**:
  - Animated liquid wave progress bar tracking completion percentage.
  - Real-time search and multi-filtering by Status, Priority, and Category chips.
- **DBeaver Integration**:
  - Stores all data in `backend/tasks.db` with SQLite WAL mode.
  - In-app interactive **DBeaver Guide** modal with 1-click database path copying and live schema preview.

---

## 🔑 Authentication Credentials

### Demo Account (Pre-seeded):
- **Username**: `retro_pilot` (or email: `pilot@taskflow.dev`)
- **Password**: `password123`
*(You can also use the **1-Click Demo** button in the app to log in instantly!)*

### New Account Registration:
You can register any number of new users with custom retro avatar auras from the Sign In modal.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, Lucide Icons, Custom Pure Liquid Glassmorphism CSS with CSS Variables & Keyframe Fluid Shaders.
- **Backend**: Node.js (v22+), Express.js (100% Modern ES Modules `import`), `jsonwebtoken`, `bcryptjs`, CORS, Dotenv.
- **Database**: SQLite 3 (`better-sqlite3`), WAL journal mode, pre-seeded with demo user and retro-tech tasks.
- **DB Tool**: DBeaver GUI (direct connection to `backend/tasks.db`).

---

## 🚀 How to Run the Application

Start both servers concurrently:
```powershell
node start.js
```
Or start each separately:

**Backend Terminal**:
```powershell
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000`*

**Frontend Terminal**:
```powershell
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🗄️ Connecting DBeaver to the Database

1. Open **DBeaver**.
2. Click **Database** $\rightarrow$ **New Database Connection**.
3. Select **SQLite** and click **Next**.
4. In the **Path** field, paste:
   ```text
   e:\Tech folders\LOMAA_practice\task_Management\backend\tasks.db
   ```
5. Click **Test Connection** $\rightarrow$ **Finish**.
6. View both the `users` and `tasks` tables with their relationships in the DBeaver GUI!

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user & return JWT token |
| `POST` | `/api/auth/login` | Login with username/email & password |
| `GET` | `/api/auth/me` | Fetch authenticated user profile (Requires JWT) |
| `GET` | `/api/auth/demo` | Fetch demo user credentials helper |

### Task Endpoints (Protected by `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch authenticated user's tasks (with filters & search) |
| `GET` | `/api/tasks/:id` | Fetch single task by ID |
| `POST` | `/api/tasks` | Create task assigned to authenticated user |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH` | `/api/tasks/:id/status` | Quick update task status |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/tasks/stats` | Summary statistics for authenticated user |
| `GET` | `/api/tasks/dbeaver-info`| Public database path & metadata |
