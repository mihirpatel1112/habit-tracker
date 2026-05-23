"use client";

import { useEffect, useState, useRef } from "react";
import { CompleteButton } from "@/components/CompleteButton";
import { getHabitColor } from "@/lib/habit-colors";

interface TodayClientProps {
  activeHabits: Array<{
    id: number;
    title: string;
  }>;
  todayCompletions: Array<{
    habit_id: number;
  }>;
}

function sortHabitOrder(order: number[], completed: Set<number>) {
  const incomplete = order.filter((id) => !completed.has(id));
  const complete = order.filter((id) => completed.has(id));
  return [...incomplete, ...complete];
}

export function TodayClient({ activeHabits, todayCompletions }: TodayClientProps) {
  const initialCompleted = new Set(todayCompletions.map((completion) => completion.habit_id));
  const initialOrder = activeHabits.map((habit) => habit.id);

  const [habitOrder, setHabitOrder] = useState(() =>
    sortHabitOrder(initialOrder, initialCompleted),
  );
  const [completedHabits, setCompletedHabits] = useState(initialCompleted);
  
  // Use ref to track previous completions
  const prevCompletionsRef = useRef(initialCompleted);

  // Update state when today's completions change
  useEffect(() => {
    const newCompleted = new Set(todayCompletions.map((completion) => completion.habit_id));
    const prevCompletions = prevCompletionsRef.current;
    
    // Only update state if completions have changed
    if (newCompleted.size !== prevCompletions.size || 
        ![...newCompleted].every(id => prevCompletions.has(id))) {
      setCompletedHabits(newCompleted);
      setHabitOrder((order) => sortHabitOrder(order, newCompleted));
      prevCompletionsRef.current = newCompleted;
    }
  }, [todayCompletions]);

  // Create a map of habit id to habit object for easy lookup
  const habitMap = new Map(activeHabits.map(habit => [habit.id, habit]));

  return (
    <>
      {habitOrder.map((habitId) => {
        const habit = habitMap.get(habitId);
        if (!habit) return null;
        
        const isDone = completedHabits.has(habit.id);
        const color = getHabitColor(habit.id);

        return (
          <div className="list-row list-row-interactive" key={habit.id}>
            <div className="flex items-center gap-3 min-w-0">
              <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${color}`} />
              <p className="truncate font-medium text-[var(--text-primary)]">{habit.title}</p>
            </div>

            <CompleteButton
              colorClass={color}
              habitId={habit.id}
              habitTitle={habit.title}
              isDone={isDone}
            />
          </div>
        );
      })}
    </>
  );
}