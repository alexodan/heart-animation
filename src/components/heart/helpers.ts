/**
 * This function returns an array of particle objects with properties that are derived from the `chaos`
 * parameter. More chaos means more particles but also distance and velocity randomness. Not all particles
 * travel to the same distance, and neither they do at the same speed. It will also make them "sparkle"
 * (twinkle?) or not if chaos = 0.
 *
 * The formula is just a linear proggression => MIN + MAX / (100 / chaos):
 * Let's say I want minimum 10 particles and maximum 50,
 * 10 chaos will be 6 (so it actually returns 10 as is less than minimum)
 * ...
 * 50 chaos will be 30
 * ...
 * 100 chaos will be 50
 *
 * And actually all the others derive from a similar calculation, speed, distance, all oscilate between a range [a, b].
 */
const MINIMUM_PARTICLES = 12
const MAXIMUM_PARTICLES = 50

export function getParticles(chaos: number) {
  const randomAmount =
    (MINIMUM_PARTICLES + MAXIMUM_PARTICLES) / (100 / Math.min(1, chaos))
  const amount = Math.max(MINIMUM_PARTICLES, randomAmount)
  return {
    particles: Array.from({
      length: amount,
    }).map((_, index) => {
      // TODO: the "natural" random doesn't feel right in the animation,
      // particles are disperse through a particular quadrant sometimes.
      const angle = chaos === 0 ? 360 - 30 * index : Math.random() * 360
      // TODO: colors are not harmonic, replace generator
      const color = chaos === 0 ? 'white' : generateRandomColor(chaos)
      return { angle, color }
    }),
  }
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
