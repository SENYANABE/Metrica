import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, Check, Menu, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const telegram = 'https://t.me/MetricaEduBot'
const container = 'mx-auto w-[min(1180px,calc(100%-40px))]'

const blocks = [
  { id: 'hero', n: '01', name: 'Баннер' },
  { id: 'audiences', n: '02', name: 'Для кого — карточки стопкой' },
  { id: 'how', n: '03', name: 'Как это работает' },
  { id: 'connect', n: '04', name: 'Связь / проверка' },
  { id: 'start', n: '05', name: 'Начало работы' },
  { id: 'faq', n: '06', name: 'Вопросы' },
  { id: 'final', n: '07', name: 'Финальная заявка' },
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

function Pill({ children }: { children: ReactNode }) {
  return <Card className="gap-0 rounded-xl py-2.5 shadow-md"><CardContent className="px-3.5 text-xs font-medium">{children}</CardContent></Card>
}

// Переключатель вариантов для обсуждения: на сайте останется один выбранный вариант.
function Variants({ value, onChange, options }: { value: number; onChange: (v: number) => void; options: string[] }) {
  return <div className="mb-8 flex flex-wrap items-center gap-2 rounded-xl bg-neutral-900 p-2 text-xs text-neutral-300">
    <span className="px-2">Вариант для обсуждения:</span>
    {options.map((o, i) => <button key={o} type="button" onClick={() => onChange(i)} aria-pressed={value === i} className={`rounded-lg px-3 py-1.5 ${value === i ? 'bg-white text-neutral-900' : 'hover:bg-neutral-800'}`}>{String.fromCharCode(1040 + i)}. {o}</button>)}
  </div>
}

function Block({ id, n, name, bg, children }: { id: string; n: string; name: string; bg: string; children: ReactNode }) {
  return <section id={id} className="overflow-x-clip border-b border-neutral-200 py-14 md:py-20">
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

// Блок 4, вариант А: одно событие проходит по орбите от репетитора к ученику и родителю.
function OneEvent() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setStep(s => (s + 1) % 3), 2200)
    return () => window.clearInterval(t)
  }, [])
  const screens = [
    { who: 'Репетитор', device: 'Ноутбук', event: 'Отмечает работу «Квадратные уравнения» проверенной', pill: 'Оценка 5 · «Все основные шаги верны»' },
    { who: 'Ученик', device: 'Телефон', event: 'Сразу видит оценку и комментарий', pill: '+ звёзды: 18 из 30 до награды' },
    { who: 'Родитель', device: 'Телефон', event: 'Видит результат и следующее занятие', pill: 'Последняя работа · оценка 5' },
  ]
  return <div>
    <h2 className="wf-display max-w-4xl text-[clamp(40px,5.5vw,72px)]">Одна проверка — <em>три измерения</em></h2>
    <p className="mt-5 max-w-xl text-neutral-600">Репетитор работает в Метрике, а ученик и родитель видят результат у себя — без пересылки скриншотов и сообщений.</p>
    <div className="relative mt-12">
      <svg className="pointer-events-none absolute inset-x-0 top-[38%] hidden h-24 w-full md:block" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M60 80 C 300 -10, 700 -10, 940 80" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="relative grid gap-8 md:grid-cols-3">
        {screens.map((s, i) => <li key={s.who} className={`transition-opacity ${i === step ? 'opacity-100' : 'md:opacity-45'}`}>
          <div className="relative">
            <Ph label={`${s.device} ${s.who.toLowerCase()}а: экран из демо`} className={s.device === 'Ноутбук' ? 'aspect-[4/3]' : 'mx-auto aspect-[3/4] w-3/4'} />
            <div className={`absolute -bottom-3 left-1/2 w-max max-w-[95%] -translate-x-1/2 transition-transform ${i === step ? 'scale-105' : ''}`}><Pill>{s.pill}</Pill></div>
          </div>
          <p className="mt-8 text-xs uppercase tracking-widest text-neutral-500">0{i + 1} · {s.who}</p>
          <p className="mt-1 font-medium">{s.event}</p>
        </li>)}
      </ol>
    </div>
    <div className="mt-6"><Status ok>всё есть в демо</Status></div>
  </div>
}

// Блок 4, вариант Б: тетрадь, которую посетитель «проверяет» сам.
function CheckDemo() {
  const [checked, setChecked] = useState(false)
  const lines = [['2x + 3 = 11', 'верно'], ['2x = 8', 'верно'], ['x = 4', 'верно'], ['(x − 1)² = 9', 'верно'], ['x − 1 = 3', 'проверьте шаг: есть второй корень']]
  return <div className="grid items-center gap-10 lg:grid-cols-2">
    <div>
      <h2 className="wf-display text-[clamp(40px,5.5vw,72px)]">Новое <em>измерение</em> без рутинных проверок</h2>
      <p className="mt-5 max-w-md text-neutral-600">Нажмите «Проверить» и посмотрите, как выглядит разбор работы.</p>
      <div className="mt-4"><Status>что делает ИИ — уточнить; в демо его нет</Status></div>
      <p className="mt-8 border-l-4 border-neutral-900 pl-4 text-lg font-medium">Оценку ставит репетитор.<span className="ml-2 align-middle"><Status>подтвердить</Status></span></p>
    </div>
    <div className="relative">
      <Ph label="Фон: ИИ-звезда над стопкой тетрадей (сюжет Figma 1351:185)" className="absolute inset-0" bottom />
      <Card className="relative mx-6 my-10 gap-4 py-6 shadow-xl sm:mx-12">
        <CardContent className="space-y-3 px-5 font-mono text-sm">
          {lines.map(([l, mark]) => <p key={l} className="flex min-h-7 items-center justify-between gap-3">
            <span>{l}</span>
            {checked && <Badge variant={mark === 'верно' ? 'secondary' : 'outline'} className={mark === 'верно' ? '' : 'border-dashed whitespace-normal text-left'}>{mark === 'верно' && <Check />}{mark}</Badge>}
          </p>)}
          <div className="flex items-center justify-between gap-3 border-t pt-4 font-sans">
            {checked ? <p className="text-sm font-medium">Репетитор: оценка 4 · «Найди второй корень»</p> : <p className="text-sm text-neutral-500">Работа ждёт проверки</p>}
            <Button size="sm" variant={checked ? 'outline' : 'default'} onClick={() => setChecked(!checked)}>{checked ? 'Сбросить' : 'Проверить'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
}

// Блок 5, вариант А: шаги стоят на орбите, кнопка в центре.
function OrbitPath() {
  const steps = [['Заявка', 'Кнопка «Оставить заявку» откроет бота Метрики в Telegram.', true], ['Знакомство', 'Команда расскажет о платформе и условиях доступа.', false], ['Начало работы', 'Как подключаются репетитор и его ученики — уточнить.', false]] as const
  return <div>
    <h2 className="wf-display text-center text-[clamp(40px,5.5vw,72px)]">Первый шаг <em>в новое измерение</em></h2>
    <div className="relative mx-auto mt-10 max-w-5xl md:aspect-[2.3/1]">
      <div className="wf-orbit absolute inset-[6%] hidden -rotate-6 md:block" aria-hidden="true" />
      <div className="relative flex flex-col items-center justify-center gap-3 py-6 md:absolute md:inset-0">
        <Button asChild size="lg" className="h-14 px-8 text-base"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
        <a className="text-sm underline underline-offset-4" href="mailto:metrica_start@mail.ru">или напишите на почту</a>
      </div>
      <ol className="mt-6 grid gap-6 md:mt-0">
        {steps.map(([t, d, ok], i) => <li key={t} className={`flex items-start gap-4 md:absolute md:w-64 ${['md:left-[2%] md:top-[2%]', 'md:right-[0%] md:top-[30%]', 'md:bottom-[0%] md:left-[18%]'][i]}`}>
          <Ph label="3D" className="size-16 shrink-0 rounded-full" />
          <div><p className="text-xs uppercase tracking-widest text-neutral-500">Шаг {i + 1}</p><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-neutral-600">{d}</p><div className="mt-2"><Status ok={ok}>{ok ? 'согласовано' : 'уточнить процесс'}</Status></div></div>
        </li>)}
      </ol>
    </div>
  </div>
}

// Блок 5, вариант Б: показываем, куда ведёт кнопка, — экран бота в Telegram.
function BotPreview() {
  return <div className="grid items-center gap-10 md:grid-cols-2">
    <div>
      <h2 className="wf-display text-[clamp(40px,5.5vw,72px)]">Заявка — <em>в одно касание</em></h2>
      <p className="mt-5 max-w-md text-neutral-600">Без форм на сайте: кнопка открывает бота Метрики в Telegram, дальше команда свяжется с вами там.</p>
      <ol className="mt-6 space-y-2 text-sm">
        <li className="flex gap-2"><span className="font-semibold">1.</span>Нажмите «Оставить заявку»</li>
        <li className="flex gap-2"><span className="font-semibold">2.</span>Нажмите «Запустить» в Telegram</li>
        <li className="flex gap-2"><span className="font-semibold">3.</span>Ответьте на вопросы бота<span className="ml-1"><Status>какие — уточнить</Status></span></li>
      </ol>
      <Button asChild size="lg" className="mt-7"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
    </div>
    <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border-[10px] border-neutral-900 bg-neutral-100 p-4">
      <div className="flex items-center gap-3 border-b border-neutral-300 pb-3"><Ph label="М" className="size-10 rounded-full" /><div><p className="text-sm font-semibold">МЕТРИКА_БОТ</p><p className="text-xs text-neutral-500">бот</p></div></div>
      <div className="space-y-3 py-6">
        <div className="w-4/5 rounded-2xl rounded-tl-sm bg-white p-3"><div className="h-2 w-full rounded bg-neutral-300" /><div className="mt-2 h-2 w-3/4 rounded bg-neutral-300" /><p className="mt-2 text-[11px] text-neutral-500">Приветствие бота — текст уточнить</p></div>
        <div className="ml-auto w-3/5 rounded-2xl rounded-tr-sm bg-neutral-800 p-3"><div className="h-2 w-full rounded bg-neutral-500" /></div>
        <div className="w-4/5 rounded-2xl rounded-tl-sm bg-white p-3"><div className="h-2 w-full rounded bg-neutral-300" /><div className="mt-2 h-2 w-2/3 rounded bg-neutral-300" /></div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-neutral-400">Запустить <Send className="ml-auto size-4" /></div>
    </div>
  </div>
}

export default function Wireframe() {
  const [notes, setNotes] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [v4, setV4] = useState(0)
  const [v5, setV5] = useState(0)

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
          <a href="#audiences">Для кого</a><a href="#how">Как это работает</a><a href="#start">Как начать</a><a href="#faq">Вопросы</a>
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className={`${container} flex flex-col gap-4 pb-5 text-sm md:hidden`} aria-label="Мобильная навигация">
        {[['audiences', 'Для кого'], ['how', 'Как это работает'], ['start', 'Как начать'], ['faq', 'Вопросы']].map(([id, t]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{t}</a>)}
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

      <Block id="connect" n="04" name="Связь / проверка" bg="тёмно-синий (А) или синий (Б)">
        <Variants value={v4} onChange={setV4} options={['Одна проверка — три экрана', 'Проверь сам']} />
        {v4 === 0 ? <OneEvent /> : <CheckDemo />}
        <div className="mt-8"><Note>{v4 === 0
          ? <><b>А.</b> Событие «бежит» по орбите от ноутбука репетитора к телефонам ученика и родителя — «новое измерение» как связь между людьми. Все данные — из демо. Референсы: ось с объектами у Яндекс Учебника, пунктир ClassDojo.</>
          : <><b>Б.</b> Интерактив: посетитель сам нажимает «Проверить» и видит метки на строках решения. Референсы: Speak, Studdy. Подходит, только если команда подтвердит, что делает ИИ.</>}</Note></div>
      </Block>

      <Block id="start" n="05" name="Начало работы" bg="белый (А) или фиолетовый (Б)">
        <Variants value={v5} onChange={setV5} options={['Шаги на орбите', 'Экран бота']} />
        {v5 === 0 ? <OrbitPath /> : <BotPreview />}
        <div className="mt-8"><Note>{v5 === 0
          ? <><b>А.</b> Шаги стоят на большой орбите, кнопка — в центре. Вместо значков — 3D-объекты из концепции. На телефоне шаги идут списком.</>
          : <><b>Б.</b> Показываем, куда ведёт кнопка: телефон с ботом Метрики. Снимает вопрос «что будет после нажатия». Тексты бота нужно взять у команды.</>}</Note></div>
      </Block>

      <Block id="faq" n="06" name="Вопросы" bg="белый">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="wf-display text-[clamp(40px,5.5vw,72px)]">Остались <em>вопросы?</em></h2>
            <p className="mt-5 text-sm text-neutral-600">Напишите команде: <a className="underline" href="mailto:metrica_start@mail.ru">metrica_start@mail.ru</a></p>
          </div>
          <Accordion type="single" collapsible className="border-t">
            {faq.map((f, i) => <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="space-y-2 text-neutral-600"><p>{f.a}</p>{!f.ok && <Status>ответ уточнить</Status>}</AccordionContent>
            </AccordionItem>)}
          </Accordion>
        </div>
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

    <footer className="pb-24 pt-10 md:pb-10">
      <div className={`${container} flex flex-col gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between`}>
        <span className="font-black italic text-neutral-900">[ЛОГО] МЕТРИКА</span>
        <a href="mailto:metrica_start@mail.ru">metrica_start@mail.ru</a>
        <a href="https://outputs-livid-delta.vercel.app/legal/#privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
      </div>
    </footer>

    {/* Телефон: закреплённая кнопка заявки */}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <Button asChild size="lg" className="w-full"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
    </div>
  </div>
}
