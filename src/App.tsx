import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { Check, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BannerArt } from '@/components/BannerArt'
import { ScreenUI, type ScreenKind } from '@/components/ScreenUI'
import { aiArt, heroArt, laptopArt, parentArt, studentArt } from '@/art'

const telegram = 'https://t.me/MetricaEduBot'
const email = 'metrica_start@mail.ru'
const privacy = 'https://outputs-livid-delta.vercel.app/legal/#privacy'

const nav = [['audiences', 'Для кого'], ['how', 'Как это работает'], ['try', 'Попробовать'], ['faq', 'Вопросы']]

function Logo() {
  return <span className="logo"><img src="/brand/mark.svg" alt="" width="120" height="63" /><span>Метрика</span></span>
}

function ApplyButton({ className = '' }: { className?: string }) {
  return <Button asChild size="lg" className={`cta ${className}`}>
    <a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку</a>
  </Button>
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    const on = () => setReduced(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ——— Для кого: три карточки ложатся стопкой при прокрутке ——— */

const audiences = [
  { id: 'tutor', tone: 'card-blue', art: laptopArt, screen: <ScreenUI kind="lessons" />, title: <>Новое <em>измерение</em> для занятий</>, text: 'Репетитору — расписание, ученики, материалы и домашние задания в одной платформе.', cta: true },
  { id: 'student', tone: 'card-violet', art: studentArt, title: <>Ваши уроки <em>в новом</em> месте</>, text: 'Ученику — ближайшее занятие, материалы, домашнее задание и звёзды за прогресс в личном кабинете.' },
  { id: 'parent', tone: 'card-navy', art: parentArt, title: <>Больше <em>знаний</em> для ваших детей</>, text: 'Родителю — проведённые и ближайшие занятия, оценки и комментарии репетитора. Проще заботиться об образовании ребёнка.' },
]

function Audiences() {
  return <section id="audiences" className="audiences" aria-label="Для кого Метрика">
    <div className="container stack">
      {audiences.map((a, i) => <article key={a.id} className={`aud-card ${a.tone}`} style={{ '--i': i } as CSSProperties}>
        <div className="aud-copy">
          <h2>{a.title}</h2>
          <p>{a.text}</p>
          {a.cta && <ApplyButton />}
        </div>
        <BannerArt art={a.art} screen={a.screen} className="aud-art" />
      </article>)}
    </div>
  </section>
}

/* ——— Как это работает: экран закреплён, пункты раскрываются по прокрутке ——— */

const features: { title: string; text: string; screen: ScreenKind | null }[] = [
  { title: 'Расписание и занятия', text: 'Неделя занятий, ближайший урок, материалы и последнее домашнее задание ученика — перед глазами.', screen: 'lessons' },
  { title: 'Ученики', text: 'Все ученики с предметом, классом и статусом: нужно проверить ДЗ, занятие завтра, ожидаем ответ.', screen: 'students' },
  { title: 'Проверка ДЗ', text: 'Работы, которые ждут проверки. После проверки ученик видит оценку и комментарий, прогресс обновляется.', screen: 'homework' },
  { title: 'ИИ-помощник', text: 'Помогает репетитору с проверкой домашних заданий, чтобы больше времени оставалось на учеников.', screen: null },
  { title: 'Прогресс и награды', text: 'Ученик видит прогресс и звёзды до награды, родитель — оценки и комментарии репетитора.', screen: 'progress' },
]

// Сцена: одна неподвижная основа (волна-«М» и орбиты), меняется только то, что на ней.
function Stage({ index }: { index: number }) {
  return <div className="stage">
    <BannerArt art={aiArt} className="stage-base" only={l => l.kind !== 'masked'} />
    <BannerArt art={aiArt} className={`stage-ai ${features[index].screen ? '' : 'is-active'}`} only={l => l.kind === 'masked'} />
    {features.map((f, i) => f.screen && <div key={f.title} className={`stage-window ${i === index ? 'is-active' : ''}`}><ScreenUI kind={f.screen} /></div>)}
  </div>
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el || !el.offsetParent) return
      const total = el.offsetHeight - window.innerHeight
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / total, 0), 0.9999) * features.length
      setActive(Math.floor(p))
      setProgress(p % 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  function jump(i: number) {
    const el = ref.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + total * (i + 0.05) / features.length })
  }

  return <section id="how" className="how">
    <div className="container">
      <h2 className="section-title">Как это <em>работает</em></h2>
      <p className="section-lead">Всё, что нужно для занятий, — в одном рабочем пространстве.</p>
    </div>
    <div ref={ref} className="how-scroll" style={{ height: `${features.length * 70 + 40}vh` }}>
      <div className="how-pin">
        <div className="container how-grid">
          <ol className="how-list">
            {features.map((f, i) => <li key={f.title}>
              {i === active
                ? <div className="how-item is-active" aria-current="step">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <span className="how-bar"><span style={{ width: `${Math.max(progress, 0.04) * 100}%` }} /></span>
                </div>
                : <button type="button" className="how-item" onClick={() => jump(i)}><h3>{f.title}</h3></button>}
            </li>)}
          </ol>
          <Stage index={active} />
        </div>
      </div>
    </div>
    <ol className="container how-mobile">
      {features.map(f => <li key={f.title}>
        <div className="stage stage-static">
          <BannerArt art={aiArt} className="stage-base" only={l => f.screen ? l.kind !== 'masked' : true} />
          {f.screen && <div className="stage-window is-active"><ScreenUI kind={f.screen} /></div>}
        </div>
        <h3>{f.title}</h3>
        <p>{f.text}</p>
      </li>)}
    </ol>
  </section>
}

/* ——— Шагните в новое измерение: пять живых плиток ——— */

function SlideToCheck({ onUse }: { onUse: () => void }) {
  const [x, setX] = useState(0)
  const [done, setDone] = useState(false)
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ start: number; max: number } | null>(null)
  function down(e: ReactPointerEvent) {
    if (done || !track.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { start: e.clientX - x, max: track.current.offsetWidth - 52 }
  }
  function move(e: ReactPointerEvent) {
    if (drag.current) setX(Math.min(Math.max(e.clientX - drag.current.start, 0), drag.current.max))
  }
  function finish() { setDone(true); onUse() }
  function up() {
    if (!drag.current) return
    if (x > drag.current.max * 0.85) { setX(drag.current.max); finish() } else setX(0)
    drag.current = null
  }
  return <div className="w-card w-check">
    <p className="w-meta">Математика · Артём Соловьёв · 7 класс</p>
    <p className="w-title">Квадратные уравнения</p>
    <p className="w-meta">Решение_Артем.pdf · отправлено сегодня в 11:40</p>
    <div ref={track} className={`w-track ${done ? 'is-done' : ''}`}>
      <span>{done ? 'Проверено — ученик увидит оценку' : 'Отметить проверенным'}</span>
      {!done && <button type="button" aria-label="Отметить проверенным" className="w-knob" onPointerDown={down} onPointerMove={move} onPointerUp={up} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') finish() }} style={{ transform: `translateX(${x}px)` }}><Check /></button>}
    </div>
    {done && <button type="button" className="w-reset" onClick={() => { setDone(false); setX(0) }}>Вернуть на проверку</button>}
  </div>
}

function StarCounter({ onUse }: { onUse: () => void }) {
  const [stars, setStars] = useState(18)
  const goal = 30
  return <div className="w-stars">
    <p className="w-stars-num"><span key={stars} className="roll">{stars}</span><small>из {goal}</small></p>
    <p className="w-stars-label">звёзд до награды</p>
    <span className="w-stars-bar"><span style={{ width: `${(stars / goal) * 100}%` }} /></span>
    <button type="button" className="w-chip" onClick={() => { setStars(s => (s >= goal ? 18 : s + 1)); onUse() }}>{stars >= goal ? 'Начать заново' : '+ звезда'}</button>
  </div>
}

function WeekStrip({ onUse }: { onUse: () => void }) {
  const days = [['ПН', 28, []], ['ВТ', 29, ['16:00 · Арина', '18:00 · Артём']], ['СР', 30, ['15:00 · Артём']], ['ЧТ', 1, ['17:30 · Александр']], ['ПТ', 2, ['16:00 · Елизавета']], ['СБ', 3, []], ['ВС', 4, []]] as const
  const [day, setDay] = useState(2)
  return <div className="w-week">
    <div className="w-days">
      {days.map(([d, n, l], i) => <button key={d} type="button" aria-pressed={day === i} onClick={() => { setDay(i); onUse() }}>
        <span>{d}</span><b>{n}</b><i className={l.length ? 'has' : ''} />
      </button>)}
    </div>
    <ul className="w-lessons">
      {days[day][2].length ? days[day][2].map(l => <li key={l} className="pop">{l}</li>) : <li className="pop is-empty">Занятий нет</li>}
    </ul>
  </div>
}

function StudentFilter({ onUse }: { onUse: () => void }) {
  const students = [['Артём Соловьёв', 'Математика · 7 класс', 'Нужно проверить ДЗ'], ['Арина Мошкова', 'Математика · 6 класс', 'Занятие завтра'], ['Александр Смуров', 'Физика · 9 класс', 'Все задания проверены'], ['Елизавета Терехова', 'Математика · 8 класс', 'Ожидаем ответ']]
  const filters = ['Все', 'Нужно проверить ДЗ', 'Занятие завтра']
  const [f, setF] = useState(0)
  const list = f === 0 ? students : students.filter(s => s[2] === filters[f])
  return <div className="w-students">
    <div className="w-filters">{filters.map((t, i) => <button key={t} type="button" aria-pressed={f === i} onClick={() => { setF(i); onUse() }}>{t}</button>)}</div>
    <ul>{list.map(([n, s, st]) => <li key={n} className="pop w-card w-row"><span><b>{n}</b><small>{s}</small></span><em>{st}</em></li>)}</ul>
  </div>
}

function ParentCards({ onUse }: { onUse: () => void }) {
  const cards = [['Последняя работа', 'Квадратные уравнения · оценка 5', '«Хорошая работа! Все основные шаги верны.»'], ['Учёба в ритме', '12 занятий проведено', 'Следующее — завтра в 16:00'], ['Ближайшие занятия', 'Математика · завтра, 16:00', 'Артём Соловьёв · 7 класс']]
  const [top, setTop] = useState(0)
  return <button type="button" className="w-deck" aria-label="Показать следующую карточку" onClick={() => { setTop(t => (t + 1) % cards.length); onUse() }}>
    {cards.map((c, i) => {
      const pos = (i - top + cards.length) % cards.length
      return <span key={c[0]} className="w-card w-deck-card" style={{ transform: `translateY(${pos * 14}px) scale(${1 - pos * 0.05})`, zIndex: cards.length - pos, opacity: pos > 1 ? 0.55 : 1 }}>
        <small>{c[0]}</small><b>{c[1]}</b><span>{c[2]}</span>
      </span>
    })}
  </button>
}

const dims = [
  { dim: 'Без рутинных проверок', name: 'Проверка домашних заданий', hint: 'Перетащите кнопку вправо', W: SlideToCheck, wide: true },
  { dim: 'Измерение роста', name: 'Звёзды за прогресс ученика', hint: 'Нажмите «+ звезда»', W: StarCounter },
  { dim: 'Измерение времени', name: 'Расписание недели', hint: 'Выберите день', W: WeekStrip },
  { dim: 'Измерение учеников', name: 'Все ученики и их статусы', hint: 'Отфильтруйте список', W: StudentFilter },
  { dim: 'Измерение семьи', name: 'Что видит родитель', hint: 'Нажмите на карточку', W: ParentCards },
]

function Dimensions() {
  const [open, setOpen] = useState<boolean[]>(dims.map(() => false))
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [tilt, setTilt] = useState(1)
  const count = open.filter(Boolean).length
  const all = count === dims.length

  // Погружение: плоскость плиток наклонена и выпрямляется, пока блок входит в экран.
  useEffect(() => {
    if (reduced) { setTilt(0); return }
    function onScroll() {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      setTilt(Math.min(Math.max((top - window.innerHeight * 0.5) / (window.innerHeight * 0.45), 0), 1))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  const use = (i: number) => () => setOpen(o => (o[i] ? o : o.map((v, j) => (j === i ? true : v))))

  return <section id="try" className="dims">
    <div className="container">
      <div className="dims-head">
        <div>
          <h2 className="section-title">Шагните в <em>новое измерение</em></h2>
          <p className="section-lead">Пять измерений работы репетитора — в одной Метрике. Откройте каждое: нажмите, перетащите, полистайте.</p>
        </div>
        <p className="dims-count" aria-live="polite">
          <span className="dims-dots" aria-hidden="true">{open.map((v, i) => <i key={i} className={v ? 'on' : ''} />)}</span>
          Открыто {count} из {dims.length}
        </p>
      </div>
      <div className="dims-space">
        <div ref={ref} className="dims-grid" style={{ transform: `rotateX(${tilt * 28}deg) scale(${1 - tilt * 0.08})`, opacity: 1 - tilt * 0.4 }}>
          {dims.map((d, i) => <figure key={d.dim} className={`dim ${open[i] ? 'is-open' : ''} ${d.wide ? 'dim-wide' : ''}`}>
            <span className="dim-mark" aria-label={open[i] ? 'открыто' : 'не открыто'}>{open[i] ? <Check /> : i + 1}</span>
            <div className="dim-body"><d.W onUse={use(i)} /></div>
            <figcaption><b>{d.dim}</b><span>{open[i] ? d.name : d.hint}</span></figcaption>
          </figure>)}
        </div>
      </div>
      <div className={`dims-finale ${all ? 'is-shown' : ''}`} aria-hidden={!all}>
        <p>Все пять измерений <em>открыты</em></p>
        <Button asChild size="lg" className="cta cta-blue"><a href={telegram} target="_blank" rel="noopener noreferrer" tabIndex={all ? 0 : -1}>Оставить заявку</a></Button>
      </div>
    </div>
  </section>
}

/* ——— Вопросы ——— */

const faq = [
  { q: 'Для кого Метрика?', a: 'Для онлайн-репетиторов: занятия, ученики, домашние задания и прогресс в одном пространстве. Ученик и родитель видят свою часть процесса.' },
  { q: 'Что видят ученик и родитель?', a: 'Ученик — ближайшее занятие, материалы, домашнее задание и прогресс. Родитель — проведённые и ближайшие занятия, последнюю работу с оценкой и комментарием репетитора.' },
  { q: 'Как оставить заявку?', a: 'Нажмите «Оставить заявку» — откроется Telegram-бот Метрики.' },
  { q: 'Где узнать условия доступа?', a: `У команды Метрики в Telegram или по почте ${email}.` },
]

function Faq() {
  return <section id="faq" className="faq">
    <div className="container faq-inner">
      <h2 className="section-title">Вопросы</h2>
      <Accordion type="single" collapsible className="faq-list">
        {faq.map((f, i) => <AccordionItem key={f.q} value={`q${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>)}
      </Accordion>
      <p className="faq-more">Не нашли ответ? <a href={telegram} target="_blank" rel="noopener noreferrer">Напишите нам в Telegram</a> или на <span className="select-all">{email}</span></p>
    </div>
  </section>
}

/* ——— Страница ——— */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="brand" aria-label="Метрика — на главную"><Logo /></a>
        <nav className="desktop-nav" aria-label="Основная навигация">{nav.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}</nav>
        <div className="header-actions">
          <ApplyButton className="header-cta" />
          <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav container" aria-label="Мобильная навигация">{nav.map(([id, t]) => <a key={id} onClick={closeMenu} href={`#${id}`}>{t}</a>)}</nav>}
    </header>

    <main id="main">
      <section className="hero">
        <div className="container hero-copy">
          <h1>Новое <em>измерение</em> обучения</h1>
          <p className="hero-lead">Платформа, где собрано<br /> всё для работы репетитора</p>
          <div className="button-row"><ApplyButton /><a className="text-link" href="#how">Как это работает</a></div>
        </div>
        <BannerArt art={heroArt} className="hero-art" />
      </section>

      <Audiences />
      <HowItWorks />
      <Dimensions />
      <Faq />

      <section className="final">
        <div className="container final-inner">
          <div className="final-copy">
            <h2>Откройте новое <em>измерение</em> занятий</h2>
            <p>Познакомьтесь с Метрикой — оставьте заявку в Telegram.</p>
            <ApplyButton />
          </div>
          <div className="final-objects" aria-hidden="true">
            <span className="final-orbit" />
            <img className="art-float" src="/brand/student/objects.webp" alt="" width="1536" height="1024" />
            <img className="art-float final-obj-2" src="/brand/parent/objects.webp" alt="" width="1254" height="1254" />
          </div>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="container footer-inner">
        <a href="#" className="footer-mark" aria-label="Метрика — на главную"><img src="/brand/mark.svg" alt="" width="44" height="23" /></a>
        <nav aria-label="Разделы"><b>Разделы</b>{nav.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}</nav>
        <div><b>Связь</b><a href={telegram} target="_blank" rel="noopener noreferrer">Telegram</a><span className="select-all">{email}</span></div>
        <div className="footer-docs"><b>Документы</b><a href={privacy} target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a></div>
        <span className="footer-copy">© 2026 Метрика</span>
      </div>
    </footer>

    <div className="mobile-cta"><ApplyButton /></div>
  </>
}

