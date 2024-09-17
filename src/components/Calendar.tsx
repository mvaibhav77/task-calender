import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Task } from "./TaskManager";
import { MdDelete } from "react-icons/md";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
}

interface CalendarProps {
  tasks: Task[];
}

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(
    JSON.parse(localStorage.getItem("events") ?? "[]").map(
      (event: { date: string | number | Date }) => ({
        ...event,
        date: new Date(event.date),
      })
    )
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Handle dropping a task onto a specific date
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    setHoveredDate(null); // Clear hover state when dropped
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t.id === parseInt(taskId));

    if (task) {
      const newEvent: CalendarEvent = {
        id: task.id,
        title: task.name,
        date: date,
      };

      // Prevent duplicate events for the same task on the same day
      const isDuplicate = events.some(
        (event) =>
          event.id === newEvent.id && event.date.getDate() === date.getDate()
      );

      if (!isDuplicate) {
        setEvents([...events, newEvent]);
      } else {
        alert("Task already exists for this day");
      }
    }
  };

  // Allow dragging over calendar days
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();
    setHoveredDate(date); // Set the date being hovered over
  };

  // Clear the hover state when the drag leaves the date card
  const handleDragLeave = () => {
    setHoveredDate(null);
  };

  // Handle removing an event
  const handleRemoveEvent = (eventId: number, eventDate: Date) => {
    setEvents(
      events.filter(
        (event) =>
          !(
            event.id === eventId && event.date.getTime() === eventDate.getTime()
          )
      )
    );
  };

  // Render the calendar days for a given month
  const renderCalendarDays = () => {
    const daysInMonth = 30; // Example: 30 days for September 2024
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(2024, 8, i);
      const dayEvents = events.filter((event) => event.date.getDate() === i);

      const isHovered = hoveredDate?.getDate() === i;

      days.push(
        <Col key={i} className="mb-3">
          <Card
            className={`calendar-day ${isHovered ? "border-primary" : ""}`}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
              handleDragOver(e, date)
            }
            onDragLeave={handleDragLeave}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, date)}
          >
            <Card.Body className="p-0">
              <Card.Title className="bg-primary p-1 px-2">Day {i}</Card.Title>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="d-flex justify-content-between align-items-center mb-2 p-2"
                >
                  <Card.Text className="mb-0">{event.title}</Card.Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveEvent(event.id, event.date)}
                  >
                    <MdDelete />
                  </Button>
                </div>
              ))}

              {/* Placeholder for the hovered state */}
              {isHovered && dayEvents.length === 0 && (
                <div className="p-2 text-center text-muted">Drop task here</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      );
    }

    return days;
  };

  // Save events to localStorage whenever the events array changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="calendar pt-3">
      <h2 className="mb-4">Task Calendar</h2>
      <Container fluid>
        <Row xs={3} md={4} lg={5} xl={6}>
          {renderCalendarDays()}
        </Row>
      </Container>
    </div>
  );
};

export default Calendar;
