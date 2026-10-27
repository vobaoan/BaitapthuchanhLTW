import axios from "axios";

const api = axios.create({
  baseURL: "/api/taskcards"
});

// GET: lấy danh sách công việc
export async function getTasks() {
  const response = await api.get("");
  return response.data;
}

// POST: thêm công việc
export async function createTask(task) {
  const response = await api.post("", task);
  return response.data;
}

// PUT: sửa công việc
export async function updateTask(id, task) {
  await api.put(`/${id}`, task);
}

// DELETE: xóa công việc
export async function deleteTask(id) {
  await api.delete(`/${id}`);
}