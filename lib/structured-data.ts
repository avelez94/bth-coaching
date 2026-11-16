import type { SiteSettings } from './site-settings'
import type { PublicProgramInfo } from './program-info'
import { DESCRIPTION, SITE_NAME, SITE_URL, absolute } from './seo'

const ORG_ID = `${SITE_URL}/#organization`

export function organization(tagline: string, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: 'Beyond the Horizon',
    url: SITE_URL,
    logo: absolute('/images/bth-logo-nav.png'),
    image: absolute('/images/share/bth-share.jpg'),
    slogan: tagline,
    description: `${tagline} ${DESCRIPTION}`,
    email: settings.contactEmail,
    telephone: settings.phone,
    founder: { '@type': 'Person', name: 'John McCracken', url: absolute('/about') },
    ...(settings.linkedinCompanyUrl ? { sameAs: [settings.linkedinCompanyUrl] } : {}),
  }
}

export function website(tagline: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: tagline,
    publisher: { '@id': ORG_ID },
  }
}

// A coaching program with the price shown on its page
export function service(path: string, name: string, description: string, program: Pick<PublicProgramInfo, 'fullPriceCents'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absolute(path)}#service`,
    name,
    serviceType: name,
    description,
    url: absolute(path),
    provider: { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: SITE_URL },
    offers: {
      '@type': 'Offer',
      url: absolute(path),
      price: (program.fullPriceCents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}
