/**
 * The vocabulary layer. Every string in template code that names a side of
 * the client's business, a transaction, or the brand itself reads from here.
 *
 * Currently wired to: Sun Life (Canada) - one-sided group benefits insurer /
 * claims administrator. Nouns from story-spec.brand.nouns.
 */

export const BRAND = {
  name: 'Sun Life',
  logoPath: '/sunlife-logo.svg',
  logoAlt: 'Sun Life',
}

export const MARKETPLACE_TYPE = 'one-sided' // 'two-sided' | 'one-sided'

export const IS_TWO_SIDED = MARKETPLACE_TYPE === 'two-sided'

export const NOUNS = {
  demandSide: 'member',
  demandSidePlural: 'members',
  supplySide: null,
  supplySidePlural: null,
  transaction: 'claim',
  transactionPlural: 'claims',
  currency: 'CAD',
  currencySymbol: 'CA$',
  locale: 'en-CA',
}

export const CONTACT_INDEX_PATH = '/data/sunlife_contact_index.json'

export const NOUNS_CAP = {
  demandSide: cap(NOUNS.demandSide),
  demandSidePlural: cap(NOUNS.demandSidePlural),
  supplySide: cap(NOUNS.supplySide),
  supplySidePlural: cap(NOUNS.supplySidePlural),
  transaction: cap(NOUNS.transaction),
}

function cap(s) {
  if (!s) return ''
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
