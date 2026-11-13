import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path in backend directory: backend/tasks.db
export const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../tasks.db');

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency and fast reads/writes
db.pragma('journal_mode = WAL');

// Initialize schema and seed data
export function initDatabase() {
  // 1. Create Users Table
  const userSchema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar_color TEXT DEFAULT 'retro-violet',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;
  db.exec(userSchema);

  // 2. Create Tasks Table
  const taskSchema = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
      priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
      category TEXT NOT NULL DEFAULT 'General',
      due_date TEXT,
      color_tag TEXT DEFAULT 'retro-violet',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
    CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
  `;
  db.exec(taskSchema);

  // Check if user_id column exists on tasks table (for existing database files)
  const columns = db.pragma('table_info(tasks)');
  const hasUserId = columns.some((col) => col.name === 'user_id');
  if (!hasUserId) {
    db.exec('ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE');
  }

  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');

  // 3. Seed Default Demo User if table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  let demoUserId = 1;

  if (userCount === 0) {
    console.log('Seeding initial demo user for JWT auth...');
    const hashedPassword = bcrypt.hashSync('password123', 10);
    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password, avatar_color, created_at)
      VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    `);
    const result = insertUser.run('retro_pilot', 'pilot@taskflow.dev', hashedPassword, 'retro-cyan');
    demoUserId = result.lastInsertRowid;
    console.log(`Demo user created: retro_pilot (ID: ${demoUserId})`);
  } else {
    demoUserId = db.prepare('SELECT id FROM users LIMIT 1').get().id;
  }

  // Update any existing unassigned tasks to point to demoUserId
  db.prepare('UPDATE tasks SET user_id = ? WHERE user_id IS NULL').run(demoUserId);

  // 4. Seed sample tasks if tasks table is empty
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;

  if (taskCount === 0) {
    console.log('Seeding initial retro liquid glass tasks...');
    const insertStmt = db.prepare(`
      INSERT INTO tasks (user_id, title, description, status, priority, category, due_date, color_tag, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `);

    const seedTasks = [
      {
        title: 'Calibrate Synthwave Audio Oscilloscope',
        description: 'Fine-tune the analog frequency filters and audio spectrum analyzer for 80s tape compression.',
        status: 'in_progress',
        priority: 'high',
        category: 'Retro Tech',
        due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        color_tag: 'retro-sunset'
      },
      {
        title: 'Design Liquid Glass Refraction Shader',
        description: 'Implement chromatic dispersion, caustic reflections, and fluid organic border radii in CSS/WebGL.',
        status: 'completed',
        priority: 'urgent',
        category: 'Design',
        due_date: new Date().toISOString().split('T')[0],
        color_tag: 'retro-violet'
      },
      {
        title: 'Optimize DBeaver SQLite Index Queries',
        description: 'Examine query execution plans in DBeaver and create composite indexes for task filtering.',
        status: 'completed',
        priority: 'medium',
        category: 'Development',
        due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        color_tag: 'retro-cyan'
      },
      {
        title: 'Digitize Vintage VHS Artwork Archives',
        description: 'High-res scan 1984 neon cassette box sleeves and vectorize the holographic typography.',
        status: 'pending',
        priority: 'low',
        category: 'Creative',
        due_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        color_tag: 'retro-gold'
      },
      {
        title: 'Build Realtime Liquid Ripple Feedback',
        description: 'Add haptic water drop sound effects and cursor-following viscous wave deformations.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'Development',
        due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        color_tag: 'retro-mint'
      },
      {
        title: 'Draft Retrofuturistic Architecture Roadmap',
        description: 'Outline the transition plan for microservices using modern Node.js ESM modules.',
        status: 'pending',
        priority: 'medium',
        category: 'Work',
        due_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        color_tag: 'retro-coral'
      }
    ];

    const seedMany = db.transaction((tasks) => {
      for (const t of tasks) {
        insertStmt.run(demoUserId, t.title, t.description, t.status, t.priority, t.category, t.due_date, t.color_tag);
      }
    });

    seedMany(seedTasks);
    console.log(`Successfully seeded ${seedTasks.length} tasks!`);
  }
}
