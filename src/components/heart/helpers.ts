const MINIMUM_PARTICLES = 12
const MAXIMUM_PARTICLES = 50

const MIN_DISTANCE = 30
const MAX_DISTANCE = 45

type ParticleProperties = {
  angle: number
  distance: number
  color: string
  disperseDuration: number
}

const basicAnimation = (index: number): ParticleProperties => ({
  angle: 360 - 30 * index,
  distance: index % 2 ? 40 : 50,
  color: 'white',
  disperseDuration: 600,
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
      const color = generateRandomColor(chaos)
      particles.push({
        angle,
        color,
        distance,
        disperseDuration: linearConversion(
          distance,
          MIN_DISTANCE,
          MAX_DISTANCE,
          600,
          1000,
        ),
      })
    }
  }

  return particles
}

// https://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
export function generateRandomColor(chaos: number) {
  let red = Math.floor(Math.random() * 256)
  let green = Math.floor(Math.random() * 256)
  let blue = Math.floor(Math.random() * 256)

  const b = chaos & 0xff,
    g = (chaos & 0xff00) >>> 8,
    r = (chaos & 0xff0000) >>> 16
  red = (red + r) / 2
  green = (green + g) / 2
  blue = (blue + b) / 2

  return `rgb(${red}, ${green}, ${blue})`
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
