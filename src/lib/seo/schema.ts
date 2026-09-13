export interface FAQItem {
  question: string;
  answer: string;
}

export function generateWebAppSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ClearWave Speaker Cleaner',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free acoustic resonance tool to eject water and dust particles from phone speakers.',
    url: siteUrl,
  };
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}