
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== FETCH ONCE =====
  useEffect(() => {
    api.get("/todos").then((res) => setTodos(res.data));
  }, []);

  // ===== ADD =====
  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      const res = await api.post("/todos", { title, priority, status });

      // 🔥 IMPORTANT: local update only
      setTodos((prev) => [res.data, ...prev]);

      setTitle("");
      setPriority("medium");
      setStatus("pending");
      setError("");
    } catch {
      setError("Failed to add todo");
    }
  };

  // ===== DELETE =====
  const deleteTodo = async (id) => {
    // 🔥 FIRST state update → exit animation
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      await api.delete(`/todos/${id}`);
    } catch {
      setError("Failed to delete todo");
    }
  };

  // ===== STATUS TOGGLE =====
  const toggleStatus = async (todo) => {
    const newStatus =
      todo.status === "completed" ? "pending" : "completed";

    try {
      await api.put(`/todos/${todo._id}`, { status: newStatus });

      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, status: newStatus } : t
        )
      );
    } catch {
      setError("Failed to update status");
    }
  };

  // ===== EDIT =====
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      await api.put(`/todos/${id}`, { title: editingTitle });

      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, title: editingTitle } : t
        )
      );

      setEditingId(null);
      setEditingTitle("");
    } catch {
      setError("Failed to update title");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">
          Todo App
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* ADD TODO */}
        <input
          className="w-full border border-slate-300 p-2 rounded-lg mb-2"
          placeholder="Enter todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            className="border border-slate-300 p-2 rounded-lg"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="border border-slate-300 p-2 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={addTodo}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mb-4"
          disabled={loading}
        >
          ➕ Add Todo
        </motion.button>

        {/* ===== ANIMATED LIST ===== */}
        <motion.ul layout className="space-y-3">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.li
                key={todo._id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.25 }}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div className="flex-1 mr-2">
                  {editingId === todo._id ? (
                    <input
                      className="border p-1 rounded w-full"
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                    />
                  ) : (
                    <>
                      <p className="font-medium text-slate-800">
                        {todo.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {todo.priority} • {todo.status}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-1">
                  {editingId === todo._id ? (
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => saveEdit(todo._id)}
                      className="px-2 py-1 text-sm rounded bg-yellow-500 text-white"
                    >
                      💾
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => startEdit(todo)}
                      className="px-2 py-1 text-sm rounded bg-slate-200"
                    >
                      ✏️
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleStatus(todo)}
                    className="px-2 py-1 text-sm rounded bg-green-600 text-white"
                  >
                    ✅
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => deleteTodo(todo._id)}
                    className="px-2 py-1 text-sm rounded bg-red-600 text-white"
                  >
                    🗑
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </motion.div>
  );
}
