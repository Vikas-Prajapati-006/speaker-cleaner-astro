export interface MetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
}

const DEFAULT_SITE_NAME = 'ClearWave Speaker Cleaner';
const DEFAULT_TITLE = 'Fix My Speakers & Eject Water | ClearWave Acoustic Tool';
const DEFAULT_DESCRIPTION = 'Eject trapped water and dust from smartphone speakers using scientific sound waves and resonant kinetic pulses.';
const DEFAULT_SITE_URL = 'https://speaker-cleaner-astro.pages.dev';

export function createSEO(props: MetaProps = {}) {
  const siteUrl = (import.meta.env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
  const title = props.title ? `${props.title} | ${DEFAULT_SITE_NAME}` : DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const canonical = props.canonical 
    ? (props.canonical.startsWith('http') ? props.canonical : `${siteUrl}${props.canonical}`)
    : siteUrl;
  const image = props.image || `${siteUrl}/og-image.png`;
  const type = props.type || 'website';

  return {
    title,
    description,
    canonical,
    image,
    type,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image
    }
  };
}