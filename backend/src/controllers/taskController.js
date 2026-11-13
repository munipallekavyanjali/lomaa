import { db, DB_PATH } from '../db.js';

// GET all tasks for the authenticated user with optional search & filters
export function getTasks(req, res) {
  try {
    const userId = req.user.id;
    const { status, priority, category, search, sortBy = 'created_at', order = 'DESC' } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    // Sanitize sort column and order
    const allowedSortCols = ['id', 'title', 'status', 'priority', 'category', 'due_date', 'created_at', 'updated_at'];
    const safeSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    const stmt = db.prepare(query);
    const tasks = stmt.all(...params);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve tasks', error: error.message });
  }
}

// GET single task by ID for authenticated user
export function getTaskById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?');
    const task = stmt.get(id, userId);

    if (!task) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found` });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve task', error: error.message });
  }
}

// POST create new task for authenticated user
export function createTask(req, res) {
  try {
    const userId = req.user.id;
    const {
      title,
      description = '',
      status = 'pending',
      priority = 'medium',
      category = 'General',
      due_date = null,
      color_tag = 'retro-violet'
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    // Validate enum constraints
    const validStatuses = ['pending', 'in_progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high', 'urgent'];

    const safeStatus = validStatuses.includes(status) ? status : 'pending';
    const safePriority = validPriorities.includes(priority) ? priority : 'medium';

    const insertStmt = db.prepare(`
      INSERT INTO tasks (user_id, title, description, status, priority, category, due_date, color_tag, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `);

    const result = insertStmt.run(
      userId,
      title.trim(),
      description.trim(),
      safeStatus,
      safePriority,
      category.trim() || 'General',
      due_date || null,
      color_tag || 'retro-violet'
    );

    const createdTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: createdTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
}

// PUT update whole task
export function updateTask(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      category,
      due_date,
      color_tag
    } = req.body;

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found` });
    }

    const updatedTitle = title !== undefined ? title.trim() : existingTask.title;
    if (!updatedTitle) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty' });
    }

    const updatedDescription = description !== undefined ? description : existingTask.description;
    const updatedStatus = status !== undefined ? status : existingTask.status;
    const updatedPriority = priority !== undefined ? priority : existingTask.priority;
    const updatedCategory = category !== undefined ? category : existingTask.category;
    const updatedDueDate = due_date !== undefined ? due_date : existingTask.due_date;
    const updatedColorTag = color_tag !== undefined ? color_tag : existingTask.color_tag;

    const updateStmt = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, color_tag = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `);

    updateStmt.run(
      updatedTitle,
      updatedDescription,
      updatedStatus,
      updatedPriority,
      updatedCategory,
      updatedDueDate,
      updatedColorTag,
      id,
      userId
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
}

// PATCH update status only
export function updateTaskStatus(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found` });
    }

    db.prepare(`
      UPDATE tasks 
      SET status = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND user_id = ?
    `).run(status, id, userId);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    res.json({
      success: true,
      message: `Task status changed to ${status}`,
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ success: false, message: 'Failed to update task status', error: error.message });
  }
}

// DELETE remove task
export function deleteTask(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: `Task with id ${id} not found` });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, userId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedId: Number(id)
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
}

// GET summary stats for fluid counters for authenticated user
export function getTaskStats(req, res) {
  try {
    const userId = req.user.id;
    const total = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(userId).count;
    const pending = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'pending'").get(userId).count;
    const inProgress = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'in_progress'").get(userId).count;
    const completed = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = 'completed'").get(userId).count;
    const urgentOrHigh = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND priority IN ('high', 'urgent') AND status != 'completed'").get(userId).count;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Categories breakdown
    const categories = db.prepare('SELECT category, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY category').all(userId);

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        urgentOrHigh,
        completionRate,
        categories
      }
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
  }
}

// GET DBeaver connection info helper (public)
export function getDBeaverInfo(req, res) {
  try {
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    res.json({
      success: true,
      databaseType: 'SQLite 3',
      filePath: DB_PATH,
      table: 'tasks',
      rowCount: totalTasks,
      userCount: totalUsers,
      instructions: [
        '1. Open DBeaver application.',
        '2. Click "New Database Connection" (the plug icon with the +).',
        '3. Select "SQLite" from the list and click "Next".',
        `4. In "Path", paste this exact path: ${DB_PATH}`,
        '5. Click "Test Connection" (DBeaver will automatically fetch the SQLite driver if prompted).',
        '6. Click "Finish"! You can now browse tables "users" and "tasks" directly in the GUI!'
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
