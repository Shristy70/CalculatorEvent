import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isToday } from "date-fns";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Navigation handler for changing months
  const handleNavigation = (direction) => {
    setCurrentMonth((prev) => new Date(prev.setMonth(prev.getMonth() + direction)));
  };

  // Generate dates for the calendar grid
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfMonth(currentMonth);
    const days = [];
    
    let currentDate = start;
    while (currentDate <= end || days.length % 7 !== 0) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };

  const days = generateCalendarDays();

  return (
    <div className="calendar-container p-3">
      {/* Header: Month name and navigation buttons */}
      <div className="flex justify-between items-center mb-2 px-1">
        <button
          onClick={() => handleNavigation(-1)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="font-medium text-center text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        
        <button
          onClick={() => handleNavigation(1)}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-muted-foreground h-8 w-8 mx-auto flex items-center justify-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "h-8 w-8 flex items-center justify-center text-sm rounded-md",
              isToday(day) && "bg-accent text-accent-foreground font-bold",
              isSameMonth(day, currentMonth) ? "text-primary" : "text-muted-foreground"
            )}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
