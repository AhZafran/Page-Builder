'use client'

import { useState } from 'react'
import type { NewsletterBlock as NewsletterBlockType } from '@/types'

interface NewsletterBlockProps {
  block: NewsletterBlockType
  sectionId: string
}

export function NewsletterBlock({ block, sectionId }: NewsletterBlockProps) {
  const { heading, description, inputPlaceholder, buttonText, successMessage, showPrivacyCheckbox, privacyText, style } = block
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    if (showPrivacyCheckbox && !agreed) return

    // In the actual implementation, this would send to an email service
    console.log('Newsletter signup:', email)
    setSubmitted(true)
    setEmail('')
    setAgreed(false)

    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  // Build styles
  const containerStyle: React.CSSProperties = {
    padding: `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`,
    margin: `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px`,
    backgroundColor: style.backgroundColor,
    borderRadius: `${style.borderRadius}px`,
  }

  const headingStyle: React.CSSProperties = {
    color: style.headingColor,
    fontSize: `${style.headingSize}px`,
    fontWeight: style.headingWeight,
    textAlign: style.headingAlign,
    margin: 0,
    marginBottom: description ? `${style.gap}px` : 0,
  }

  const descriptionStyle: React.CSSProperties = {
    color: style.descriptionColor,
    fontSize: `${style.descriptionSize}px`,
    textAlign: style.descriptionAlign,
    margin: 0,
    marginBottom: `${style.gap}px`,
  }

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: style.layout === 'inline' ? 'row' : 'column',
    gap: `${style.gap}px`,
    alignItems: style.layout === 'inline' ? 'center' : 'stretch',
  }

  const inputStyle: React.CSSProperties = {
    flex: style.layout === 'inline' ? 1 : 'none',
    padding: `${style.inputPadding}px`,
    backgroundColor: style.inputBackgroundColor,
    color: style.inputTextColor,
    border: `${style.inputBorderWidth}px solid ${style.inputBorderColor}`,
    borderRadius: `${style.inputBorderRadius}px`,
    fontSize: '14px',
    outline: 'none',
  }

  const buttonStyle: React.CSSProperties = {
    padding: `${style.buttonPadding}px ${style.buttonPadding * 2}px`,
    backgroundColor: style.buttonBackgroundColor,
    color: style.buttonTextColor,
    border: 'none',
    borderRadius: `${style.buttonBorderRadius}px`,
    fontSize: `${style.buttonFontSize}px`,
    fontWeight: style.buttonFontWeight,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginTop: `${style.gap}px`,
  }

  const checkboxLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: style.descriptionColor,
    lineHeight: '1.5',
  }

  const successStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: `${style.borderRadius}px`,
    textAlign: 'center',
    fontWeight: 500,
    marginTop: `${style.gap}px`,
  }

  return (
    <div style={containerStyle}>
      {heading && <h3 style={headingStyle}>{heading}</h3>}
      {description && <p style={descriptionStyle}>{description}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          placeholder={inputPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={showPrivacyCheckbox && !agreed}
          style={{
            ...buttonStyle,
            opacity: showPrivacyCheckbox && !agreed ? 0.5 : 1,
            cursor: showPrivacyCheckbox && !agreed ? 'not-allowed' : 'pointer',
          }}
        >
          {buttonText}
        </button>
      </form>

      {showPrivacyCheckbox && (
        <div style={checkboxContainerStyle}>
          <input
            type="checkbox"
            id={`privacy-${block.id}`}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: '4px' }}
          />
          <label htmlFor={`privacy-${block.id}`} style={checkboxLabelStyle}>
            {privacyText}
          </label>
        </div>
      )}

      {submitted && (
        <div style={successStyle}>
          {successMessage}
        </div>
      )}
    </div>
  )
}
