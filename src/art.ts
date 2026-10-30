// Композиции баннеров из концепции Figma. Координаты — в пикселях макета,
// отсчёт от левого верхнего угла композиции (W × H).

export type Point = [number, number]

export type Layer =
  | { kind: 'orbit'; src: string; x: number; y: number; w: number; h: number; iw: number; ih: number; rot: number }
  | { kind: 'img'; src: string; x: number; y: number; w: number; h: number; float?: boolean }
  | {
      kind: 'masked'; src: string; x: number; y: number; w: number; h: number
      mask: string; mx: number; my: number; mw: number; mh: number
      // Экран интерфейса под фото с вырезанным дисплеем: углы в координатах фото.
      screen?: { quad: [Point, Point, Point, Point] }
    }

// frame — видимая рамка композиции; если не задана, рамка совпадает с w × h.
export type Art = { w: number; h: number; frame?: { x: number; y: number; w: number; h: number }; layers: Layer[] }

// Слайд 1215:305 — репетитор с ноутбуком.
export const heroArt: Art = {
  w: 1325, h: 887,
  layers: [
    { kind: 'orbit', src: '/brand/orbit-top.svg', x: 305, y: 5, w: 957.553, h: 733.775, iw: 924.756, ih: 313.382, rot: 30 },
    { kind: 'img', src: '/brand/wave.svg', x: 54, y: 219, w: 1271, h: 667.742 },
    { kind: 'orbit', src: '/brand/orbit-bottom.svg', x: 179.031, y: 406.48, w: 1083.785, h: 474.359, iw: 1047.97, ih: 300.033, rot: -9.82 },
    { kind: 'img', src: '/brand/objects.webp', x: 373, y: 21, w: 451.104, h: 385, float: true },
    { kind: 'masked', src: '/brand/tutor.webp', x: 59, y: 169, w: 1324, h: 750, mask: '/brand/tutor-mask.svg', mx: -58.883, my: -56.789, mw: 1324.891, mh: 774.531 },
  ],
}

// Кадр 1351:401 — ноутбук; в дисплей подставляется экран Метрики.
export const laptopArt: Art = {
  w: 1271, h: 1020,
  frame: { x: 0, y: -9.53, w: 1271, h: 908 },
  layers: [
    { kind: 'orbit', src: '/brand/tutor-laptop/orbit-top.svg', x: 184.95, y: 88.91, w: 826.355, h: 490.423, iw: 775.112, ih: 300.033, rot: 15 },
    { kind: 'img', src: '/brand/tutor-laptop/wave.svg', x: 0, y: 230.47, w: 1271, h: 667.742 },
    { kind: 'orbit', src: '/brand/tutor-laptop/orbit-bottom.svg', x: 222.92, y: 232.64, w: 1085.949, h: 655.087, iw: 1047.97, ih: 300.033, rot: -20.96 },
    {
      kind: 'masked', src: '/brand/tutor-laptop/photo-hole.webp', x: 266, y: -180, w: 1097, h: 1353,
      mask: '/brand/tutor-laptop/mask.svg', mx: -266, my: 180, mw: 1271, mh: 898.219,
      // Measured from the photo's alpha aperture (1129 × 1393), converted to
      // this layer's coordinates, with a 3px overlap beneath the opaque bezel.
      screen: { quad: [[44.6, 422.59], [777.68, 300.24], [880.38, 808.53], [142.0, 943.7]] },
    },
  ],
}

// Слайд 1215:326 — ученик с планшетом.
export const studentArt: Art = {
  w: 1351, h: 882,
  frame: { x: 80, y: -26, w: 1271, h: 908 },
  layers: [
    { kind: 'orbit', src: '/brand/student/orbit-top.svg', x: 330.99, y: 0, w: 957.553, h: 733.775, iw: 924.756, ih: 313.382, rot: 150 },
    { kind: 'img', src: '/brand/student/wave.svg', x: 80, y: 214, w: 1271, h: 667.742 },
    { kind: 'orbit', src: '/brand/student/orbit-bottom.svg', x: 255.03, y: 399.47, w: 1083.785, h: 474.359, iw: 1047.97, ih: 300.033, rot: -9.82 },
    { kind: 'img', src: '/brand/student/objects.webp', x: 326, y: 27.02, w: 468, h: 312, float: true },
    { kind: 'masked', src: '/brand/student/photo.webp', x: 66, y: 160, w: 1461, h: 828, mask: '/brand/student/mask.svg', mx: -65.68, my: -91.016, mw: 1350.68, mh: 812.75 },
  ],
}

// Слайд 1215:342 — родитель с телефоном.
export const parentArt: Art = {
  w: 1271, h: 887,
  frame: { x: 0, y: -21, w: 1271, h: 908 },
  layers: [
    { kind: 'orbit', src: '/brand/parent/orbit-top.svg', x: 21, y: 0, w: 957.553, h: 733.775, iw: 924.756, ih: 313.382, rot: 30 },
    { kind: 'img', src: '/brand/parent/wave.svg', x: 0, y: 219, w: 1271, h: 667.742 },
    { kind: 'orbit', src: '/brand/parent/orbit-bottom.svg', x: 125.03, y: 406.48, w: 1083.785, h: 474.359, iw: 1047.97, ih: 300.033, rot: -9.82 },
    { kind: 'img', src: '/brand/parent/objects.webp', x: 240, y: 13, w: 412, h: 412, float: true },
    { kind: 'masked', src: '/brand/parent/photo.webp', x: 47, y: 156, w: 1399.51, h: 793, mask: '/brand/parent/mask.svg', mx: -47, my: -43.789, mw: 1271, mh: 774.531 },
  ],
}

// Кадр 1351:185 — ИИ-звезда над стопкой тетрадей.
export const aiArt: Art = {
  w: 1271, h: 882,
  frame: { x: 0, y: -82.53, w: 1271, h: 908 },
  layers: [
    { kind: 'orbit', src: '/brand/ai/orbit-top.svg', x: 214.95, y: 97.91, w: 826.355, h: 490.423, iw: 775.112, ih: 300.033, rot: 15 },
    { kind: 'img', src: '/brand/ai/wave.svg', x: 0, y: 157.47, w: 1271, h: 667.742 },
    { kind: 'orbit', src: '/brand/ai/orbit-bottom.svg', x: 215, y: 357, w: 1083.785, h: 474.359, iw: 1047.97, ih: 300.033, rot: -9.82 },
    { kind: 'masked', src: '/brand/ai/photo.webp', x: 232, y: 24, w: 858, h: 858, mask: '/brand/ai/mask.svg', mx: -232, my: -23.711, mw: 1271, mh: 824.93 },
  ],
}
