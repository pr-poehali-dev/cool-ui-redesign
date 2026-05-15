import Icon from "@/components/ui/icon"

export default function AboutSection() {
  return (
    <section id="about" className="relative z-20 px-8 py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Раздел</p>
        <h2 className="text-3xl font-light text-white">
          Обо <span className="font-medium italic">мне</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 flex items-start justify-center md:justify-start">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/40 to-purple-800/40 border border-white/20 flex items-center justify-center">
            <Icon name="User" size={40} className="text-white/60" />
          </div>
        </div>

        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-white text-xl font-medium mb-1">Привет, это я!</h3>
          <p className="text-white/50 text-xs mb-4 uppercase tracking-widest">Личный сайт</p>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Это мой личный уголок в интернете — место, где я собираю свои проекты, идеи и заметки.
            Сайт только для меня, поэтому здесь всё так, как мне удобно.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: "Folder", label: "Проекты", desc: "Мои начинания" },
              { icon: "StickyNote", label: "Заметки", desc: "Мысли и идеи" },
              { icon: "Lock", label: "Приватно", desc: "Только для меня" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <Icon name={item.icon as "Folder"} size={20} className="text-violet-400" />
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
