import React, { useState } from "react";
import { Button, Form, ListGroup, InputGroup } from "react-bootstrap";

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
    <div className="task-manager">
      <h2 className="mb-4">Task Manager</h2>

      <Form className="mb-3">
        <Form.Group controlId="formTaskName">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Add new task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <Button variant="primary" onClick={handleAddTask}>
              Add Task
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>

      <ListGroup>
        {props.tasks.map((task) => (
          <ListGroup.Item
            key={task.id}
            className="d-flex justify-content-between align-items-center"
          >
            {editingTaskId === task.id ? (
              <>
                <Form.Control
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => setEditingTaskName(e.target.value)}
                  className="me-2"
                />
                <Button variant="success" size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="draggable-task"
                >
                  {task.name}
                </div>
                <div className="row task-action-container">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 col"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="col"
                    onClick={() => props.deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TaskManager;
