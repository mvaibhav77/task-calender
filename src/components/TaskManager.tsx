import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface Task {
  id: number;
  name: string;
}

type Props = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, name: string) => void;
};

const TaskManager = (props: Props) => {
  const [taskName, setTaskName] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskName, setEditingTaskName] = useState<string>("");

  const handleAddTask = () => {
    if (taskName.trim()) {
      const newTask: Task = { id: Date.now(), name: taskName };
      props.addTask(newTask);
      setTaskName("");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
  };

  const handleSaveEdit = () => {
    if (editingTaskId !== null && editingTaskName.trim()) {
      props.editTask(editingTaskId, editingTaskName);
      setEditingTaskId(null);
      setEditingTaskName("");
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number
  ) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  return (
    <div className="px-6 py-8 bg-gray-900 text-white h-screen">
      <h2 className="text-3xl font-semibold mb-6">Task Manager</h2>

      <div className="flex items-center mb-6">
        <Input
          type="text"
          placeholder="Add new task"
          value={taskName}
          className="text-lg h-10"
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Button
          variant={"secondary"}
          size={"lg"}
          onClick={handleAddTask}
          className=" px-4 py-2 rounded-md"
        >
          Add Task
        </Button>
      </div>

      <ul className="flex flex-col gap-4">
        {props.tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 border bg-gray-400 text-black hover:bg-gray-600 hover:text-white border-gray-300 rounded-md"
          >
            {editingTaskId === task.id ? (
              <div className="flex items-center justify-between w-full">
                <Input
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => setEditingTaskName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mr-2 w-100 w-full"
                />
                <Button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white px-3 py-1 rounded-md"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full pl-2">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="mr-2 cursor-pointer w-full font-semibold"
                >
                  {task.name}
                </div>
                <div className="flex">
                  <Button
                    onClick={() => handleEditTask(task)}
                    className="bg-gray-300 text-black px-3 py-1 rounded-md mr-2 hover:text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => props.deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
