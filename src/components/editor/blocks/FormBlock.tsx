'use client'

import type { FormBlock as FormBlockType, FormField } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { useState } from 'react'

interface FormBlockProps {
  block: FormBlockType
  sectionId: string
}

export function FormBlock({ block, sectionId }: FormBlockProps) {
  const { selectedElement, selectElement } = useEditorStore()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const isSelected =
    selectedElement.type === 'block' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.blockId === block.id

  const containerStyle: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor,
    borderRadius: `${block.style.borderRadius}px`,
    padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
    marginTop: `${block.style.margin.top}px`,
    marginRight: `${block.style.margin.right}px`,
    marginBottom: `${block.style.margin.bottom}px`,
    marginLeft: `${block.style.margin.left}px`,
    fontFamily: block.style.fontFamily,
  }

  const labelStyle: React.CSSProperties = {
    color: block.style.labelColor,
    fontSize: `${block.style.labelSize}px`,
    fontWeight: 600,
    marginBottom: '8px',
    display: 'block',
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: block.style.inputBackgroundColor,
    border: `1px solid ${block.style.inputBorderColor}`,
    color: block.style.inputTextColor,
    borderRadius: `${block.style.inputBorderRadius}px`,
    padding: '12px 16px',
    fontSize: '14px',
    width: '100%',
    fontFamily: block.style.fontFamily,
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical' as const,
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: block.style.buttonBackgroundColor,
    color: block.style.buttonTextColor,
    borderRadius: `${block.style.buttonBorderRadius}px`,
    padding: '12px 24px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    fontFamily: block.style.fontFamily,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In editor mode, just show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const renderField = (field: FormField) => {
    const fieldStyle = { marginBottom: `${block.style.spacing}px` }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              style={inputStyle}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              required={field.required}
              style={textareaStyle}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <select
              required={field.required}
              style={inputStyle}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {field.options?.map((option, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: block.style.inputTextColor }}>
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) => {
                      const current = formData[field.id] || []
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((v: string) => v !== option)
                      setFormData({ ...formData, [field.id]: newValue })
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label}
              {field.required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {field.options?.map((option, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: block.style.inputTextColor }}>
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    required={field.required}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={containerStyle}
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        selectElement({ type: 'block', sectionId, blockId: block.id })
      }}
    >
      {/* Title */}
      {block.title && (
        <h3 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: block.style.labelColor,
          marginBottom: '8px',
        }}>
          {block.title}
        </h3>
      )}

      {/* Description */}
      {block.description && (
        <p style={{
          fontSize: '14px',
          color: block.style.inputTextColor,
          marginBottom: `${block.style.spacing}px`,
        }}>
          {block.description}
        </p>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 16px',
          borderRadius: `${block.style.inputBorderRadius}px`,
          marginBottom: `${block.style.spacing}px`,
          textAlign: 'center',
        }}>
          {block.successMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {block.fields.map(renderField)}

        {/* Submit Button */}
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          {block.submitButtonText}
        </button>
      </form>
    </div>
  )
}
