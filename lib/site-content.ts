// ============================================================
// Editable page content: what John can change on each existing
// page, grouped the way the live page is laid out.
//
// Every field's default is the exact copy the page launched with.
// The database only stores John's edits; anything he has not
// changed keeps this default. Safe to import in the browser.
// ============================================================

export type FieldType = 'text' | 'textarea' | 'image'

export interface ImageSpec {
  ratio: string            // shown to John, e.g. "3:2 landscape"
  recommended: string      // e.g. "2400 × 1600 pixels or larger"
  minWidth: number         // reject smaller uploads (pixels)
  aspect: number           // width / height the layout expects
}

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  default: string
  help?: string
  optional?: boolean
  image?: ImageSpec
}

export interface SectionDef {
  id: string
  title: string
  description: string
  fields: FieldDef[]
}

export interface PageDef {
  label: string
  path: string
  description: string
  sections: SectionDef[]
}

const LANDSCAPE_3x2: ImageSpec = { ratio: '3:2 landscape', recommended: '2400 × 1600 pixels or larger', minWidth: 1600, aspect: 1.5 }

export const PAGE_SCHEMA = {
  home: {
    label: 'Home',
    path: '/',
    description: 'The first page visitors see. Changes appear on the live site as soon as you save.',
    sections: [
      {
        id: 'hero',
        title: 'Top of page',
        description: 'The large opening area with your headline and photo.',
        fields: [
          { key: 'hero.headline', label: 'Headline', type: 'textarea', default: "The challenge in your job is only part of what you're carrying." },
          { key: 'hero.subhead', label: 'Supporting statement', type: 'textarea', default: 'I help leaders gain clarity and get results, without sacrificing everything else.' },
          { key: 'hero.body', label: 'Short paragraph', type: 'textarea', default: 'Executive and leadership coaching backed by 37 years of building teams and leading people through high-stakes change, from Navy ships to large organizations.' },
          { key: 'hero.orgPrompt', label: 'Organization link: question', type: 'text', default: 'Hiring for your organization?' },
          { key: 'hero.orgLink', label: 'Organization link: link text', type: 'text', default: 'Start here →' },
          { key: 'hero.image', label: 'Home Hero Photo', type: 'image', default: '/images/2Backupheroshot.jpeg', image: LANDSCAPE_3x2, help: 'Shown on the right half of the top of the page. Faces near the top of the frame work best.' },
        ],
      },
      {
        id: 'doors',
        title: 'Which sounds like you?',
        description: 'The three cards that send visitors to the right program.',
        fields: [
          { key: 'doors.label', label: 'Section label', type: 'text', default: 'Which sounds like you?' },
          { key: 'doors.1.headline', label: 'Card 1 headline (Executive Coaching)', type: 'textarea', default: 'The challenges are outpacing the solutions.' },
          { key: 'doors.1.body', label: 'Card 1 text', type: 'textarea', default: "You're good at what you do, but problems are arriving faster than you can solve them. The stress is following you home, and the results aren't what you know you're capable of. Holding course and speed and hoping it gets better rarely fixes it. Coaching helps you find what's driving the pressure, at work and outside it, and build a plan you can sustain." },
          { key: 'doors.1.link', label: 'Card 1 link text', type: 'text', default: 'Executive Coaching →' },
          { key: 'doors.2.headline', label: 'Card 2 headline (Leader Development)', type: 'textarea', default: "You're leading people, and it's harder than you expected." },
          { key: 'doors.2.body', label: 'Card 2 text', type: 'textarea', default: "Maybe you were just promoted over last week's peers. Maybe your team has stalled and you can't see why. You don't need another seminar. You need help with the real situation in front of you. Together, we'll build the skills and habits that get your team moving and help you lead with confidence." },
          { key: 'doors.2.link', label: 'Card 2 link text', type: 'text', default: 'Leader Development →' },
          { key: 'doors.3.headline', label: 'Card 3 headline (For Organizations)', type: 'textarea', default: "Someone on your team is struggling, and you'd rather invest than replace." },
          { key: 'doors.3.body', label: 'Card 3 text', type: 'textarea', default: 'A talented leader is in over their head: a new role, a culture mismatch, or something outside work pulling at them. A performance plan documents the problem but rarely solves it, and replacing a leader is slow and expensive. Coaching gives them real support in a confidential setting, working toward outcomes you help define.' },
          { key: 'doors.3.link', label: 'Card 3 link text', type: 'text', default: 'For Organizations →' },
        ],
      },
      {
        id: 'how',
        title: 'How it works',
        description: 'The heading and the three numbered steps.',
        fields: [
          { key: 'how.heading', label: 'Heading', type: 'text', default: 'How it works' },
          { key: 'how.step1', label: 'Step 1', type: 'textarea', default: 'Book a free 15-minute call. Tell me what’s hardest right now.' },
          { key: 'how.step2', label: 'Step 2', type: 'textarea', default: 'Get clear on where you want to go. We define success in your own terms.' },
          { key: 'how.step3', label: 'Step 3', type: 'textarea', default: 'Work the plan with a coach beside you. You make the decisions, and I help you stay on track.' },
        ],
      },
      {
        id: 'changes',
        title: 'What Changes',
        description: 'The heading and paragraph describing results.',
        fields: [
          { key: 'changes.heading', label: 'Heading', type: 'text', default: 'What Changes' },
          { key: 'changes.body', label: 'Paragraph', type: 'textarea', default: 'You make the hard calls with confidence, using a repeatable framework grounded in your own values. Your team trusts where you’re taking them. And success at work stops costing you everything else. You’re more present for the parts of your life that matter most.' },
        ],
      },
      {
        id: 'approach',
        title: 'My approach',
        description: 'The dark section about coaching the whole person.',
        fields: [
          { key: 'approach.label', label: 'Section label', type: 'text', default: 'My approach' },
          { key: 'approach.headline', label: 'Headline', type: 'textarea', default: "You're not one person at work and another at home. Your development shouldn't treat you that way." },
          { key: 'approach.body', label: 'Paragraph', type: 'textarea', default: "When we address the whole person — every dimension of who you are and what you're carrying — something unlocks. Potential you didn't know you had. Clarity you couldn't find alone. A transformative path forward that lasts." },
          { key: 'approach.link', label: 'Link text', type: 'text', default: 'Explore the 8 Pillars →' },
        ],
      },
      {
        id: 'testimonial',
        title: 'Client testimonial',
        description: 'The quote from a client and who said it.',
        fields: [
          { key: 'testimonial.label', label: 'Section label', type: 'text', default: 'What clients say' },
          { key: 'testimonial.quote', label: 'Quote', type: 'textarea', default: "When I started coaching, I was looking to become a stronger leader. What I found was far more transformative. Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement. Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person." },
          { key: 'testimonial.name', label: 'Client name', type: 'text', default: 'Linnea Landowski' },
          { key: 'testimonial.role', label: 'Client title and organization', type: 'text', default: 'Director of Camping Programs, Scouting America, Western Los Angeles County Council' },
        ],
      },
      {
        id: 'guide',
        title: 'Your guide',
        description: 'The short introduction to you, with photo.',
        fields: [
          { key: 'guide.label', label: 'Section label', type: 'text', default: 'Your guide' },
          { key: 'guide.body', label: 'Paragraph', type: 'textarea', default: "I know what it's like to carry more than the job, and to hit a setback you didn't see coming. I spent 30 years leading in the Navy and seven as a senior defense civilian at the Pentagon learning how people recover and grow. Now I help leaders do it faster and better than I did." },
          { key: 'guide.name', label: 'Name', type: 'text', default: 'John McCracken' },
          { key: 'guide.credentials', label: 'Credentials line', type: 'text', default: 'CAPT, USN (Ret.) | EMBA | Associate Certified Coach (ACC) | DoD Certified Executive Coach' },
          { key: 'guide.link', label: 'Link text', type: 'text', default: 'Read my story →' },
          { key: 'guide.image', label: 'Home "Your Guide" Photo', type: 'image', default: '/images/3AboutStrip.jpeg', image: LANDSCAPE_3x2, help: 'Shown beside your introduction. The left and top of the photo stay visible on smaller screens.' },
        ],
      },
      {
        id: 'credibility',
        title: 'Credentials and experience',
        description: 'The research statement and your credential badges.',
        fields: [
          { key: 'cred.line1', label: 'Headline, first line', type: 'text', default: 'Research-grounded.' },
          { key: 'cred.line2', label: 'Headline, second line', type: 'text', default: 'Experience-tested.' },
          { key: 'cred.body', label: 'Paragraph', type: 'textarea', default: "The coaching and programs at Beyond the Horizon draw on peer-reviewed research on human flourishing — the same science behind the U.S. Army's resilience programs." },
          { key: 'cred.badge1', label: 'Credential 1', type: 'text', default: 'ACC' },
          { key: 'cred.badge1Detail', label: 'Credential 1 detail', type: 'text', default: 'International Coaching Federation', optional: true },
          { key: 'cred.badge2', label: 'Credential 2', type: 'text', default: 'DoD Certified Executive Coach' },
          { key: 'cred.badge2Detail', label: 'Credential 2 detail', type: 'text', default: '', optional: true },
          { key: 'cred.badge3', label: 'Credential 3', type: 'text', default: 'LCOP Certificate' },
          { key: 'cred.badge3Detail', label: 'Credential 3 detail', type: 'text', default: 'American University / Heidrick & Struggles', optional: true },
        ],
      },
      {
        id: 'closing',
        title: 'Closing invitation',
        description: 'The last section, inviting visitors to book a call.',
        fields: [
          { key: 'closing.headline', label: 'Headline', type: 'text', default: 'It starts with a single conversation.' },
          { key: 'closing.body', label: 'Paragraph', type: 'textarea', default: "A free 15-minute call. No pitch, no pressure. Just a direct conversation about where you are, where you want to go, and whether we're the right fit to get you there." },
        ],
      },
    ],
  },
} satisfies Record<string, PageDef>

export type PageKey = keyof typeof PAGE_SCHEMA
export const PAGE_KEYS = Object.keys(PAGE_SCHEMA) as PageKey[]

export type PageContent = Record<string, string>

function defaultsFor(def: PageDef): PageContent {
  const out: PageContent = {}
  for (const s of def.sections) for (const f of s.fields) out[f.key] = f.default
  return out
}

export const PAGE_DEFAULTS: Record<PageKey, PageContent> = Object.fromEntries(
  PAGE_KEYS.map(k => [k, defaultsFor(PAGE_SCHEMA[k])]),
) as Record<PageKey, PageContent>

export function fieldDef(page: PageKey, key: string): FieldDef | undefined {
  for (const s of (PAGE_SCHEMA[page] as PageDef).sections) {
    const f = s.fields.find(x => x.key === key)
    if (f) return f
  }
  return undefined
}

// Limits keep edits from breaking layouts (no novel-length headlines).
export function maxLength(f: FieldDef): number {
  if (f.type === 'image') return 600
  return f.type === 'text' ? 160 : 2000
}
