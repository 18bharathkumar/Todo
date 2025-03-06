import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  {url} from '../url/url'

const CreateTodo: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [discription, setDiscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !discription) {
      setError("All fields must be filled");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/todo/addTodo`,
        { title, discription },
        { withCredentials: true } // Include cookies for authentication
      );

      if (response.status === 201) {
        navigate("/"); // Redirect to the todos page after successful creation
      }
    } catch (err) {
      console.error("Error creating todo:", err);
      setError("Failed to create todo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create a New Todo
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter todo title"
            />
          </div>
          <div>
            <label
              htmlFor="discription"
              className="block text-sm font-medium text-gray-700"
            >
              iscription
            </label>
            <textarea
              id="discription"
              value={discription}
              onChange={(e) => setDiscription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter todo description"
              rows={4}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;