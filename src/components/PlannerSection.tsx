import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

interface PlanItem {
  id: number
  date: string
  time: string
  text: string
  done: boolean
}

const STORAGE_KEY = "my_planner"

const pad = (n: number) => String(n).padStart(2, "0")

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
]
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export default function PlannerSection() {
  const now = new Date()
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(toDateStr(now.getFullYear(), now.getMonth(), now.getDate()))
  const [items, setItems] = useState<PlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [newText, setNewText] = useState("")
  const [newTime, setNewTime] = useState("")
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const addItem = () => {
    if (!newText.trim()) return
    setItems(prev => [...prev, {
      id: Date.now(),
      date: selectedDate,
      time: newTime,
      text: newText.trim(),
      done: false,
    }])
    setNewText("")
    setNewTime("")
  }

  const toggleDone = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  const daysWithEvents = new Set(items.map(i => i.date))

  const selectedItems = items
    .filter(i => i.date === selectedDate)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"))

  const hours = pad(clock.getHours())
  const minutes = pad(clock.getMinutes())
  const seconds = pad(clock.getSeconds())

  const clockDeg = {
    hour: (clock.getHours() % 12) * 30 + clock.getMinutes() * 0.5,
    min: clock.getMinutes() * 6,
    sec: clock.getSeconds() * 6,
  }

  const selectedLabel = new Date(selectedDate + "T12:00:00").toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <section id="planner" className="relative z-20 px-8 py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Раздел</p>
        <h2 className="text-3xl font-light text-white">
          Планировщик <span className="font-medium italic">и время</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Часы */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          {/* Аналоговые часы */}
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180)
                const r1 = i % 3 === 0 ? 40 : 43
                const r2 = 46
                return (
                  <line
                    key={i}
                    x1={50 + r1 * Math.cos(angle)}
                    y1={50 + r1 * Math.sin(angle)}
                    x2={50 + r2 * Math.cos(angle)}
                    y2={50 + r2 * Math.sin(angle)}
                    stroke={i % 3 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}
                    strokeWidth={i % 3 === 0 ? 2 : 1}
                    strokeLinecap="round"
                  />
                )
              })}
              {/* Час */}
              <line
                x1="50" y1="50"
                x2={50 + 26 * Math.cos((clockDeg.hour - 90) * Math.PI / 180)}
                y2={50 + 26 * Math.sin((clockDeg.hour - 90) * Math.PI / 180)}
                stroke="white" strokeWidth="3" strokeLinecap="round"
              />
              {/* Минута */}
              <line
                x1="50" y1="50"
                x2={50 + 36 * Math.cos((clockDeg.min - 90) * Math.PI / 180)}
                y2={50 + 36 * Math.sin((clockDeg.min - 90) * Math.PI / 180)}
                stroke="white" strokeWidth="2" strokeLinecap="round"
              />
              {/* Секунда */}
              <line
                x1="50" y1="50"
                x2={50 + 38 * Math.cos((clockDeg.sec - 90) * Math.PI / 180)}
                y2={50 + 38 * Math.sin((clockDeg.sec - 90) * Math.PI / 180)}
                stroke="#a78bfa" strokeWidth="1" strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="2.5" fill="white" />
            </svg>
          </div>
          {/* Цифровые */}
          <div className="text-center">
            <p className="text-white text-3xl font-light tracking-widest tabular-nums">
              {hours}<span className="opacity-40 animate-pulse">:</span>{minutes}
              <span className="text-lg text-white/40 ml-1">{seconds}</span>
            </p>
            <p className="text-white/40 text-xs mt-1">
              {clock.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        {/* Календарь */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white/10 transition-colors">
              <Icon name="ChevronLeft" size={16} className="text-white/60" />
            </button>
            <p className="text-white text-sm font-medium">{MONTHS[currentMonth]} {currentYear}</p>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white/10 transition-colors">
              <Icon name="ChevronRight" size={16} className="text-white/60" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-white/30 text-xs py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1
              const dateStr = toDateStr(currentYear, currentMonth, day)
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              const hasEvent = daysWithEvents.has(dateStr)
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative aspect-square flex items-center justify-center rounded-lg text-xs transition-all duration-150 ${
                    isSelected
                      ? "bg-white text-black font-medium"
                      : isToday
                      ? "bg-violet-500/30 text-violet-300 font-medium"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {day}
                  {hasEvent && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* События дня */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col">
          <p className="text-white/40 text-xs mb-1">{selectedLabel}</p>
          <p className="text-white text-sm font-medium mb-4">
            {selectedItems.length === 0 ? "Событий нет" : `${selectedItems.length} событий`}
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/70 text-xs outline-none focus:border-white/30 w-24"
            />
            <input
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem()}
              placeholder="Добавить событие..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/30 outline-none focus:border-white/30"
            />
            <button
              onClick={addItem}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon name="Plus" size={14} className="text-white" />
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-48 pr-1">
            {selectedItems.length === 0 && (
              <p className="text-white/20 text-xs text-center py-6">Нажмите на дату и добавьте событие</p>
            )}
            {selectedItems.map(item => (
              <div key={item.id} className="group flex items-start gap-2">
                <button onClick={() => toggleDone(item.id)} className="mt-0.5 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full border transition-all ${item.done ? "bg-violet-500 border-violet-500" : "border-white/20 hover:border-white/40"}`}>
                    {item.done && <Icon name="Check" size={10} className="text-white m-auto mt-0.5" />}
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  {item.time && <span className="text-violet-400 text-xs mr-1.5">{item.time}</span>}
                  <span className={`text-xs ${item.done ? "line-through text-white/30" : "text-white/80"}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Icon name="X" size={12} className="text-white/30 hover:text-white/60" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
