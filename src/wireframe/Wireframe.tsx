import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const telegram = 'https://t.me/MetricaEduBot'
const container = 'mx-auto w-[min(1180px,calc(100%-40px))]'

const blocks = [
  { id: 'hero', n: '01', name: 'Баннер' },
  { id: 'audiences', n: '02', name: 'Для кого — карточки стопкой' },
  { id: 'how', n: '03', name: 'Как это работает' },
  { id: 'try', n: '04', name: 'Шагните в новое измерение' },
  { id: 'faq', n: '05', name: 'Вопросы' },
  { id: 'final', n: '06', name: 'Финальная заявка' },
]

// Статус утверждения: «в демо» — увидели в существующем демо, «уточнить» — нужно подтверждение команды.
function Status({ ok, children }: { ok?: boolean; children: ReactNode }) {
  return <Badge variant={ok ? 'secondary' : 'outline'} className={`wf-svc ${ok ? '' : 'border-dashed'}`}>{ok ? <Check /> : '?'} {children}</Badge>
}

// Пояснение для согласования: какой приём из референсов здесь используется и что будет в дизайне.
function Note({ children }: { children: ReactNode }) {
  return <aside className="wf-svc rounded-md border border-dashed border-neutral-400 bg-white/80 px-3 py-2 text-xs leading-relaxed text-neutral-600">{children}</aside>
}

function Ph({ label, className = '', bottom = false }: { label: string; className?: string; bottom?: boolean }) {
  return <div className={`wf-ph relative flex justify-center rounded-lg ${bottom ? 'items-end pb-4' : 'items-center'} ${className}`}>
    <span className="mx-3 rounded bg-white px-2 py-1 text-center text-[11px] leading-snug text-neutral-600 shadow-sm">{label}</span>
  </div>
}

function Block({ id, n, name, bg, children }: { id: string; n: string; name: string; bg: string; children: ReactNode }) {
  return <section id={id} className="overflow-x-clip py-14 md:py-20">
    <div className={container}>
      <div className="wf-svc mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-neutral-500">
        <span className="font-semibold text-neutral-900">{n} · {name}</span>
        <span className="normal-case tracking-normal">Фон в дизайне: {bg}</span>
      </div>
      {children}
    </div>
  </section>
}

const audiences = [
  { who: 'Репетитору', title: <>Новое <em>измерение</em> для занятий</>, text: 'Расписание, ученики и домашние задания — в одном рабочем пространстве.', visual: 'Фото или 3D внутри буквы М: ноутбук с занятием (сюжет Figma 1351:401)', tone: 'bg-neutral-200', cta: true },
  { who: 'Ученику', title: <>Ваши уроки <em>в новом месте</em></>, text: 'Ближайшее занятие, материалы, домашнее задание и звёзды за прогресс — в личном кабинете.', visual: 'Фото или 3D внутри буквы М: ученик с планшетом (сюжет Figma 1215:326)', tone: 'bg-neutral-300', cta: false },
  { who: 'Родителю', title: <>Больше знаний <em>для ваших детей</em></>, text: 'Проведённые и ближайшие занятия, оценки и комментарии репетитора — на виду.', visual: 'Фото или 3D внутри буквы М: телефон с прогрессом (сюжет Figma 1351:196)', tone: 'bg-neutral-400', cta: false },
]

const features = [
  { title: 'Расписание и занятия', text: 'Неделя занятий, ближайший урок, материалы и последнее домашнее задание ученика — перед глазами.', screen: 'Экран демо «Занятия под контролем»', ok: true },
  { title: 'Ученики', text: 'Все ученики с предметом, классом и статусом: нужно проверить ДЗ, занятие завтра, ожидаем ответ.', screen: 'Экран демо «Мои ученики»', ok: true },
  { title: 'Проверка ДЗ', text: 'Работы, которые ждут проверки. После проверки ученик видит оценку и комментарий, прогресс обновляется.', screen: 'Экран демо «Домашние задания»', ok: true },
  { title: 'ИИ-помощник', text: 'Что именно делает ИИ при проверке — нужно подтвердить у команды. В демо этой функции нет.', screen: 'Экрана нет в демо', ok: false },
  { title: 'Прогресс и награды', text: 'Ученик видит прогресс и звёзды до награды, родитель — оценки и комментарии репетитора.', screen: 'Экраны демо ученика и родителя', ok: true },
]

const faq = [
  { q: 'Для кого Метрика?', a: 'Для онлайн-репетиторов: занятия, ученики, домашние задания и прогресс в одном пространстве. Ученик и родитель видят свою часть процесса.', ok: true },
  { q: 'Что видят ученик и родитель?', a: 'Ученик — ближайшее занятие, материалы, домашнее задание и прогресс. Родитель — проведённые и ближайшие занятия, последнюю работу с оценкой и комментарием репетитора.', ok: true },
  { q: 'Кто ставит оценку — ИИ или репетитор?', a: 'Ответ нужно подтвердить у команды: что именно делает ИИ при проверке и остаётся ли решение за репетитором.', ok: false },
  { q: 'Можно посмотреть платформу до заявки?', a: 'Да, в интерактивном демо: экраны репетитора, ученика и родителя.', ok: true },
  { q: 'Как оставить заявку?', a: 'Через Telegram-бота Метрики по кнопке «Оставить заявку».', ok: true },
  { q: 'Где узнать условия доступа?', a: 'У команды Метрики через Telegram или по почте metrica_start@mail.ru.', ok: true },
]

// Блок 3: активный пункт меняется по мере прокрутки, как на tokens.studio.
function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const p = Math.min(Math.max(-rect.top / total, 0), 0.9999) * features.length
      setActive(Math.floor(p))
      setProgress(p % 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function jump(i: number) {
    const el = ref.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + total * (i + 0.05) / features.length })
  }

  return <>
    {/* Компьютер: длинная секция, внутри закреплённый экран */}
    <div ref={ref} className="relative hidden md:block" style={{ height: `${features.length * 70 + 30}vh` }}>
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center">
        <div className="grid w-full grid-cols-[0.95fr_1.05fr] items-center gap-12">
          <ol className="space-y-2">
            {features.map((f, i) => <li key={f.title}>
              {i === active
                ? <div className="rounded-2xl bg-neutral-100 p-6">
                  <h3 className="wf-display text-4xl">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">{f.text}</p>
                  <div className="mt-3"><Status ok={f.ok}>{f.ok ? 'есть в демо' : 'уточнить у команды'}</Status></div>
                  <div className="mt-5 h-1 rounded-full bg-neutral-300"><div className="h-1 rounded-full bg-neutral-900" style={{ width: `${Math.max(progress, 0.04) * 100}%` }} /></div>
                </div>
                : <button type="button" onClick={() => jump(i)} className="wf-display px-6 py-1 text-left text-3xl text-neutral-300 hover:text-neutral-500">{f.title}</button>}
            </li>)}
          </ol>
          <div className="relative aspect-[6/5]">
            <div className="wf-m absolute -left-[6%] top-[4%] h-[92%] w-[112%]" aria-hidden="true" />
            <div className="absolute right-0 top-[12%] h-[76%] w-[78%] overflow-hidden rounded-2xl border-4 border-neutral-900 bg-white shadow-xl">
              <Ph label={`${features[active].screen} — меняется вместе с пунктом слева`} className="h-full rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Телефон: пункты друг под другом, у каждого свой экран */}
    <ol className="space-y-10 md:hidden">
      {features.map(f => <li key={f.title}>
        <div className="relative aspect-[5/4]">
          <div className="wf-m absolute inset-x-[-8%] inset-y-[4%]" aria-hidden="true" />
          <div className="absolute inset-x-[10%] inset-y-[12%] overflow-hidden rounded-xl border-4 border-neutral-900 bg-white"><Ph label={f.screen} className="h-full rounded-none" /></div>
        </div>
        <h3 className="wf-display mt-5 text-3xl">{f.title}</h3>
        <p className="mt-2 text-sm text-neutral-700">{f.text}</p>
        <div className="mt-2"><Status ok={f.ok}>{f.ok ? 'есть в демо' : 'уточнить у команды'}</Status></div>
      </li>)}
    </ol>
  </>
}

// Блок 4: мини-интерактивы в духе bencho.dev — посетитель трогает рабочие моменты репетитора.
// Все данные — демонстрационные, из существующего демо.
function Tile({ n, dim, name, hint, open, className = '', children }: { n: number; dim: string; name: string; hint: string; open: boolean; className?: string; children: ReactNode }) {
  return <figure className={`group relative flex min-h-72 flex-col rounded-3xl p-5 transition-colors duration-500 ${open ? 'bg-neutral-200' : 'bg-neutral-100 hover:bg-neutral-200/60'} ${className}`}>
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs uppercase tracking-widest text-neutral-500">Измерение {n}</p>
      <span className={`flex size-6 items-center justify-center rounded-full text-xs transition-all duration-500 ${open ? 'scale-100 bg-neutral-900 text-white' : 'scale-90 border border-neutral-300 text-neutral-400'}`} aria-label={open ? 'открыто' : 'не открыто'}>{open ? <Check className="size-3.5" /> : n}</span>
    </div>
    <div className="flex flex-1 items-center justify-center py-4">{children}</div>
    <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><span className="wf-display text-2xl">{dim}</span><span className="text-xs text-neutral-500">{open ? name : hint}</span></figcaption>
  </figure>
}

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
    if (!drag.current) return
    setX(Math.min(Math.max(e.clientX - drag.current.start, 0), drag.current.max))
  }
  function up() {
    if (!drag.current) return
    if (x > drag.current.max * 0.85) { setX(drag.current.max); setDone(true); onUse() } else setX(0)
    drag.current = null
  }
  return <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-sm">
    <p className="text-xs text-neutral-500">Математика · Артём Соловьёв · 7 класс</p>
    <p className="mt-1 font-semibold">Квадратные уравнения</p>
    <p className="text-xs text-neutral-500">Решение_Артем.pdf · отправлено сегодня в 11:40</p>
    <div ref={track} className={`relative mt-4 h-12 overflow-hidden rounded-full ${done ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}>
      <span className={`absolute inset-0 flex items-center justify-center text-sm ${done ? 'px-4' : 'pl-14 pr-4'}`}>{done ? 'Проверено — ученик увидит оценку' : 'Отметить проверенным →'}</span>
      {!done && <button type="button" aria-label="Отметить проверенным" onPointerDown={down} onPointerMove={move} onPointerUp={up} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setDone(true); onUse() } }} className="absolute left-0.5 top-0.5 flex size-11 touch-none items-center justify-center rounded-full bg-neutral-900 text-white transition-transform" style={{ transform: `translateX(${x}px)` }}><Check className="size-5" /></button>}
    </div>
    {done && <button type="button" className="mt-3 text-xs text-neutral-500 underline" onClick={() => { setDone(false); setX(0) }}>Вернуть на проверку</button>}
  </div>
}

function StarCounter({ onUse }: { onUse: () => void }) {
  const [stars, setStars] = useState(18)
  const goal = 30
  return <div className="w-full max-w-56 text-center">
    <div className="flex items-end justify-center gap-1 tabular-nums">
      <span key={stars} className="wf-roll wf-display text-7xl">{stars}</span>
      <span className="wf-display pb-2 text-2xl text-neutral-400">/ {goal}</span>
    </div>
    <p className="mt-1 text-xs text-neutral-500">звёзд до награды</p>
    <div className="mt-4 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-neutral-900 transition-all duration-500" style={{ width: `${(stars / goal) * 100}%` }} /></div>
    <Button size="sm" variant="outline" className="mt-4 bg-white" onClick={() => { setStars(s => (s >= goal ? 18 : s + 1)); onUse() }}>{stars >= goal ? 'Начать заново' : '+ звезда'}</Button>
  </div>
}

function WeekStrip({ onUse }: { onUse: () => void }) {
  const days = [['ПН', 28, []], ['ВТ', 29, ['16:00 · Арина', '18:00 · Артём']], ['СР', 30, ['15:00 · Артём']], ['ЧТ', 1, ['17:30 · Александр']], ['ПТ', 2, ['16:00 · Елизавета']], ['СБ', 3, []], ['ВС', 4, []]] as const
  const [day, setDay] = useState(2)
  return <div className="w-full max-w-sm">
    <div className="grid grid-cols-7 gap-1">
      {days.map(([d, n, l], i) => <button key={d} type="button" onClick={() => { setDay(i); onUse() }} aria-pressed={day === i} className={`flex flex-col items-center rounded-xl py-2 text-xs transition-colors ${day === i ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}>
        <span className="opacity-70">{d}</span><span className="text-base font-semibold">{n}</span><span className={`mt-1 size-1.5 rounded-full ${l.length ? (day === i ? 'bg-white' : 'bg-neutral-900') : 'bg-transparent'}`} />
      </button>)}
    </div>
    <ul className="mt-3 min-h-16 space-y-1.5">
      {days[day][2].length ? days[day][2].map(l => <li key={l} className="wf-pop rounded-xl bg-white px-3 py-2 text-sm">{l}</li>) : <li className="px-3 py-2 text-sm text-neutral-500">Занятий нет</li>}
    </ul>
  </div>
}

function StudentFilter({ onUse }: { onUse: () => void }) {
  const students = [['Артём Соловьёв', 'Математика · 7 класс', 'Нужно проверить ДЗ'], ['Арина Мошкова', 'Математика · 6 класс', 'Занятие завтра'], ['Александр Смуров', 'Физика · 9 класс', 'Все задания проверены'], ['Елизавета Терехова', 'Математика · 8 класс', 'Ожидаем ответ']]
  const filters = ['Все', 'Нужно проверить ДЗ', 'Занятие завтра']
  const [f, setF] = useState(0)
  const list = f === 0 ? students : students.filter(s => s[2] === filters[f])
  return <div className="w-full max-w-sm">
    <div className="flex flex-wrap gap-1.5">{filters.map((t, i) => <button key={t} type="button" onClick={() => { setF(i); onUse() }} aria-pressed={f === i} className={`rounded-full px-3 py-1 text-xs transition-colors ${f === i ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-50'}`}>{t}</button>)}</div>
    <ul className="mt-3 space-y-1.5">{list.map(([n, s, st]) => <li key={n} className="wf-pop flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2"><span className="min-w-0"><span className="block truncate text-sm font-medium">{n}</span><span className="block text-xs text-neutral-500">{s}</span></span><Badge variant="secondary" className="shrink-0">{st}</Badge></li>)}</ul>
  </div>
}

function ParentCards({ onUse }: { onUse: () => void }) {
  const cards = [['Последняя работа', 'Квадратные уравнения · оценка 5', '«Хорошая работа! Все основные шаги верны.»'], ['Учёба в ритме', '12 занятий проведено', 'Следующее — завтра в 16:00'], ['Ближайшие занятия', 'Математика · завтра, 16:00', 'Артём Соловьёв · 7 класс']]
  const [top, setTop] = useState(0)
  return <button type="button" onClick={() => { setTop(t => (t + 1) % cards.length); onUse() }} className="relative h-40 w-full max-w-xs" aria-label="Показать следующую карточку">
    {cards.map((c, i) => {
      const pos = (i - top + cards.length) % cards.length
      return <div key={c[0]} className="absolute inset-x-0 top-0 rounded-2xl bg-white p-4 text-left shadow-md transition-all duration-500" style={{ transform: `translateY(${pos * 14}px) scale(${1 - pos * 0.05})`, zIndex: cards.length - pos, opacity: pos > 1 ? 0.5 : 1 }}>
        <p className="text-xs text-neutral-500">{c[0]}</p><p className="mt-1 font-semibold">{c[1]}</p><p className="mt-1 text-sm text-neutral-600">{c[2]}</p>
      </div>
    })}
  </button>
}

const dims = [
  { dim: 'Без рутинных проверок', name: 'Проверка домашних заданий', hint: 'Перетащите кнопку вправо', wide: true },
  { dim: 'Измерение роста', name: 'Звёзды за прогресс ученика', hint: 'Нажмите «+ звезда»' },
  { dim: 'Измерение времени', name: 'Расписание недели', hint: 'Выберите день' },
  { dim: 'Измерение учеников', name: 'Все ученики и их статусы', hint: 'Отфильтруйте список' },
  { dim: 'Измерение семьи', name: 'Что видит родитель', hint: 'Нажмите на карточку' },
]

function Playground() {
  const [open, setOpen] = useState<boolean[]>(dims.map(() => false))
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState(1)
  const count = open.filter(Boolean).length

  // «Погружение»: плоскость плиток наклонена и выпрямляется, пока блок входит в экран.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTilt(0); return }
    function onScroll() {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      setTilt(Math.min(Math.max((top - window.innerHeight * 0.5) / (window.innerHeight * 0.45), 0), 1))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const use = (i: number) => () => setOpen(o => (o[i] ? o : o.map((v, j) => (j === i ? true : v))))
  const widgets = [SlideToCheck, StarCounter, WeekStrip, StudentFilter, ParentCards]

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 className="wf-display max-w-3xl text-[clamp(40px,5.5vw,72px)]">Шагните в <em>новое измерение</em></h2>
        <p className="mt-5 max-w-xl text-neutral-600">Пять измерений работы репетитора — в одной Метрике. Откройте каждое: нажмите, перетащите, полистайте. Данные — из демо.</p>
      </div>
      <div className="flex items-center gap-3" aria-live="polite">
        <div className="flex gap-1.5" aria-hidden="true">{open.map((v, i) => <span key={i} className={`h-2 w-6 rounded-full transition-colors duration-500 ${v ? 'bg-neutral-900' : 'bg-neutral-200'}`} />)}</div>
        <span className="text-sm tabular-nums text-neutral-600">Открыто {count} из {dims.length}</span>
      </div>
    </div>
    <div className="mt-10 [perspective:1400px]">
      <div ref={ref} className="grid gap-3 will-change-transform md:grid-cols-3" style={{ transform: `rotateX(${tilt * 28}deg) scale(${1 - tilt * 0.08})`, transformOrigin: '50% 0%', opacity: 1 - tilt * 0.35 }}>
        {dims.map((d, i) => { const W = widgets[i]; return <Tile key={d.dim} n={i + 1} dim={d.dim} name={d.name} hint={d.hint} open={open[i]} className={d.wide ? 'md:col-span-2' : ''}><W onUse={use(i)} /></Tile> })}
      </div>
    </div>
    <div className={`mt-3 overflow-hidden rounded-3xl bg-neutral-900 text-white transition-all duration-700 ${count === dims.length ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`} aria-hidden={count !== dims.length}>
      <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
        <p className="wf-display text-3xl sm:text-4xl">Все пять измерений <em>открыты</em></p>
        <Button asChild size="lg" variant="secondary" tabIndex={count === dims.length ? 0 : -1}><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
      </div>
    </div>
  </div>
}

export default function Wireframe() {
  const [notes, setNotes] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return <div className={notes ? '' : 'wf-notes-off'}>
    {/* Служебная панель согласования */}
    <div className="bg-neutral-900 text-neutral-100">
      <div className={`${container} flex flex-wrap items-center justify-between gap-3 py-3 text-xs`}>
        <p>{notes ? 'Показаны рабочие пометки: на сайте их не будет.' : 'Черновая схема страницы, версия 2. Серое с крестом — места для фото и 3D. Тёмные плашки — выбор варианта, на сайте их не будет.'}</p>
        <Button size="sm" variant="secondary" onClick={() => setNotes(!notes)}>{notes ? 'Скрыть пометки' : 'Показать рабочие пометки'}</Button>
      </div>
    </div>

    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        <a href="#" className="rounded-md border-2 border-neutral-900 px-2.5 py-1 text-sm font-black italic tracking-tight">[ЛОГО] МЕТРИКА</a>
        <nav className="hidden gap-6 text-sm md:flex" aria-label="Основная навигация">
          <a href="#audiences">Для кого</a><a href="#how">Как это работает</a><a href="#try">Попробовать</a><a href="#faq">Вопросы</a>
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className={`${container} flex flex-col gap-4 pb-5 text-sm md:hidden`} aria-label="Мобильная навигация">
        {[['audiences', 'Для кого'], ['how', 'Как это работает'], ['try', 'Попробовать'], ['faq', 'Вопросы']].map(([id, t]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t}</a>)}
      </nav>}
    </header>

    {/* Карта страницы */}
    <nav className="wf-svc border-b border-neutral-200 bg-neutral-50" aria-label="Карта страницы">
      <div className={`${container} flex gap-2 overflow-x-auto py-3 text-xs`}>
        {blocks.map(b => <a key={b.id} href={`#${b.id}`} className="shrink-0 rounded-full border border-neutral-300 bg-white px-3 py-1.5">{b.n} {b.name}</a>)}
      </div>
    </nav>

    <main>
      <Block id="hero" n="01" name="Баннер" bg="синий #025BFF — баннер из концепции, как уже сверстан">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-100 p-6 sm:p-10 lg:p-14">
          <div className="relative z-10 max-w-xl">
            <h1 className="wf-display text-[clamp(52px,8vw,112px)]">Новое<br /><em>измерение</em><br />обучения</h1>
            <p className="mt-6 max-w-md text-lg leading-snug">Платформа, где собрано всё для работы репетитора.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
              <Button asChild size="lg" variant="ghost"><a href="#how">Как это работает <ArrowDown /></a></Button>
            </div>
          </div>
          <Ph label="Баннер концепции: репетитор с ноутбуком, волна-М, орбиты, 3D-объекты — уходит за правый край" className="mt-8 aspect-[4/3] lg:absolute lg:-right-10 lg:bottom-0 lg:top-10 lg:mt-0 lg:aspect-auto lg:w-[55%]" bottom />
        </div>
        <div className="mt-6"><Note>Остаётся баннер из концепции Figma — уже сверстан на основной странице.</Note></div>
      </Block>

      <Block id="audiences" n="02" name="Для кого — карточки стопкой" bg="три карточки: синяя, фиолетовая, тёмно-синяя — как три баннера концепции">
        <div className="relative">
          {audiences.map((a, i) => <article key={a.who} className={`sticky mb-8 overflow-hidden rounded-3xl ${a.tone} p-6 sm:p-10 lg:p-14`} style={{ top: `${72 + i * 28}px` }}>
            <div className="grid min-h-[min(62vh,560px)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest">{a.who}</p>
                <h2 className="wf-display mt-3 text-[clamp(40px,6vw,84px)]">{a.title}</h2>
                <p className="mt-5 max-w-md text-base">{a.text}</p>
                {a.cta
                  ? <Button asChild size="lg" className="mt-7"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
                  : <Button asChild size="lg" variant="outline" className="mt-7 bg-transparent"><a href="#how">Как это работает <ArrowDown /></a></Button>}
              </div>
              <div className="relative aspect-[6/5]">
                <div className="wf-m wf-m-light absolute inset-x-0 inset-y-[10%]" aria-hidden="true" />
                <Ph label={a.visual} className="absolute inset-[18%] bg-transparent" />
              </div>
            </div>
          </article>)}
        </div>
        <Note><b>Референс 2 (tokens.studio):</b> большие карточки накладываются друг на друга при прокрутке. В каждой — огромный капс слева, справа наша буква М как подложка, внутри фото или 3D. Три карточки = три баннера концепции для трёх аудиторий.</Note>
      </Block>

      <Block id="how" n="03" name="Как это работает" bg="белый; буква М — синяя, экраны — настоящие из демо">
        <h2 className="wf-display max-w-3xl text-[clamp(40px,5.5vw,72px)]">Как это <em>работает</em></h2>
        <p className="mt-5 max-w-xl text-neutral-600">Всё, что нужно для занятий, — в одном рабочем пространстве.</p>
        <div className="mt-8"><HowItWorks /></div>
        <div className="mt-6"><Note><b>Референс 3 (tokens.studio):</b> при прокрутке экран справа закреплён, пункты слева по очереди раскрываются, полоска показывает прогресс. Экран вставлен в нашу букву М. Пункт можно нажать.</Note></div>
      </Block>

      <Block id="try" n="04" name="Шагните в новое измерение" bg="белый; плитки — светло-голубые, открытые — синие, акценты мятные">
        <Playground />
        <div className="mt-8"><Note><b>bencho.dev:</b> сетка плиток, в каждой — живое мини-действие. Плитки — пять «измерений» работы репетитора. Плоскость наклонена и выпрямляется при входе в блок — эффект погружения. Открытые измерения отмечаются, после всех пяти появляется заявка.</Note></div>
      </Block>

      <Block id="faq" n="05" name="Вопросы" bg="белый">
        <div className="mx-auto max-w-2xl">
          <h2 className="wf-display text-center text-[clamp(36px,4.5vw,56px)]">Вопросы</h2>
          <Accordion type="single" collapsible className="mt-10">
            {faq.map((f, i) => <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="py-5 text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="space-y-2 pb-5 text-neutral-600"><p>{f.a}</p>{!f.ok && <Status>ответ уточнить</Status>}</AccordionContent>
            </AccordionItem>)}
          </Accordion>
          <p className="mt-8 text-center text-sm text-neutral-600">Не нашли ответ? <a className="underline underline-offset-4" href={telegram} target="_blank" rel="noopener noreferrer">Напишите нам в Telegram</a> или на metrica_start@mail.ru</p>
        </div>
        <div className="mt-8"><Note><b>bencho.dev:</b> узкая колонка по центру, тонкие строки, без большого заголовка сбоку.</Note></div>
      </Block>

      <Block id="final" n="07" name="Финальная заявка" bg="синий, как баннер; объекты собираются на орбите">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-100 px-6 py-14 sm:px-12">
          <div className="wf-orbit pointer-events-none absolute -right-24 top-6 h-64 w-[34rem] rotate-12 opacity-70" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <h2 className="wf-display text-[clamp(44px,7vw,96px)]">Откройте новое <em>измерение занятий</em></h2>
            <p className="mt-5 text-neutral-600">Познакомьтесь с Метрикой — оставьте заявку в Telegram.</p>
            <Button asChild size="lg" className="mt-7"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
          </div>
          <div className="relative mt-10 flex gap-3 sm:absolute sm:bottom-10 sm:right-10 sm:mt-0 sm:w-56 sm:flex-col">
            <Ph label="3D: тетрадь с «5»" className="h-20 flex-1" /><Ph label="3D: монета с графиком" className="h-20 flex-1" />
          </div>
        </div>
      </Block>
    </main>

    <footer className="pb-24 pt-12 md:pb-14 md:pt-16">
      <div className={`${container} grid grid-cols-2 gap-x-6 gap-y-7 text-sm sm:grid-cols-[1fr_auto_auto_auto_1fr] sm:gap-14`}>
        <span className="wf-m wf-m-dark col-span-2 h-6 w-11 sm:col-span-1" aria-label="Метрика" role="img" />
        <nav aria-label="Разделы" className="flex flex-col gap-2"><span className="font-medium">Разделы</span>{[['audiences', 'Для кого'], ['how', 'Как это работает'], ['try', 'Попробовать'], ['faq', 'Вопросы']].map(([id, t]) => <a key={id} className="text-neutral-500 hover:text-neutral-900" href={`#${id}`}>{t}</a>)}</nav>
        <div className="flex flex-col gap-2"><span className="font-medium">Связь</span><a className="text-neutral-500 hover:text-neutral-900" href={telegram} target="_blank" rel="noopener noreferrer">Telegram</a><span className="select-all text-neutral-500">metrica_start@mail.ru</span></div>
        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1"><span className="font-medium">Документы</span><a className="text-neutral-500 hover:text-neutral-900" href="https://outputs-livid-delta.vercel.app/legal/#privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a></div>
        <span className="col-span-2 text-neutral-400 sm:col-span-1 sm:text-right">© 2026 Метрика</span>
      </div>
    </footer>

    {/* Телефон: закреплённая кнопка заявки */}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <Button asChild size="lg" className="w-full"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
    </div>
  </div>
}
