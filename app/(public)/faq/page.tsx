import { redirect } from 'next/navigation'
import View from './view'
import { getViewProps, isPageActive } from '@/lib/site-data'
import { pageMetadata } from '@/lib/seo'
import { OPTIONAL_PAGES } from '@/lib/optional-pages'

export const metadata = pageMetadata('faq')

export default async function Faq() {
  // Page Status: while Hidden, visitors are sent to the Contact page
  // instead (temporary redirect, nothing is deleted).
  if (!(await isPageActive('faq'))) redirect(OPTIONAL_PAGES.faq.hiddenRedirect)
  const props = await getViewProps('faq')
  return <View {...props} />
}
