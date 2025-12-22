"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = savedTheme === "dark" || (!savedTheme && true)
    setIsDark(prefersDark)
    document.documentElement.classList.toggle("dark", prefersDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 bg-transparent"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm">Dark</span>
        </>
      )}
    </Button>
  )
}
