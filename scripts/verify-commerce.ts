/**
 * Verification harness for the commerce logic.
 *
 * Run with:  npx tsx scripts/verify-commerce.ts
 *
 * This exists so the ₹280 mustard-oil pricing, the quantity totals
 * (1 L = ₹280, 2 L = ₹560, 3 L = ₹840), the PIN/mobile validation and the
 * WhatsApp order message can be checked without a browser. It imports no DOM
 * APIs, so it runs under plain Node.
 */

import { PRODUCTS, findProduct, unitPrice, formatPrice } from '../src/lib/products'
import { validateCheckout, buildOrderMessage, type CustomerForm } from '../src/pages/CheckoutPage'

let passed = 0
let failed = 0

function check(label: string, actual: unknown, expected: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) {
    passed++
    console.log(`  PASS  ${label}`)
  } else {
    failed++
    console.log(
      `  FAIL  ${label}\n          expected: ${JSON.stringify(expected)}\n          actual:   ${JSON.stringify(actual)}`,
    )
  }
}

console.log('\n=== 1. Mustard oil price model ==============================')
const oil = findProduct('mustard-oil')
check('mustard-oil exists', Boolean(oil), true)
check('base price is 280', oil?.price, 280)
check('variant 1l = 280', unitPrice(oil!, '1l'), 280)
check('variant 2l = 560', unitPrice(oil!, '2l'), 560)
check('variant 3l = 840', unitPrice(oil!, '3l'), 840)
check('formatted base price', formatPrice(280), '₹280')
check('formatted 560', formatPrice(560), '₹560')
check('formatted 840', formatPrice(840), '₹840')

console.log('\n=== 2. Quantity totals (dynamic line totals) ================')
for (const [variant, unit] of [
  ['1l', 280],
  ['2l', 560],
  ['3l', 840],
] as const) {
  for (const qty of [1, 2, 3]) {
    const price = unitPrice(oil!, variant)
    check(`${variant} x ${qty} line total`, (price ?? 0) * qty, unit * qty)
  }
}

console.log('\n=== 3. Unpriced products must stay unpriced =================')
const unpriced = PRODUCTS.filter((p) => p.price === null)
check(
  'every product is either priced or null (never 0)',
  PRODUCTS.every((p) => p.price === null || p.price > 0),
  true,
)
console.log(`  INFO  ${unpriced.length} of ${PRODUCTS.length} products have no confirmed price`)
check('unpriced products have no variants', unpriced.every((p) => !p.variants), true)

console.log('\n=== 4. Address validation ====================================')
const base: CustomerForm = {
  name: 'Asha Verma',
  phone: '9876543210',
  email: '',
  houseNo: 'B-12',
  building: 'Green Heights',
  street: 'MG Road',
  area: 'Civil Lines',
  landmark: '',
  city: 'Bhopal',
  state: 'Madhya Pradesh',
  country: 'India',
  pincode: '462041',
  instructions: '',
}
check('a fully valid form passes', validateCheckout(base), {})

const bad: Array<[string, Partial<CustomerForm>, string]> = [
  ['empty name', { name: '' }, 'name'],
  ['one-char name', { name: 'A' }, 'name'],
  ['short mobile', { phone: '98765' }, 'phone'],
  ['mobile starting 5 (invalid)', { phone: '5876543210' }, 'phone'],
  ['mobile starting 0', { phone: '0876543210' }, 'phone'],
  ['12-digit mobile', { phone: '987654321012' }, 'phone'],
  ['letters in mobile', { phone: '98765abcde' }, 'phone'],
  ['5-digit PIN', { pincode: '46204' }, 'pincode'],
  ['7-digit PIN', { pincode: '4620411' }, 'pincode'],
  ['non-numeric PIN', { pincode: 'ABCDEF' }, 'pincode'],
  ['empty PIN', { pincode: '' }, 'pincode'],
  ['empty city', { city: '' }, 'city'],
  ['empty state', { state: '' }, 'state'],
  ['empty houseNo', { houseNo: '' }, 'houseNo'],
  ['empty building', { building: '' }, 'building'],
  ['empty street', { street: '' }, 'street'],
  ['empty area', { area: '' }, 'area'],
  ['bad email', { email: 'not-an-email' }, 'email'],
]
for (const [label, patch, field] of bad) {
  check(`${label} -> error on "${field}"`, Object.keys(validateCheckout({ ...base, ...patch })), [
    field,
  ])
}

console.log('\n=== 5. Valid edge cases that must NOT error ==================')
check('mobile with spaces is accepted', validateCheckout({ ...base, phone: '98765 43210' }), {})
check('mobile with dashes is accepted', validateCheckout({ ...base, phone: '98765-43210' }), {})
check('blank email is accepted', validateCheckout({ ...base, email: '' }), {})
check('valid email is accepted', validateCheckout({ ...base, email: 'a@b.co' }), {})
check('blank optional landmark is accepted', validateCheckout({ ...base, landmark: '' }), {})
check(
  'blank optional instructions is accepted',
  validateCheckout({ ...base, instructions: '' }),
  {},
)

console.log('\n=== 6. WhatsApp order message ================================')
const msg = buildOrderMessage({
  customer: {
    name: 'Asha Verma',
    phone: '9876543210',
    email: 'asha@example.com',
    address:
      'B-12, Green Heights, MG Road, Civil Lines, Bhopal, Madhya Pradesh, PIN 462041, India',
  },
  items: [
    {
      name: '100% Pure Mustard Oil',
      variantLabel: '2 litres',
      qty: 1,
      unitPrice: 560,
      lineTotal: 560,
    },
  ],
  subtotal: 560,
  deliveryCharge: null,
  total: 560,
  paymentMethod: 'cod',
})
check('includes customer name', msg.includes('Name: Asha Verma'), true)
check('includes mobile', msg.includes('Mobile: 9876543210'), true)
check('includes PIN', msg.includes('PIN 462041'), true)
check('includes product name', msg.includes('100% Pure Mustard Oil'), true)
check('includes variant', msg.includes('2 litres'), true)
check('includes unit price', msg.includes('560'), true)
check('includes line total expression', msg.includes('x 1 x ₹560 = ₹560'), true)
check('includes subtotal', msg.includes('Subtotal: ₹560'), true)
check('includes total', msg.includes('Total: ₹560'), true)
check('states Cash on Delivery', msg.includes('Payment: Cash on Delivery'), true)
check('omits delivery line when unconfigured', msg.includes('Delivery:'), false)
check(
  'marks order ref as unassigned when no backend',
  msg.includes('to be assigned on confirmation'),
  true,
)

const msgWithDelivery = buildOrderMessage({
  customer: { name: 'X', phone: '9876543210', email: '', address: 'Addr' },
  items: [
    {
      name: '100% Pure Mustard Oil',
      variantLabel: '1 litre',
      qty: 2,
      unitPrice: 280,
      lineTotal: 560,
    },
  ],
  subtotal: 560,
  deliveryCharge: 40,
  total: 600,
  paymentMethod: 'cod',
})
check('shows delivery charge when configured', msgWithDelivery.includes('Delivery: ₹40'), true)
check('final total adds delivery', msgWithDelivery.includes('Total: ₹600'), true)

console.log('\n=== 7. Honesty guards ========================================')
check(
  'no product claims stock availability',
  PRODUCTS.every((p) => p.stock === 'unknown'),
  true,
)
check(
  'mustard oil description has no nutrition claim',
  !/protein|calorie|kcal|fat content|vitamin/i.test(oil?.description ?? ''),
  true,
)
check(
  'mustard oil description does not say organic',
  !/organic/i.test(oil?.description ?? ''),
  true,
)
check(
  'mustard oil description does not say chemical-free',
  !/chemical[- ]free/i.test(oil?.description ?? ''),
  true,
)
check(
  'mustard oil description mentions Cold Pressed as a label claim',
  /Cold Pressed/.test(oil?.description ?? ''),
  true,
)
check(
  'mustard oil description points to the label',
  /refer to the actual product label/i.test(oil?.description ?? ''),
  true,
)

console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===============\n`)
if (failed > 0) process.exit(1)
