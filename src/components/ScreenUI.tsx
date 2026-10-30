import { Check } from 'lucide-react'

// Экраны интерфейса Метрики в стиле концепции. Вёрстка в em: 1em = 1/96 ширины экрана,
// поэтому экран одинаково выглядит и в окне блока «Как это работает», и в дисплее ноутбука.

export type ScreenKind = 'lessons' | 'students' | 'homework' | 'progress'

const tabs: [ScreenKind, string][] = [['lessons', 'Занятия'], ['students', 'Ученики'], ['homework', 'Проверка ДЗ']]

function Bar({ active }: { active: ScreenKind }) {
  return <div className="sui-bar">
    <span className="sui-logo"><img src="/brand/mark.svg" alt="" />Метрика</span>
    {active !== 'progress' && <span className="sui-tabs">{tabs.map(([k, t]) => <span key={k} className={k === active ? 'on' : ''}>{t}</span>)}</span>}
    <span className="sui-user"><i>{active === 'progress' ? 'АС' : 'АВ'}</i>{active === 'progress' ? 'Артём · ученик' : 'Арина Викторовна'}</span>
  </div>
}

function Lessons() {
  const week = [['ПН', 28, 0], ['ВТ', 29, 2], ['СР', 30, 1], ['ЧТ', 1, 1], ['ПТ', 2, 1], ['СБ', 3, 0], ['ВС', 4, 0]] as const
  return <>
    <h4 className="sui-h">Занятия под контролем</h4>
    <div className="sui-grid sui-grid-lessons">
      <div className="sui-hero">
        <small>Сегодня, 15:00</small>
        <b>Математика с Артёмом</b>
        <span>Алгебра · квадратные уравнения</span>
        <span className="sui-btns"><i className="mint">К ученику</i><i>Посмотреть ДЗ</i></span>
      </div>
      <div className="sui-week">{week.map(([d, n, c], i) => <span key={d} className={i === 2 ? 'on' : ''}><small>{d}</small><b>{n}</b><em>{c ? '•'.repeat(c) : ''}</em></span>)}</div>
      {[['4', 'ученика в работе'], ['1', 'работа ждёт проверки'], ['5', 'занятий на неделе']].map(([n, t]) => <div key={t} className="sui-stat"><b>{n}</b><span>{t}</span></div>)}
    </div>
  </>
}

function Students() {
  const rows = [['Артём Соловьёв', 'Математика · 7 класс · 12 занятий', 'Нужно проверить ДЗ', 'warn'], ['Арина Мошкова', 'Математика · 6 класс · 8 занятий', 'Занятие завтра', ''], ['Александр Смуров', 'Физика · 9 класс · 16 занятий', 'Все задания проверены', 'ok'], ['Елизавета Терехова', 'Математика · 8 класс · 5 занятий', 'Ожидаем ответ', '']]
  return <>
    <h4 className="sui-h">Мои ученики</h4>
    <div className="sui-list">{rows.map(([n, s, st, tone]) => <div key={n} className="sui-row">
      <i className="sui-ava">{n.split(' ').map(w => w[0]).join('')}</i>
      <span><b>{n}</b><small>{s}</small></span>
      <em className={tone}>{st}</em>
    </div>)}</div>
  </>
}

function Homework() {
  return <>
    <h4 className="sui-h">Домашние задания</h4>
    <div className="sui-grid sui-grid-hw">
      <div className="sui-card">
        <small>Артём Соловьёв · 7 класс</small>
        <b>Квадратные уравнения</b>
        <span className="sui-file">Решение_Артем.pdf · отправлено сегодня в 11:40</span>
        <span className="sui-grade"><small>Оценка</small>{[2, 3, 4, 5].map(n => <i key={n} className={n === 5 ? 'on' : ''}>{n}</i>)}</span>
        <span className="sui-comment">Хорошая работа! Все основные шаги верны.</span>
        <span className="sui-btns"><i className="blue"><Check />Отметить проверенным</i><i>К ученику</i></span>
      </div>
      <div className="sui-card sui-note">
        <b>Фокус на обратной связи</b>
        <span>После проверки ученик увидит оценку и комментарий. Прогресс обновится в его кабинете.</span>
      </div>
    </div>
  </>
}

function Progress() {
  return <>
    <h4 className="sui-h">Твой прогресс</h4>
    <div className="sui-grid sui-grid-progress">
      <div className="sui-hero sui-stars">
        <small>Звёзды до награды</small>
        <b className="sui-big">18<span> / 30</span></b>
        <span className="sui-hero-note">Ещё 12 звёзд — и награда</span>
        <span className="sui-meter"><span style={{ width: '60%' }} /></span>
      </div>
      <div className="sui-card">
        <small>Следующее занятие · завтра, 16:00</small>
        <b>Квадратные уравнения</b>
        <span className="sui-btns"><i className="mint">Открыть материалы</i></span>
      </div>
      <div className="sui-card">
        <small>Последняя работа</small>
        <b>Оценка 5</b>
        <span className="sui-quote">«Хорошая работа! Все основные шаги верны.»</span>
      </div>
    </div>
  </>
}

export function ScreenUI({ kind }: { kind: ScreenKind }) {
  return <div className="sui" aria-hidden="true">
    <Bar active={kind} />
    <div className="sui-body">
      {kind === 'lessons' && <Lessons />}
      {kind === 'students' && <Students />}
      {kind === 'homework' && <Homework />}
      {kind === 'progress' && <Progress />}
    </div>
  </div>
}
