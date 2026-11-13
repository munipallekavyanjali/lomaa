const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_URL.replace(/\/$/, '')}/tasks`;

function getAuthHeaders() {
  const token = localStorage.getItem('retro_taskflow_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchTasks(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
  if (filters.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
  if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.order) queryParams.append('order', filters.order);

  const url = `${BASE_URL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchTaskStats() {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    throw new Error('Failed to load stats');
  }
  return res.json();
}

export async function fetchDBeaverInfo() {
  const res = await fetch(`${BASE_URL}/dbeaver-info`);
  if (!res.ok) throw new Error('Failed to load DBeaver database info');
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create task');
  }
  return res.json();
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update task');
  }
  return res.json();
}

export async function updateTaskStatus(id, status) {
  const res = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update status');
  }
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete task');
  }
  return res.json();
}
