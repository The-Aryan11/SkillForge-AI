"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Brain, Zap, AlertTriangle, CheckCircle2, XCircle,
  ArrowRight, Clock, Target, TrendingUp, BarChart3, Sparkles,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";

// Demo questions
const DEMO_QUESTIONS = [
  {
    id: "q1", skill: "Python", type: "multiple_choice", difficulty: 0.5, discrimination: 1.2,
    question_text: "What is the output of: print(type([]) is list)?",
    options: ["True", "False", "TypeError", "None"],
    correct_answer: 0, explanation: "type([]) returns <class 'list'>, which is the same as list, so 'is' returns True.",
    bloom_level: "understand"
  },
  {
    id: "q2", skill: "SQL", type: "multiple_choice", difficulty: 0.6, discrimination: 1.1,
    question_text: "Which SQL clause is used to filter groups?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correct_answer: 1, explanation: "HAVING filters groups created by GROUP BY, while WHERE filters individual rows.",
    bloom_level: "remember"
  },
  {
    id: "q3", skill: "Docker", type: "multiple_choice", difficulty: 0.7, discrimination: 1.3,
    question_text: "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
    options: [
      "CMD can be overridden at runtime, ENTRYPOINT cannot",
      "ENTRYPOINT defines the executable, CMD provides default arguments",
      "They are identical",
      "CMD runs at build time, ENTRYPOINT at runtime"
    ],
    correct_answer: 1, explanation: "ENTRYPOINT sets the main executable. CMD provides default arguments that can be overridden.",
    bloom_level: "analyze"
  },
  {
    id: "q4", skill: "System Design", type: "multiple_choice", difficulty: 0.8, discrimination: 1.4,
    question_text: "Which pattern is best for handling 10,000 concurrent WebSocket connections?",
    options: [
      "Thread-per-connection model",
      "Event-driven non-blocking I/O",
      "Process forking",
      "Synchronous polling"
    ],
    correct_answer: 1, explanation: "Event-driven I/O (like Node.js or asyncio) handles many concurrent connections efficiently without thread overhead.",
    bloom_level: "evaluate"
  },
  {
    id: "q5", skill: "Kubernetes", type: "multiple_choice", difficulty: 0.9, discrimination: 1.5,
    question_text: "A pod is in CrashLoopBackOff. What is the MOST likely first debugging step?",
    options: [
      "Delete and recreate the pod",
      "Check pod logs with kubectl logs",
      "Scale the deployment to 0",
      "Restart the kubelet service"
    ],
    correct_answer: 1, explanation: "kubectl logs shows container output and error messages, which is the most informative first step.",
    bloom_level: "apply"
  },
];

export default function QuizPage() {
  const router = useRouter();
  const { gap_analysis, addXP, earnBadge } = useStore();

  const [started, setStarted] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const [responses, setResponses] = React.useState<{ correct: boolean; theta: number }[]>([]);
  const [theta, setTheta] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);

  const questions = DEMO_QUESTIONS;
  const currentQ = questions[currentIndex];

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);

    const correct = selectedAnswer === currentQ.correct_answer;

    // Simple IRT theta update
    const a = currentQ.discrimination;
    const b = currentQ.difficulty;
    const p = 1 / (1 + Math.exp(-a * (theta - b)));
    const delta = correct ? a * (1 - p) * 0.3 : -a * p * 0.3;
    const newTheta = theta + delta;
    setTheta(newTheta);

    setResponses(prev => [...prev, { correct, theta: newTheta }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setIsComplete(true);
      addXP(150);
      earnBadge("data_driven");
    }
  };

  const correctCount = responses.filter(r => r.correct).length;
  const thetaHistory = [{ q: 0, theta: 0 }, ...responses.map((r, i) => ({ q: i + 1, theta: r.theta }))];

  if (!started) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="fixed inset-0 -z-10"><div className="absolute inset-0 mesh-gradient opacity-20" /></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="max-w-lg glass border-border/50 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Diagnostic Quiz</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  {questions.length} adaptive questions to validate your skill levels.
                  Uses Item Response Theory for accurate assessment.
                  Your pathway will adapt based on results.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> ~5 minutes</Badge>
                  <Badge variant="secondary"><Target className="w-3 h-3 mr-1" /> Adaptive difficulty</Badge>
                  <Badge variant="secondary"><Sparkles className="w-3 h-3 mr-1" /> +150 XP</Badge>
                </div>
                <Button onClick={() => { setStarted(true); setStartTime(Date.now()); }} className="gap-2 gradient-bg border-0 shadow-lg h-12 px-8 text-base">
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </>
    );
  }

  if (isComplete) {
    const abilityLabel = theta > 1 ? "Advanced" : theta > 0 ? "Intermediate" : theta > -1 ? "Beginner" : "Novice";
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 pb-12">
          <div className="fixed inset-0 -z-10"><div className="absolute inset-0 mesh-gradient opacity-20" /></div>
          <div className="max-w-2xl mx-auto px-4 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass border-border/50 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-muted-foreground mb-6">Your ability has been assessed using Item Response Theory.</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-2xl font-bold">{correctCount}/{questions.length}</p>
                      <p className="text-xs text-muted-foreground">Correct</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-2xl font-bold">{theta.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">θ (Ability)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-2xl font-bold">{abilityLabel}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                  </div>

                  {/* Theta History Chart */}
                  <div className="h-[200px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={thetaHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="q" tick={{ fontSize: 11 }} label={{ value: "Question", position: "bottom", fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} domain={[-2, 2]} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="theta" stroke="hsl(228, 76%, 59%)" strokeWidth={2.5} dot={{ fill: "hsl(228, 76%, 59%)", r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <Sparkles className="w-3 h-3 mr-1" /> +150 XP earned! 📊 Data Driven badge unlocked!
                  </Badge>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push("/pathway")} className="gap-2 gradient-bg border-0">
                      View Updated Pathway <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/analysis")}>
                      View Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  // Active Quiz
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 mesh-gradient opacity-20" /></div>
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          {/* Progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Question {currentIndex + 1} of {questions.length}</span>
              <Badge variant="secondary" className="text-xs"><Brain className="w-3 h-3 mr-1" /> θ = {theta.toFixed(2)}</Badge>
            </div>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Card className="glass border-border/50 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">{currentQ.skill}</Badge>
                    <Badge variant="outline" className="text-[10px]">Difficulty: {(currentQ.difficulty * 5).toFixed(1)}/5</Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">{currentQ.bloom_level}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">{currentQ.question_text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(v) => !answered && setSelectedAnswer(parseInt(v))}
                  >
                    {currentQ.options.map((option, i) => {
                      const isCorrect = i === currentQ.correct_answer;
                      const isSelected = selectedAnswer === i;
                      return (
                        <Label key={i} htmlFor={`opt-${i}`}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                            answered && isCorrect ? "border-emerald-500/50 bg-emerald-500/10" :
                            answered && isSelected && !isCorrect ? "border-red-500/50 bg-red-500/10" :
                            isSelected ? "border-primary/50 bg-primary/5" :
                            "border-border/50 hover:border-primary/30"
                          )}>
                          <RadioGroupItem value={i.toString()} id={`opt-${i}`} disabled={answered} />
                          <span className="text-sm flex-1">{option}</span>
                          {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                        </Label>
                      );
                    })}
                  </RadioGroup>

                  {answered && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs font-semibold text-primary mb-1">Explanation:</p>
                      <p className="text-xs text-muted-foreground">{currentQ.explanation}</p>
                    </motion.div>
                  )}

                  <div className="flex justify-end">
                    {!answered ? (
                      <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="gap-2">
                        Submit Answer <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="gap-2 gradient-bg border-0">
                        {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}