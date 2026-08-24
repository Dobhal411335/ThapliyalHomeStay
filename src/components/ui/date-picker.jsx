"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DATE_VALUE_FORMAT = "yyyy-MM-dd";

function parseValue(value) {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  try {
    const parsed = parse(String(value), DATE_VALUE_FORMAT, new Date());
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  } catch {
    return undefined;
  }
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  disablePast = false,
  className,
  buttonClassName,
  align = "start",
}) {
  const [open, setOpen] = React.useState(false);
  const selected = parseValue(value);

  function handleSelect(date) {
    onChange?.(date ? format(date, DATE_VALUE_FORMAT) : "");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            data-empty={!selected}
            className={cn(
              "h-8 w-full justify-start gap-2 rounded-lg border-input bg-transparent px-2.5 font-normal text-foreground shadow-none data-[empty=true]:text-muted-foreground",
              buttonClassName,
              className
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 text-muted" aria-hidden="true" />
        {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent align={align} className="z-60 w-auto p-0">
        <Calendar
         mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={
            disablePast
              ? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
              : undefined
          }
          defaultMonth={selected}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
