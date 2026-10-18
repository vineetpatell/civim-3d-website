import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo, type Breadcrumb } from '../lib/seo'

/**
 * Shared shell for the four legal / policy pages.
 *
 * These are IMPLEMENTATION DRAFTS, not legal advice. Every page carries a
 * visible review banner so the business owner must confirm the policy with a
 * legal adviser before launch. No return window, refund deadline, delivery
 * timeline, shipping fee, encryption or retention period is stated here unless
 * the business confirms it — those are marked as TODO(CONFIRM).
 */

const CRUMBS: Breadcrumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Policies', path: '/privacy-policy' },
]

interface LegalPageProps {
  /** Unique <title> suffix — the page name. */
  title: string
  /** Unique meta description for this policy page. */
  description: string
  path: string
  heading: string
  intro: string
  /** Last-reviewed note shown under the intro. */
  updated: string
  children: ReactNode
}

/** A titled prose block used across the policy pages. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="legal__block" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  )
}

/**
 * Highlighted "to be confirmed" marker. Used wherever a real policy value must
 * be supplied by the business owner before launch.
 */
export function Confirm({ children }: { children: ReactNode }) {
  return <mark className="legal__confirm">{children}</mark>
}

export function LegalPage({
  title,
  description,
  path,
  heading,
  intro,
  updated,
  children,
}: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={description} path={path} breadcrumbs={CRUMBS} />

      <section className="section page-hero page-hero--tight" aria-labelledby="legal-h">
        <div className="shell narrow">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li aria-current="page">{heading}</li>
            </ol>
          </nav>
          <span className="eyebrow">Policy</span>
          <h1 id="legal-h">{heading}</h1>
          <p className="lede">{intro}</p>
          <p className="legal__updated">{updated}</p>
        </div>
      </section>

      <section className="section page-section page-section--flush" aria-label={`${heading} details`}>
        <div className="shell narrow legal">
          <div className="legal__draft" role="note">
            <strong>Draft for review — not yet published policy.</strong>
            <p>
              This page describes how the CIVIM GRAINS website currently works. It is an
              implementation draft that must be reviewed and approved by the business owner
              with appropriate legal advice before launch. Items marked{' '}
              <Confirm>to be confirmed</Confirm> are policy decisions that only the business
              owner can set.
            </p>
          </div>

          {children}

          <div className="legal__block">
            <h2>Questions about this policy</h2>
            <p>
              Contact us at <a href="mailto:support@civimgrains.com">support@civimgrains.com</a>{' '}
              or on <a href="tel:+918450912454">+91 8450912454</a>. Privacy and
              data-protection enquiries can be sent to the same address and will be routed to
              the responsible contact. <Confirm>Nominate the specific privacy contact.</Confirm>
            </p>
          </div>

          <nav className="legal__siblings" aria-label="Other policies">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/return-refund-policy">Return &amp; Refund Policy</Link>
            <Link to="/data-protection">Data Protection</Link>
          </nav>
        </div>
      </section>
    </>
  )
}
