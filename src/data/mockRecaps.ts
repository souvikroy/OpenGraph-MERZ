import type { MeetingRecap } from '../types';

export const mockRecaps: MeetingRecap[] = [
  {
    id: 'recap-001',
    meetingId: 'meet-006',
    productsDiscussed: ['Xeomin'],
    hcpSentiment: 'positive',
    sentimentNotes:
      'Dr. Al-Rashid expressed strong interest in Xeomin. She mentioned patient feedback has been excellent. Requested updated dosing charts for her clinic team.',
    competitorMentions: ['Botox'],
    volumeDiscussed: '50 units/month current, potential to grow to 80 units/month',
    aspDiscussed: 'Standard pricing confirmed, open to volume discount discussion in Q2',
    samplesLeft: '2 × Xeomin 50U sample vials',
    nextSteps: 'Send updated dosing chart PDF. Schedule training for clinic nurse on injection technique.',
    nextVisitDate: '2026-04-28',
    complianceFlags: ['competitive'],
    voiceTranscript:
      'Met with Dr. Al-Rashid at Emirates Dermatology Centre. She mentioned she\'s been using Xeomin for about 18 months and patient satisfaction is really good. She brought up Botox comparison, asked about the naked toxin advantage again. I explained the complexing proteins difference. She was receptive. Current order volume is around 50 units a month, she thinks she can grow that to 80. ASP conversation was quick, she\'s happy with standard pricing for now but mentioned she wants to talk volume discounts in Q2. She took two sample vials. Main ask was updated dosing charts for the clinic team.',
    status: 'complete',
    crmEntryConfirmed: true,
    followupEmailSent: true,
    createdAt: '2026-03-28T11:30:00',
  },
  {
    id: 'recap-002',
    meetingId: 'meet-007',
    productsDiscussed: ['Belotero'],
    hcpSentiment: 'neutral',
    sentimentNotes:
      'Dr. Al-Hashim was politely engaged but not yet committed. She currently uses Restylane almost exclusively and is cautious about switching. She showed interest in the CPM technology.',
    competitorMentions: ['Restylane'],
    volumeDiscussed: 'Not discussed - too early stage',
    aspDiscussed: 'Not discussed',
    samplesLeft: '1 × Belotero Balance 1ml',
    nextSteps:
      'Follow up with EMERGE study data. Invite to upcoming Belotero hands-on workshop in Dubai. Ask Nadia (marketing) if there are any patient case studies from UAE dermatologists.',
    nextVisitDate: '2026-04-22',
    complianceFlags: ['competitive'],
    voiceTranscript:
      'Short meeting with Dr. Al-Hashim at Kaya JBR. She\'s a Restylane loyalist. I presented Belotero CPM technology and she seemed genuinely curious about the integration profile. But she wasn\'t ready to commit. Left one Balance sample. She said she\'d try it on a suitable patient. Need to get her the EMERGE study. Also thinking the hands-on workshop might be the real hook for her.',
    status: 'complete',
    crmEntryConfirmed: false,
    followupEmailSent: false,
    createdAt: '2026-04-01T14:15:00',
  },
  {
    id: 'recap-003',
    meetingId: 'meet-008',
    productsDiscussed: ['Xeomin', 'Radiesse'],
    hcpSentiment: 'positive',
    sentimentNotes:
      'Dr. Al-Otaibi was enthusiastic about the Radiesse Lidocaine formulation. His patients have been asking about more comfortable procedures. Strong potential for conversion from standard Radiesse.',
    competitorMentions: ['Botox', 'Sculptra'],
    volumeDiscussed: 'Radiesse: currently 4 syringes/month. Expects to double with lidocaine version.',
    aspDiscussed: 'Lidocaine premium pricing accepted in principle. Will confirm next month.',
    samplesLeft: '2 × Radiesse (+) Lidocaine 1.5ml',
    nextSteps:
      'Send Radiesse Lidocaine ordering form. Confirm pricing with Ahmad. Follow up on Sculptra comparison materials with Medical Affairs.',
    nextVisitDate: '2026-05-05',
    complianceFlags: ['competitive'],
    voiceTranscript:
      'Good session with Dr. Al-Otaibi. He\'s a solid Xeomin user, no concerns there. The big opportunity is Radiesse Lidocaine. He mentioned Sculptra is what some of his colleagues are switching to and I need to get competitive materials from Medical Affairs. He\'s currently doing 4 syringes of standard Radiesse a month and thinks Lidocaine version would let him double that because patients will be more comfortable. He accepted the concept of premium pricing. Sent him two lidocaine samples.',
    status: 'complete',
    crmEntryConfirmed: true,
    followupEmailSent: false,
    createdAt: '2026-04-03T11:00:00',
  },
];

export const getRecapByMeetingId = (meetingId: string) =>
  mockRecaps.find(r => r.meetingId === meetingId);
