# 🐍 Chroma Task Management — Python FastAPI & PostgreSQL Backend

A high-performance **Python FastAPI** backend powered by **PostgreSQL** (and SQLAlchemy ORM), featuring **JWT Authentication** and complete CRUD capabilities designed to pair seamlessly with the React liquid glassmorphism frontend.

---

## ⚡ Quick Start

### 1. Start PostgreSQL Database

You have two simple options:

#### Option A: Using Docker (One Command)
If you have Docker Desktop running:
```bash
cd python-backend
docker compose up -d
```
This automatically starts a PostgreSQL 16 container on `localhost:5432` with database `task_management_db`.

#### Option B: Local PostgreSQL Service
If you installed PostgreSQL on your machine:
- Ensure the PostgreSQL service is running on port `5432`.
- Create database `task_management_db` (or update credentials in `.env`).

---

### 2. Configure Environment (`.env`)

Check `python-backend/.env`:
```env
PORT=5000
HOST=0.0.0.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_management_db
JWT_SECRET=retro_liquid_glassmorphism_jwt_secret_key_2026_super_secure
JWT_EXPIRES_DAYS=7
USE_SQLITE_FALLBACK=true
```
*(If PostgreSQL is temporarily offline during testing, `USE_SQLITE_FALLBACK=true` allows the server to run with zero interruptions).*

---

### 3. Run FastAPI Backend

Activate the virtual environment and start the server:

```powershell
cd python-backend
.\venv\Scripts\activate
python run.py
```
Or directly with uvicorn:
```powershell
.\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 5000 --reload
```

- **API URL**: [http://localhost:5000](http://localhost:5000)
- **Interactive Swagger Docs**: [http://localhost:5000/docs](http://localhost:5000/docs)
- **ReDoc UI**: [http://localhost:5000/redoc](http://localhost:5000/redoc)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🗄️ Connecting DBeaver to PostgreSQL

DBeaver has native support for PostgreSQL:

1. Open **DBeaver**.
2. Click **Database** $\rightarrow$ **New Database Connection**.
3. Select **PostgreSQL** and click **Next**.
4. Enter the connection settings:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `task_management_db`
   - **Username**: `postgres`
   - **Password**: `postgres` (or your local Postgres password)
5. Click **Test Connection** (DBeaver will automatically download the PostgreSQL JDBC driver if needed).
6. Click **Finish**!
7. Navigate to `task_management_db` $\rightarrow$ `Schemas` $\rightarrow$ `public` $\rightarrow$ `Tables` to view and query `users` and `tasks`!

---

## 🔑 Authentication Credentials

### Demo Account (Pre-seeded):
- **Username**: `retro_pilot` (or email: `pilot@taskflow.dev`)
- **Password**: `password123`

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user with retro avatar aura |
| `POST` | `/api/auth/login` | Login with username/email & password, returns JWT |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/auth/demo` | Fetch demo credentials helper |

### Tasks (`/api/tasks` — Protected by `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get user's tasks (filters: `status`, `priority`, `category`, `search`, `sortBy`, `order`) |
| `GET` | `/api/tasks/{id}` | Get single task by ID |
| `POST` | `/api/tasks` | Create new task |
| `PUT` | `/api/tasks/{id}` | Update task details |
| `PATCH` | `/api/tasks/{id}/status` | Quick status progression |
| `DELETE` | `/api/tasks/{id}` | Delete task |
| `GET` | `/api/tasks/stats` | Pipeline stats, completion percentage & category counts |
| `GET` | `/api/tasks/dbeaver-info` | Public database info for DBeaver explorer |
