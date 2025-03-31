import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Calendar } from "./components/ui/calendar";

const EventCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );

  const openAddEventForm = () => {
    setNewEvent({
      name: "",
      startDate: selectedDate,
      startTime: "",
      endTime: "",
      description: "",
    });
    setEditIndex(null);
    setEventModalOpen(true);
  };

  const addOrEditEvent = () => {
    if (
      !newEvent.name ||
      !newEvent.startDate ||
      !newEvent.startTime ||
      !newEvent.endTime
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const overlappingEvent = events.some(
      (event) =>
        event.startDate === newEvent.startDate &&
        event.startTime === newEvent.startTime
    );

    if (overlappingEvent) {
      alert("Event time conflicts with another event!");
      return;
    }

    let updatedEvents = [...events];
    if (editIndex !== null) {
      updatedEvents[editIndex] = newEvent;
    } else {
      updatedEvents.push(newEvent);
    }
    setEvents(updatedEvents);
    setEventModalOpen(false);
  };

  const deleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevMonth}>Previous</Button>
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <Button onClick={handleNextMonth}>Next</Button>
        </div>

        <div className="flex justify-center">
          <Calendar
            month={currentMonth}
            onDateClick={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        <div className="mt-6 flex justify-between">
          <Button onClick={openAddEventForm}>Add Event</Button>
          {"    "}
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-6 p-4 border rounded bg-gray-50 shadow-sm w-full">
          <h3 className="text-lg font-semibold text-center">Event List</h3>
          {filteredEvents.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 shadow-sm mt-3">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Start Time</th>
                  <th className="py-2 px-4 border">End Time</th>
                  <th className="py-2 px-4 border">Description</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={index} className="border-b text-center">
                    <td className="py-2 px-4 border">{event.name}</td>
                    <td className="py-2 px-4 border">{event.startDate}</td>
                    <td className="py-2 px-4 border">{event.startTime}</td>
                    <td className="py-2 px-4 border">{event.endTime}</td>
                    <td className="py-2 px-4 border">{event.description}</td>
                    <td className="py-2 px-4 border">
                      <Button
                        onClick={() => {
                          setNewEvent(event);
                          setEditIndex(index);
                          setEventModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      {"     "}
                      <Button onClick={() => deleteEvent(index)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-2">No events found.</p>
          )}
        </div>
      </div>

      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
            />
            <Input
              type="date"
              value={newEvent.startDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startDate: e.target.value })
              }
            />
            <Input
              type="time"
              value={newEvent.startTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startTime: e.target.value })
              }
            />
            <Input
              type="time"
              value={newEvent.endTime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endTime: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <Button className="w-full" onClick={addOrEditEvent}>
              Save Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
