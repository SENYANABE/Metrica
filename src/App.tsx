import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const telegram = 'https://t.me/MetricaEduBot'
const demo = 'https://outputs-livid-delta.vercel.app/platform-demo/?embed=1'

const stages = [
  { id: 'before', label: 'До занятия', number: '01', title: 'Всё начинается с подготовки', text: 'Материалы и задания — начало учебного маршрута. Подготовьтесь к следующей встрече с учеником в Метрике.', items: ['Материалы к занятию', 'Задания для ученика'], next: 'Дальше — встреча с учеником' },
  { id: 'during', label: 'На занятии', number: '02', title: 'В центре — ваше занятие', text: 'Перейдите от подготовки к работе с учеником. Посмотрите в демо, как устроено пространство занятия в Метрике.', items: ['Работа с материалами', 'Учебный процесс'], next: 'Дальше — самостоятельная работа' },
  { id: 'after', label: 'После занятия', number: '03', title: 'У каждого занятия есть продолжение', text: 'Домашняя работа, проверка и прогресс продолжают учебный процесс между встречами с учеником.', items: ['Домашняя работа и проверка', 'Прогресс ученика'], next: 'Дальше — новый шаг в обучении' },
]

const questions = [
  { q: 'Для кого Метрика?', a: 'Метрика — платформа для онлайн-репетиторов. Она объединяет занятия, материалы, домашние задания и прогресс учеников в одном пространстве.' },
  { q: 'Как оставить заявку?', a: 'Перейдите в Telegram по кнопке «Оставить заявку». Через бота Метрики можно оставить обращение команде.' },
  { q: 'Можно посмотреть платформу до заявки?', a: 'Да. На странице есть ссылка на интерактивное демо: в нём можно познакомиться с занятиями, учениками и проверкой домашних заданий.' },
  { q: 'Где узнать условия доступа?', a: 'Уточните актуальные условия у команды Метрики через Telegram или напишите на metrica_start@mail.ru.' },
]

function ApplyButton({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return <Button asChild size="lg" className={`cta ${light ? 'cta-mint' : ''} ${className}`}>
    <a href={telegram} target="_blank" rel="noopener noreferrer">Оставить заявку <ArrowUpRight aria-hidden="true" /></a>
  </Button>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  function closeMenu() { setMenuOpen(false) }

  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="brand" aria-label="Метрика — на главную">Метрика<span className="brand-period">.</span></a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <a href="#process">Как это работает</a><a href="#possibilities">Возможности</a><a href="#questions">Вопросы</a>
        </nav>
        <div className="header-actions"><ApplyButton /><Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
      </div>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav container" aria-label="Мобильная навигация"><a onClick={closeMenu} href="#process">Как это работает</a><a onClick={closeMenu} href="#possibilities">Возможности</a><a onClick={closeMenu} href="#questions">Вопросы</a></nav>}
    </header>

    <main id="main">
      <section className="hero">
        <div className="container">
          <p className="eyebrow"><span className="status-dot" /> Платформа для онлайн-репетиторов</p>
          <h1>Новое измерение<br /><em>обучения</em></h1>
          <div className="hero-bottom">
            <div className="hero-intro"><p className="lead">Готовьте занятия, проверяйте задания и следите за прогрессом учеников в одном пространстве.</p><div className="button-row"><ApplyButton /><Button asChild variant="link" className="text-action"><a href="#process">Как устроена Метрика <ArrowDown aria-hidden="true" /></a></Button></div></div>
            <p className="hero-aside">От первого материала<br />до следующего шага ученика.</p>
          </div>
          <div className="hero-index" aria-label="Учебный процесс"><span>Материалы</span><ArrowRight aria-hidden="true" /><span>Занятия</span><ArrowRight aria-hidden="true" /><span>Задания</span><ArrowRight aria-hidden="true" /><span>Прогресс</span></div>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="container">
          <div className="section-top"><p className="eyebrow">01 / Одно учебное пространство</p><p className="section-aside">До встречи. На занятии.<br />И между уроками.</p></div>
          <h2>У каждого занятия<br /><em>есть продолжение</em></h2>
          <p className="section-intro">Подготовка, работа с учеником и домашние задания складываются в один процесс. Посмотрите на него шаг за шагом.</p>
          <Tabs defaultValue="before" className="process-tabs">
            <TabsList className="stage-tabs" aria-label="Этапы занятия">{stages.map(stage => <TabsTrigger key={stage.id} value={stage.id}><span>{stage.number}</span>{stage.label}</TabsTrigger>)}</TabsList>
            {stages.map(stage => <TabsContent key={stage.id} value={stage.id} className="stage-content"><div className="stage-title"><span className="stage-number" aria-hidden="true">{stage.number}</span><h3>{stage.title}</h3></div><div className="stage-description"><p>{stage.text}</p><ul>{stage.items.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><p className="stage-next"><ArrowRight aria-hidden="true" />{stage.next}</p></div></TabsContent>)}
          </Tabs>
          <div className="demo-strip"><div><p className="eyebrow">Посмотрите изнутри</p><h3>Познакомьтесь с Метрикой в демо</h3><p>Занятия, ученики и проверка домашних заданий.</p></div><Button asChild variant="outline" size="lg" className="demo-button"><a href={demo} target="_blank" rel="noopener noreferrer"><Play aria-hidden="true" />Открыть демо<ArrowUpRight aria-hidden="true" /></a></Button></div>
        </div>
      </section>

      <section id="possibilities" className="section checking-section">
        <div className="container checking-grid">
          <div><p className="eyebrow">02 / Помощь в работе</p><h2>Больше внимания<br /><em>обучению</em></h2></div>
          <div className="feature-story"><p className="lead">От выполненного задания — к обратной связи и следующему шагу.</p><div className="feature-row"><span>01</span><div><h3>ИИ-помощник</h3><p>Познакомьтесь с возможностями помощника в Метрике.</p></div></div><div className="feature-row"><span>02</span><div><h3>Автопроверка домашних заданий</h3><p>Проверка — часть общего учебного процесса. Посмотрите, как она устроена, в интерактивном демо.</p></div></div><a className="inline-link" href={demo} target="_blank" rel="noopener noreferrer">Посмотреть возможности <ArrowUpRight aria-hidden="true" /></a></div>
        </div>
      </section>

      <section className="section progress-section">
        <div className="container"><p className="eyebrow">03 / Общая картина</p><div className="progress-heading"><h2>Каждый шаг<br /><em>имеет значение</em></h2><p className="lead">Занятие заканчивается.<br />Обучение продолжается.</p></div><div className="progress-rows"><article><span className="row-number">01</span><h3>Прогресс ученика</h3><p>Следите за прогрессом и выполненными заданиями в одном месте.</p></article><article><span className="row-number">02</span><h3>Связь с родителями</h3><p>Показывайте родителям понятную картину обучения и выполненных заданий.</p></article><article><span className="row-number">03</span><h3>Геймификация</h3><p>Узнайте у команды, как устроена геймификация в Метрике.</p></article></div></div>
      </section>

      <section id="start" className="section start-section"><div className="container start-grid"><div><p className="eyebrow">04 / Первый шаг</p><h2>Первый шаг<br /><em>в новое измерение</em></h2></div><div><p className="lead">Оставьте заявку через Telegram, чтобы узнать больше о Метрике и условиях доступа.</p><ApplyButton /><p className="small-note">Есть вопрос? <a href="mailto:metrica_start@mail.ru">Напишите команде на почту</a>.</p></div></div></section>

      <section id="questions" className="section faq-section"><div className="container faq-grid"><div><p className="eyebrow">05 / Перед началом</p><h2>Остались<br /><em>вопросы?</em></h2><p>Разберёмся вместе.<br /><a className="inline-link" href="mailto:metrica_start@mail.ru">metrica_start@mail.ru <ArrowUpRight aria-hidden="true" /></a></p></div><Accordion type="single" collapsible>{questions.map((question, i) => <AccordionItem key={question.q} value={`question-${i}`}><AccordionTrigger>{question.q}</AccordionTrigger><AccordionContent>{question.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>

      <section className="final-section"><div className="container"><p className="eyebrow">Метрика / Пространство для обучения</p><h2>Откройте новое<br /><em>измерение занятий</em></h2><div className="final-bottom"><p>Познакомьтесь с Метрикой.<br />Оставьте заявку через Telegram.</p><ApplyButton light /></div></div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><a className="footer-name" href="#">Метрика</a><a href="mailto:metrica_start@mail.ru">metrica_start@mail.ru</a><a href="https://outputs-livid-delta.vercel.app/legal/#privacy" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a></div></footer>
  </>
}
