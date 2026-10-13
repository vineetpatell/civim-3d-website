import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Accessible accordion FAQ.
 * Semantic <button> controls (full keyboard support), aria-expanded /
 * aria-controls wiring, and `hidden` panels — one shared treatment used by
 * the Home / About / Shop / Contact FAQ sections with page-specific copy.
 */
export function Faq({ items, idPrefix }: { items: FaqItem[]; idPrefix: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${idPrefix}-btn-${i}`
        const panelId = `${idPrefix}-panel-${i}`
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={btnId}>
            <h3 className="faq__heading">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="faq__btn"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  {isOpen ? '–' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="faq__panel"
            >
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
