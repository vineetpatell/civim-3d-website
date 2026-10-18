import { LegalPage, LegalSection, Confirm } from '../components/LegalPage'

/**
 * Privacy Policy — describes what the checkout actually collects today and how
 * it is used. Deliberately does NOT claim encryption, automatic deletion, or
 * any technical safeguard that is not implemented. It accurately describes the
 * WhatsApp handoff, which is the only order channel currently connected.
 */
export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy — CIVIM GRAINS"
      description="How CIVIM GRAINS collects and uses the information you enter at checkout, how orders are handed off through WhatsApp, and how to contact us with privacy enquiries."
      path="/privacy-policy"
      heading="Privacy Policy"
      intro="What we collect when you place an order, why we collect it, and what happens to it. Written to match the way this website actually works today."
      updated="Last reviewed: pending business sign-off. No effective date is claimed until this page is approved."
    >
      <LegalSection id="pp-collect" title="What information we collect">
        <p>
          When you complete checkout, we ask only for the information needed to deliver an
          order:
        </p>
        <ul>
          <li>Full name</li>
          <li>Mobile number</li>
          <li>Email address (optional — leave it blank if you prefer)</li>
          <li>PIN code</li>
          <li>House or flat number, building or apartment name, street or road, and area or locality</li>
          <li>Landmark (optional)</li>
          <li>City, state and country (country defaults to India)</li>
          <li>Delivery instructions (optional)</li>
        </ul>
        <p>
          We also record the products, quantities, unit prices, line totals, subtotal, any
          configured delivery charge, the final total, and the payment method you selected.
          These make up the order itself.
        </p>
        <p>
          We do not collect payment card details on this website. Card details are never
          entered here.{' '}
          <Confirm>Confirm whether any payment provider collects data directly.</Confirm>
        </p>
      </LegalSection>

      <LegalSection id="pp-purpose" title="Why we collect it">
        <p>We use this information only to:</p>
        <ul>
          <li>Process your order request</li>
          <li>Deliver your order to the address you provide</li>
          <li>Contact you about that order, including confirming it and arranging delivery</li>
          <li>Handle a damaged, incorrect, defective or missing item you report to us</li>
        </ul>
        <p>
          We do not use your checkout details for advertising, profiling, or sale to any third
          party.
        </p>
      </LegalSection>

      <LegalSection id="pp-whatsapp" title="The WhatsApp order handoff — please read this">
        <p>
          This is the important part. When you complete checkout and choose to continue, the
          order details you entered are placed into a message that opens in WhatsApp,
          addressed to CIVIM GRAINS on <strong>+91 8450912454</strong>. You review that
          message and press send yourself.
        </p>
        <p>By continuing, you understand and agree that:</p>
        <ul>
          <li>
            Your name, mobile number, full delivery address, PIN code, the products,
            quantities, prices and totals you ordered, and your chosen payment method will be
            included in that WhatsApp message.
          </li>
          <li>
            WhatsApp is a third-party service operated by Meta. Once you send the message, the
            content is handled under WhatsApp's own terms and privacy practices, not ours. We
            encourage you to read them.
          </li>
          <li>
            Nothing is transmitted to WhatsApp automatically. If you do not press send, no
            order is sent and nothing is shared.
          </li>
          <li>
            Opening or sending WhatsApp is not by itself a confirmed order. Your order is
            confirmed only when our team replies to you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="pp-storage" title="How your information is stored and kept">
        <p>To be accurate rather than reassuring:</p>
        <ul>
          <li>
            Your shopping bag is stored in your own browser (local storage) so it survives a
            page refresh. It contains only product identifiers and quantities — prices are
            always re-derived from our own catalogue, so no price data is persisted.
          </li>
          <li>
            Once you send the WhatsApp message, the order details live in that WhatsApp
            conversation and in whatever our team uses to fulfil it.
          </li>
          <li>
            <Confirm>
              State the actual retention period for order records, and confirm which system
              they are stored in.
            </Confirm>
          </li>
          <li>
            <Confirm>
              Confirm whether a server-side order system is in use. If one is connected,
              describe where that data is hosted and for how long it is kept.
            </Confirm>
          </li>
        </ul>
        <p>
          We do not claim that your data is encrypted in transit or at rest, and we do not
          claim automatic deletion, because those protections have not been implemented and
          verified for this site. If and when they are, this page will be updated to say so.
        </p>
      </LegalSection>

      <LegalSection id="pp-sharing" title="Who we share it with">
        <ul>
          <li>
            <strong>WhatsApp / Meta</strong> — only when you send the order message yourself.
          </li>
          <li>
            <strong>Our delivery partner</strong>, if one is used, to deliver your order.{' '}
            <Confirm>
              Confirm whether a third-party courier is used and what it receives.
            </Confirm>
          </li>
          <li>
            <strong>A payment provider</strong> — only if online payment is enabled. No payment
            provider is connected to this site today, so no payment data is shared with one.
          </li>
        </ul>
        <p>
          We do not sell your personal information. We would disclose it to a law enforcement
          or regulatory authority where we are legally required to do so.
        </p>
      </LegalSection>

      <LegalSection id="pp-rights" title="Your choices and rights">
        <p>You can:</p>
        <ul>
          <li>Leave optional fields (email, landmark, delivery instructions) blank</li>
          <li>Empty your cart at any time, which clears the bag stored in your browser</li>
          <li>Choose not to send the WhatsApp message, in which case no order is shared</li>
          <li>
            Ask us what order information we hold about you, and ask us to correct or delete it,
            by contacting us
          </li>
        </ul>
        <p>
          <Confirm>
            Confirm the response timeframe the business can commit to for access, correction and
            deletion requests, and the exact contact address to send them to.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="pp-cookies" title="Cookies and analytics">
        <p>
          This website does not use advertising cookies. Your cart is held in your browser's
          local storage, which is not a cookie and is not sent to us.{' '}
          <Confirm>
            Confirm whether any analytics or marketing script will be added before launch; if so,
            list it here and disclose what it collects.
          </Confirm>
        </p>
      </LegalSection>

      <LegalSection id="pp-changes" title="Changes to this policy">
        <p>
          If the way we handle your information changes — for example, when a server-side order
          system or a payment provider is connected — this page will be updated to describe the
          change accurately before that change goes live.
        </p>
      </LegalSection>
    </LegalPage>
  )
}

