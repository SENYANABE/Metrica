import { useState, type ReactNode } from 'react'
import { ArrowUpRight, Check, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const telegram = 'https://t.me/MetricaEduBot'
const demo = 'https://outputs-livid-delta.vercel.app/platform-demo/?embed=1'

const blocks = [
  { id: 'hero', n: '01', name: 'Первый экран' },
  { id: 'process', n: '02', name: 'Этапы занятия' },
  { id: 'checking', n: '03', name: 'Проверка ДЗ и ИИ' },
  { id: 'progress', n: '04', name: 'Ученик и родитель' },
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

function Block({ id, n, name, bg, children }: { id: string; n: string; name: string; bg: string; children: ReactNode }) {
  return <section id={id} className="overflow-x-clip border-b border-neutral-200 py-14 md:py-20">
    <div className="mx-auto w-[min(1180px,calc(100%-40px))]">
      <div className="wf-svc mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-neutral-500">
        <span className="font-semibold text-neutral-900">{n} · {name}</span>
        <span className="normal-case tracking-normal">Фон в дизайне: {bg}</span>
      </div>
      {children}
    </div>
  </section>
}

const steps = [
  { id: 'before', label: 'До занятия', title: 'Подготовка', items: ['Расписание недели и ближайшие занятия', 'Материалы и последнее ДЗ ученика под рукой'], ok: true, screen: 'Экран демо «Занятия под контролем»: расписание недели' },
  { id: 'during', label: 'На занятии', title: 'Занятие', items: ['Что происходит в Метрике во время урока: видеосвязь, доска, материалы?'], ok: false, screen: 'Экран урока — нужно понять, есть ли он в продукте' },
  { id: 'after', label: 'После занятия', title: 'Продолжение', items: ['Ученик сдаёт работу, репетитор проверяет', 'Оценка и комментарий видны ученику, прогресс обновляется'], ok: true, screen: 'Экран демо «Домашние задания»: работа ждёт проверки' },
]

const faq = [
  { q: 'Для кого Метрика?', a: 'Для онлайн-репетиторов: занятия, ученики, домашние задания и прогресс в одном пространстве. Ученик и родитель видят свою часть процесса.', ok: true },
  { q: 'Что видят ученик и родитель?', a: 'Ученик — ближайшее занятие, материалы, домашнее задание и прогресс. Родитель — проведённые и ближайшие занятия, последнюю работу с оценкой и комментарием репетитора.', ok: true },
  { q: 'Кто ставит оценку — ИИ или репетитор?', a: 'Ответ нужно подтвердить у команды: что именно делает ИИ при проверке и остаётся ли решение за репетитором.', ok: false },
  { q: 'Можно посмотреть платформу до заявки?', a: 'Да, в интерактивном демо: экраны репетитора, ученика и родителя.', ok: true },
  { q: 'Как оставить заявку?', a: 'Через Telegram-бота Метрики по кнопке «Оставить заявку».', ok: true },
  { q: 'Где узнать условия доступа?', a: 'У команды Метрики через Telegram или по почте metrica_start@mail.ru.', ok: true },
]

export default function Wireframe() {
  const [notes, setNotes] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return <div className={notes ? '' : 'wf-notes-off'}>
    {/* Служебная панель согласования */}
    <div className="bg-neutral-900 text-neutral-100">
      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-wrap items-center justify-between gap-3 py-3 text-xs">
        <p>{notes ? 'Показаны рабочие пометки: на сайте их не будет.' : 'Черновая схема страницы. Серые блоки с крестом — места для фото и картинок.'}</p>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => setNotes(!notes)}>{notes ? 'Скрыть пометки' : 'Показать рабочие пометки'}</Button>
        </div>
      </div>
    </div>

    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-[min(1180px,calc(100%-40px))] items-center justify-between gap-4">
        <a href="#" className="rounded-md border-2 border-neutral-900 px-2.5 py-1 text-sm font-black italic tracking-tight">[ЛОГО] МЕТРИКА</a>
        <nav className="hidden gap-6 text-sm md:flex" aria-label="Основная навигация">
          <a href="#process">Как это работает</a><a href="#checking">Проверка ДЗ</a><a href="#progress">Ученикам и родителям</a><a href="#faq">Вопросы</a>
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" className="hidden sm:inline-flex"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-4 pb-5 text-sm md:hidden" aria-label="Мобильная навигация">
        {blocks.slice(1, 6).map(b => <a key={b.id} href={`#${b.id}`} onClick={() => setMenuOpen(false)}>{b.name}</a>)}
      </nav>}
    </header>

    {/* Карта страницы */}
    <nav className="wf-svc border-b border-neutral-200 bg-neutral-50" aria-label="Карта страницы">
      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] gap-2 overflow-x-auto py-3 text-xs">
        {blocks.map(b => <a key={b.id} href={`#${b.id}`} className="shrink-0 rounded-full border border-neutral-300 bg-white px-3 py-1.5">{b.n} {b.name}</a>)}
      </div>
    </nav>

    <main>
      <Block id="hero" n="01" name="Первый экран" bg="синий #025BFF, как в концепции">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h1 className="wf-display text-[clamp(56px,8vw,112px)]">Новое<br /><em>измерение</em><br />обучения</h1>
            <p className="mt-6 max-w-md text-lg leading-snug">Расписание, ученики, домашние задания и прогресс — в одном пространстве для репетитора.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
              <Button asChild size="lg" variant="outline"><a href={demo} target="_blank" rel="noopener noreferrer">Посмотреть демо</a></Button>
            </div>
          </div>
          <div className="relative">
            <div className="wf-orbit absolute -inset-x-6 top-10 bottom-6 -rotate-6" aria-hidden="true" />
            <Ph label="Фото из концепции: репетитор с ноутбуком, выходит за правый край экрана" className="aspect-[4/3]" bottom />
            <div className="absolute left-[8%] top-[14%] w-[44%]"><Ph label="Экран ноутбука: «Занятия под контролем» из демо" className="aspect-[16/10] border-2 border-white" /></div>
            <div className="absolute -left-2 top-[52%] sm:-left-6"><Pill>1 работа ждёт проверки</Pill></div>
            <div className="absolute -right-1 top-[6%] sm:-right-4"><Pill>Сегодня, 15:00 · Артём · алгебра</Pill></div>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Note><b>Wise:</b> один цвет на весь экран, огромный капс, одно главное действие. <b>Skyeng:</b> человек перекрывает рамку. <b>Cash App:</b> устройство срезано краем экрана.</Note>
          <Note><b>Preply:</b> плашки-события поверх фото показывают продукт, а не обещания. Данные в плашках — демонстрационные, из демо. На телефоне снизу закреплена кнопка «Оставить заявку».</Note>
        </div>
      </Block>

      <Block id="process" n="02" name="Этапы занятия" bg="белый; тонкая орбита связывает этапы">
        <h2 className="wf-display max-w-3xl text-[clamp(40px,5.5vw,72px)]">У каждого занятия <em>есть продолжение</em></h2>
        <p className="mt-5 max-w-xl text-neutral-600">Подготовка, урок и домашнее задание в одном процессе — для репетитора, ученика и родителя.</p>

        {/* Десктоп: устройство закреплено слева, этапы прокручиваются справа */}
        <div className="mt-10 hidden gap-10 md:grid md:grid-cols-[1fr_1fr]">
          <div className="sticky top-24 self-start"><Ph label="Планшет в руках репетитора: экран меняется вместе с активным этапом" className="aspect-[4/5]" /></div>
          <ol className="flex flex-col">
            {steps.map((s, i) => <li key={s.id} className="flex min-h-[46vh] flex-col justify-center border-l-2 border-neutral-200 pl-8 first:border-neutral-900">
              <span className="text-xs text-neutral-500">0{i + 1} · {s.label}</span>
              <h3 className="wf-display mt-2 text-5xl">{s.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">{s.items.map(it => <li key={it} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0" />{it}</li>)}</ul>
              <div className="mt-4"><Status ok={s.ok}>{s.ok ? 'есть в демо' : 'уточнить у команды'}</Status></div>
              <p className="wf-svc mt-3 text-xs text-neutral-500">Экран на планшете: {s.screen}</p>
            </li>)}
          </ol>
        </div>

        {/* Телефон: те же этапы во вкладках */}
        <Tabs defaultValue="before" className="mt-8 md:hidden">
          <TabsList className="w-full">{steps.map(s => <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>)}</TabsList>
          {steps.map(s => <TabsContent key={s.id} value={s.id} className="pt-4">
            <Ph label={s.screen} className="aspect-[4/3]" />
            <h3 className="wf-display mt-5 text-4xl">{s.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">{s.items.map(it => <li key={it} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0" />{it}</li>)}</ul>
            <div className="mt-3"><Status ok={s.ok}>{s.ok ? 'есть в демо' : 'уточнить у команды'}</Status></div>
          </TabsContent>)}
        </Tabs>

        <Separator className="my-10" />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm"><b>Посмотрите изнутри.</b> Экраны репетитора, ученика и родителя в интерактивном демо.</p>
          <Button asChild variant="outline"><a href={demo} target="_blank" rel="noopener noreferrer">Открыть демо <ArrowUpRight /></a></Button>
        </div>
        <div className="mt-6"><Note><b>Klarna:</b> одно устройство закреплено, справа крупные этапы подсвечиваются при прокрутке — шаги без сетки карточек. <b>Lessonspace:</b> вместо описаний показываем настоящий интерфейс.</Note></div>
      </Block>

      <Block id="checking" n="03" name="Проверка ДЗ и ИИ" bg="синий; сюжет Figma «Новое измерение без рутинных проверок»">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="wf-display text-[clamp(40px,5.5vw,72px)]">Новое <em>измерение</em> без рутинных проверок</h2>
            <ol className="mt-8 space-y-4">
              {[['Ученик сдаёт работу в Метрике', true], ['ИИ помогает с проверкой — что именно он делает?', false], ['Репетитор ставит оценку и пишет комментарий', true], ['Ученик видит результат, прогресс обновляется', true]].map(([t, ok], i) =>
                <li key={i} className="flex items-start gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 text-sm font-semibold">{i + 1}</span><div><p className="font-medium">{t}</p><div className="mt-1.5"><Status ok={ok as boolean}>{ok ? 'есть в демо' : 'уточнить: в демо ИИ нет'}</Status></div></div></li>)}
            </ol>
            <p className="mt-8 border-l-4 border-neutral-900 pl-4 text-lg font-medium">Решение всегда за репетитором.<span className="ml-2 align-middle"><Status>подтвердить формулировку</Status></span></p>
          </div>
          <div className="relative">
            <Ph label="Иллюстрация из Figma (1351:185): ИИ-звезда над стопкой тетрадей с галочками" className="aspect-square" />
            <Card className="absolute bottom-6 left-4 right-4 gap-3 py-4 shadow-lg sm:left-10 sm:right-10">
              <CardContent className="space-y-2 px-4 font-mono text-sm">
                <p className="flex items-center justify-between gap-2"><span>2x + 3 = 11</span><Badge variant="secondary"><Check /> верно</Badge></p>
                <p className="flex items-center justify-between gap-2"><span>x = 4</span><Badge variant="secondary"><Check /> верно</Badge></p>
                <p className="flex items-center justify-between gap-2"><span>x − 1 = ±3</span><Badge variant="outline" className="border-dashed">проверьте шаг</Badge></p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <Note><b>Speak / Studdy:</b> метки прямо на строках решения — так видно, что значит «проверка», без абстракций. Метки показываем как пример, пока команда не подтвердит работу ИИ.</Note>
          <Note><b>Khanmigo / Brilliant:</b> ясная роль ИИ снимает страх «ИИ заменит учителя». <b>Важно:</b> в демо ИИ-проверки нет, на старом лендинге она только заявлена.</Note>
        </div>
      </Block>

      <Block id="progress" n="04" name="Ученик и родитель" bg="тёмно-синий; сюжеты Figma «Успехи ребёнка в новом измерении» и «Целое измерение в кармане»">
        <h2 className="wf-display max-w-3xl text-[clamp(40px,5.5vw,72px)]">Успехи ученика <em>в новом измерении</em></h2>
        <p className="mt-5 max-w-xl text-neutral-600">Репетитор работает в Метрике — ученик и родитель видят свою часть процесса.</p>
        <Tabs defaultValue="parent" className="mt-10">
          <TabsList><TabsTrigger value="parent">Родитель</TabsTrigger><TabsTrigger value="student">Ученик</TabsTrigger></TabsList>
          {[
            { v: 'parent', screen: 'Телефон в руке родителя: экран «Прогресс ребёнка — на виду» из демо', pills: ['12 занятий проведено', 'Квадратные уравнения · оценка 5', '«Хорошая работа! Все основные шаги верны.»'], facts: ['Проведённые и ближайшие занятия', 'Последняя работа с оценкой', 'Комментарий репетитора'] },
            { v: 'student', screen: 'Телефон в руке ученика: экран «Твоё пространство для учёбы» из демо', pills: ['Завтра, 16:00 · квадратные уравнения', 'ДЗ: № 124–129 до 2 октября', '18 из 30 звёзд до награды'], facts: ['Ближайшее занятие и материалы', 'Домашнее задание и срок', 'Звёзды за прогресс (геймификация)'] },
          ].map(t => <TabsContent key={t.v} value={t.v} className="pt-6">
            <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative mx-auto w-full max-w-sm">
                <Ph label={t.screen} className="aspect-[3/4]" />
                <div className="absolute -right-2 top-[12%] flex flex-col items-end gap-2 sm:-right-10">{t.pills.map(p => <Pill key={p}>{p}</Pill>)}</div>
              </div>
              <ul className="space-y-5">{t.facts.map(f => <li key={f} className="flex items-baseline gap-3 border-b border-neutral-200 pb-5"><Check className="size-5 shrink-0 translate-y-1" /><span className="wf-display text-3xl">{f}</span></li>)}<li><Status ok>всё есть в демо</Status></li></ul>
            </div>
          </TabsContent>)}
        </Tabs>
        <div className="mt-8"><Note><b>Preply / Wise:</b> плашки с данными поверх фото человека с телефоном. <b>Duolingo:</b> курсивный капс на тёмно-синем — для этого блока. <b>Khanmigo /parents:</b> родителю показываем факты, а не «прозрачность».</Note></div>
      </Block>

      <Block id="start" n="05" name="Начало работы" bg="белый">
        <h2 className="wf-display text-[clamp(40px,5.5vw,72px)]">Первый шаг <em>в новое измерение</em></h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-0">
          {[['Оставьте заявку', 'В Telegram-боте Метрики — одной кнопкой.', true], ['Знакомство с командой', 'Команда расскажет о платформе и условиях доступа.', false], ['Начало работы', 'Как подключается репетитор и его ученики?', false]].map(([t, d, ok], i) =>
            <li key={i} className="relative md:pr-8">
              <div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">{i + 1}</span>{i < 2 && <span className="hidden h-px flex-1 bg-neutral-300 md:block" aria-hidden="true" />}</div>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="mt-1 text-sm text-neutral-600">{d}</p>
              <div className="mt-3"><Status ok={ok as boolean}>{ok ? 'согласовано' : 'уточнить процесс'}</Status></div>
            </li>)}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
          <a className="text-sm underline underline-offset-4" href="mailto:metrica_start@mail.ru">или напишите на почту</a>
        </div>
        <div className="mt-6"><Note><b>Preply /teach:</b> шаги одной горизонтальной линией, без карточек. Без сроков ответа и обещаний бесплатного доступа.</Note></div>
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
        <div className="mt-6"><Note><b>Khanmigo / Preply:</b> вопросы отвечают на реальные опасения — кто ставит оценку, что видит родитель.</Note></div>
      </Block>

      <Block id="final" n="07" name="Финальная заявка" bg="синий, как первый экран; объекты собираются на орбите">
        <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-900 px-6 py-14 sm:px-12">
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
      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-black italic text-neutral-900">[ЛОГО] МЕТРИКА</span>
        <a href="mailto:metrica_start@mail.ru">metrica_start@mail.ru</a>
        <a href="https://outputs-livid-delta.vercel.app/legal/#privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a>
      </div>
    </footer>

    {/* Телефон: закреплённая кнопка заявки (приём Cash App) */}
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <Button asChild size="lg" className="w-full"><a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight /></a></Button>
    </div>
  </div>
}
