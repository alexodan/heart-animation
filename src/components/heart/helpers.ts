const MINIMUM_PARTICLES = 12
const MAXIMUM_PARTICLES = 100
const MIN_DISTANCE = 25
const MAX_DISTANCE = 40
const MIN_DISPERSE_DURATION = 400
const MAX_DISPERSE_DURATION = 1200
const MIN_FADE_DURATION = 400
const MAX_FADE_DURATION = 1500

type ParticleProperties = {
  angle: number
  distance: number
  color: string
  disperseDuration: number
  fadeDelay: string
  fadeDuration: string
  oppositeColor?: string
  size: string
}

type HSLColor = {
  h: number
  s: number
  l: number
  hsl: string
}

const basicAnimation = (index: number): ParticleProperties => ({
  angle: 360 - 30 * index,
  distance: index % 2 ? 30 : 36,
  color: 'white',
  disperseDuration: 600,
  fadeDuration: `500ms`,
  fadeDelay: '600ms',
  oppositeColor: 'white',
  size: `8px`,
})

/**
 * This function returns an array of particle objects with properties that are derived from the `chaos`
 * parameter. More chaos means more particles but also distance and velocity randomness. Not all particles
 * travel to the same distance, and neither they do at the same speed. It will also make them "sparkle"
 * (twinkle?) or not if chaos = 0.
 *
 * The formula to calculate that correlation is a linear conversion (see function `linearConversion`).
 * Let's say a particle travels 50px, then I want it to go at a certain speed (which is the animation duration),
 * so as an example, I need to map 50px to 500ms, and the same occurs with other properties (particle amount, color, etc).
 */
export function getParticles(chaos: number): ParticleProperties[] {
  const randomAmount = Math.round(
    linearConversion(chaos, 0, 100, MINIMUM_PARTICLES, MAXIMUM_PARTICLES),
  )
  const amount = Math.max(MINIMUM_PARTICLES, randomAmount)
  const particles: ParticleProperties[] = []

  for (let i = 0; i < amount; i++) {
    if (chaos === 0) {
      particles.push(basicAnimation(i))
    } else {
      // TODO: the "natural" random doesn't feel right in the animation,
      // particles are disperse through a particular quadrant sometimes.
      const angle = Math.random() * 360
      // TODO: colors are not harmonic, replace generator
      const distance = randomBetween(MIN_DISTANCE, MAX_DISTANCE)
      const color = generateRandomColor()
      const oppositeColor = getOppositeColor(color)
      const disperseDuration = linearConversion(
        distance,
        MIN_DISTANCE,
        MAX_DISTANCE,
        MIN_DISPERSE_DURATION,
        MAX_DISPERSE_DURATION,
      )
      const fadeDuration =
        linearConversion(
          distance,
          MIN_DISTANCE,
          MAX_DISTANCE,
          MIN_FADE_DURATION,
          MAX_FADE_DURATION,
        ) + 'ms'
      const fadeDelay =
        linearConversion(distance, MIN_DISTANCE, MAX_DISTANCE, 400, 600) + 'ms'
      const size = randomBetween(5, 10) + 'px'
      particles.push({
        angle,
        color: color.hsl,
        disperseDuration,
        distance,
        fadeDelay,
        fadeDuration,
        oppositeColor: oppositeColor,
        size,
      })
    }
  }

  return particles
}

function generateRandomColor(): HSLColor {
  const h = randomBetween(1, 360)
  const s = randomBetween(0, 100)
  const l = randomBetween(0, 100)
  return { h, s, l, hsl: 'hsl(' + h + ',' + s + '%,' + l + '%)' }
}

export function getOppositeColor(hsl: HSLColor) {
  return `hsl(${hsl.h + 180}deg ${hsl.s}% ${hsl.l}%)`
}

/**
 * Convert a number range to another range, maintaining ratio
 * Source: https://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
 */
function linearConversion(
  oldValue: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
): number {
  return newMin + ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
