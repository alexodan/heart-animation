import { useState } from 'react'
import { HeartIcon } from './HeartIcon'
import { getParticles } from './helpers'

import styles from './heart.module.css'

export function HeartDemo() {
  const [isActive, setIsActive] = useState(false)
  const [chaos, setChaos] = useState(0)

  const particles = isActive ? getParticles(chaos) : []

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
            return (
              <span
                key={i}
                style={
                  {
                    '--angle': `${particle.angle}deg`,
                    '--distance': `-${particle.distance}px`,
                    '--color': particle.color,
                    '--disperse-duration': `${particle.disperseDuration}ms`,
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
