'use client'

import { useEffect, useState } from 'react'
import type { CountdownBlock } from '@/types'

interface CountdownBlockComponentProps {
  block: CountdownBlock
}

export function CountdownBlockComponent({ block }: CountdownBlockComponentProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(block.targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [block.targetDate])

  const containerStyle: React.CSSProperties = {
    paddingTop: `${block.style.padding.top}px`,
    paddingRight: `${block.style.padding.right}px`,
    paddingBottom: `${block.style.padding.bottom}px`,
    paddingLeft: `${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    backgroundColor: block.style.backgroundColor,
  }

  const numberStyle: React.CSSProperties = {
    fontSize: `${block.style.fontSize}px`,
    fontWeight: block.style.fontWeight,
    fontFamily: block.style.fontFamily,
    color: block.style.color,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: `${block.style.fontSize * 0.4}px`,
    color: block.style.labelColor || block.style.color,
    fontFamily: block.style.fontFamily,
  }

  const showDays = block.displayFormat === 'dhms'
  const showHours = block.displayFormat === 'dhms' || block.displayFormat === 'hms'

  return (
    <div style={containerStyle}>
      {block.label && (
        <div style={labelStyle} className="mb-2 text-center">
          {block.label}
        </div>
      )}
      <div className="flex gap-4 justify-center">
        {showDays && (
          <div className="text-center">
            <div style={numberStyle}>{timeLeft.days}</div>
            <div style={labelStyle}>Days</div>
          </div>
        )}
        {showHours && (
          <div className="text-center">
            <div style={numberStyle}>{timeLeft.hours}</div>
            <div style={labelStyle}>Hours</div>
          </div>
        )}
        <div className="text-center">
          <div style={numberStyle}>{timeLeft.minutes}</div>
          <div style={labelStyle}>Minutes</div>
        </div>
        <div className="text-center">
          <div style={numberStyle}>{timeLeft.seconds}</div>
          <div style={labelStyle}>Seconds</div>
        </div>
      </div>
    </div>
  )
}
