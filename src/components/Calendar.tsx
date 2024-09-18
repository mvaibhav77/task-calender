import React, { useEffect, useState } from "react";
import { Task } from "./TaskManager";
import { MdDelete } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();
    setHoveredDate(date); // Set the date being hovered over
  };

  const handleDragLeave = () => {
    setHoveredDate(null);
  };

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

  const renderCalendarDays = () => {
    const daysInMonth = 30; // Example: 30 days for September 2024
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(2024, 8, i);
      const dayEvents = events.filter((event) => event.date.getDate() === i);

      const isHovered = hoveredDate?.getDate() === i;

      days.push(
        <Card key={i} className="mb-3 h-[160px]">
          <CardContent
            className={`relative border p-0 rounded-md shadow-md h-full ${
              isHovered ? "border-blue-800" : "border-gray-300"
            }`}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) =>
              handleDragOver(e, date)
            }
            onDragLeave={handleDragLeave}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, date)}
          >
            <CardHeader className="bg-gray-900 text-white p-1 px-2 py-3 rounded-md w-full">
              <CardTitle>Day {i}</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[115px] rounded-md">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between pl-2 py-0 text-gray-800 font-semibold bg-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-white hover:cursor-pointer "
                  >
                    <div>{event.title}</div>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleRemoveEvent(event.id, event.date)}
                      className="text-lg p-2 text-white"
                    >
                      <MdDelete />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="h-[100px] w-full flex justify-center items-center">
                  NO EVENTS
                </div>
              )}
            </ScrollArea>

            {isHovered && dayEvents.length === 0 && (
              <div className="text-center text-gray-500 mt-2">
                Drop task here
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return days;
  };

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="calendar p-4 mt-5 max-h-screen w-full">
      <h2 className="text-3xl font-semibold mb-4">Task Calendar</h2>
      <ScrollArea className="h-[calc(100vh-110px)]">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {renderCalendarDays()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Calendar;
