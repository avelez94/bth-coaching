import HomeView from './home-view'
import { getViewProps } from '@/lib/site-data'

export default async function Home() {
  const props = await getViewProps('home')
  return <HomeView c={props.c} bookingUrl={props.booking?.free} engagements={props.engagements} />
}
