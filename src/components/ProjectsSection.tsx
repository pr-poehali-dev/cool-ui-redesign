import { useState } from "react"
import Icon from "@/components/ui/icon"

const initialProjects = [
  {
    id: 1,
    title: "Идея #1",
    description: "Описание первого проекта или идеи",
    tag: "В работе",
    color: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: 2,
    title: "Идея #2",
    description: "Описание второго проекта или идеи",
    tag: "Планирую",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: 3,
    title: "Идея #3",
    description: "Описание третьего проекта или идеи",
    tag: "Готово",
    color: "from-emerald-500/20 to-teal-500/10",
  },
]

export default function ProjectsSection() {
  const [projects, setProjects] = useState(initialProjects)
  const [editing, setEditing] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")

  const startEdit = (p: (typeof initialProjects)[0]) => {
    setEditing(p.id)
    setEditTitle(p.title)
    setEditDesc(p.description)
  }

  const saveEdit = (id: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: editTitle, description: editDesc } : p))
    )
    setEditing(null)
  }

  const addProject = () => {
    const id = Date.now()
    setProjects((prev) => [
      ...prev,
      {
        id,
        title: "Новый проект",
        description: "Добавьте описание",
        tag: "Планирую",
        color: "from-pink-500/20 to-rose-500/10",
      },
    ])
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
        {projects.map((p) => (
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
                <span className="inline-block text-xs text-white/50 border border-white/10 rounded-full px-2 py-0.5 mb-3">
                  {p.tag}
                </span>
                <h3 className="text-white font-medium text-base mb-1">{p.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{p.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
