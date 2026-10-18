import { LegalPage, LegalSection, Confirm } from '../components/LegalPage'

/**
 * Terms & Conditions — ordering, pricing, order acceptance, payment, COD,
 * delivery, cancellation and customer responsibilities.
 *
 * HARD RULES for this page: no invented shipping fee, no invented delivery
 * timeline, no business guarantee. It states plainly that a WhatsApp message
 * being opened or sent is NOT verified payment or automatic order confirmation.
 */
export function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions — CIVIM GRAINS"
      description="The terms that apply when you order from CIVIM GRAINS: pricing, order acceptance, payment, Cash on Delivery, delivery, cancellations and your responsibilities as a customer."
      path="/terms-and-conditions"
      heading="Terms & Conditions"
      intro="These terms apply when you order from CIVIM GRAINS through this website. Please read them before placing an order."
      updated="Last reviewed: pending business sign-off. No effective date is claimed until this page is approved."
    >
      <LegalSection id="tc-agreement" title="1 · About these terms">
        <p>
          This website is operated by CIVIM GRAINS. By placing an order request through
          checkout, you agree to these terms. If you do not agree with any part of them, please
          do not place an order — you are welcome to contact us with questions first.
        </p>
        <p>
          CIVIM GRAINS may update these terms. The version shown on this page at the time you
          order is the version that applies to that order.
        </p>
      </LegalSection>

      <LegalSection id="tc-ordering" title="2 · How ordering works">
        <p>
          Placing an order through this website is an <strong>order request</strong>, not a
          completed purchase. The flow is:
        </p>
        <ol>
          <li>You review your shopping bag and confirm quantities.</li>
          <li>You enter your delivery address and contact details.</li>
          <li>You choose a payment method.</li>
          <li>You review the complete order summary, including the final total.</li>
          <li>
            You continue to WhatsApp, where your order is prefilled for you to review and send
            to CIVIM GRAINS on +91 8450912454.
          </li>
        </ol>
        <p>
          <strong>Please read this carefully.</strong> A WhatsApp message being opened or sent
          is <strong>not</strong> equivalent to verified payment or automatic order
          confirmation. It is a request that our team must accept. Your order is confirmed only
          when CIVIM GRAINS confirms it to you.
        </p>
        <p>
          We may decline an order request — for example, if a product is unavailable, if the
          delivery address cannot be served, or if the details provided are incomplete. If we
          decline, we will tell you.
        </p>
      </LegalSection>

      <LegalSection id="tc-pricing" title="3 · Products and pricing">
        <p>
          All prices are shown in Indian Rupees (₹) and are inclusive of what is displayed at
          checkout. As an example of the current verified pricing, CIVIM GRAINS Mustard Oil is{' '}
          <strong>₹280 per 1 litre</strong> (2 litres = ₹560, 3 litres = ₹840).
        </p>
        <p>
          Line totals are calculated from the quantity you choose. We do not apply a discount
          that is not shown to you. If a product does not yet have a confirmed price, it is
          marked <em>Price to be confirmed</em> and cannot be checked out — we will not
          estimate a price on your behalf.
        </p>
        <p>
          Prices may change. The price that applies to your order is the price shown in the
          order summary you reviewed before sending it.
        </p>
        <p>
          Product images are representative. Please rely on the actual product label for
          definitive ingredient, storage and other product information.
        </p>
      </LegalSection>

      <LegalSection id="tc-availability" title="4 · Availability">
        <p>
          We do not publish a live stock figure on this website, because availability is not
          connected to a real inventory feed. Availability is confirmed by our team when they
          accept your order. If a product you requested is unavailable, we will contact you.
        </p>
      </LegalSection>

      <LegalSection id="tc-payment" title="5 · Payment">
        <h3>Cash on Delivery</h3>
        <p>
          Cash on Delivery is available. You pay in cash when your order arrives. Nothing is
          charged online and no payment is taken in advance.
        </p>

        <h3>Online payment</h3>
        <p>
          Online payment is offered only when a verified payment provider has been connected to
          this website. <strong>No online payment provider is connected today</strong>, so the
          online payment option is shown as disabled and cannot be selected. We will not
          simulate or display a successful payment that a real provider has not verified.
        </p>
        <p>
          When online payment is enabled, orders and payment verification will be handled by our
          server with the provider's credentials held server-side. Payment card details will
          never be handled by this front-end code.
        </p>
        <p>
          <Confirm>
            Confirm which payment provider will be used and whether online payment will be
            offered at launch.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="tc-delivery" title="6 · Delivery">
        <p>
          You are asked for a complete delivery address, including a valid six-digit Indian PIN
          code. Deliverability for your PIN code is confirmed by our team during order
          processing — this website does not claim that any particular PIN code is serviceable,
          because no serviceability rule is configured here.
        </p>
        <p>
          If a delivery charge is configured, it is shown as a separate line in your order
          summary before you send the order. If none is configured, no delivery charge is shown
          and none is charged.
        </p>
        <p>
          Someone must be available to receive the order and, for Cash on Delivery, to make the
          payment. Please share delivery instructions if there is anything we should know.
        </p>
        <p>
          <Confirm>
            State the delivery areas actually served, the delivery charge (or confirm that
            delivery is free), and the delivery timeline the business can commit to. None of
            these is stated on the website because none has been confirmed.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="tc-cancel" title="7 · Cancellations and changes">
        <p>
          Because an order is only a request until we accept it, you can contact us on +91
          8450912454 at any point before we confirm it and ask us to change or cancel it.
        </p>
        <p>
          Once an order has been confirmed and dispatched, changes and cancellations depend on
          the stage the order has reached. Please contact us immediately and we will tell you
          what is possible.
        </p>
        <p>
          <Confirm>
            Confirm the cancellation window after confirmation that the business will commit to,
            and whether any cancellation charge applies.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="tc-returns" title="8 · Damaged, incorrect or missing products">
        <p>
          If your order arrives damaged, incorrect, defective, or with items missing, please
          contact us as soon as possible with your order details and photographs where relevant.
          Our full position is set out in the Return &amp; Refund Policy.
        </p>
        <p>
          <strong>No return window, refund deadline or unconditional return promise is stated
          here</strong>, because those policy values have not yet been set by the business. They
          must be confirmed before launch.
        </p>
      </LegalSection>

      <LegalSection id="tc-responsibilities" title="9 · Your responsibilities">
        <p>When you place an order, you confirm that:</p>
        <ul>
          <li>
            The name, mobile number and delivery address you provide are accurate and complete.
          </li>
          <li>
            The mobile number is reachable, so we can contact you about the order and arrange
            delivery.
          </li>
          <li>
            You will be available at the delivery address to receive the order and, for Cash on
            Delivery, to pay for it.
          </li>
          <li>
            You have reviewed the order summary, including quantities and the final total,
            before sending it.
          </li>
        </ul>
        <p>
          Please do not enter another person's details without their permission. You are
          responsible for the accuracy of the information you provide.
        </p>
      </LegalSection>

      <LegalSection id="tc-product-info" title="10 · Product information">
        <p>
          We describe our products only as supported by the pack label. We do not add nutritional
          figures, manufacturing temperatures, certifications, health benefits, or descriptions
          such as organic or chemical-free that are not verified on the label. Please refer to
          the actual product label for definitive information.
        </p>
      </LegalSection>

      <LegalSection id="tc-liability" title="11 · Liability and governing law">
        <p>
          Nothing in these terms limits any right you have under applicable Indian law that
          cannot lawfully be limited. Our liability for an order is limited to the amount you
          paid for that order.
        </p>
        <p>
          <Confirm>
            Confirm the governing law and jurisdiction clause with legal advice, including the
            correct registered business name and address to use in these terms.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="tc-contact" title="12 · Contacting us">
        <p>
          For anything to do with an order or these terms, contact CIVIM GRAINS on +91 8450912454
          or at support@civimgrains.com.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
