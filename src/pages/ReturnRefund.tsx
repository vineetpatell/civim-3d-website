import { LegalPage, LegalSection, Confirm } from '../components/LegalPage'

/**
 * Return & Refund Policy.
 *
 * HARD RULE: no return window, no refund deadline and no unconditional return
 * promise is stated anywhere in this page, because none has been set by the
 * business. Every policy value is an explicit, clearly marked setting for the
 * owner to confirm before launch.
 */
export function ReturnRefundPage() {
  return (
    <LegalPage
      title="Return & Refund Policy — CIVIM GRAINS"
      description="What to do if your CIVIM GRAINS order arrives damaged, incorrect, defective or incomplete, and the policy settings that must be confirmed before launch."
      path="/return-refund-policy"
      heading="Return & Refund Policy"
      intro="How we handle orders that arrive damaged, incorrect, defective or with items missing."
      updated="Last reviewed: pending business sign-off. No effective date is claimed until this page is approved."
    >
      <div className="legal__draft legal__draft--strong" role="note">
        <strong>Action required before launch.</strong>
        <p>
          This page does <strong>not</strong> state a return window, a refund deadline, or an
          unconditional return promise, because those values have not been set by the business.
          The sections below explain the process and mark each unresolved setting for the
          business owner to confirm. Do not publish this page to customers until every marked
          item has been filled in.
        </p>
      </div>

      <LegalSection id="rr-scope" title="What this policy covers">
        <p>This policy applies when an order arrives:</p>
        <ul>
          <li>
            <strong>Damaged</strong> — the pack or product is damaged on arrival, for example a
            leaking or crushed bottle.
          </li>
          <li>
            <strong>Incorrect</strong> — you receive a product you did not order.
          </li>
          <li>
            <strong>Defective</strong> — the product is spoiled or otherwise unfit in a way you
            can demonstrate.
          </li>
          <li>
            <strong>Missing items</strong> — the order is incomplete compared with what was
            confirmed.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="rr-how" title="How to report a problem">
        <p>Please contact us as soon as you notice the problem:</p>
        <ol>
          <li>
            Call or WhatsApp CIVIM GRAINS on <a href="tel:+918450912454">+91 8450912454</a>, or
            email <a href="mailto:support@civimgrains.com">support@civimgrains.com</a>.
          </li>
          <li>
            Tell us your name, the mobile number you ordered from, the approximate order date and
            what arrived.
          </li>
          <li>
            Where relevant, send photographs of the product and its pack, including the label and
            the batch code if it is visible.
          </li>
        </ol>
        <p>
          Reporting early helps us resolve it quickly and helps us catch any packing or handling
          problem.
        </p>
      </LegalSection>

      <LegalSection id="rr-window" title="Reporting window — TO BE CONFIRMED">
        <p>
          <Confirm>
            Set the number of days within which a customer must report a damaged, incorrect,
            defective or missing item, counted from delivery. Nothing is stated on the live site
            until this is set.
          </Confirm>
        </p>
        <p>
          <Confirm>
            Confirm whether a report must include photographs, and whether the original pack must
            be retained and returned.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="rr-remedy" title="What we will do — TO BE CONFIRMED">
        <p>
          Once a report is verified, the remedy will be one of the options the business selects
          below. Only the selected option should be published.
        </p>
        <ul className="legal__checklist">
          <li>
            <Confirm>Replacement of the affected item — allowed? Yes / No</Confirm>
          </li>
          <li>
            <Confirm>Refund of the affected item — allowed? Yes / No</Confirm>
          </li>
          <li>
            <Confirm>Credit against a future order — allowed? Yes / No</Confirm>
          </li>
          <li>
            <Confirm>
              Refund of the delivery charge where the whole order is unusable — Yes / No
            </Confirm>
          </li>
        </ul>
        <p>
          For Cash on Delivery orders, confirm how a refund is actually paid out, because no
          online payment was taken.{' '}
          <Confirm>
            State the refund method (UPI / bank transfer / cash) and who arranges it.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="rr-timeline" title="Refund timeline — TO BE CONFIRMED">
        <p>
          <Confirm>
            State the number of working days from verification to refund or replacement. No
            deadline is published on the site until this is set.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="rr-not-covered" title="What is not covered — TO BE CONFIRMED">
        <p>Confirm which of the following exclusions apply:</p>
        <ul className="legal__checklist">
          <li>
            <Confirm>
              Change of mind after the order is confirmed — excluded? Yes / No
            </Confirm>
          </li>
          <li>
            <Confirm>
              Damage caused after delivery, including storage or handling by the customer —
              excluded? Yes / No
            </Confirm>
          </li>
          <li>
            <Confirm>
              Orders where the customer could not be reached or was unavailable to receive —
              excluded? Yes / No
            </Confirm>
          </li>
          <li>
            <Confirm>
              Variation in colour, aroma or sediment typical of cold pressed oil — excluded?
              Yes / No
            </Confirm>
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="rr-cod" title="Cash on Delivery orders">
        <p>
          Because Cash on Delivery is paid at the door, please check the product before paying
          where possible. If you have already paid and something is wrong, report it using the
          steps above and the confirmed remedy will apply.
        </p>
        <p>
          <Confirm>
            Confirm whether a customer may refuse a Cash on Delivery order at the door when it is
            visibly damaged, and whether any refusal charge applies.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="rr-cancel" title="Cancelling before dispatch">
        <p>
          You can ask us to cancel an order at any point before we confirm it, by contacting us
          on +91 8450912454. After confirmation, cancellation depends on the stage the order has
          reached — see the Terms &amp; Conditions.
        </p>
      </LegalSection>

      <LegalSection id="rr-contact" title="Contact us about a return">
        <p>
          CIVIM GRAINS — <a href="tel:+918450912454">+91 8450912454</a> or{' '}
          <a href="mailto:support@civimgrains.com">support@civimgrains.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
