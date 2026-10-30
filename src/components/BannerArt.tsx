import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Art, Layer, Point } from '@/art'

const px = (n: number) => `calc(${n} * var(--u))`
const box = (x: number, y: number, w: number, h: number): CSSProperties => ({ left: px(x), top: px(y), width: px(w), height: px(h) })

// Перспективное преобразование прямоугольника w × h в четырёхугольник (для экрана в дисплее ноутбука).
function quadTransform(w: number, h: number, q: [Point, Point, Point, Point]) {
  const src: Point[] = [[0, 0], [w, 0], [w, h], [0, h]]
  const A: number[][] = []
  src.forEach(([x, y], i) => {
    const [X, Y] = q[i]
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X, X])
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y, Y])
  })
  for (let c = 0; c < 8; c++) {
    let p = c
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    for (let r = 0; r < 8; r++) {
      if (r === c) continue
      const f = A[r][c] / A[c][c]
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k]
    }
  }
  const [a, b, c, d, e, f, g, hh] = A.map((row, i) => row[8] / row[i])
  return `matrix3d(${[a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].join(',')})`
}

const SCREEN_W = 1920
const SCREEN_H = 1245

function Screen({ quad, layerW, children }: { quad: [Point, Point, Point, Point]; layerW: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    // Keep subpixel precision: offsetWidth rounds the photo width and can
    // leave a seam between the projected interface and the screen aperture.
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / layerW))
    ro.observe(el)
    return () => ro.disconnect()
  }, [layerW])
  const q = quad.map(([x, y]) => [x * scale, y * scale]) as [Point, Point, Point, Point]
  return <div ref={ref} className="art-screen" style={{ width: SCREEN_W, height: SCREEN_H, transform: scale ? quadTransform(SCREEN_W, SCREEN_H, q) : 'scale(0)' }}>
    {children}
  </div>
}

function renderLayer(l: Layer, i: number, screen?: ReactNode) {
  if (l.kind === 'orbit') return <span key={i} className="art-orbit" style={box(l.x, l.y, l.w, l.h)}>
    <img src={l.src} alt="" style={{ width: px(l.iw), height: px(l.ih), transform: `translate(-50%, -50%) rotate(${l.rot}deg)` }} />
  </span>
  if (l.kind === 'img') return <img key={i} src={l.src} alt="" className={l.float ? 'art-float' : undefined} style={box(l.x, l.y, l.w, l.h)} />
  const mask = `url("${l.mask}") no-repeat ${px(l.mx)} ${px(l.my)} / ${px(l.mw)} ${px(l.mh)}`
  return <div key={i} className="art-masked" style={{ ...box(l.x, l.y, l.w, l.h), WebkitMask: mask, mask }}>
    {l.screen && screen && <Screen quad={l.screen.quad} layerW={l.w}>{screen}</Screen>}
    <img src={l.src} alt="" />
  </div>
}

// Слоистая композиция баннера: масштабируется как единое целое от ширины контейнера.
// frame — общая рамка (по волне-«М»), чтобы разные композиции стояли одинаково; only — какие слои рисовать.
export function BannerArt({ art, className = '', screen, only }: { art: Art; className?: string; screen?: ReactNode; only?: (l: Layer) => boolean }) {
  const f = art.frame ?? { x: 0, y: 0, w: art.w, h: art.h }
  return <div className={`art ${className}`} style={{ '--art-w': f.w, aspectRatio: `${f.w} / ${f.h}` } as CSSProperties} aria-hidden="true">
    {art.layers.map((l, i) => (!only || only(l)) && renderLayer({ ...l, x: l.x - f.x, y: l.y - f.y }, i, screen))}
  </div>
}
