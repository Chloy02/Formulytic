"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  multiple?: boolean
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

const useDropdown = () => {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error("useDropdown must be used within a Dropdown")
  }
  return context
}

interface DropdownProps {
  children: React.ReactNode
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  multiple?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ 
  children, 
  value, 
  onValueChange, 
  multiple = false 
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownContext.Provider value={{ open, setOpen, value, onValueChange, multiple }}>
      <div className="relative">{children}</div>
    </DropdownContext.Provider>
  )
}

const DropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: string
  }
>(({ className, placeholder = "Select option...", children, ...props }, ref) => {
  const { open, setOpen, value, multiple } = useDropdown()

  const getDisplayValue = () => {
    if (!value) return placeholder
    if (multiple && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selected` : placeholder
    }
    return value as string
  }

  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <span className={cn(!value && "text-muted-foreground")}>
        {children || getDisplayValue()}
      </span>
      <ChevronDown 
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          open && "rotate-180"
        )} 
      />
    </button>
  )
})
DropdownTrigger.displayName = "DropdownTrigger"

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, align = "start", sideOffset = 4, children, ...props }, ref) => {
  const { open, setOpen } = useDropdown()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        alignmentClasses[align],
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownContent.displayName = "DropdownContent"

const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    disabled?: boolean
  }
>(({ className, value: itemValue, disabled = false, children, ...props }, ref) => {
  const { setOpen, value, onValueChange, multiple } = useDropdown()

  const isSelected = multiple 
    ? Array.isArray(value) && value.includes(itemValue)
    : value === itemValue

  const handleClick = () => {
    if (disabled) return

    if (multiple && Array.isArray(value)) {
      const newValue = isSelected 
        ? value.filter(v => v !== itemValue)
        : [...value, itemValue]
      onValueChange?.(newValue)
    } else {
      onValueChange?.(itemValue)
      setOpen(false)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {multiple && (
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      {children}
    </div>
  )
})
DropdownItem.displayName = "DropdownItem"

const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownLabel.displayName = "DropdownLabel"

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
}
