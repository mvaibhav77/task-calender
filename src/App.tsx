import React, { useState } from "react";
import "./App.css";
import TaskManager, { Task } from "./components/TaskManager";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(
    JSON.parse(localStorage.getItem("tasks") || "[]")
  );

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, task]));
  };

  const editTasks = (id: number, name: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, name };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-row gap-4 ">
      <TaskManager
        tasks={tasks}
        editTask={editTasks}
        addTask={addTask}
        deleteTask={deleteTask}
      />
      <Calendar tasks={tasks} />
    </div>
  );
};

export default App;
