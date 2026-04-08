import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Brain,
  BookOpen,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Filter,
  History,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { mockChatSessions } from '../data/mockChats';
import type { ChatMessage, ProductBrand, ComplianceFlag } from '../types';
import ProductBadge from '../components/shared/ProductBadge';
import ComplianceBadge from '../components/shared/ComplianceBadge';

const PRODUCT_FILTERS: { label: string; value: ProductBrand | 'all' }[] = [
  { label: 'All Products', value: 'all' },
  { label: 'Xeomin', value: 'Xeomin' },
  { label: 'Belotero', value: 'Belotero' },
  { label: 'Radiesse', value: 'Radiesse' },
  { label: 'Ultherapy', value: 'Ultherapy' },
];

const QUICK_QUESTIONS = [
  'What is the recommended Xeomin dose for glabellar lines?',
  'What are Belotero\'s approved indications?',
  'Radiesse mechanism of action?',
  'Ultherapy treatment depths explained',
];

// Simulated AI response for demo
function getSimulatedResponse(query: string): ChatMessage {
  const lower = query.toLowerCase();
  let response = '';
  let flags: ComplianceFlag[] = ['compliant'];
  let citations = [];
  let score = 88;
  let routing = '';

  if (lower.includes('off-label') || lower.includes('hyperhidrosis') || lower.includes('brow lift')) {
    response =
      'This query relates to an off-label use that falls outside the approved indication in the UAE. I\'m unable to provide guidance on off-label uses.\n\nThis query has been logged and forwarded to the Medical Affairs team (Fouad) per our compliance protocol.\n\nFor approved indication questions, I\'m ready to help.';
    flags = ['off-label'];
    score = 99;
    routing = 'Query logged. Medical Affairs notified.';
    citations = [{ documentName: 'Compliance Guidelines', section: 'Off-Label Query Protocol' }];
  } else if (lower.includes('adverse') || lower.includes('side effect') || lower.includes('complication') || lower.includes('swelling')) {
    response =
      '⚠️ **Potential Adverse Event Detected**\n\nThis description may represent an adverse event requiring pharmacovigilance reporting. Please:\n\n1. Advise the HCP to refer the patient for clinical evaluation\n2. Report to your PV team via the standard channel within **24 hours**\n3. Complete the Merz AE reporting form\n4. Contact Fouad (Medical Affairs/PV) directly for serious events\n\nA PV alert has been generated automatically.';
    flags = ['pv-signal'];
    score = 99;
    routing = 'PV alert generated. Fouad (PV team) notified automatically.';
    citations = [{ documentName: 'Pharmacovigilance Protocol', section: 'AE Reporting Procedure' }];
  } else if (lower.includes('competitor') || lower.includes('botox') || lower.includes('juvederm') || lower.includes('restylane') || lower.includes('dysport')) {
    response =
      'I can share approved positioning data for Merz products. Comparative claims require head-to-head clinical data from approved sources.\n\nFor Xeomin vs. other botulinum toxin products, the key differentiator is the naked toxin formulation (free of complexing proteins), which may reduce the risk of antibody formation with repeated use.\n\nAll competitive references have been logged for Marketing Intelligence reporting.';
    flags = ['competitive', 'compliant'];
    score = 82;
    routing = 'Competitive mention logged for Marketing Intelligence.';
    citations = [{ documentName: 'Competitive Positioning Brief', section: 'Botulinum Toxin Differentiation' }];
  } else if (lower.includes('xeomin')) {
    response =
      'Xeomin (incobotulinumtoxinA) is a purified botulinum toxin type A formulation free of complexing proteins.\n\n**Approved indication (UAE):** Temporary improvement of glabellar lines (frown lines between the eyebrows) in adults.\n\n**Standard dose:** 20 Units across 5 injection sites.\n\n**Onset:** 2–3 days; full effect at Day 30.\n\n**Re-treatment:** Not sooner than 3 months after prior injection.\n\nWould you like dosing specifics, contraindications, or clinical study summaries?';
    citations = [
      { documentName: 'Xeomin SmPC UAE', section: 'Section 4.1 & 4.2', page: 3 },
      { documentName: 'Xeomin Product Monograph', section: 'Clinical Pharmacology' },
    ];
    score = 95;
  } else if (lower.includes('belotero')) {
    response =
      'Belotero is a range of hyaluronic acid-based dermal fillers using Cohesive Polydensified Matrix (CPM) technology.\n\n**Range overview:**\n- **Belotero Soft** – superficial fine lines\n- **Belotero Balance** – mid-dermal wrinkles and folds\n- **Belotero Intense** – deep wrinkles and lip augmentation\n- **Belotero Volume** – volumizing cheekbones and chin\n\n**Key differentiator:** CPM technology creates seamless integration into the dermis without the Tyndall effect.\n\nWould you like information on a specific SKU or indication?';
    citations = [
      { documentName: 'Belotero Product Range Overview', section: 'Product Portfolio' },
      { documentName: 'Belotero SmPC', section: 'Section 4.1' },
    ];
    score = 93;
  } else if (lower.includes('radiesse')) {
    response =
      'Radiesse is a calcium hydroxylapatite (CaHA) biostimulator for facial volume restoration and skin quality improvement.\n\n**Mechanism:** CaHA microspheres suspended in CMC gel provide immediate volumizing effect, followed by collagen stimulation as the gel is absorbed over 3–6 months.\n\n**Radiesse (+):** Available with 0.3% lidocaine for improved patient comfort.\n\n**Approved uses:** Nasolabial folds, cheek augmentation, jawline definition, hand rejuvenation.\n\n**Duration:** 12–18+ months.';
    citations = [
      { documentName: 'Radiesse Product Monograph', section: 'Mechanism of Action' },
      { documentName: 'Radiesse SmPC UAE', section: 'Section 4.1 & 5.1' },
    ];
    score = 91;
  } else if (lower.includes('ultherapy')) {
    response =
      'Ultherapy (Micro-Focused Ultrasound with Visualisation, MFU-V) is a non-invasive energy-based device.\n\n**Approved indications (UAE):**\n1. Non-invasive eyebrow lifting\n2. Improvement of submental and neck skin laxity\n3. Improvement of décolletage lines and wrinkles\n\n**Mechanism:** Focused ultrasound energy at precise depths (1.5mm, 3.0mm, 4.5mm) triggers thermal coagulation points, stimulating collagen remodelling.\n\n**Results:** Develop over 2–3 months. Typically 1 treatment session.';
    citations = [
      { documentName: 'Ultherapy SmPC UAE', section: 'Section 4.1 – Indications', page: 2 },
      { documentName: 'Ultherapy Clinical Overview', section: 'Mechanism of Action' },
    ];
    score = 94;
  } else {
    response =
      'I searched the Merz product knowledge base for your query. Based on available approved documentation:\n\nI have limited information specifically addressing this query. Let me provide what I can from approved sources.\n\nFor a more precise answer, could you specify which product (Xeomin, Belotero, Radiesse, or Ultherapy) and the clinical context? This helps me retrieve the most relevant approved materials.';
    flags = ['low-confidence'];
    score = 61;
    citations = [{ documentName: 'General Product Knowledge Base', section: 'Query Results' }];
    routing = 'Low confidence response – flagged for Medical Affairs review.';
  }

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
    confidenceScore: score,
    citations: citations as any,
    complianceFlags: flags,
    routingAction: routing || undefined,
  };
}

export default function ProductExpertChat() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ProductBrand | 'all'>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
      product: selectedProduct !== 'all' ? selectedProduct : undefined,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const aiMsg = getSimulatedResponse(query);
    if (selectedProduct !== 'all') aiMsg.product = selectedProduct;
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Brain size={20} className="text-merz-teal" />
            Product Expert
          </h1>
          <p className="page-subtitle">Compliance-first AI · All responses validated against approved sources</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/product-expert/audit')} className="btn-secondary">
            <History size={14} />
            Audit Trail
          </button>
          <button onClick={() => setMessages([])} className="btn-ghost">
            <RefreshCw size={14} />
            New Chat
          </button>
        </div>
      </div>

      {/* Product filter */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-merz-slate-light" />
        <div className="flex gap-1.5 flex-wrap">
          {PRODUCT_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setSelectedProduct(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedProduct === f.value
                  ? 'bg-merz-teal text-white'
                  : 'bg-white border border-merz-border text-merz-slate-mid hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 card overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-merz-teal-light flex items-center justify-center mb-4">
                  <Brain size={28} className="text-merz-teal" />
                </div>
                <h3 className="font-semibold text-merz-slate mb-1">Product Knowledge Expert</h3>
                <p className="text-sm text-merz-slate-light max-w-sm mb-6">
                  Ask any question about Xeomin, Belotero, Radiesse, or Ultherapy. All responses are validated against approved Merz documentation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left px-3 py-2.5 bg-gray-50 hover:bg-merz-teal-light border border-merz-border hover:border-merz-teal rounded-lg text-xs text-merz-slate transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-merz-teal flex items-center justify-center shrink-0 mt-1">
                        <Brain size={13} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[78%] ${msg.role === 'user' ? '' : ''}`}>
                      {msg.role === 'user' ? (
                        <div className="chat-bubble-user">
                          <p>{msg.content}</p>
                        </div>
                      ) : (
                        <div className="chat-bubble-ai">
                          {/* Compliance flags */}
                          {msg.complianceFlags && msg.complianceFlags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {msg.complianceFlags.map(flag => (
                                <ComplianceBadge key={flag} flag={flag} />
                              ))}
                              {msg.confidenceScore !== undefined && (
                                <span className={`badge text-[10px] px-2 py-0 ${
                                  msg.confidenceScore >= 90 ? 'badge-green' :
                                  msg.confidenceScore >= 75 ? 'badge-teal' : 'badge-amber'
                                }`}>
                                  {msg.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                          )}

                          {/* PV/Off-label alert banners */}
                          {msg.complianceFlags?.includes('pv-signal') && (
                            <div className="flex items-start gap-2 bg-compliance-pv-flag-bg border border-compliance-pv-flag/30 rounded-lg px-3 py-2 mb-3 -mx-1">
                              <AlertTriangle size={14} className="text-compliance-pv-flag shrink-0 mt-0.5" />
                              <p className="text-xs font-semibold text-compliance-pv-flag">Pharmacovigilance Alert Active</p>
                            </div>
                          )}
                          {msg.complianceFlags?.includes('off-label') && (
                            <div className="flex items-start gap-2 bg-compliance-off-label-bg border border-compliance-off-label/30 rounded-lg px-3 py-2 mb-3 -mx-1">
                              <AlertCircle size={14} className="text-compliance-off-label shrink-0 mt-0.5" />
                              <p className="text-xs font-semibold text-compliance-off-label">Off-Label Query – Response Blocked</p>
                            </div>
                          )}

                          <p
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                          />

                          {/* Citations */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-merz-border">
                              <p className="text-[10px] font-bold text-merz-slate-light uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                <BookOpen size={10} /> Sources
                              </p>
                              <div className="space-y-1">
                                {msg.citations.map((c, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <span className="w-4 h-4 rounded bg-merz-teal-light text-merz-teal text-[9px] font-bold flex items-center justify-center shrink-0">
                                      {i + 1}
                                    </span>
                                    <p className="text-[11px] text-merz-slate-mid">
                                      <span className="font-medium">{c.documentName}</span>
                                      {c.section && <span className="text-merz-slate-light"> · {c.section}</span>}
                                      {c.page && <span className="text-merz-slate-light"> · p.{c.page}</span>}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Routing action */}
                          {msg.routingAction && (
                            <div className="mt-2 pt-2 border-t border-merz-border">
                              <p className="text-[10px] text-merz-slate-light flex items-center gap-1">
                                <ChevronRight size={10} />
                                {msg.routingAction}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-merz-border">
                            <button
                              onClick={() => copyMessage(msg.id, msg.content)}
                              className="text-[11px] text-merz-slate-light hover:text-merz-slate flex items-center gap-1 transition-colors"
                            >
                              <Copy size={11} />
                              {copiedId === msg.id ? 'Copied!' : 'Copy'}
                            </button>
                            <button className="text-[11px] text-merz-slate-light hover:text-compliance-compliant flex items-center gap-1 transition-colors">
                              <ThumbsUp size={11} /> Helpful
                            </button>
                            <button className="text-[11px] text-merz-slate-light hover:text-compliance-off-label flex items-center gap-1 transition-colors">
                              <ThumbsDown size={11} /> Not helpful
                            </button>
                            <span className="ml-auto text-[10px] text-merz-slate-light">
                              {format(new Date(msg.timestamp), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-merz-teal flex items-center justify-center shrink-0">
                      <Brain size={13} className="text-white" />
                    </div>
                    <div className="chat-bubble-ai">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-merz-teal rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-merz-teal rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-merz-teal rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-xs text-merz-slate-light">Searching knowledge base...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="mt-3 card p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={2}
                className="flex-1 resize-none text-sm text-merz-slate placeholder-gray-400 bg-transparent outline-none leading-relaxed"
                placeholder={`Ask about ${selectedProduct === 'all' ? 'any Merz product' : selectedProduct}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="btn-primary py-2 px-3 shrink-0 self-end"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-merz-border">
              <p className="text-[10px] text-merz-slate-light">
                <CheckCircle size={10} className="inline mr-1 text-compliance-compliant" />
                Compliance guardrails active · Off-label & PV detection enabled
              </p>
              <p className="text-[10px] text-merz-slate-light">Enter to send · Shift+Enter for newline</p>
            </div>
          </div>
        </div>

        {/* Recent queries sidebar */}
        <div className="hidden xl:flex w-64 flex-col gap-3 shrink-0">
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-merz-border">
              <p className="text-xs font-semibold text-merz-slate-mid uppercase tracking-wide">Recent Sessions</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-merz-border">
              {mockChatSessions.map(session => {
                const firstUserMsg = session.messages.find(m => m.role === 'user');
                const hasFlags = session.messages.some(m =>
                  m.complianceFlags?.some(f => f !== 'compliant')
                );
                return (
                  <div
                    key={session.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/product-expert/audit')}
                  >
                    <div className="flex items-start gap-2">
                      {hasFlags && <AlertCircle size={11} className="text-compliance-off-label shrink-0 mt-0.5" />}
                      <div className="min-w-0">
                        <p className="text-xs text-merz-slate line-clamp-2 leading-relaxed">{firstUserMsg?.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          {session.product && <ProductBadge product={session.product} size="sm" showDot={false} />}
                          <span className="text-[10px] text-merz-slate-light ml-auto">
                            {format(new Date(session.startTime), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
