import { useState, useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

type Tag = "Планирую" | "В работе" | "Готово"

interface Project {
  id: number
  title: string
  description: string
  tag: Tag
  color: string
}

const TAGS: { label: Tag; icon: string; color: string }[] = [
  { label: "Планирую", icon: "Clock", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  { label: "В работе", icon: "Zap", color: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  { label: "Готово", icon: "CheckCircle2", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
]

const TAG_COLORS: Record<Tag, string> = {
  "Планирую": "from-blue-500/20 to-cyan-500/10",
  "В работе": "from-violet-500/20 to-purple-500/10",
  "Готово": "from-emerald-500/20 to-teal-500/10",
}

const initialProjects: Project[] = [
  { id: 1, title: "Идея #1", description: "Описание первого проекта или идеи", tag: "В работе", color: TAG_COLORS["В работе"] },
  { id: 2, title: "Идея #2", description: "Описание второго проекта или идеи", tag: "Планирую", color: TAG_COLORS["Планирую"] },
  { id: 3, title: "Идея #3", description: "Описание третьего проекта или идеи", tag: "Готово", color: TAG_COLORS["Готово"] },
]

const STORAGE_KEY = "my_projects"

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialProjects
    } catch {
      return initialProjects
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const [editing, setEditing] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [tagPicker, setTagPicker] = useState<number | null>(null)
  const tagPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tagPickerRef.current && !tagPickerRef.current.contains(e.target as Node)) {
        setTagPicker(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const startEdit = (p: Project) => {
    setEditing(p.id)
    setEditTitle(p.title)
    setEditDesc(p.description)
    setTagPicker(null)
  }

  const saveEdit = (id: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: editTitle, description: editDesc } : p))
    )
    setEditing(null)
  }

  const changeTag = (id: number, tag: Tag) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tag, color: TAG_COLORS[tag] } : p))
    )
    setTagPicker(null)
  }

  const addProject = () => {
    const id = Date.now()
    const newProject: Project = {
      id,
      title: "Новый проект",
      description: "Добавьте описание",
      tag: "Планирую",
      color: TAG_COLORS["Планирую"],
    }
    setProjects((prev) => [...prev, newProject])
    setTimeout(() => {
      setEditing(id)
      setEditTitle("Новый проект")
      setEditDesc("Добавьте описание")
    }, 0)
  }

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <section id="projects" className="relative z-20 px-8 py-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Раздел</p>
          <h2 className="text-3xl font-light text-white">
            Мои <span className="font-medium italic">проекты</span>
          </h2>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-white/70 text-xs hover:border-white/40 hover:text-white transition-all duration-200"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => {
          const tagMeta = TAGS.find((t) => t.label === p.tag) ?? TAGS[0]
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl bg-gradient-to-br ${p.color} border border-white/10 backdrop-blur-sm p-6 group`}
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(p)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon name="Pencil" size={12} className="text-white/70" />
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/30 transition-colors"
                >
                  <Icon name="Trash2" size={12} className="text-white/70" />
                </button>
              </div>

              {editing === p.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 outline-none border border-white/20 focus:border-white/40"
                    autoFocus
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="bg-white/10 text-white/70 text-xs rounded-lg px-3 py-1.5 outline-none border border-white/20 focus:border-white/40 resize-none"
                  />
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="self-end px-4 py-1 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors"
                  >
                    Сохранить
                  </button>
                </div>
              ) : (
                <>
                  {/* Кликабельный статус */}
                  <div className="relative mb-3" ref={tagPicker === p.id ? tagPickerRef : null}>
                    <button
                      onClick={() => setTagPicker(tagPicker === p.id ? null : p.id)}
                      className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-0.5 transition-all hover:opacity-80 cursor-pointer ${tagMeta.color}`}
                    >
                      <Icon name={tagMeta.icon as "Clock"} size={10} />
                      {p.tag}
                      <Icon name="ChevronDown" size={10} className="opacity-60" />
                    </button>

                    {tagPicker === p.id && (
                      <div className="absolute top-7 left-0 z-50 bg-neutral-900 border border-white/15 rounded-xl p-1.5 flex flex-col gap-1 shadow-xl min-w-[130px]">
                        {TAGS.map((t) => (
                          <button
                            key={t.label}
                            onClick={() => changeTag(p.id, t.label)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/10 w-full text-left ${p.tag === t.label ? "bg-white/10" : ""}`}
                          >
                            <Icon name={t.icon as "Clock"} size={12} className={t.color.split(" ")[0]} />
                            <span className="text-white/80">{t.label}</span>
                            {p.tag === t.label && <Icon name="Check" size={10} className="ml-auto text-white/40" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-white font-medium text-base mb-1">{p.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{p.description}</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
