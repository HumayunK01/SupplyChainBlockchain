'use client'

import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import Partners from '@/components/home/Partners'
import IntegrationsFlow from '@/components/home/IntegrationsFlow'

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <Hero />
      <Stats />
      <FeaturesGrid />
      <Partners />
      <IntegrationsFlow />
    </div>
  )
}
