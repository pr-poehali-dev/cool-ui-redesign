import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface Note {
  id: number
  text: string
  date: string
}

const STORAGE_KEY = "my_notes"
const today = () => new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })

const defaultNotes: Note[] = [
  { id: 1, text: "Первая заметка — напиши здесь что угодно!", date: today() },
]

export default function NotesSection() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultNotes
    } catch {
      return defaultNotes
    }
  })
  const [input, setInput] = useState("")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!input.trim()) return
    setNotes((prev) => [{ id: Date.now(), text: input.trim(), date: today() }, ...prev])
    setInput("")
  }

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <section id="notes" className="relative z-20 px-8 py-10 pb-24 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Раздел</p>
        <h2 className="text-3xl font-light text-white">
          Мои <span className="font-medium italic">заметки</span>
        </h2>
      </div>

      <div className="flex gap-3 mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote()
          }}
          placeholder="Напишите заметку... (Ctrl+Enter чтобы добавить)"
          rows={2}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/30 resize-none transition-colors"
        />
        <button
          onClick={addNote}
          className="px-5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors self-stretch"
        >
          <Icon name="Send" size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {notes.length === 0 && (
          <p className="text-white/30 text-sm text-center py-10">Заметок пока нет. Добавьте первую!</p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="group flex items-start justify-between gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
              <p className="text-white/30 text-xs mt-2">{note.date}</p>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-500/20 transition-all flex-shrink-0 mt-0.5"
            >
              <Icon name="X" size={14} className="text-white/40" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}