import { TAGLINE } from './seo'
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
const LANDSCAPE_4x3: ImageSpec = { ratio: '4:3 landscape', recommended: '2400 × 1800 pixels or larger', minWidth: 1600, aspect: 4 / 3 }
const SQUARE: ImageSpec = { ratio: 'square (1:1)', recommended: '1600 × 1600 pixels or larger', minWidth: 1000, aspect: 1 }

// Short builders for field definitions
// {deadline} and {deadline_short} in Sprint and FAQ text show the Sprint
// registration deadline set in Admin under Pricing ("January 10, 2027" and
// "January 10"), so every page, email and certificate shows the same date.
export const DEADLINE_HELP = 'Where you see {deadline} or {deadline_short}, the website shows the Sprint registration deadline from Pricing (for example "January 10, 2027" or "January 10"). Keep them to change the date in one place.'
const withDeadlineHelp = (def: string, extra: Partial<FieldDef>): Partial<FieldDef> =>
  def.includes('{deadline') ? { ...extra, help: [extra.help, DEADLINE_HELP].filter(Boolean).join(' ') } : extra
const line = (key: string, label: string, def: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'text', default: def, ...withDeadlineHelp(def, extra) })
const para = (key: string, label: string, def: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: 'textarea', default: def, ...withDeadlineHelp(def, extra) })
const photo = (key: string, label: string, def: string, image: ImageSpec, help?: string): FieldDef => ({ key, label, type: 'image', default: def, image, help })
const PRICE_NOTE = 'The price shown in this section comes from Pricing & Payments.'

// ------------------------------------------------------------
// FAQ copy (from John's FAQ page document). Each answer opens
// under its question. Program answers end with an investment line
// built from Pricing & Payments, so prices are never typed twice.
// ------------------------------------------------------------
const FORMAT_HELP = 'To make words bold, put two asterisks on each side, like **this**. Start a line with a hyphen and a space to make a bulleted list.'
const LINK_HELP = 'To link words, put them in square brackets followed by the web address in round brackets, like [ICF](https://coachingfederation.org).'
const FAQ_SPARE = 2

export type FaqProgram = 'executive-coaching' | '8-pillars' | 'sprint'
interface FaqItem { q: string; a: string; program?: FaqProgram; sources?: string }

const SRC = {
  deHaan: 'https://scienceforwork.com/blog/workplace-coaching-what-does-the-evidence-say-and-does-it-work/',
  jones: 'https://research.aston.ac.uk/en/publications/the-effectiveness-of-workplace-coaching-a-meta-analysis-of-learni/',
  theeboom: 'https://instituteofcoaching.org/resources/does-coaching-work-meta-analysis-effects-coaching-individual-level-outcomes-organizational',
  icfRelease: 'https://prnewswire.com/news-releases/professional-coaching-continues-to-satisfy-consumers-106028668.html',
  icfOverview: 'https://coachingfederation.org/blog/coaching-statistics-the-roi-of-coaching-in-2024/',
}

export const FAQ_SECTIONS: { id: string; heading: string; items: FaqItem[] }[] = [
  { id: 'coaching', heading: 'About coaching', items: [
    { q: 'What is coaching?', a: `Coaching is a partnership where you set the agenda and I help you think it through. The International Coaching Federation defines it as partnering with clients in a thought-provoking and creative process that inspires them to maximize their personal and professional potential. In practice, I ask questions that help you see your situation clearly, test your assumptions, and decide what to do next. You leave every session with a commitment you chose.` },
    { q: 'How is coaching different from therapy, consulting, or mentoring?', a: `- **Therapy** focuses on mental health and healing the past. Coaching looks forward, at your goals and the actions that get you there. It isn't a substitute for therapy, and if something comes up that a therapist would serve better, I'll tell you.
- **Consulting** gives you answers. Coaching helps you find your own, so the solution fits your situation and you own it.
- **Mentoring** passes on the mentor's path. I bring 37 years of leadership experience, but I share it only when it serves your goals, not as a template.` },
    { q: 'Who do you work with?', a: `Senior leaders and executives, new leaders stepping into larger roles, leaders whose teams have stalled, and organizations that want to invest in their people.` },
    { q: 'Does coaching actually work?', a: `The research says yes, with a consistent, moderate positive effect. A 2023 meta-analysis of 37 randomized controlled trials found coaching improved well-being, professional skills, and goal attainment compared with control groups (de Haan & Nilsson). Earlier meta-analyses found positive effects on performance, work attitudes, coping, and the ability to set and pursue goals (Theeboom et al., 2014; Jones et al., 2016). Results still depend on the work you put in, and no coach can guarantee an outcome.`,
      sources: `Sources: [de Haan & Nilsson, 2023](${SRC.deHaan}) · [Theeboom et al., 2014](${SRC.theeboom}) · [Jones et al., 2016](${SRC.jones})` },
    { q: 'What is the return on a coaching investment?', a: `In the International Coaching Federation's Global Coaching Client Study, conducted by PricewaterhouseCoopers, companies reported a median return of about seven times their investment in coaching, and individuals about 3.4 times. Those figures are self-reported and come from an industry-commissioned study, so treat them as directional rather than precise. For organizations, the more practical comparison is usually this: the cost of coaching a capable leader through a hard stretch against the cost of replacing them, in recruiting, onboarding, and lost momentum. Coaching also shapes culture: leaders who are coached tend to bring the same habits of reflection and development to their own teams.`,
      sources: `Sources: [ICF 2010 release](${SRC.icfRelease}) · [ICF ROI overview](${SRC.icfOverview})` },
  ] },
  { id: 'programs', heading: 'The programs', items: [
    { q: 'What can I expect from the 8 Pillars Leadership Program?', program: '8-pillars', a: `Ten months of leadership development and coaching built around the 8 Pillars, the areas of life that shape how well you lead. Month 1 is an 8 Pillars assessment and a half-day kickoff, in person or virtual, where you define what success looks like for you. In months 2 through 9 we take one pillar a month, with two sessions: a structured pillar session that uses a focused set of questions, and an open coaching session where you set the agenda. Month 10 is for review and integration, and you leave with commitments you've defined and a plan for what's next.` },
    { q: 'What can I expect from the 8 Pillar Sprint?', program: 'sprint', a: `An eight-week group program in which you build a one-page personal framework, one pillar per week, anchored in your own values. It meets on eight Tuesday evenings, January 12 to March 2, 2027, for 75 minutes by video, with 6 to 12 participants. Before Week 1 you complete a short self-assessment and receive a one-page snapshot of where you stand across the 8 Pillars. Each session follows the same rhythm: look back at last week's commitment, work through one pillar, reflect with a partner, and set one small commitment to test that week. You finish with your completed framework and a second self-assessment to see what moved. The Sprint is facilitated group learning, not one-on-one coaching.` },
    { q: 'Can I give the Sprint as a gift?', a: `Yes. You'll receive a gift certificate to pass along, and the recipient registers by {deadline_short} and decides whether to join. As the giver, you won't see their self-assessment, attendance, or anything discussed in the sessions. Gifts can be fully refunded or transferred until {deadline}.` },
    { q: 'How is the Sprint different from the 8 Pillars Leadership Program?', a: `The Sprint is eight weeks in a small group, and you leave with a personal framework. The 8 Pillars Leadership Program is ten months of intensive one-on-one work, where you put that framework into practice with a coach and make the change last.` },
    { q: 'What can I expect from Executive Coaching?', program: 'executive-coaching', a: `Six months, twelve one-hour sessions about every two weeks, starting with an 8 Pillars whole-person assessment. You bring what matters most, and we work through it together: your values, perspectives, what's within your control or influence, and an action plan. Each session ends with a commitment you define, and the final session covers reflection, integration, and a plan for what's next.` },
    { q: 'How do I choose the right program?', a: `If you have a specific challenge in front of you and want focused support, Executive Coaching fits. If you want to build a stronger foundation across your whole life and leadership, the 8 Pillars Leadership Program fits. If you want a structured start in a small group, the 8 Pillar Sprint fits. If you're not sure, that's what the free 15-minute call is for. We'll figure it out together, and there's no pressure to commit.` },
    { q: 'Can my organization sponsor my coaching?', a: `Yes. Many clients are sponsored by their employer. Organizations can also run the 8 Pillars program for a group of leaders or build a custom program. See [For Organizations](/for-organizations), or schedule a 30-minute organizational consultation.` },
  ] },
  { id: 'working', heading: 'Working together', items: [
    { q: 'How do I get started?', a: `Schedule a free 15-minute call. We'll talk about where you are, where you want to go, and whether we're the right fit. If we are, you can enroll online or I'll send you the details by email.` },
    { q: 'What are your credentials?', a: `I'm an Associate Certified Coach (ACC) with the International Coaching Federation, and I completed American University's Leadership Coaching for Organizational Performance (LCOP) program, an ICF Level 2 accredited program. I follow the ICF Code of Ethics. I also bring 30 years of Navy leadership, including command, and seven years as a senior defense civilian.` },
    { q: 'Is what I share confidential?', a: `Yes. What you share stays between us, under the ICF Code of Ethics, with narrow exceptions such as a risk of harm to you or others. When an organization sponsors your coaching, we agree up front, in writing, on what general information the sponsor receives, such as attendance and overall progress. The content of our conversations stays with you.` },
    { q: 'Where and how do sessions happen?', a: `By Microsoft Teams, Zoom, or phone, whichever works best for you. I work with clients in the Washington, DC area and virtually anywhere.` },
    { q: 'What if I need to reschedule?', a: `Give me at least 24 hours' notice and we'll find a new time at no charge. If I have to cancel, I'll schedule a makeup session at no cost to you.` },
    { q: 'Can I reach you between sessions?', a: `Yes, by email, text, or voicemail. I typically respond within one to two business days.` },
    { q: 'How does payment work?', a: `You can pay in full or in monthly installments, by card or bank transfer, through Stripe's secure checkout. I never see or store your card or bank details. Sponsored programs are invoiced to the organization.` },
    { q: "What if it isn't working?", a: `Either of us can end the engagement at any time with written notice. Any remaining installments are canceled, and fees paid for sessions not yet held are refunded. The full terms are in the Coaching Agreement.` },
    { q: "What if something comes up that coaching can't address?", a: `I'll tell you, and help you find the right kind of professional. Coaching is not psychotherapy, counseling, or medical, legal, or financial advice. If you're working with a therapist, I encourage you to let them know you're also working with a coach.` },
  ] },
]

export const FAQ_SOURCES: string[] = [
  `de Haan, E. & Nilsson, V. O. (2023). What can we know about the effectiveness of coaching? A meta-analysis based only on randomized controlled trials. *Academy of Management Learning & Education.* Summary: [ScienceForWork](${SRC.deHaan})`,
  `Jones, R. J., Woods, S. A. & Guillaume, Y. R. F. (2016). [The effectiveness of workplace coaching: a meta-analysis of learning and performance outcomes from coaching](${SRC.jones}). *Journal of Occupational and Organizational Psychology*, 89(2), 249 to 277.`,
  `Theeboom, T., Beersma, B. & van Vianen, A. (2014). [Does coaching work? A meta-analysis on the effects of coaching on individual level outcomes in an organizational context](${SRC.theeboom}). *The Journal of Positive Psychology*, 9(1).`,
  `International Coaching Federation, Global Coaching Client Study (PricewaterhouseCoopers): median ROI of 7x for companies and about 3.4x for individuals, as reported in [ICF's 2010 release](${SRC.icfRelease}) and [ICF's ROI overview](${SRC.icfOverview}).`,
]

/** Which FAQ answers end with a program's investment line */
export function faqProgramFor(fieldKey: string): FaqProgram | undefined {
  const m = fieldKey.match(/^(\w+)\.(\d+)\.a$/)
  if (!m) return undefined
  return FAQ_SECTIONS.find(s => s.id === m[1])?.items[Number(m[2]) - 1]?.program
}

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
          { key: 'hero.subhead', label: 'Supporting statement', type: 'textarea', default: TAGLINE, help: 'This is also the tagline used in search results and link previews.' },
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
        id: 'engagements',
        title: 'Sample engagements',
        description: 'A rotating preview of your Sample Engagements. The examples themselves are edited on the Sample Engagements page.',
        fields: [
          line('engagements.label', 'Section label', 'Sample engagements'),
          line('engagements.link', 'Link text', 'See Sample Engagements →'),
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
        description: 'Client quotes. The Home page rotates through them.',
        fields: [
          { key: 'testimonial.label', label: 'Section label', type: 'text', default: 'What clients say' },
          { key: 'testimonial.quote', label: 'Quote', type: 'textarea', default: "When I started coaching, I was looking to become a stronger leader. What I found was far more transformative. Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement. Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person." },
          { key: 'testimonial.name', label: 'Client name', type: 'text', default: 'Linnea Landowski' },
          { key: 'testimonial.role', label: 'Client title and organization', type: 'text', default: 'Director of Camping Programs, Scouting America, Western Los Angeles County Council' },
          para('testimonial.2.quote', 'Testimonial 2: quote', "I am retiring from the Navy after 30 years and looking forward to the next adventure. The only problem: what is that next adventure? Once you start looking at all the possibilities that are out there, it is easy to get overwhelmed. This is where John can be a tremendous help as a coach. Over several sessions, John was able to help me navigate through the challenges of 'what do you want to do when you grow up,' then work with me to brainstorm on the art of the possible. He helped me really focus on what I wanted to do, vice what I thought I had to do. John is friendly, engaging, and very supportive \u2014 it is clear he wants to help and really listens as you work through what is best for you. I highly recommend talking with John. You will not be disappointed, and you will be surprised at what you learn that you never considered before. Two thumbs up!!", { optional: true, help: 'The Home page rotates through every testimonial that has a quote. Clear a quote to remove it from the rotation.' }),
          line('testimonial.2.name', 'Testimonial 2: client name', 'Billy D.', { optional: true }),
          line('testimonial.2.role', 'Testimonial 2: client title', 'CAPT (USN), Ret.', { optional: true }),
          para('testimonial.3.quote', 'Testimonial 3: quote', "Working with John as my coach has been a truly transformative experience. After retiring from the military, I transitioned into government contracting, but I was still looking for something more. John's coaching style was the ideal blend of support and structure \u2014 friendly, engaging, and supportive throughout, creating a safe space for honest self-reflection, while holding me accountable to the actionable plans we built together. Thanks to his guidance, I made that transition into government service and gained a much clearer sense of purpose and confidence along the way. I wouldn't be where I am today without him, and I highly recommend his coaching to anyone looking to make real, lasting progress in their life or career.", { optional: true }),
          line('testimonial.3.name', 'Testimonial 3: client name', 'Matt', { optional: true }),
          line('testimonial.3.role', 'Testimonial 3: client title', 'Senior Professional, transitioning from the private sector to government service.', { optional: true }),
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
  'executive-coaching': {
    label: 'Executive Coaching',
    path: '/executive-coaching',
    description: 'The Executive Coaching program page. The price comes from Pricing & Payments.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The opening headline area.', fields: [
        line('hero.context', 'Small label above headline', 'For Leaders'),
        para('hero.headline', 'Headline', 'When the challenges are outpacing the solutions.'),
        para('hero.subhead', 'Supporting statement', "You're not getting the results you want from yourself or your team, and working harder isn't closing the gap."),
      ] },
      { id: 'familiar', title: 'Sound familiar?', description: 'Three short paragraphs describing the reader’s situation.', fields: [
        line('familiar.headline', 'Heading', 'Sound familiar?'),
        para('familiar.body1', 'Paragraph 1', "You've earned your role. But the challenges are complex, the environment is ambiguous, the pace is unrelenting, and the approach that got you here isn't working the way it used to. You're thinking about work at dinner. The team isn't moving the way you need it to. Goals you care about keep getting pushed to next quarter."),
        para('familiar.body2', 'Paragraph 2', "Most leaders respond by working harder. Holding course and speed rarely fixes it, and the cost usually shows up somewhere you can't afford: your health, your family, your team's trust in you."),
        para('familiar.body3', 'Paragraph 3', "The challenge in front of you is rarely the whole story. That's where we start."),
      ] },
      { id: 'photo', title: 'Photo', description: 'The wide photo below the opening.', fields: [
        photo('photo.image', 'Executive Coaching Photo', '/images/5Hero.jpeg', LANDSCAPE_3x2, 'Shown full width across the page.'),
      ] },
      { id: 'story', title: 'What this looks like in practice', description: 'A short, anonymized client story.', fields: [
        line('story.heading', 'Heading', 'What this looks like in practice'),
        para('story.body', 'Story', "A leader came to me to strengthen his executive presence. As we worked, the real challenge came into focus. His new role required him to lead through influence across the organization, without clear authority, while he also wanted to be more present for a growing family. He shifted from chasing outcomes to building a process and drew on experience he'd been underusing. He also defined what being present at home meant to him and built a plan to get there."),
        line('story.attribution', 'Who it describes', 'Senior leader, new cross-organizational role.'),
      ] },
      { id: 'work', title: 'What we work on', description: 'The four focus areas.', fields: [
        line('work.heading', 'Heading', 'What we work on'),
        line('work.1.title', 'Area 1 title', 'Leading through others.'),
        para('work.1.body', 'Area 1 text', 'Moving from doing the work yourself to building a team that does it well, without lowering your standards.'),
        line('work.2.title', 'Area 2 title', 'Presence and influence.'),
        para('work.2.body', 'Area 2 text', 'How you show up in hard conversations and high-stakes moments, including the patterns that are hardest to see from the inside.'),
        line('work.3.title', 'Area 3 title', 'Whole-life integration.'),
        para('work.3.body', 'Area 3 text', "Your work, health, family, and finances aren't separate problems. We look at how they affect each other, and build a foundation that doesn't depend on heroic effort."),
        line('work.4.title', 'Area 4 title', 'Whatever is most pressing.'),
        para('work.4.body', 'Area 4 text', "A career decision, a difficult relationship, the weight of carrying too much for too long. If it affects how you lead, it's in scope."),
      ] },
      { id: 'how', title: 'How it works', description: 'How a coaching session works.', fields: [
        line('how.heading', 'Heading', 'How it works'),
        para('how.body1', 'Paragraph 1', "You bring what matters most right now, and we work through it together. I'll ask questions that challenge your assumptions and open up options you can't see from inside the situation. You leave every session with a commitment you defined and a next step you chose."),
        para('how.body2', 'Paragraph 2', 'This is your agenda. I bring the structure and the questions.'),
      ] },
      { id: 'possible', title: "What's possible", description: 'The results paragraph.', fields: [
        line('possible.heading', 'Heading', "What's possible"),
        para('possible.body', 'Paragraph', "Your team brings you solutions, not problems. You make the hard calls without replaying them at 2 a.m. You're home for dinner, and you're actually present."),
      ] },
      { id: 'engagement', title: 'The engagement', description: 'What the program includes and the enroll button. ' + PRICE_NOTE, fields: [
        line('eng.context', 'Small label', 'The engagement'),
        line('eng.headline', 'Headline', 'Six months. Twelve sessions. Your agenda.'),
        line('eng.enroll', 'Enroll button text', 'Enroll in Executive Coaching'),
        line('eng.detail1', 'Included item 1', '12 one-hour sessions, every other week'),
        line('eng.detail2Link', 'Included item 2 (linked words)', '8 Pillars whole-person assessment', { help: 'These words link to The 8 Pillars page.' }),
        line('eng.detail2Rest', 'Included item 2 (rest)', 'at the start'),
        line('eng.detail3', 'Included item 3', 'Commitments at each session that you define'),
        line('eng.detail4', 'Included item 4', "Final session: reflection, integration, and a plan for what's next"),
        line('eng.investmentLabel', 'Price label', 'Investment'),
        para('sponsor.text', 'Sponsor note', 'Sponsoring a leader? If your organization is investing in developing one of its leaders, see how organizational engagements work.'),
        line('sponsor.link', 'Sponsor note link text', 'For Organizations →'),
      ] },
    ],
  },
  'leader-development': {
    label: '8 Pillars Leadership',
    path: '/leader-development',
    description: 'The 8 Pillars Leadership Program page. The price comes from Pricing & Payments.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The opening headline area.', fields: [
        line('hero.context', 'Small label above headline', 'For Leaders'),
        para('hero.headline', 'Headline', "You're leading people, and it's harder than you expected."),
        para('hero.subhead', 'Supporting statement', 'A ten-month development and coaching program for new leaders, stretched leaders, and anyone ready to become the leader they want to be, and the one their team needs.'),
      ] },
      { id: 'familiar', title: 'Sound familiar?', description: 'Three short paragraphs describing the reader’s situation.', fields: [
        line('familiar.headline', 'Heading', 'Sound familiar?'),
        para('familiar.body1', 'Paragraph 1', "Maybe you were promoted over the people who were your peers last week. Maybe you've led for years, but your team has stalled and you can't see why. Maybe the role grew faster than you did."),
        para('familiar.body2', 'Paragraph 2', "You're capable. But leading people draws on more than your professional skills. It draws on your energy, judgment, relationships, and values, all at once. Most leadership training covers the first part and ignores the rest."),
        para('familiar.body3', 'Paragraph 3', 'Figuring it out by trial and error works eventually. It usually costs a year and a few relationships along the way.'),
      ] },
      { id: 'program', title: 'The 8 Pillars Leadership Program', description: 'Photo and program introduction.', fields: [
        photo('split.image', '8 Pillars Leadership Photo', '/images/6Hero.jpeg', LANDSCAPE_3x2, 'Shown beside the program introduction.'),
        line('pillars.head', 'Heading', 'The 8 Pillars Leadership Program'),
        line('pillars.label', 'Subheading', 'Leadership, Personal Development & Coaching'),
        para('pillars.intro', 'Introduction', "This program develops the whole leader, not just leadership behaviors. It's built on the 8 Pillars, the areas of life that shape how well you lead:"),
        para('pillars.names', 'The 8 Pillars list', 'Values · Professional Excellence · Physical Health · Financial Stewardship · Cognitive Fortitude · Emotional Equanimity · Relational Harmony · Environmental Harmony'),
        para('pillars.note', 'Closing sentence', 'A weakness in one area shows up everywhere else. Strength in one area reinforces the others.'),
        line('pillars.link', 'Link text', 'Explore the 8 Pillars →'),
      ] },
      { id: 'how', title: 'How it works', description: 'The four stages of the program.', fields: [
        line('how.heading', 'Heading', 'How it works'),
        line('stage.1.label', 'Stage 1 title', 'Month 1 — Start with clarity.'),
        para('stage.1.body', 'Stage 1 text', 'An intake assessment and a half-day kickoff, in person or virtual. You define what success looks like for you and where you want to grow.'),
        line('stage.2.label', 'Stage 2 title', 'Months 2–9 — One pillar at a time.'),
        para('stage.2.body', 'Stage 2 text', 'Each month focuses on one pillar, with two sessions: a structured session that uses a focused set of questions to assess where you are and where you want to be, and a coaching session where you set the agenda and work on whatever matters most right now.'),
        line('stage.3.label', 'Stage 3 title', 'Month 10 — Lock it in.'),
        para('stage.3.body', 'Stage 3 text', "Review what you've learned, what has changed, and the commitments you're carrying forward."),
        line('stage.4.label', 'Stage 4 title', 'After the program — Support when you need it.'),
        para('stage.4.body', 'Stage 4 text', 'Optional as-needed coaching for the storms that come later.'),
      ] },
      { id: 'outcomes', title: "What's possible", description: 'The results paragraph.', fields: [
        line('outcomes.heading', 'Heading', "What's possible"),
        para('outcomes.body', 'Paragraph', "Your former peers now come to you for direction. Your team is moving, and you know why. And the growth holds, because it's built on more than technique."),
      ] },
      { id: 'testimonial', title: 'Client testimonial', description: 'The quote from a client, in three paragraphs.', fields: [
        line('testimonial.label', 'Section label', 'From a coaching client'),
        para('testimonial.p1', 'Quote, paragraph 1', '“When I started coaching, I was looking to become a stronger leader. What I found was far more transformative.'),
        para('testimonial.p2', 'Quote, paragraph 2', "Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement."),
        para('testimonial.p3', 'Quote, paragraph 3', 'Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person.”'),
        line('testimonial.name', 'Client name', 'Linnea Landowski'),
        line('testimonial.role', 'Client title and organization', 'Director of Camping Programs, Scouting America, Western Los Angeles County Council'),
      ] },
      { id: 'engagement', title: 'The engagement', description: 'What the program includes and the enroll button. ' + PRICE_NOTE, fields: [
        line('eng.context', 'Small label', 'The engagement'),
        line('eng.headline', 'Headline', 'Ten months. Eight pillars. One whole leader.'),
        line('eng.enroll', 'Enroll button text', 'Enroll in the 8 Pillars Leadership Program'),
        line('eng.detail1', 'Included item 1', 'About 10 months, 16 or more sessions plus a kickoff'),
        line('eng.detail2', 'Included item 2', '8 Pillars whole-person assessment'),
        line('eng.detail3', 'Included item 3', 'Structured pillar sessions plus open coaching sessions'),
        line('eng.detail4', 'Included item 4', 'Commitments you define at each session.'),
        line('eng.detail5', 'Included item 5', 'Optional ongoing support after the program'),
        line('eng.investmentLabel', 'Price label', 'Investment'),
      ] },
      { id: 'team', title: 'Developing a whole team?', description: 'The closing note for organizations.', fields: [
        line('team.headline', 'Heading', 'Developing a whole team?'),
        para('team.body', 'Paragraph', 'The program also runs for cohorts inside organizations.'),
        line('team.link', 'Button text', 'For Organizations →'),
      ] },
    ],
  },
  'for-organizations': {
    label: 'For Organizations',
    path: '/for-organizations',
    description: 'The page for organizations sponsoring a leader or a team. Program prices come from Pricing & Payments.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The opening headline area.', fields: [
        line('hero.context', 'Small label above headline', 'For Organizations'),
        para('hero.headline', 'Headline', 'You need your leaders to lead.'),
        para('hero.subhead', 'Supporting statement', "When someone isn't there yet, you can replace them or invest in them. I help you invest well."),
      ] },
      { id: 'familiar', title: 'Sound familiar?', description: 'Three short paragraphs describing the reader’s situation.', fields: [
        line('familiar.headline', 'Heading', 'Sound familiar?'),
        para('familiar.body1', 'Paragraph 1', "A talented leader is struggling. They're new to the role, or the culture isn't a fit, or something outside work is pulling at them. A team that should be performing has stalled, and nobody can say exactly why. Your leadership training checks the box, but nothing changes afterward."),
        para('familiar.body2', 'Paragraph 2', "You've tried feedback. You've tried patience. You're running low on both, and you still believe this person is worth it."),
        para('familiar.body3', 'Paragraph 3', 'Doing nothing is expensive. Turnover, lost momentum, and a team watching how you handle it all cost more than addressing the problem directly.'),
      ] },
      { id: 'photo', title: 'Photo', description: 'The wide photo below the opening.', fields: [
        photo('photo.image', 'For Organizations Photo', '/images/1Heroshot.jpeg', LANDSCAPE_3x2, 'Shown full width across the page.'),
      ] },
      { id: 'ways', title: 'Three ways I work with organizations', description: 'The three offering cards. The first two show program prices from Pricing & Payments.', fields: [
        line('ways.heading', 'Heading', 'Three ways I work with organizations'),
        line('way.1.title', 'Card 1 title', "Support a leader who's struggling."),
        para('way.1.body', 'Card 1 text', 'You see potential worth investing in. I coach that leader one-on-one to help them regain their footing. You help define the purpose of the engagement and what success looks like. The coaching conversations stay confidential, which is what makes real change possible. Includes a kickoff and a close-out conversation with you and the leader.'),
        line('way.1.priceLead', 'Card 1 length (before the price)', 'Six months, 12 sessions —', { help: 'The Executive Coaching price is added after this.' }),
        line('way.2.title', 'Card 2 title', 'Develop your leaders.'),
        para('way.2.body', 'Card 2 text', 'The 8 Pillars Leadership Program combines leadership development with individual coaching, built around a whole-person framework. Your leaders build skills and resilience together, and each one works on their own goals with a coach.'),
        line('way.2.priceLead', 'Card 2 length (before the price)', 'Ten months, tailorable —', { help: 'The 8 Pillars price is added after this.' }),
        line('way.2.priceTail', 'Card 2 text after the price', 'per participant'),
        line('way.3.title', 'Card 3 title', 'Build a custom leadership program.'),
        para('way.3.body', 'Card 3 text', "Your situation doesn't fit a standard program. I start by understanding your organization, its culture, and the real problem behind the stated one. Then I design and deliver a program that fits: supervisor development, executive team alignment, off-sites, or a full leadership curriculum."),
        line('way.3.price', 'Card 3 pricing line', 'Custom-scoped'),
      ] },
      { id: 'how', title: 'How it works', description: 'The four steps of an organizational engagement.', fields: [
        line('how.heading', 'Heading', 'How it works'),
        line('step.1.label', 'Step 1 title', 'Start with a conversation.'),
        para('step.1.body', 'Step 1 text', "Tell me what you're seeing and what you need."),
        line('step.2.label', 'Step 2 title', 'Agree on the purpose.'),
        para('step.2.body', 'Step 2 text', "We define goals, boundaries, and how you'll see progress."),
        line('step.3.label', 'Step 3 title', 'Assess (optional).'),
        para('step.3.body', 'Step 3 text', 'For engagements that benefit from a structured baseline, I use the 8 Pillars assessment to identify where the leader is starting from and where they want to grow. This gives the coaching a sharper focus from the first session.'),
        line('step.4.label', 'Step 4 title', 'Do the work.'),
        para('step.4.body', 'Step 4 text', 'Your leaders get real support, and you see the difference in how they lead.'),
      ] },
      { id: 'outcomes', title: "What's possible", description: 'The results paragraph.', fields: [
        line('outcomes.heading', 'Heading', "What's possible"),
        para('outcomes.body', 'Paragraph', 'The leader you almost lost becomes one others learn from. Your team stops working around a problem and starts delivering. You made the call to invest, and it paid off.'),
      ] },
      { id: 'conf', title: 'A note on confidentiality', description: 'How sponsor involvement and confidentiality work.', fields: [
        line('conf.label', 'Heading', 'A note on confidentiality'),
        para('conf.body', 'Paragraph', 'When you sponsor coaching, you help set the direction, and the conversations belong to the leader. That trust is what makes coaching work, and it protects your investment.'),
      ] },
      { id: 'why', title: 'Why work with me', description: 'Your experience, with a link to Sample Engagements.', fields: [
        line('why.label', 'Small label', 'Why work with me'),
        para('why.headline', 'Headline', 'Thirty years leading in the Navy and seven as a senior defense civilian.'),
        para('why.body', 'Paragraph', "That includes turning around one of the lowest-performing commands in the Naval Reserve. I've led people through consolidations, culture problems, and high-stakes transitions, and I've coached leaders through the same."),
        line('why.link', 'Link text', 'See Sample Engagements →'),
      ] },
    ],
  },
  'sample-engagements': {
    label: 'Sample Engagements',
    path: '/sample-engagements',
    description: 'Anonymized examples of coaching engagements and teams you led.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The page title and introduction.', fields: [
        line('hero.headline', 'Headline', 'Leadership in Practice'),
        para('hero.body', 'Introduction', "Every leader's situation is different. These examples show what changes when leaders get the right support — sometimes one leader at a turning point, sometimes a whole organization learning to lead differently. Client details are anonymized."),
      ] },
      ...([
        ['coach', 'Coaching engagements', 'Coaching engagements', [
          ['Leading Through Consolidation', 'Turned a potentially divisive transition into a collaborative one.', 'Executive Director, regional nonprofit council', 'The Executive Director of a regional nonprofit council faced an organizational consolidation and realignment. Through coaching, he led his team through the change, communicated clearly with his Board of Directors and national leadership, and answered a question the change forced: what role did he want next? He got clear on his own path and kept open communication with every stakeholder, turning a potentially divisive transition into a collaborative one.', 'For Organizations'],
          ['Leading Through Influence', 'Built a plan for presence at work and at home.', 'Senior leader, new cross-organizational role', "A leader came in to strengthen his executive presence. The real challenge was a new role that required leading across the organization without clear authority, while also wanting to be more present for a growing family. He shifted from chasing outcomes to building a process, drew on experience he'd been underusing, and built a plan for the presence he wanted at home.", 'Executive Coaching'],
          ['Redefining Success', 'Finished with firmer boundaries, clearer confidence, and a broader definition of success.', 'Program director, regional youth-serving nonprofit', "A program director wanted to become a stronger leader. She discovered that empathy and accountability weren't in conflict, and untangled a professional identity that had absorbed everything else. She finished with firmer boundaries, clearer confidence, and a definition of success that included health and relationships.", 'Leader Development'],
        ]],
        ['cmd', 'Leading teams myself', 'Leading teams myself.', [
          ['Turning Around an Underperforming Command', "Recognized as the region's #1 large Navy Operational Support Center within one year.", 'Commanding Officer, Navy Operational Support Center', "John took command of the largest unit of its type in the nation, and one of the lowest-performing in the Naval Reserve: five directors, about 75 people, missing key goals, with broken morale and poor customer service. Instead of launching a new program, he changed how he led — asking more, directing less, and building a metrics dashboard that gave people autonomy over the outcomes that mattered. Within one year the team was recognized as the region's #1 large Navy Operational Support Center. Retention rose, morale recovered, and customers became advocates.", 'Leader Development'],
          ['Building a Workforce Plan', 'Manning brought in line with reality within a year; full human capital strategy built.', 'Director, Manpower and Human Capital Strategy, Department of the Navy', "A command of more than 200 people hadn't reconciled its personnel against its authorized positions in years, and had no human capital strategy or succession plan. Working collaboratively across a matrixed organization, the team brought the manning plan in line with reality within a year. Every element agreed on what staffing should be and what it actually was. The team then built a full strategy covering onboarding, leadership development, and offboarding, plus a succession plan for planned and unexpected departures.", 'For Organizations'],
          ['Rebuilding a Team in COVID', 'Resilient, collaborative team known for responsiveness and outstanding results.', 'Director, Policy and Executive Services, Office of the Assistant to the Secretary of Defense for Public Affairs', 'John stepped into a position vacated unexpectedly and reported for duty the week COVID shut everything down. The nine-person team administered public affairs policy for the Department of Defense and ran executive services for a staff of about 75. The team had to rebuild while the entire way of working changed around it. The result: a resilient, collaborative team known for responsiveness and outstanding results, built largely while working remotely.', 'For Organizations'],
          ['Turning Distrust Into Teamwork', 'Organizational goals met or exceeded; retention increased; morale became a point of pride.', 'Director, Policy and Executive Services, Office of the Assistant to the Secretary of Defense for Public Affairs', "In the same role, John found a team of strong individual performers who didn't trust one another and weren't supporting each other across functions. Together they identified shared values, celebrated individual and collective wins, and built trust through shared goals and experiences. The team became cooperative and successful: organizational goals were met or exceeded, retention increased, and morale became a point of pride.", 'Leader Development'],
        ]],
      ] as [string, string, string, [string, string, string, string, string][]][]).map(([g, title, label, items]) => ({
        id: g, title, description: 'Each example has a title, result, who it was, the story, and a link to the related program.',
        fields: [
          line(`${g}.label`, 'Section label', label),
          ...items.flatMap(([t, r, ctx, body, linkLabel], i) => [
            line(`${g}.${i + 1}.title`, `Example ${i + 1}: title`, t),
            para(`${g}.${i + 1}.result`, `Example ${i + 1}: result`, r),
            line(`${g}.${i + 1}.context`, `Example ${i + 1}: who`, ctx),
            para(`${g}.${i + 1}.body`, `Example ${i + 1}: story`, body),
            line(`${g}.${i + 1}.link`, `Example ${i + 1}: program link text`, `${linkLabel} →`),
          ]),
        ],
      })),
      { id: 'closing', title: 'Closing', description: 'The photo and invitation at the bottom of the page.', fields: [
        photo('closing.image', 'Sample Engagements Closing Photo', '/images/18Sitewide.jpeg', LANDSCAPE_4x3, 'Shown full width above the closing invitation.'),
        line('closing.label', 'Invitation', 'Ready to invest in a leader?'),
      ] },
    ],
  },
  'the-8-pillars': {
    label: 'The 8 Pillars',
    path: '/the-8-pillars',
    description: 'The page explaining the 8 Pillars framework.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The opening statement and framework image.', fields: [
        para('hero.headline', 'Headline', 'The challenge in front of you is rarely the whole story.'),
        para('hero.subhead', 'Introduction', "The 8 Pillars is a whole-person framework grounded in peer-reviewed research on performance, resilience, and well-being and informed by neuroscience. It's the foundation of every coaching engagement and program at Beyond the Horizon."),
        photo('hero.image', '8 Pillars Framework Image', '/images/9Framework.jpeg', SQUARE, 'The compass graphic beside the headline.'),
      ] },
      { id: 'miss', title: 'What most leadership frameworks miss', description: 'Why the whole person matters, with a pull quote.', fields: [
        line('miss.headline', 'Heading', 'What most leadership frameworks miss'),
        para('miss.body1', 'Paragraph 1', 'Most frameworks ask what effective leaders do: which behaviors and competencies they need. The 8 Pillars asks a prior question: what is the condition of the leader doing all of those things?'),
        para('miss.body2', 'Paragraph 2', "A leader carrying financial stress makes different decisions than the same leader who is financially clear. A leader with friction at home brings less to every meeting — not from a lack of professionalism, but because people aren't modular. What we carry in one part of life shows up in all the others."),
        para('miss.quote', 'Pull quote', "We don't aim for work-life balance, because balance implies a trade-off. Strength built in any part of your life reinforces the others. The goal is conscious, values-aligned integration."),
      ] },
      { id: 'science', title: 'Where the framework comes from', description: 'The four research foundations.', fields: [
        line('science.heading', 'Heading', 'Where the framework comes from'),
        line('science.1.name', 'Source 1 name', 'Resilience science'),
        para('science.1.body', 'Source 1 text', "Dr. Martin Seligman's research on resilience and performance under pressure established that strength across interdependent life domains is the foundation of sustained performance. His work became the scientific basis of the U.S. Army's Comprehensive Soldier and Family Fitness (CSF2) program."),
        line('science.2.name', 'Source 2 name', 'Total Leadership'),
        para('science.2.body', 'Source 2 text', "Stewart Friedman's research at the Wharton School found that leaders who invest across work, home, community, and self outperform those who sacrifice one area for another."),
        line('science.3.name', 'Source 3 name', 'Stress and executive function'),
        para('science.3.body', 'Source 3 text', 'Chronic stress impairs the prefrontal cortex, the seat of judgment and emotional regulation. Financial worry alone can reduce cognitive performance as much as significant sleep loss (Mani et al., Science, 2013).'),
        line('science.4.name', 'Source 4 name', 'Work-life boundary research'),
        para('science.4.body', 'Source 4 text', 'Studies of boundary management (Kossek et al.) show that flexible integration sustains performance better than rigid separation.'),
      ] },
      { id: 'pillars', title: 'The 8 Pillars', description: 'Each pillar’s name, subtitle, and description.', fields: [
        line('pillars.heading', 'Heading', 'The 8 Pillars'),
        ...([
          ['Values, Ethical & Moral Compass', 'Character, integrity, and values-aligned decisions', "Under pressure and in ambiguity, character is what remains. This pillar is about who you are when the rules don't cover it."],
          ['Professional Excellence', 'Craft, credibility, and continued development', 'Credibility is currency and needs active stewardship — including recognizing when what has always worked no longer does.'],
          ['Physical Health & Readiness', 'Energy, endurance, and cognitive capacity', 'Sleep, exercise, and recovery are the infrastructure of sustained leadership, not a fitness trend.'],
          ['Financial Stewardship', 'Stability and freedom from cognitive load', 'Unresolved financial stress consumes bandwidth a leader needs for every decision.'],
          ['Cognitive Fortitude', 'Clarity and sound judgment under pressure', 'Thinking clearly under sustained pressure is a skill you can build: how you interpret setbacks, manage uncertainty, and keep perspective when the situation is loud.'],
          ['Emotional Equanimity', 'Regulation, presence, and impact on culture', "A leader's emotional state spreads through a team. The goal is to feel difficulty without being governed by it."],
          ['Relational Harmony', 'Trust and connection at work and at home', 'The quality of your most important relationships determines the support available when things get hard.'],
          ['Environmental Harmony', 'Culture, values alignment, and contextual fit', 'Some leadership challenges are context problems, not leader problems. Recognizing the difference is itself a leadership skill.'],
        ] as [string, string, string][]).flatMap(([n, sub, body], i) => [
          line(`pillar.${i + 1}.name`, `Pillar ${i + 1}: name`, n),
          line(`pillar.${i + 1}.subtitle`, `Pillar ${i + 1}: subtitle`, sub),
          para(`pillar.${i + 1}.body`, `Pillar ${i + 1}: description`, body),
        ]),
      ] },
      { id: 'coaching', title: 'How the Pillars work in coaching', description: 'The four steps and closing paragraph.', fields: [
        line('coaching.headline', 'Heading', 'How the Pillars work in coaching'),
        para('coaching.step1', 'Step 1', 'For each pillar, you define what success looks like — your definition, not an imposed standard.'),
        para('coaching.step2', 'Step 2', 'You honestly assess where you stand today.'),
        para('coaching.step3', 'Step 3', 'The gap becomes your coaching agenda.'),
        para('coaching.step4', 'Step 4', 'Together, we identify what to grow — and what to say no to, to make room for it.'),
        para('coaching.body', 'Closing paragraph', "That last step is often the most valuable. Most people aren't underperforming because they lack ability. They haven't been honest about what their current commitments are costing them."),
      ] },
      { id: 'closing', title: 'Closing', description: 'The photo and link at the bottom of the page.', fields: [
        photo('closing.image', '8 Pillars Closing Photo', '/images/18Sitewide.jpeg', LANDSCAPE_4x3, 'Shown full width above the closing buttons.'),
        line('closing.link', 'Program link text', 'See the 8 Pillars Leadership Program →'),
      ] },
    ],
  },
  about: {
    label: 'About',
    path: '/about',
    description: 'Your story, photos, credentials, and how you coach.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'Your name, opening statement, and portrait.', fields: [
        line('hero.name', 'Name', 'John McCracken'),
        para('hero.lead', 'Headline', 'I help leaders gain clarity and get results, in every part of their lives.'),
        para('hero.subhead', 'Supporting statement', 'Thirty-seven years of leadership, the setbacks as well as the successes, and professional coach training, all focused on the results you want.'),
        photo('hero.image', 'About Hero Photo', '/images/john-mccracken-about-hero.jpeg', LANDSCAPE_3x2, 'Your portrait at the top of the About page.'),
      ] },
      { id: 'started', title: 'Where I started', description: 'The first part of your story.', fields: [
        line('started.label', 'Heading', 'Where I started'),
        para('started.body1', 'Paragraph', 'I spent 11 of my first 16 years in the Navy at sea, learning, leading, and performing in a demanding but rewarding environment. I went from Division Officer leading a team of 30, to Department Head leading an engineering team of 70, to Executive Officer running the day-to-day operations of a destroyer and her crew of about 350.'),
      ] },
      { id: 'failure', title: 'What failure taught me', description: 'The setback that changed how you lead.', fields: [
        line('failure.label', 'Heading', "What failure taught me that success couldn't"),
        para('failure.body1', 'Paragraph 1', "Up to that point, almost everything had gone to plan. Then came my greatest career setback: I wasn't selected for command at sea. And that setback wasn't private. Whether you are selected is visible to everyone, in the pins on your uniform or their absence."),
        para('failure.body2', 'Paragraph 2', "It took me five years to get over it. I internalized it far more than I should have. I went on to have a great career, but it wasn't the career I had wanted."),
        para('failure.body3', 'Paragraph 3', "If I'd been selected, I likely would have kept leading the way I always had, which wasn't always the kindest or most empowering way to lead. Not being selected forced a change I wouldn't have made on my own. I made more room for people's autonomy. I listened more than I directed. And I stopped holding people to my idea of perfection and started holding them to \"good enough, done well.\""),
        para('failure.body4', 'Paragraph 4', "While it took me years to get there, I want to help you move through your own version of this faster and more smoothly than I did — whether it's a career-altering setback or the everyday challenge of a hard meeting or a hard relationship."),
      ] },
      { id: 'living', title: 'Living the change', description: 'Turning around NOSC Washington, with photo.', fields: [
        line('living.label', 'Heading', 'Living the change'),
        para('living.body1', 'Paragraph 1', 'I put my renewed perspective and skills to work when I took command ashore of NOSC Washington, the largest Navy Operational Support Center in the nation, and one of the most underperforming in the Naval Reserve. Morale was broken, performance was low, and everyone expected more of the same.'),
        para('living.body2', 'Paragraph 2', "I knew something had to change, and it had to start with me. Not a new program or a reorganization plan — how I showed up. The questions I asked instead of the answers I gave. Honesty about what wasn't working, including my own leadership."),
        para('living.body3', 'Paragraph 3', "Within a year, that team was recognized as the region's #1 large Navy Operational Support Center. Not because I had the answers, but because I learned to lead differently."),
        photo('living.image', 'Living the Change Photo', '/images/12Livingthechange.jpeg', { ratio: '3:4 portrait', recommended: '1800 × 2400 pixels or larger', minWidth: 1200, aspect: 0.75 }),
        line('living.caption', 'Photo caption', "Reenlisting NOSC Washington's Command Master Chief"),
      ] },
      { id: 'after', title: 'After the Navy', description: 'Your civilian service and transition, with photo.', fields: [
        line('after.label', 'Heading', 'After the Navy'),
        para('after.body1', 'Paragraph 1', "After retiring, I joined a Navy command as a senior civilian, and then the Office of the Assistant to the Secretary of Defense for Public Affairs. I reconciled long-standing manpower problems, built human capital strategy, learned to lead as a civilian, and rebuilt a team the week COVID shut everything down. Along the way, I've spent seven years watching how large organizations develop their leaders, and where they fall short."),
        para('after.body2', 'Paragraph 2', 'Leaving uniform was harder than I expected. Losing my community, my professional reputation, and my sense of who I was out of uniform was disorienting. I found my footing again by reconnecting with the values and practices that made me successful, and having a coach helped. That experience is part of why I coach. I want to help people grow, build resilience, recover quickly from setbacks, and become the person and the leader they know they can be.'),
        photo('after.image', 'After the Navy Photo', '/images/13AftertheNavy.jpeg', SQUARE, 'Shown in a square frame.'),
        line('after.caption', 'Photo caption', 'Leaving Joint Base Andrews after completing command of NOSC Washington.'),
      ] },
      { id: 'beyond', title: 'Beyond work', description: 'Your life outside work, with three photos.', fields: [
        line('beyond.label', 'Heading', 'Beyond work'),
        para('beyond.body1', 'Paragraph 1', "I've been married for more than 35 years. I'm a father and a grandfather. And I'm a lifelong endurance athlete: marathons, Ironman races, years of running, cycling, and swimming. Last year, wear and tear meant I had to give up running. I didn't quit; I adjusted. I'm still competing on the bike and in the water."),
        para('beyond.body2', 'Paragraph 2', "That's the same thing I help clients do: when something changes that you didn't choose, find the path that still gets you where you want to go."),
        photo('beyond.image1', 'Beyond Work Photo: large', '/images/14Beyondthework.jpeg', LANDSCAPE_4x3),
        photo('beyond.image2', 'Beyond Work Photo: small portrait', '/images/15Beyndthework.jpeg', { ratio: '3:4 portrait', recommended: '900 × 1200 pixels or larger', minWidth: 500, aspect: 0.77 }),
        photo('beyond.image3', 'Beyond Work Photo: small landscape', '/images/17Beyondthework.jpeg', LANDSCAPE_4x3),
      ] },
      { id: 'quote', title: 'Why this works', description: 'The pull quote.', fields: [
        line('quote.label', 'Small label', 'Why this works'),
        para('quote.text', 'Quote', "When we address the whole person — every dimension of who you are and what you're carrying — something unlocks. Potential you didn't know you had. Clarity you couldn't find alone. A transformative path forward that lasts."),
      ] },
      { id: 'creds', title: 'Preparation and credentials', description: 'Your experience, education, and certifications. Leave a detail blank to hide it.', fields: [
        line('creds.heading', 'Heading', 'Preparation and credentials'),
        ...([
          ['exp', 'Experience', [
            ['Commanding Officer and progressively senior leadership roles', 'U.S. Navy, 30 years'],
            ['Director, Manpower and Human Capital Strategy', 'Department of the Navy'],
            ['Director, Policy and Executive Services', 'Office of the Assistant to the Secretary of Defense for Public Affairs'],
            ['Senior defense civilian', 'Department of the Navy and Office of the Secretary of Defense, 7 years'],
          ]],
          ['edu', 'Education', [
            ['Executive Master of Business Administration', 'Naval Postgraduate School'],
            ['Master of Arts, National Security and Strategic Studies', 'Naval War College'],
            ['Bachelor of Science, Geography', 'Old Dominion University'],
            ['Leadership Coaching for Organizational Performance (LCOP) Certificate', 'American University / Heidrick & Struggles (ICF Level 2 accredited)'],
          ]],
          ['cert', 'Certifications', [
            ['Associate Certified Coach (ACC)', 'International Coaching Federation'],
            ['LCOP Level 2', 'American University / Heidrick & Struggles'],
            ['DoD Coach Training Program (ICF-accredited), graduate', ''],
          ]],
        ] as [string, string, [string, string][]][]).flatMap(([g, label, entries]) => [
          line(`creds.${g}.label`, `${label}: tab name`, label),
          ...entries.flatMap(([t, o], i) => [
            line(`creds.${g}.${i + 1}.title`, `${label} ${i + 1}`, t),
            line(`creds.${g}.${i + 1}.org`, `${label} ${i + 1}: detail`, o, { optional: true }),
          ]),
        ]),
      ] },
      { id: 'coach', title: 'How I coach', description: 'Your coaching approach.', fields: [
        line('coach.label', 'Heading', 'How I coach'),
        para('coach.body1', 'Paragraph 1', "My coaching follows International Coaching Federation methodology and ethics. It's client-centered and goal-focused, built on questions rather than prescriptions. You bring the situation; I help you see it clearly and decide what to do next."),
        para('coach.body2', 'Paragraph 2', "I use the 8 Pillars of Whole Person Leadership as a framework, not a script. The pillars give us a shared language for what you're working on, and a way to see how every part of who you are — at work, at home, in how you think about yourself — connects to your results."),
        para('coach.body3', 'Paragraph 3', "Most of my clients come in focused on one problem. By the time we're done, they've solved it and learned something larger: how they lead, how they live, and how those two things are the same."),
        line('coach.link', 'Link text', 'Explore the 8 Pillars →'),
      ] },
      { id: 'closing', title: 'Closing statement', description: 'Your closing message above your signature.', fields: [
        para('closing.body', 'Statement', "I believe setbacks don't define people; what they do next does. Thirty-seven years of leading, and sometimes failing, taught me that lasting results come from developing the whole person, not just the work version of who they are. If that's the growth you want for yourself or your team, let's take 15 minutes to chart a path forward."),
      ] },
    ],
  },
  contact: {
    label: 'Contact',
    path: '/contact',
    description: 'The Contact page. Your email, phone, and location come from Site Settings.',
    sections: [
      { id: 'top', title: 'Top of page', description: 'The headline and introduction.', fields: [
        para('top.headline', 'Headline', 'A better path starts with a single conversation'),
        para('top.body', 'Introduction', "A free 15-minute call. No pitch, no pressure. Just a direct conversation about where you are, where you want to go, and whether we're the right fit to get you there."),
        line('top.faqLink', 'FAQ link text', 'Frequently asked questions →', { help: 'Shown under the introduction.' }),
      ] },
      { id: 'form', title: 'Message form', description: 'What visitors see after sending a message.', fields: [
        line('form.success', 'Thank-you message', "Thanks, I'll respond within one business day."),
      ] },
      { id: 'details', title: 'Your details', description: 'The photo and name beside the form. Email, phone, and location are set in Site Settings.', fields: [
        photo('details.image', 'Contact Photo', '/images/9Contact.jpeg', { ratio: '7:5 landscape', recommended: '2100 × 1500 pixels or larger', minWidth: 1200, aspect: 1.39 }),
        line('details.name', 'Name and credentials', 'John McCracken, CAPT, USN (Ret.), ACC'),
      ] },
      { id: 'closing', title: 'Closing statement', description: 'Your closing message above your signature.', fields: [
        para('closing.body', 'Statement', "I believe setbacks don't define people; what they do next does. Thirty-seven years of leading, and sometimes failing, taught me that lasting results come from developing the whole person, not just the work version of who they are. If that's the growth you want for yourself or your team, let's take 15 minutes to chart a path forward."),
      ] },
    ],
  },
  sprint: {
    label: '8 Pillar Sprint',
    path: '/sprint',
    description: 'The 8 Pillar Sprint program page. The price and both Stripe links come from Pricing & Payments.',
    sections: [
      { id: 'hero', title: 'Top of page', description: 'The quote, headline, the Eight Pillars, and the two buttons.', fields: [
        para('hero.quote', 'Quote', '“The winds and waves are always on the side of the ablest navigators.”', { help: 'Shown at the top of the page and again at the very bottom.' }),
        line('hero.quoteBy', 'Quote author', 'Edward Gibbon'),
        line('hero.label', 'Small label above headline', 'Set Your Course'),
        para('hero.headline', 'Headline', 'Eight weeks. Eight pillars. One framework built on what you value most.'),
        line('hero.pillarsLead', 'Words in bold before the Eight Pillars', 'The Eight Pillars:', { optional: true, help: 'Leave blank to show the list without them.' }),
        para('hero.pillars', 'The Eight Pillars', 'Your Values; Professional Excellence; Physical Health; Financial Stewardship; Fortitude; Equanimity; Relational, and Environmental Harmony. Together creating, the foundation, tools, and plan to get the most from yourself whatever the weather of life.'),
        para('hero.subhead', 'Supporting statement', "A small-group program for leaders, and anyone ready to strengthen their foundation, to start the year with clarity. Each week you take on one of the 8 Pillars and add one piece to a single-page framework you'll carry into the years ahead."),
        line('btn.enroll', 'Enroll button text', 'Enroll in the Sprint', { help: 'Used on every Enroll button on this page. It opens the Stripe enroll link from Pricing & Payments.' }),
        line('btn.gift', 'Gift button text', 'Give the Sprint as a gift', { help: 'Used on every gift button on this page. It opens the Stripe gift link from Pricing & Payments.' }),
        para('hero.when', 'Line under the buttons (dates and time)', 'Eight Tuesdays, January 12 to March 2, 2027, 7:00 to 8:15 PM ET. Limited to 12 participants.', { help: 'The dates and time also appear in The details section. If you change them here, change them there too.' }),
      ] },
      { id: 'familiar', title: 'Sound familiar?', description: 'Two short points and two paragraphs.', fields: [
        line('familiar.heading', 'Heading', 'Sound familiar?'),
        para('familiar.point1', 'Point 1', "You've set goals before. A few weeks later, work or life pulled you back into the same patterns, and the goals didn't survive the first hard week."),
        para('familiar.point2', 'Point 2', 'You want to be more present for the things you value most in life but seem to lack the time or tools to make it a reality.'),
        para('familiar.body1', 'Paragraph 1', "The problem usually isn't willpower or time management. Goals that sit on top of your life, instead of growing out of what you value, don't hold up under pressure. And the pressure rarely comes from one place. It comes from your work, your health, your relationship with money, and the people who matter most, all at once, cumulatively it can become overwhelming and blow you off course."),
        para('familiar.body2', 'Paragraph 2', 'The 8 Pillar Sprint gives you eight weeks to build something sturdier, and learn how to trim your sails to make the most progress given the wind and the waves of life. You get a clear picture of what you value, and a practical plan for keeping to it no matter the weather.'),
      ] },
      { id: 'how', title: 'How it works', description: 'The self-assessment and the eight weeks.', fields: [
        line('how.heading', 'Heading', 'How it works'),
        line('how.before.title', 'Before Week 1: title', 'Before Week 1: see where you stand.'),
        para('how.before.body', 'Before Week 1: text', "A 15-minute self-assessment gives you a one-page snapshot across all 8 Pillars, with your strongest and most stretched areas marked. Only you and I see it, and there's no overall score."),
        line('how.weeks.title', 'Eight weeks: title', 'Eight weeks, eight pillars.'),
        para('how.weeks.body', 'Eight weeks: text', 'Weeks 1 to 4 build your foundation. Weeks 5 and 6 test it under pressure. Weeks 7 and 8 bring in the people and places that shape your days.'),
      ] },
      { id: 'weeks', title: 'Week by week', description: 'The table of dates, pillars, and what each week adds.', fields: [
        line('weeks.col.week', 'Column heading: week', 'Week'),
        line('weeks.col.date', 'Column heading: date', 'Date'),
        line('weeks.col.pillar', 'Column heading: pillar', 'Pillar'),
        line('weeks.col.add', 'Column heading: what you add', 'What you add to your framework'),
        ...([
          ['Jan 12', 'Values, Ethical & Moral Compass', 'Your top three values in your own words, and how they should shape your decisions and relationships'],
          ['Jan 19', 'Professional Excellence', "One growth edge in your skills or leadership, and how you'll develop it"],
          ['Jan 26', 'Physical Health & Readiness', "Your routine for resetting when stress builds, and when you'd reach for outside help"],
          ['Feb 2', 'Financial Stewardship', 'How financial pressure shows up for you, and how you want to decide when it does'],
          ['Feb 9', 'Cognitive Fortitude', 'Your plan for staying with your values when things get hard'],
          ['Feb 16', 'Emotional Equanimity', 'Your early-warning sign for strong emotion, and your reset'],
          ['Feb 23', 'Relational Harmony', "One relationship, one change you'll try, and the shared result you want"],
          ['Mar 2', 'Environmental Harmony', 'One change to your space, routines, or circle that protects what you value, then your finished framework'],
        ] as const).flatMap(([date, pillar, add], i) => [
          line(`week.${i + 1}.date`, `Week ${i + 1}: date`, date),
          line(`week.${i + 1}.pillar`, `Week ${i + 1}: pillar`, pillar),
          para(`week.${i + 1}.add`, `Week ${i + 1}: what you add`, add),
        ]),
      ] },
      { id: 'rhythm', title: 'Every session', description: 'The four steps of each session, the warmup sheet, and what you leave with.', fields: [
        line('rhythm.heading', 'Heading', 'Every session follows the same rhythm (75 minutes):'),
        line('rhythm.1.title', 'Step 1 title', 'Look back.'),
        para('rhythm.1.body', 'Step 1 text', "What happened with last week's commitment. No judgment, just what you learned."),
        line('rhythm.2.title', 'Step 2 title', 'Work the pillar.'),
        para('rhythm.2.body', 'Step 2 text', "Research-grounded content and exercises for that week's pillar, shaped by the group's self-assessments. Develop a written approach and commitment(s) incorporating the Pillar into your life."),
        line('rhythm.3.title', 'Step 3 title', 'Reflect with a partner.'),
        para('rhythm.3.body', 'Step 3 text', 'A short conversation in pairs (optional). You can always stay in the main room if you prefer.'),
        line('rhythm.4.title', 'Step 4 title', 'Practice.'),
        para('rhythm.4.body', 'Step 4 text', 'One specific “if this happens, I’ll do that” commitment, small enough to test in a week.'),
        para('rhythm.warmup', 'Warmup sheet note', 'A short warmup sheet arrives a few days before each session, about 10 minutes so everyone shows up in a similar mindset, and you maximize the value of your time.'),
        line('leave.heading', 'What you leave with: heading', 'What you leave with'),
        para('leave.1', 'Item 1', 'A one-page personal framework built on your own values, covering all 8 Pillars'),
        para('leave.2', 'Item 2', 'Eight commitments tested in real life, so you know what works for you'),
        para('leave.3', 'Item 3', "A before-and-after look at your self-assessment, showing what moved and what didn't"),
        para('leave.4', 'Item 4', 'A next-step page with options for what comes after'),
        para('leave.5', 'Item 5', 'One 30-minute one-on-one session with John, to catch up on a missed week or go deeper on your framework'),
      ] },
      { id: 'details', title: 'The details', description: 'Dates, time, format, and investment. ' + PRICE_NOTE, fields: [
        line('details.heading', 'Heading', 'The details'),
        line('details.dates.label', 'Dates: label', 'Dates'),
        line('details.dates', 'Dates', 'Eight Tuesdays, January 12 to March 2, 2027', { help: 'Also shown under the top buttons, and week by week in the schedule.' }),
        line('details.time.label', 'Time: label', 'Time'),
        line('details.time', 'Time', '7:00 to 8:15 PM Eastern', { help: 'Also shown in the line under the top buttons. Change both together.' }),
        line('details.format.label', 'Format: label', 'Format'),
        line('details.format', 'Format', 'Live by video, Microsoft Teams'),
        line('details.size.label', 'Group size: label', 'Group size'),
        line('details.size', 'Group size', 'Up to 12 participants'),
        line('details.prep.label', 'Preparation: label', 'Preparation'),
        para('details.prep', 'Preparation', 'A 15-minute self-assessment before Week 1, and a 10- to 15-minute worksheet before each session'),
        line('details.investment.label', 'Investment: label', 'Investment'),
        line('details.investment.suffix', 'Words after the price', 'per person', { help: 'The price itself comes from Pricing & Payments.' }),
        line('details.register.label', 'Register by: label', 'Register by'),
        line('details.register', 'Register by', '{deadline}'),
      ] },
      { id: 'refunds', title: 'Refunds and cancellations', description: 'The five refund terms. Each starts with a few words in bold.', fields: [
        line('refunds.heading', 'Heading', 'Refunds and cancellations'),
        ...([
          ['Until {deadline}:', 'full refund, or transfer your seat to someone else.'],
          ['After {deadline_short}:', 'fees are non-refundable.'],
          ['If fewer than 6 people register,', "the Sprint still runs. You'll have the choice to continue with a smaller group or take a full refund."],
          ['Missed sessions', "aren't refunded. You'll receive a one-page summary after every session, and you can use your one-on-one session to catch up."],
          ['Gifts', 'follow the same terms. Any refund goes to the person who paid.'],
        ] as const).flatMap(([lead, text], i) => [
          line(`refund.${i + 1}.lead`, `Term ${i + 1}: words in bold`, lead),
          para(`refund.${i + 1}.text`, `Term ${i + 1}: rest of the sentence`, text),
        ]),
      ] },
      { id: 'gift', title: 'Give the Sprint as a gift', description: 'How gifts work, with the gift button.', fields: [
        line('gift.heading', 'Heading', 'Give the Sprint as a gift'),
        para('gift.body1', 'Paragraph 1', 'Know someone who wants to maximize their performance despite multiple challenges? Give them eight weeks to build a framework of their own.'),
        para('gift.body2', 'Paragraph 2', "When you buy the Sprint as a gift, you'll receive a gift certificate by email to pass along. Your recipient registers by {deadline_short} and decides for themselves whether to join. The choice is theirs, which is part of what makes it work."),
        line('gift.1.lead', 'Point 1: words in bold', 'Their privacy is protected.'),
        para('gift.1.text', 'Point 1: rest', "You won't see their self-assessment, attendance, or anything discussed in the sessions."),
        line('gift.2.lead', 'Point 2: words in bold', 'If they decide not to join,'),
        para('gift.2.text', 'Point 2: rest', 'the refund terms above apply.'),
      ] },
      { id: 'next', title: 'What comes next', description: 'The programs that follow the Sprint.', fields: [
        line('next.heading', 'Heading', 'What comes next'),
        para('next.body', 'Paragraph', "Eight weeks builds the framework. Living it takes longer. If you want to go further, the 8 Pillars Leadership Program gives you ten months of one-on-one work to put your framework into practice and make the change last. One-on-one Executive Coaching is also available. Neither is required, and you'll never get a sales pitch during the sessions. Sprint graduates receive 20% off either program when they enroll within 30 days of the final session."),
        line('next.link', 'Link text', 'See the 8 Pillars Leadership Program →'),
      ] },
      { id: 'note', title: 'A note on what this is', description: 'What the Sprint is and is not.', fields: [
        line('note.heading', 'Heading', 'A note on what this is'),
        para('note.body', 'Paragraph', "The 8 Pillar Sprint is facilitated group learning, not one-on-one coaching, therapy, or financial or legal advice. In Week 1 the group agrees on how we'll work together: share your own experience, not other people's, and how anonymized information either stays in the room or may be shared. Sessions are not recorded. If you miss a week, you'll receive a one-page summary of that pillar, and you can use your one-on-one session to catch up."),
      ] },
      { id: 'closing', title: 'Closing', description: 'The cherry blossom photo, closing words, both buttons, and the call link.', fields: [
        photo('closing.image', 'Sprint Closing Photo', '/images/18Sitewide.jpeg', LANDSCAPE_4x3, 'Shown as a band above the closing buttons.'),
        line('closing.headline', 'Headline', 'Start the year with a framework that holds.'),
        para('closing.body', 'Text', "Eight weeks, a small group, and a single page that captures what you value and how you'll keep it."),
        line('closing.question', 'Question before the call link', 'Questions first?'),
        line('closing.call', 'Call link text', 'Schedule a free 15-minute call →', { help: 'Opens your free call booking page from Scheduling.' }),
      ] },
    ],
  },
  faq: {
    label: 'FAQ',
    path: '/faq',
    description: 'Frequently asked questions. Each question opens to show its answer. Program prices in the answers come from Pricing & Payments.',
    sections: [
      { id: 'top', title: 'Top of page', description: 'The page heading.', fields: [
        line('top.label', 'Small label', 'FAQ'),
        line('top.heading', 'Heading', 'Frequently asked questions'),
        line('investment.label', 'Word before program prices', 'Investment', { help: 'Answers about each program end with this word and the price from Pricing & Payments.' }),
        line('investment.sprintSuffix', 'Words after the Sprint price', 'per person'),
      ] },
      ...FAQ_SECTIONS.map(sec => ({
        id: sec.id,
        title: sec.heading,
        description: 'The section heading and its questions. Leave a question blank to hide it. The empty slots at the end let you add a new question.',
        fields: [
          line(`${sec.id}.heading`, 'Section heading', sec.heading),
          ...[...sec.items, ...Array.from({ length: FAQ_SPARE }, () => ({ q: '', a: '' }))].flatMap((it, i) => {
            const n = i + 1
            const priced = 'program' in it && it.program
            return [
              line(`${sec.id}.${n}.q`, `Question ${n}`, it.q, { optional: true }),
              para(`${sec.id}.${n}.a`, `Answer ${n}`, it.a, {
                optional: true,
                help: (priced ? 'The investment line is added automatically from Pricing & Payments. ' : '') + FORMAT_HELP,
              }),
              ...('sources' in it ? [para(`${sec.id}.${n}.sources`, `Answer ${n}: source links`, it.sources as string, { optional: true, help: 'Small links shown under the answer. ' + LINK_HELP })] : []),
            ]
          }),
        ],
      })),
      { id: 'sources', title: 'Sources', description: 'The research cited in the answers, listed at the bottom of the page.', fields: [
        line('sources.heading', 'Heading', 'Sources'),
        ...FAQ_SOURCES.map((src, i) => para(`sources.${i + 1}`, `Source ${i + 1}`, src, { optional: true, help: LINK_HELP })),
        ...Array.from({ length: 2 }, (_, i) => para(`sources.${FAQ_SOURCES.length + i + 1}`, `Source ${FAQ_SOURCES.length + i + 1}`, '', { optional: true, help: LINK_HELP })),
      ] },
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
