export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-11 p-6">
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-wide">Мой личный сайт</div>
        <nav className="flex gap-8">
          <a
            href="#projects"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Проекты
          </a>
          <a
            href="#about"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Обо мне
          </a>
          <a
            href="#notes"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Заметки
          </a>
        </nav>
      </div>
    </header>
  )
}