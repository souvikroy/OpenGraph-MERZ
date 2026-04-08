import type { ChatSession } from '../types';

export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat-001',
    repId: 'rep-001',
    repName: 'James Mitchell',
    startTime: '2026-04-09T08:15:00',
    product: 'Xeomin',
    messages: [
      {
        id: 'msg-001-1',
        role: 'user',
        content: 'What is the recommended dosing for Xeomin when treating glabellar lines?',
        timestamp: '2026-04-09T08:15:10',
        product: 'Xeomin',
      },
      {
        id: 'msg-001-2',
        role: 'assistant',
        content:
          'For glabellar lines, Xeomin (incobotulinumtoxinA) is administered as follows:\n\n**Recommended dose:** 20 Units total, distributed as 5 injections of 4 Units each into the corrugator and procerus muscles.\n\n**Injection sites:**\n- 2 × corrugator supercilii muscle (each side)\n- 1 × procerus muscle\n\n**Re-treatment interval:** Clinical improvement typically lasts 3–4 months. Re-treatment should not occur sooner than 3 months after the prior injection.\n\n**Maximum dose:** Do not exceed 20 Units per treatment session for glabellar lines.\n\nThe onset of effect typically occurs within 2–3 days, with full effect observed at Day 30.',
        timestamp: '2026-04-09T08:15:14',
        product: 'Xeomin',
        confidenceScore: 96,
        citations: [
          { documentName: 'Xeomin SmPC', section: 'Section 4.2 – Posology', page: 4 },
          { documentName: 'Xeomin Dosing Guide', section: 'Glabellar Lines Protocol' },
        ],
        complianceFlags: ['compliant'],
      },
      {
        id: 'msg-001-3',
        role: 'user',
        content: 'Can Xeomin be used for brow lifting in patients over 65?',
        timestamp: '2026-04-09T08:16:40',
        product: 'Xeomin',
      },
      {
        id: 'msg-001-4',
        role: 'assistant',
        content:
          'Xeomin is approved for glabellar lines in adults. For the specific brow-lifting application in patients over 65, this would fall outside the approved indication in the UAE SmPC.\n\nI\'m unable to provide guidance on off-label uses. I\'ve logged this query for the Medical Affairs team per our compliance protocol.\n\nFor questions about approved indications, I\'m here to help. You can also contact the Medical Affairs team directly for clinical enquiries beyond the approved label.',
        timestamp: '2026-04-09T08:16:45',
        product: 'Xeomin',
        confidenceScore: 99,
        citations: [{ documentName: 'Xeomin SmPC UAE', section: 'Section 4.1 – Indications' }],
        complianceFlags: ['off-label'],
        routingAction: 'Query logged. Medical Affairs notified.',
      },
    ],
  },
  {
    id: 'chat-002',
    repId: 'rep-001',
    repName: 'James Mitchell',
    startTime: '2026-04-08T14:22:00',
    product: 'Belotero',
    messages: [
      {
        id: 'msg-002-1',
        role: 'user',
        content: 'How does Belotero Balance compare to Juvederm Ultra for nasolabial folds?',
        timestamp: '2026-04-08T14:22:10',
        product: 'Belotero',
      },
      {
        id: 'msg-002-2',
        role: 'assistant',
        content:
          'Belotero Balance has a distinct rheological profile suited to nasolabial fold treatment. Key differentiators based on approved data:\n\n**Belotero Balance:**\n- Cohesive Polydensified Matrix (CPM) technology provides seamless integration into the dermis\n- Optimal for superficial-to-mid dermal injection\n- Lower G\' (elastic modulus) enables natural, soft results\n- Clinical evidence: 98% investigator-assessed improvement at 1 month (EMERGE study)\n\n**Important compliance note:** Comparative claims must reference head-to-head clinical data. Direct comparisons with competitor products require Medical Affairs approval before use in detailing.\n\nI can share the EMERGE study data and approved Belotero positioning materials.',
        timestamp: '2026-04-08T14:22:18',
        product: 'Belotero',
        confidenceScore: 84,
        citations: [
          { documentName: 'Belotero Competitive Positioning Brief', section: 'NLF Comparison Data' },
          { documentName: 'EMERGE Clinical Study Summary', section: 'Primary Endpoints' },
        ],
        complianceFlags: ['competitive', 'compliant'],
        routingAction: 'Competitive mention logged for Marketing Intelligence.',
      },
    ],
  },
  {
    id: 'chat-003',
    repId: 'rep-001',
    repName: 'James Mitchell',
    startTime: '2026-04-08T11:05:00',
    product: 'Radiesse',
    messages: [
      {
        id: 'msg-003-1',
        role: 'user',
        content:
          'The HCP mentioned a patient had persistent swelling and pain for 3 weeks after Radiesse injection. What should I do?',
        timestamp: '2026-04-08T11:05:22',
        product: 'Radiesse',
      },
      {
        id: 'msg-003-2',
        role: 'assistant',
        content:
          '⚠️ **Potential Adverse Event Detected**\n\nThis description may represent an adverse event requiring pharmacovigilance reporting.\n\n**Do not** use me to process adverse event details. Please:\n\n1. **Immediately** advise the HCP to refer the patient for clinical evaluation if not already done\n2. **Report** this to your PV team via the standard channel within **24 hours**\n3. **Complete** the Merz adverse event reporting form with: Rep name, HCP name, product, event description, onset date, and patient age group\n4. **Contact** Fouad (Medical Affairs / PV) directly if this is a serious adverse event\n\nThis query has been automatically flagged and the PV team has been notified. A PV alert has been generated with your name, timestamp, and the product reference.\n\nDo you need the PV reporting form or contact details?',
        timestamp: '2026-04-08T11:05:26',
        product: 'Radiesse',
        confidenceScore: 99,
        citations: [{ documentName: 'Radiesse Safety Profile', section: 'Adverse Event Reporting Protocol' }],
        complianceFlags: ['pv-signal'],
        routingAction: 'PV alert generated. Fouad (PV team) notified automatically.',
      },
    ],
  },
  {
    id: 'chat-004',
    repId: 'rep-002',
    repName: 'Sarah Al-Khoury',
    startTime: '2026-04-09T09:30:00',
    product: 'Ultherapy',
    messages: [
      {
        id: 'msg-004-1',
        role: 'user',
        content: 'What are the approved indications for Ultherapy in the UAE?',
        timestamp: '2026-04-09T09:30:10',
        product: 'Ultherapy',
      },
      {
        id: 'msg-004-2',
        role: 'assistant',
        content:
          'Ultherapy (micro-focused ultrasound with visualisation, MFU-V) is approved in the UAE for:\n\n1. **Eyebrow lifting** – non-invasive lifting of the brow line\n2. **Submental and neck skin laxity** – improvement of lax skin under the chin and on the neck\n3. **Décolletage lines and wrinkles** – improvement of lines and wrinkles on the chest\n\nAll indications are non-invasive and applicable to adult patients.\n\n**Treatment depth levels:** 1.5mm (superficial dermis), 3.0mm (deep dermis), 4.5mm (SMAS layer).\n\n**Treatment sessions:** Typically 1 session, with results developing over 2–3 months as collagen remodelling occurs.',
        timestamp: '2026-04-09T09:30:17',
        product: 'Ultherapy',
        confidenceScore: 94,
        citations: [
          { documentName: 'Ultherapy SmPC UAE', section: 'Section 4.1 – Indications', page: 2 },
          { documentName: 'Ultherapy Clinical Overview', section: 'Mechanism of Action' },
        ],
        complianceFlags: ['compliant'],
      },
    ],
  },
  {
    id: 'chat-005',
    repId: 'rep-001',
    repName: 'James Mitchell',
    startTime: '2026-04-07T15:45:00',
    product: 'Xeomin',
    messages: [
      {
        id: 'msg-005-1',
        role: 'user',
        content: 'Is there any data on Xeomin for hyperhidrosis treatment?',
        timestamp: '2026-04-07T15:45:10',
        product: 'Xeomin',
      },
      {
        id: 'msg-005-2',
        role: 'assistant',
        content:
          'The current UAE-approved indication for Xeomin does not include hyperhidrosis. Providing information or guidance on Xeomin for hyperhidrosis would be outside the approved label.\n\nThis query has been logged and forwarded to the Medical Affairs team per protocol. If there is genuine clinical interest from an HCP in this indication, please escalate to Medical Affairs (Fouad) for a formal medical information response.\n\nI\'m happy to help with questions on approved Xeomin indications.',
        timestamp: '2026-04-07T15:45:15',
        product: 'Xeomin',
        confidenceScore: 99,
        citations: [{ documentName: 'Xeomin SmPC UAE', section: 'Section 4.1 – Approved Indications' }],
        complianceFlags: ['off-label'],
        routingAction: 'Query logged. Medical Affairs notified.',
      },
    ],
  },
];

export const getRecentChats = (repId?: string, limit = 10) => {
  const sessions = repId
    ? mockChatSessions.filter(s => s.repId === repId)
    : mockChatSessions;
  return sessions.slice(0, limit);
};
