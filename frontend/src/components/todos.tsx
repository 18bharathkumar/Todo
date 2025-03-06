import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { url } from "../url/url";
import {user} from "../store/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

const Todo: React.FC = () => {
  const Nav = useNavigate();
  const myuser = useAtomValue(user);
  const [todos, setTodos] = useState<any[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); // Track which todo is being edited
  const [editedTodo, setEditedTodo] = useState({ title: "", description: "" }); // Store edited todo data
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    if(!myuser){
      Nav("/login");
    }
    fetchTodos();
  }, [myuser]);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await axios.get(`${url}/todo/getTodo`, {
        withCredentials: true, // Include cookies for authentication
      });
      setTodos(res.data);
    } catch (err) {
      setError("Failed to fetch todos. Please try again later.");
      console.error("Error fetching todos:", err);
    } finally {
      setFetching(false);
    }
  };

  // Mark a todo as done
  const markTodoAsDone = async (id: number) => {
    setError("");
    try {
      await axios.put(
        `${url}/todo/${id}/done`,
        {},
        { withCredentials: true } // Include cookies for authentication
      );

      // Update the todos list
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, done: true } : todo))
      );
    } catch (err) {
      setError("Failed to mark todo as done. Please try again.");
      console.error("Error marking todo as done:", err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    setError("");
    try {
      await axios.delete(`${url}/todo/deleteTodo/${id}`, {
        withCredentials: true,
      });

      // Remove the todo from the list
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
    }
  };

  // Enable editing for a todo
  const startEditing = (todo: any) => {
    setEditingTodoId(todo.id);
    setEditedTodo({ title: todo.title, description: todo.discription });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTodo({ title: "", description: "" });
  };

  // Save edited todo
  const saveEditedTodo = async (id: number) => {
    setError("");
    if (!editedTodo.title || !editedTodo.description) {
      setError("Title and description are required.");
      return;
    }

    try {
      const res = await axios.put(
        `${url}/todo/updateTodo/${id}`,
        { title: editedTodo.title, discription: editedTodo.description },
        { withCredentials: true }
      );

      // Update the todos list
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, title: editedTodo.title, discription: editedTodo.description }
            : todo
        )
      );

      if (res.status !== 200) {
        throw new Error("Failed to update todo. Please try again.");
      }

      // Stop editing
      setEditingTodoId(null);
      setEditedTodo({ title: "", description: "" });
    } catch (err) {
      setError("Failed to update todo. Please try again.");
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Todo List
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Todo List */}
        <div>
          {fetching ? (
            <p className="text-center text-gray-500">Loading todos...</p>
          ) : todos.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No todos found.</p>
              <NavLink
                to="/create-todo"
                className="inline-block px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Your First Todo
              </NavLink>
            </div>
          ) : (
            <div className="space-y-6">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-white shadow-lg rounded-lg p-6 transition-all duration-200 hover:shadow-xl ${
                    todo.done ? "opacity-75 border-l-4 border-green-500" : ""
                  }`}
                >
                  {editingTodoId === todo.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedTodo.title}
                        onChange={(e) =>
                          setEditedTodo({ ...editedTodo, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Title"
                      />
                      <textarea
                        value={editedTodo.description}
                        onChange={(e) =>
                          setEditedTodo({ ...editedTodo, description: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Description"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveEditedTodo(todo.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {todo.title}
                        </h3>
                        <p className="text-gray-600 mt-2">{todo.discription}</p>
                      </div>
                      <div className="flex space-x-2">
                        {!todo.done && (
                          <button
                            onClick={() => markTodoAsDone(todo.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Mark as Done
                          </button>
                        )}
                        <button
                          onClick={() => startEditing(todo)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  {todo.done && (
                    <p className="text-sm text-green-600 mt-2">Completed</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Todo Button */}
      <div className="fixed bottom-8 right-8">
        <NavLink
          to="/create-todo"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          + Create Todo
        </NavLink>
      </div>
    </div>
  );
};

export default Todo;