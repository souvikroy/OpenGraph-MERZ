import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, BookOpen, Trophy, RotateCcw } from 'lucide-react';
import { mockQuizQuestions } from '../data/mockQuizzes';
import type { ProductBrand, QuizQuestion } from '../types';
import ProductBadge from '../components/shared/ProductBadge';

const PRODUCT_OPTIONS: ProductBrand[] = ['Xeomin', 'Belotero', 'Radiesse', 'Ultherapy'];

type QuizState = 'select' | 'in-progress' | 'review' | 'complete';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MicroTrainingQuiz() {
  const navigate = useNavigate();
  const [state, setState] = useState<QuizState>('select');
  const [selectedProduct, setSelectedProduct] = useState<ProductBrand>('Xeomin');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = () => {
    const pool = mockQuizQuestions.filter(q => q.product === selectedProduct);
    const selected = shuffle(pool).slice(0, Math.min(4, pool.length));
    setQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowExplanation(false);
    setState('in-progress');
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = { ...answers, [questions[currentIdx].id]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx + 1 >= questions.length) {
      setState('complete');
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const getScore = () => {
    let correct = 0;
    Object.entries(answers).forEach(([qId, ans]) => {
      const q = questions.find(q => q.id === qId);
      if (q && ans === q.correctAnswer) correct++;
    });
    return { correct, total: questions.length, pct: Math.round((correct / questions.length) * 100) };
  };

  const currentQ = questions[currentIdx];

  // ── Select screen ─────────────────────────────────────────────────────────
  if (state === 'select') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/sales-companion/pre-meeting/meetings')} className="btn-ghost">
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="page-title flex items-center gap-2">
              <BookOpen size={20} className="text-merz-teal" />
              Micro-Training Quiz
            </h1>
            <p className="page-subtitle">3–5 questions · Under 2 minutes</p>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-merz-slate mb-3">Select product to be assessed on:</p>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCT_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedProduct === p
                      ? 'border-merz-teal bg-merz-teal-light'
                      : 'border-merz-border hover:border-merz-teal/40 hover:bg-gray-50'
                  }`}
                >
                  <ProductBadge product={p} />
                  <p className="text-xs text-merz-slate-light mt-2">
                    {mockQuizQuestions.filter(q => q.product === p).length} questions available
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-merz-teal-light rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-merz-teal">Quiz format:</p>
            <ul className="space-y-1">
              {[
                '4 questions (randomised)',
                'Multiple choice & true/false',
                'Immediate feedback with explanation',
                'Score tracked in your profile',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-merz-teal-dark">
                  <CheckCircle size={11} className="text-merz-teal shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={startQuiz} className="w-full btn-primary justify-center py-3">
            Start Quiz — {selectedProduct}
          </button>
        </div>
      </div>
    );
  }

  // ── In progress ──────────────────────────────────────────────────────────
  if (state === 'in-progress' && currentQ) {
    const isCorrect = selectedAnswer !== null && selectedAnswer === currentQ.correctAnswer;
    const progress = ((currentIdx) / questions.length) * 100;

    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-merz-teal" />
            <span className="font-semibold text-merz-slate">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          <ProductBadge product={currentQ.product} size="sm" />
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-merz-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="card p-5 space-y-5">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`badge text-[10px] ${
                currentQ.difficulty === 'easy' ? 'badge-green' :
                currentQ.difficulty === 'medium' ? 'badge-amber' : 'badge-red'
              }`}>
                {currentQ.difficulty}
              </span>
              <span className="badge-gray text-[10px]">{currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'true-false' ? 'True/False' : 'Open'}</span>
            </div>
          </div>

          <p className="text-base font-semibold text-merz-slate leading-relaxed">{currentQ.question}</p>

          {/* Options */}
          <div className="space-y-2.5">
                  {currentQ.options?.map((option, optIdx) => {
                    let classes = 'w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 ';
                    if (selectedAnswer === null) {
                      classes += 'border-merz-border hover:border-merz-teal hover:bg-merz-teal-light cursor-pointer';
                    } else if (optIdx === currentQ.correctAnswer) {
                      classes += 'border-compliance-compliant bg-compliance-compliant-bg text-compliance-compliant';
                    } else if (optIdx === selectedAnswer && !isCorrect) {
                      classes += 'border-compliance-off-label bg-compliance-off-label-bg text-compliance-off-label';
                    } else {
                      classes += 'border-merz-border bg-gray-50 text-merz-slate-light cursor-default';
                    }
                    return (
                      <button key={optIdx} className={classes} onClick={() => handleAnswer(optIdx)} disabled={selectedAnswer !== null}>
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    selectedAnswer === null ? 'border-merz-border text-merz-slate-light' :
                    optIdx === currentQ.correctAnswer ? 'border-compliance-compliant text-compliance-compliant' :
                    optIdx === selectedAnswer ? 'border-compliance-off-label text-compliance-off-label' :
                    'border-merz-border text-merz-slate-light'
                  }`}>
                    {selectedAnswer !== null && optIdx === currentQ.correctAnswer ? (
                      <CheckCircle size={13} />
                    ) : selectedAnswer !== null && optIdx === selectedAnswer && !isCorrect ? (
                      <XCircle size={13} />
                    ) : (
                      String.fromCharCode(65 + optIdx)
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-compliance-compliant-bg border-compliance-compliant/30' : 'bg-compliance-off-label-bg border-compliance-off-label/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle size={15} className="text-compliance-compliant" />
                ) : (
                  <XCircle size={15} className="text-compliance-off-label" />
                )}
                <p className={`text-sm font-bold ${isCorrect ? 'text-compliance-compliant' : 'text-compliance-off-label'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
              </div>
              <p className="text-sm text-merz-slate leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {selectedAnswer !== null && (
          <button onClick={handleNext} className="w-full btn-primary justify-center py-3">
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    );
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  if (state === 'complete') {
    const { correct, total, pct } = getScore();
    const passed = pct >= 70;

    return (
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="page-title">Quiz Complete</h1>

        <div className="card p-6 text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
            passed ? 'bg-compliance-compliant-bg' : 'bg-compliance-off-label-bg'
          }`}>
            {passed ? (
              <Trophy size={36} className="text-compliance-compliant" />
            ) : (
              <BookOpen size={36} className="text-compliance-off-label" />
            )}
          </div>
          <div>
            <p className={`text-4xl font-bold ${passed ? 'text-compliance-compliant' : 'text-compliance-off-label'}`}>
              {pct}%
            </p>
            <p className="text-merz-slate-light text-sm mt-1">{correct} of {total} correct</p>
          </div>
          <div className={`rounded-xl p-3 ${passed ? 'bg-compliance-compliant-bg' : 'bg-compliance-off-label-bg'}`}>
            <p className={`text-sm font-semibold ${passed ? 'text-compliance-compliant' : 'text-compliance-off-label'}`}>
              {passed ? '✓ Pass – Score recorded' : '✗ Below threshold – Review recommended'}
            </p>
            <p className="text-xs text-merz-slate-mid mt-1">
              {passed
                ? 'Great work! Your score has been saved to your training profile.'
                : 'Score saved. Manager will be notified per configuration. Review the correct answers below.'}
            </p>
          </div>

          {/* Answer review */}
          <div className="text-left space-y-3 mt-2">
            <p className="text-sm font-semibold text-merz-slate">Answer Review:</p>
            {questions.map((q) => {
              const userAns = answers[q.id];
              const wasCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className={`p-3 rounded-lg border ${wasCorrect ? 'border-compliance-compliant/20 bg-compliance-compliant-bg' : 'border-compliance-off-label/20 bg-compliance-off-label-bg'}`}>
                  <div className="flex items-start gap-2">
                    {wasCorrect ? <CheckCircle size={13} className="text-compliance-compliant shrink-0 mt-0.5" /> : <XCircle size={13} className="text-compliance-off-label shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-medium text-merz-slate">{q.question}</p>
                      {!wasCorrect && (
                        <p className="text-[11px] text-merz-slate-mid mt-1">
                          <span className="font-semibold">Correct:</span> {q.options?.[q.correctAnswer as number]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setState('select')} className="flex-1 btn-secondary justify-center">
            <RotateCcw size={14} />
            Retake
          </button>
          <button onClick={() => navigate('/sales-companion/pre-meeting/meetings')} className="flex-1 btn-primary justify-center">
            Back to Meetings
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
