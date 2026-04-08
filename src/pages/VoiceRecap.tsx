import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Mic, Square, ChevronRight, ArrowLeft, Clock,
  FileText, AlertCircle, CheckCircle, Camera, Keyboard,
} from 'lucide-react';
import { getPastMeetings, getMeetingById } from '../data/mockMeetings';
import ProductBadge from '../components/shared/ProductBadge';

type RecapMode = 'idle' | 'recording' | 'processing' | 'done';
type InputMode = 'voice' | 'text' | 'photo';

const MOCK_TRANSCRIPT = `Met with Dr. Sara Al-Hashim at Kaya Clinic JBR today. Short but productive session. She's been using Restylane almost exclusively, but she showed real interest in the Belotero CPM technology when I explained how it integrates differently into the dermis – she liked the idea of avoiding the Tyndall effect for superficial injections. She's cautious about switching but not closed. I left her one Belotero Balance sample and asked her to try it on a suitable patient. Her feedback overall was neutral – interested but waiting to see results. I need to follow up with the EMERGE study data and also check if we have any patient case studies from UAE dermatologists. The invite to the upcoming hands-on Belotero workshop in Dubai could be the real hook for her. Next visit target is around April 22nd.`;

export default function VoiceRecap() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [mode, setMode] = useState<RecapMode>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [waveValues, setWaveValues] = useState<number[]>(Array(20).fill(4));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meeting = meetingId ? getMeetingById(meetingId) : null;
  const pastMeetings = getPastMeetings().filter(m => !m.hasRecap);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (waveRef.current) clearInterval(waveRef.current);
    };
  }, []);

  const startRecording = () => {
    setMode('recording');
    setSeconds(0);
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    waveRef.current = setInterval(() => {
      setWaveValues(Array(20).fill(0).map(() => 4 + Math.random() * 24));
    }, 100);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (waveRef.current) clearInterval(waveRef.current);
    setMode('processing');
    setTimeout(() => {
      setTranscript(MOCK_TRANSCRIPT);
      setMode('done');
    }, 2000);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setMode('processing');
    setTimeout(() => {
      setTranscript(textInput);
      setMode('done');
    }, 1500);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/sales-companion/post-meeting/history')} className="btn-ghost">
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Mic size={20} className="text-merz-teal" />
              Voice Recap
            </h1>
            <p className="page-subtitle">Record your post-meeting notes. AI will extract structured data.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recorder panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select meeting */}
          {!meeting && (
            <div className="card p-4">
              <p className="form-label">Select Meeting</p>
              <div className="space-y-2">
                {pastMeetings.slice(0, 4).map(m => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-merz-border hover:bg-merz-teal-light hover:border-merz-teal cursor-pointer transition-all"
                    onClick={() => navigate(`/sales-companion/post-meeting/recap/${m.id}`)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-merz-slate">{m.hcp.name}</p>
                      <p className="text-xs text-merz-slate-light">{m.date} · {m.location}</p>
                    </div>
                    <div className="flex gap-1">
                      {m.products.map(p => <ProductBadge key={p} product={p} size="sm" />)}
                    </div>
                    <AlertCircle size={14} className="text-compliance-pv-flag shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting context */}
          {meeting && (
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-merz-teal-light flex items-center justify-center shrink-0">
                <FileText size={16} className="text-merz-teal" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-merz-slate">{meeting.hcp.name}</p>
                <p className="text-xs text-merz-slate-light">{meeting.date} · {meeting.location}</p>
              </div>
              <div className="flex gap-1.5">
                {meeting.products.map(p => <ProductBadge key={p} product={p} size="sm" />)}
              </div>
            </div>
          )}

          {/* Input mode tabs */}
          <div className="card p-1 flex gap-1">
            {[
              { mode: 'voice' as const, icon: <Mic size={14} />, label: 'Voice Note' },
              { mode: 'text' as const, icon: <Keyboard size={14} />, label: 'Type Notes' },
              { mode: 'photo' as const, icon: <Camera size={14} />, label: 'Photo' },
            ].map(opt => (
              <button
                key={opt.mode}
                onClick={() => { setInputMode(opt.mode); setMode('idle'); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inputMode === opt.mode
                    ? 'bg-merz-teal text-white shadow-sm'
                    : 'text-merz-slate-mid hover:bg-gray-100'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {/* Voice recorder */}
          {inputMode === 'voice' && (
            <div className="card p-8 flex flex-col items-center gap-6">
              {/* Waveform */}
              <div className="flex items-center gap-1 h-12 w-full justify-center">
                {waveValues.map((h, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-75 ${mode === 'recording' ? 'bg-merz-teal' : 'bg-gray-200'}`}
                    style={{ width: '4px', height: `${mode === 'recording' ? h : 4}px` }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                {mode === 'recording' && (
                  <div className="flex items-center gap-2 justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-2xl font-bold text-merz-slate">{formatTime(seconds)}</span>
                  </div>
                )}
                {mode === 'idle' && (
                  <p className="text-merz-slate-light text-sm">Tap the button to start recording</p>
                )}
                {mode === 'processing' && (
                  <div className="flex items-center gap-2 text-merz-teal">
                    <div className="w-4 h-4 border-2 border-merz-teal/30 border-t-merz-teal rounded-full animate-spin" />
                    <span className="text-sm">Transcribing & extracting data...</span>
                  </div>
                )}
                {mode === 'done' && (
                  <div className="flex items-center gap-2 text-compliance-compliant">
                    <CheckCircle size={16} />
                    <span className="text-sm font-semibold">Transcript ready</span>
                  </div>
                )}
              </div>

              {/* Record button */}
              {(mode === 'idle' || mode === 'recording') && (
                <button
                  onClick={mode === 'idle' ? startRecording : stopRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    mode === 'recording'
                      ? 'bg-red-500 hover:bg-red-600 scale-110'
                      : 'bg-merz-teal hover:bg-merz-teal-dark'
                  }`}
                >
                  {mode === 'recording' ? (
                    <Square size={24} className="text-white" fill="white" />
                  ) : (
                    <Mic size={28} className="text-white" />
                  )}
                </button>
              )}

              {/* Guidance */}
              <div className="text-center">
                <p className="text-xs text-merz-slate-light max-w-xs">
                  Speak naturally. Mention: products discussed, HCP reaction, competitor mentions, samples left, next steps.
                </p>
              </div>
            </div>
          )}

          {/* Text input */}
          {inputMode === 'text' && (
            <div className="card p-5 space-y-4">
              <textarea
                rows={8}
                className="form-input font-mono text-xs leading-relaxed resize-none"
                placeholder="Type your meeting notes here. Mention products discussed, HCP feedback, competitor mentions, samples left, next steps..."
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
              />
              {mode === 'processing' && (
                <div className="flex items-center gap-2 text-merz-teal">
                  <div className="w-4 h-4 border-2 border-merz-teal/30 border-t-merz-teal rounded-full animate-spin" />
                  <span className="text-sm">Extracting structured data...</span>
                </div>
              )}
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || mode === 'processing'}
                className="w-full btn-primary justify-center"
              >
                Extract Structured Recap
              </button>
            </div>
          )}

          {/* Photo */}
          {inputMode === 'photo' && (
            <div className="card p-8 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Camera size={32} className="text-gray-400" />
              </div>
              <p className="text-sm text-merz-slate text-center">Take a photo of handwritten meeting notes. AI will extract text using OCR.</p>
              <button className="btn-primary">Open Camera</button>
              <p className="text-xs text-merz-slate-light">Supported on iPad with camera access</p>
            </div>
          )}

          {/* Transcript preview */}
          {mode === 'done' && transcript && (
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-merz-slate-light uppercase tracking-wide">Voice Transcript</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-merz-slate-light">AI-processed</span>
                  <CheckCircle size={12} className="text-compliance-compliant" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-merz-slate leading-relaxed border border-merz-border max-h-48 overflow-y-auto">
                {transcript}
              </div>
              <button
                onClick={() => navigate('/sales-companion/post-meeting/structured-recap')}
                className="w-full btn-primary justify-center"
              >
                Review Structured Recap
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Tips + guidance */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="section-header mb-3">What to cover</p>
            <div className="space-y-2">
              {[
                { field: 'Products discussed', desc: 'Which Merz products were presented' },
                { field: 'HCP reaction', desc: 'Positive, neutral, or negative?' },
                { field: 'Competitor mentions', desc: 'Any competitor products raised' },
                { field: 'Samples left', desc: 'What samples did you leave behind?' },
                { field: 'Volume / ASP', desc: 'Any commercial data discussed' },
                { field: 'Next steps', desc: 'Commitments made, follow-up actions' },
                { field: 'Next visit', desc: 'Estimated date for next meeting' },
              ].map(item => (
                <div key={item.field} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-merz-teal shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs font-semibold text-merz-slate">{item.field}</p>
                    <p className="text-[11px] text-merz-slate-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-amber-50 border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-compliance-pv-flag" />
              <p className="text-xs font-semibold text-compliance-pv-flag">Reminder</p>
            </div>
            <p className="text-xs text-merz-slate-mid leading-relaxed">
              Complete your recap within 2 hours of the meeting for the most accurate recall. CRM entry due by end of day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
