"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Brain, CheckCircle, XCircle, ChevronRight, Zap } from "lucide-react";

export default function QuizPage() {
  const { quiz_state } = useStore() as any;
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  const questions = quiz_state?.questions ?? [];
  const q = questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct_index) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setAnswered(false);
    setCurrentQ((c) => c + 1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Adaptive Quiz</h1>
            <p className="text-muted-foreground mb-8">2-PL IRT with Bayesian Knowledge Tracing — difficulty adapts to your answers</p>
          </motion.div>

          {questions.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Quiz not available yet</h2>
              <p className="text-muted-foreground mb-6">Complete your analysis first — the quiz adapts to your specific skill gaps.</p>
              <a href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Start Analysis <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ) : currentQ >= questions.length ? (
            <div className="glass-card p-12 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-4xl font-extrabold gradient-text mb-2">{score}/{questions.length}</p>
              <p className="text-muted-foreground">Your pathway has been updated based on your performance.</p>
              <a href="/pathway" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                View Updated Pathway <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="glass-card p-8">
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-sm font-medium">Score: {score}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mb-8">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold mb-6">{q.question}</h2>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {(q.options ?? []).map((opt: string, idx: number) => (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      !answered ? "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                      : idx === q.correct_index ? "border-green-500 bg-green-500/10 text-green-400"
                      : idx === selected ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-border/30 opacity-50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                        {["A","B","C","D"][idx]}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {answered && idx === q.correct_index && <CheckCircle className="w-4 h-4 ml-auto text-green-400" />}
                      {answered && idx === selected && idx !== q.correct_index && <XCircle className="w-4 h-4 ml-auto text-red-400" />}
                    </div>
                  </button>
                ))}
              </div>

              {answered && (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    {q.explanation && (
                      <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                    <button onClick={next}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      {currentQ + 1 < questions.length ? "Next Question" : "See Results"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
