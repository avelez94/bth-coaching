import { createHash } from 'crypto'

// ============================================================
// COACHING SERVICES AGREEMENT
// Version: 1.0
//
// ACTION REQUIRED BEFORE LAUNCH:
// Replace AGREEMENT_TEXT below with the exact verbatim text
// from John's Coaching Services Agreement PDF.
//
// Paste as a single template literal. Do not reformat —
// the SHA-256 hash is computed from this exact string and
// stored with every enrollment record as a legal audit trail.
//
// Steps:
//   1. Paste the full agreement text between the backticks below
//   2. Update AGREEMENT_VERSION and AGREEMENT_DATE to match the
//      version and effective date shown on the document
//   3. Run: node -e "const c=require('crypto');const t=require('fs').readFileSync('./lib/agreement.ts','utf8').match(/AGREEMENT_TEXT = \`([\s\S]*?)\`/)[1];console.log(c.createHash('sha256').update(t).digest('hex'))"
//      and confirm the hash printed matches AGREEMENT_HASH below
// ============================================================

export const AGREEMENT_VERSION = '1.0'
export const AGREEMENT_DATE = 'the date the Coachee enrolls online or signs below'

// Set to false once the real agreement text has been pasted in
export const AGREEMENT_IS_PLACEHOLDER = false

export const AGREEMENT_TEXT = `COACHING SERVICES AGREEMENT
Effective Date: the date the Coachee enrolls online or signs below

This Coaching Services Agreement ("Agreement") is between Beyond the Horizon Executive Coaching & Consulting, LLC, acting through its coach John McCracken ("Coach"), and the individual receiving coaching ("Coachee"). When an organization pays for the coaching, that organization is the "Sponsor."

How this Agreement is accepted. The Coachee accepts this Agreement either (a) online, by checking the box agreeing to these terms and completing payment when enrolling through the Beyond the Horizon website, or (b) by signing below. Both methods are equally binding.

When enrolling online, the Coachee's name, email, and phone number are collected at checkout and take the place of the signature lines.

COACHING PROGRAMS

The Coachee enrolls in one of the following programs. The program selected at checkout applies.

Executive Coaching. Six months; twelve one-hour sessions, about every two weeks; an 8 Pillars whole-person assessment at the start. Investment: $3,600 paid in full, or $600 per month for six months.

The 8 Pillars Leadership Program. About ten months; an intake assessment and one- to two-day kickoff, then two sessions per month for eight months (one structured pillar session and one open coaching session), followed by a close-out month. Investment: $6,000 paid in full, or $600 per month for ten months.

Organizational or custom program. Scope, schedule, and fees as set out in a written proposal or statement of work, which becomes part of this Agreement.

All programs include:
Sessions by Microsoft Teams, Zoom, phone, or another mutually agreed platform.
If the Coachee wishes, check-ins by text or email between sessions on action-plan progress.
Action plans documented and shared by email after each session.

COACHING GOALS

The Coach and Coachee will set the coaching goals together during the first session or sessions and confirm them in writing by email. Goals may be revised at any time by mutual agreement. For sponsored coaching, the Sponsor may help define the purpose of the engagement, as described in Section 6.

DEFINITION OF COACHING

Coaching is a partnership (an alliance, not a legal business partnership) between the Coach and the Coachee in a thought-provoking and creative process that inspires the Coachee to maximize personal and professional potential. It is designed to help the Coachee create personal, professional, or business goals and develop and carry out a plan for achieving them.

TERMS AND CONDITIONS

1. Coach-Coachee Relationship

A. The Coach agrees to maintain the ethics and standards of behavior established by the International Coaching Federation (ICF) (coachingfederation.org/ethics).

B. The Coachee is solely responsible for their own physical, mental, and emotional well-being, decisions, choices, actions, and results arising from the coaching relationship and their coaching sessions and interactions with the Coach. The Coachee agrees that the Coach is not and will not be liable or responsible for any action or inaction, or for any direct or indirect result of any services provided by the Coach.

C. The Coachee understands that coaching is not therapy, does not substitute for therapy if needed, and does not prevent, cure, or treat any mental disorder or medical disease.

D. The Coachee may end the coaching relationship at any time, as described in Section 4.

E. The Coachee acknowledges that coaching is a comprehensive process that may involve different areas of their life, including work, finances, health, relationships, education, and recreation. Deciding how to handle these areas, applying coaching principles to them, and carrying out choices is solely the Coachee's responsibility.

F. The Coachee acknowledges that coaching does not involve the diagnosis or treatment of mental disorders as defined by the American Psychiatric Association, and that coaching is not a substitute for counseling, psychotherapy, psychoanalysis, mental health care, substance abuse treatment, or other professional advice from legal, medical, or other qualified professionals.

G. It is the Coachee's sole responsibility to seek independent professional guidance as needed. If the Coachee is under the care of a mental health professional, the Coachee is encouraged to inform that provider of the nature and extent of the coaching relationship.

H. To get the most from coaching, the Coachee agrees to communicate honestly, be open to feedback and support, and make the time and energy to participate fully.

2. Coaching Sessions

Sessions follow the schedule of the selected program and take place by video conference (Microsoft Teams, Zoom, or another mutually agreed platform), video call, or phone, as mutually agreed. All times in this Agreement are Eastern Time unless otherwise specified.

3. Between-Session Communication

The Coach is available to the Coachee by email and voicemail and typically responds within 24 to 48 hours on business days. If the Coachee wishes, the Coach will text or email between sessions to check on action-plan progress and offer general feedback.

Additional time requested by the Coachee (such as reviewing documents, reading or writing reports, or other work outside coaching sessions) is available at the program's per-session rate, prorated by the hour, and is charged only when requested and agreed in advance.

4. Fees, Payment, and Cancellation

A. Payment Options

The Coachee may pay the program fee in full at enrollment or in monthly installments, as shown in the Coaching Programs section. Online payments are processed securely through Stripe by credit card, debit card, or bank transfer (ACH). The Coach does not see or store the Coachee's card or bank account numbers. Other payment methods, such as Zelle or check, are available by prior arrangement.

B. Monthly Installments

The first installment is charged at enrollment. Each remaining installment is charged automatically on the same day of each following month until the program total is paid, after which charges stop. By choosing installments, the Coachee authorizes these recurring charges. If a payment does not go through, the Coach will notify the Coachee, and sessions may pause until payment is resolved.

C. Sponsored and Organizational Programs

When a Sponsor pays, the Coach will invoice the Sponsor according to the written proposal. Invoices are due within 30 days unless the proposal states otherwise.

D. Price Changes

The price of a program is fixed at enrollment. Later changes to published prices do not affect a program already underway.

E. Termination and Refunds

Either party may end this Agreement at any time with written notice; email is sufficient. On termination, any remaining installments are canceled and no further fees are due. Fees already paid for sessions not yet held are refunded on a prorated basis, calculated on the sessions completed out of the program total. Fees for sessions already held are not refunded. Refunds are issued to the original payment method within 10 business days.

F. Cancellation and Rescheduling

The Coachee agrees to give at least 24 hours' notice to cancel or reschedule a session. Sessions canceled with at least 24 hours' notice will be rescheduled at a mutually convenient time with no penalty.

The Coach will wait 10 minutes after the scheduled start time. If the Coachee does not join within 10 minutes and has not given notice, the session is a no-show. The first no-show will be rescheduled without penalty as a courtesy. Later no-shows count as completed sessions.

If the Coach must cancel a session, a makeup session will be scheduled at a mutually convenient time at no charge to the Coachee.

G. Renewal

At the end of the program, the parties may agree to continue the coaching relationship on terms agreed at that time.

5. Getting Started and Meeting Procedure

Within two business days of enrollment, the Coach will contact the Coachee by email to schedule the first session.

The Coach will send a calendar invitation with a video link for each scheduled session. For phone sessions, the Coachee will call the Coach at 703-705-2225 unless the Coach provides a different number in advance.

6. Confidentiality

This coaching relationship, and all information (written or spoken) the Coachee shares with the Coach as part of it, is bound by the principles of confidentiality in the ICF Code of Ethics.

The coach-coachee relationship is not a legally privileged relationship (like the medical and legal professions), so communications are not protected by any legally recognized privilege. The Coach will not disclose any information about the Coachee without the Coachee's written consent, and will not use the Coachee's name as a reference without the Coachee's consent.

Confidential information does not include information that: (a) was in the Coach's possession before the Coachee provided it; (b) is generally known to the public or in the Coachee's industry; (c) is obtained by the Coach from a third party without breach of any obligation to the Coachee; (d) is independently developed by the Coach without use of the Coachee's confidential information; or (e) the Coach is required by statute, lawfully issued subpoena, or court order to disclose.

Confidentiality may also be breached if: (f) the Coach reasonably believes, based on information disclosed, that there is an imminent or likely risk of danger or harm to the Coachee or others; or (g) the information involves illegal activity.

Sponsored coaching. When a Sponsor pays for coaching, the Sponsor may help define the purpose of the engagement and the outcomes to watch for. Before coaching begins, the Coach, Coachee, and Sponsor will agree in writing on what general information the Sponsor will receive, such as attendance and overall progress toward agreed goals. The content of coaching sessions remains confidential between the Coach and the Coachee.

The Coachee agrees to raise any confidentiality questions or concerns with the Coach promptly.

7. Release of Information

The Coach pursues ICF credentials, which may require ICF to verify coaching relationships. By accepting this Agreement, the Coachee agrees that the Coach may share only the following with ICF staff, for the sole purpose of verifying the coaching relationship:

Name and contact information.
Start and end dates of the coaching relationship.
Total number of hours coached.

No personal notes or session content will be shared.

In keeping with professional ethics, topics may be shared anonymously and hypothetically with other coaching professionals for training, supervision, mentoring, evaluation, and professional development.

8. Record Retention

As part of the coaching relationship, the Coach will take notes (written or electronic), and together the Coach and Coachee will create action plans. These notes are kept confidential as described in Section 6, are stored securely, and are used solely for the benefit of the coaching relationship. They will not be shared with anyone except as required by law. Any recorded session will be kept only as long as needed for note-taking, except for ICF credentialing purposes and only with the Coachee's agreement.

Coaching records are kept for about two years, subject to exceptions required by law. Payment records are kept as required for tax purposes. Card and bank details are held by the payment processor, not by the Coach.

9. Changes to Contact Information

The parties agree to promptly notify each other of any change to their contact information.

10. Force Majeure

Neither party is liable for any failure or delay in performance under this Agreement caused by circumstances beyond their reasonable control, including acts of God, war, terrorism, civil disturbance, pandemic, government action, natural disaster, or other emergencies. In such events, sessions will be rescheduled at a mutually convenient time with no penalty to either party.

11. Limited Liability

Except as expressly provided in this Agreement, the Coach makes no guarantees, representations, or warranties of any kind, express or implied, about the coaching services. In no event is the Coach liable to the Coachee for any indirect, consequential, or special damages. The Coach's entire liability under this Agreement, and the Coachee's exclusive remedy, is limited to the amount actually paid to the Coach under this Agreement for coaching services through the termination date.

12. Entire Agreement

This Agreement, together with any program description or written proposal it references, is the entire agreement between the parties on its subject matter and supersedes all prior written and oral representations. It may be amended only by written agreement of both parties, which may be by email.

13. Dispute Resolution

If a dispute arising from this Agreement cannot be resolved by mutual consent, the parties agree to try in good faith to resolve it through mediation for up to 90 days after notice is given. If it is not resolved and legal action follows, the prevailing party is entitled to recover reasonable attorney's fees and court costs from the other party.

14. Severability

If any provision of this Agreement is held invalid or unenforceable, the remaining provisions remain valid and enforceable. If a court finds that a provision would be valid and enforceable if limited, that provision will be read and enforced as so limited.

15. Waiver

A party's failure to enforce any provision of this Agreement is not a waiver of that party's right to enforce that or any other provision later.

16. Applicable Law

This Agreement is governed by the laws of the Commonwealth of Virginia, without regard to its conflict-of-laws rules.

17. Binding Effect

This Agreement is binding on the parties and their respective successors and permitted assigns.

18. Electronic Acceptance and Signatures

Checking the box to accept this Agreement during online enrollment has the same legal effect as a handwritten signature. This Agreement may also be signed electronically through a signature platform (such as DocuSign or Adobe Sign), and such signatures are valid and binding.

EXECUTION

Enrolling online: accepting these terms at checkout completes this Agreement. No additional signature is needed.

Coach: John McCracken, Beyond the Horizon Executive Coaching & Consulting, LLC
Email: john@mccrackencoaching.com | Phone: 703-705-2225
Associate Certified Coach (ACC), International Coaching Federation`

export const AGREEMENT_HASH = createHash('sha256')
  .update(AGREEMENT_TEXT)
  .digest('hex')

// Paragraphs for display in the enrollment flow.
// Split by double newline so each paragraph renders separately.
export const AGREEMENT_PARAGRAPHS: string[] = AGREEMENT_TEXT
  .split(/\n{2,}/)
  .map(p => p.trim())
  .filter(Boolean)
