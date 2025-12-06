import { useState } from 'react'
import { HeartIcon } from './HeartIcon'
import styles from './heart.module.css'

export function Heart() {
  const [isActive, setIsActive] = useState(false)

  return (
    <button
      // how to a11y?
      aria-label="like"
      onClick={() => setIsActive(!isActive)}
      className={styles.wrapper}
    >
      <span
        className={`${styles.circle} ${isActive ? styles.animating : ''}`}
      />
      <HeartIcon isActive={isActive} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12
        const distance = i % 2 ? 40 : 50
        return (
          <span
            key={i}
            style={
              {
                '--angle': `${angle}deg`,
                '--distance': `-${distance}px`,
              } as React.CSSProperties
            }
            className={`${styles.particle} ${isActive ? styles.animating : ''}`}
          />
        )
      })}
    </button>
  )
}
