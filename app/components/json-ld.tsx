import { jsonLd } from '@/lib/seo'

// Structured data for search engines. jsonLd() escapes everything that
// could end the script tag, so saved text can never break the page.
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
}
