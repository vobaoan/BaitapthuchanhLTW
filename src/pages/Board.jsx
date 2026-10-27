import { useEffect, useState } from "react";
import BoardColumn from "../components/BoardColumn";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskApi";
import "../style/Board.css";

const columns = [
  { id: "Todo", title: "Cần làm" },
  { id: "Doing", title: "Đang làm" },
  { id: "Done", title: "Hoàn thành" }
];

const emptyForm = {
  title: "",
  description: "",
  status: "Todo"
};

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTasks()
      .then((data) => {
        if (active) setTasks(data);
      })
      .catch(() => {
        if (active) setError("Không tải được dữ liệu. Kiểm tra backend.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function addCard(status) {
    setEditingId(null);
    setForm({ ...emptyForm, status });
    setMessage("");
    setError("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editCard(card) {
    setEditingId(card.id);
    setForm({
      title: card.title,
      description: card.description ?? "",
      status: card.status
    });
    setMessage("");
    setError("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function showError(error) {
    console.error(error);

    const detail = error.response?.data;

    setError(
      typeof detail === "string"
        ? detail
        : "Thao tác thất bại. Hãy kiểm tra backend."
    );
  }

  async function refreshTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Đã lưu thay đổi nhưng chưa tải lại được danh sách. Hãy tải lại trang.");
    }
  }

  async function submitForm(event) {
    event.preventDefault();

    if (busy) return;

    const input = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status
    };

    if (!input.title) {
      setError("Vui lòng nhập tên công việc.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (editingId !== null) {
        await updateTask(editingId, input);
        setMessage("Đã cập nhật công việc.");
      } else {
        await createTask(input);
        setMessage("Đã thêm công việc.");
      }

      closeForm();
      await refreshTasks();
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function removeCard(card) {
    if (busy) return;
    if (!window.confirm(`Xóa công việc "${card.title}"?`)) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await deleteTask(card.id);

      if (editingId === card.id) {
        closeForm();
      }

      setMessage("Đã xóa công việc.");
      await refreshTasks();
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container">
      <div className="board-header">
        <div>
          <h1>Bảng công việc</h1>
          <p>Quản lý công việc theo từng giai đoạn.</p>
        </div>

        <button
          type="button"
          className="task-primary"
          disabled={busy || loading}
          onClick={() => addCard("Todo")}
        >
          + Công việc mới
        </button>
      </div>

      {message && (
        <p className="task-success" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="task-error" role="alert">
          {error}
        </p>
      )}

      {formOpen && (
        <form className="task-form" onSubmit={submitForm}>
          <h2>
            {editingId !== null ? "Sửa công việc" : "Thêm công việc"}
          </h2>

          <fieldset disabled={busy}>
            <label htmlFor="task-title">Tên công việc *</label>
            <input
              id="task-title"
              name="title"
              value={form.title}
              onChange={changeField}
              placeholder="Ví dụ: Thiết kế trang đăng nhập"
              required
              autoFocus
            />

            <label htmlFor="task-description">Mô tả</label>
            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={changeField}
              placeholder="Nhập nội dung chi tiết..."
              rows={3}
            />

            <label htmlFor="task-status">Trạng thái</label>
            <select
              id="task-status"
              name="status"
              value={form.status}
              onChange={changeField}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>

            <div className="task-form-actions">
              <button type="submit" className="task-primary">
                {busy
                  ? "Đang lưu..."
                  : editingId !== null
                    ? "Lưu thay đổi"
                    : "Thêm công việc"}
              </button>

              <button
                type="button"
                className="task-secondary"
                onClick={closeForm}
              >
                Hủy
              </button>
            </div>
          </fieldset>
        </form>
      )}

      {loading && <p role="status">Đang tải công việc...</p>}

      <div className="board">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={{
              ...column,
              cards: tasks.filter((task) => task.status === column.id)
            }}
            busy={busy || loading}
            onAddCard={addCard}
            onEditCard={editCard}
            onDeleteCard={removeCard}
          />
        ))}
      </div>
    </main>
  );
}