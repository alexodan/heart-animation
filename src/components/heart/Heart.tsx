import { useState } from 'react'
import { HeartIcon } from './HeartIcon'
import styles from './heart.module.css'

// const { particles } = useParticles(); [{ angle: ..., distance: ..., color: ... }, {...}, {...}]

/**
 * This function returns an array of particle objects with properties that are derived from the `chaos`
 * parameter. More chaos means more particles and also distance randomness. It will make
 * the particles "sparkle" (twinkle?) or not too (the flashy appearance and disappearance (still TODO)).
 *
 * The formula is just a linear proggression => MIN + MAX / (100 / chaos):
 * Let's say I want minimum 10 particles and maximum 50,
 * 10 chaos will be 6 (so it actually returns 10 as is less than minimum)
 * ...
 * 50 chaos will be 30
 * ...
 * 100 chaos will be 50
 */
const MINIMUM_PARTICLES = 12
const MAXIMUM_PARTICLES = 50

function getParticles(chaos: number) {
  const randomAmount =
    (MINIMUM_PARTICLES + MAXIMUM_PARTICLES) / (100 / Math.min(1, chaos))
  const amount = Math.max(MINIMUM_PARTICLES, randomAmount)
  return {
    particles: Array.from({
      length: amount,
    }).map(() => {
      // TODO: the "natural" random doesn't feel right in the animation,
      // particles are disperse through a particular quadrant sometimes.
      const angle = Math.random() * 360
      // TODO: colors are not harmonic, replace generator
      const color = chaos === 0 ? 'white' : generateRandomColor(chaos)
      return { angle, color }
    }),
  }
}

// https://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
function generateRandomColor(chaos: number) {
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

export function HeartDemo() {
  const [isActive, setIsActive] = useState(false)
  const [chaos, setChaos] = useState(0)

  const { particles } = isActive ? getParticles(chaos) : {}

  return (
    <>
      <button
        aria-label="like"
        onClick={() => setIsActive(!isActive)}
        className={styles.wrapper}
      >
        <span
          className={`${styles.circle} ${isActive ? styles.animating : ''}`}
        />
        <HeartIcon isActive={isActive} />
        {isActive &&
          particles?.map((particle, i) => {
            const distance = i % 2 ? 35 : 45
            return (
              <span
                key={i}
                style={
                  {
                    '--angle': `${particle.angle}deg`,
                    '--distance': `-${distance}px`,
                    '--color': particle.color,
                  } as React.CSSProperties
                }
                className={styles.particle}
              />
            )
          })}
      </button>
      <div className={styles.slider}>
        <label className={styles.sliderLabel} htmlFor="chaos">
          <span>Chaos </span>
          <span>{chaos}%</span>
        </label>
        <input
          className={styles.sliderInput}
          type="range"
          name="chaos"
          id="chaos"
          min="0"
          max="100"
          value={chaos}
          onChange={(e) => setChaos(+e.target.value)}
        />
      </div>
    </>
  )
}
