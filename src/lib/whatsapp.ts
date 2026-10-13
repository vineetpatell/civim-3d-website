/**
 * Single WhatsApp ordering flow for the whole site.
 *
 * Number: +91 8450912454 (wa.me needs digits only).
 * Every CTA opens WhatsApp with a prefilled message — we never claim an
 * order was placed; the customer reviews and sends the message themselves.
 */
import { CONTACT } from './site'

export const WHATSAPP_NUMBER = CONTACT.whatsappNumber

export const GENERAL_ENQUIRY_MESSAGE =
  'Namaste CIVIM GRAINS, I would like to enquire about your products and place an order. Please share the available products, pack sizes, and prices.'

export function productEnquiryMessage(productName: string): string {
  return `Namaste CIVIM GRAINS, I would like to enquire about "${productName}". Please share the available pack sizes and prices.`
}

export function contactFormMessage(
  name: string,
  contact: string,
  enquiryType: string,
  message: string,
): string {
  const lines = [
    'Namaste CIVIM GRAINS,',
    `Name: ${name || '-'}`,
    `Contact: ${contact || '-'}`,
    `Enquiry: ${enquiryType || 'General'}`,
    '',
    message || '-',
  ]
  return lines.join('\n')
}

/** Build a wa.me URL with the message correctly encoded. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
