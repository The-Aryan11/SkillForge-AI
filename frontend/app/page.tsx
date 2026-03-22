"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain, Zap, Target, BarChart3, Network, BookOpen,
  ArrowRight, CheckCircle, Sparkles, GitBranch, Shield, Clock,
} from "lucide-react";

// ── Animated counter ──────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// ── Particle canvas ───────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ── Feature card ──────────────────────────────────────────────────
function FeatureCard({
  icon: Icon, title, description, delay,
}: {
  icon: React.ElementType; title: string; description: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03 }}
      className="glass-card p-6 hover:border-blue-500/30 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  const features = [
    { icon: Brain, title: "6-Stage NLP Pipeline", description: "spaCy NER → Zero-shot classification → MiniLM embeddings → FAISS semantic search → ML proficiency inference → Ebbinghaus decay modeling.", delay: 0 },
    { icon: Network, title: "Knowledge Graph Engine", description: "NetworkX DAG with HITS, PageRank, betweenness centrality, community detection, and Critical Path Method for optimal scheduling.", delay: 0.05 },
    { icon: Zap, title: "Adaptive Pathing Algorithm", description: "Priority-weighted topological sort with Coffman-Graham parallel scheduling and constraint satisfaction for provably optimal pathways.", delay: 0.1 },
    { icon: Shield, title: "Zero Hallucination", description: "500+ real curated courses from verified free providers. The LLM never generates course names — pure retrieval-based recommendations.", delay: 0.15 },
    { icon: Target, title: "Bayesian Knowledge Tracing", description: "After each quiz answer, BKT updates your mastery probability. IRT-CAT adapts question difficulty in real time for precision calibration.", delay: 0.2 },
    { icon: BarChart3, title: "Multi-Agent AI System", description: "Parser → Analyst → Tutor → Critic agents with a self-correcting pipeline that catches and fixes errors before you see results.", delay: 0.25 },
    { icon: BookOpen, title: "Bloom's Taxonomy Progression", description: "Courses are sequenced from Remember → Create, following proven pedagogical principles for lasting knowledge acquisition.", delay: 0.3 },
    { icon: GitBranch, title: "Parallel Learning Tracks", description: "Independent skill branches are identified and scheduled simultaneously so you reach role-readiness in the shortest possible time.", delay: 0.35 },
    { icon: Clock, title: "Spaced Repetition (SM-2)", description: "Long-term retention scheduling using the SM-2 algorithm ensures skills stick beyond the onboarding period.", delay: 0.4 },
  ];

  const stats = [
    { value: 500, suffix: "+", label: "Curated Courses" },
    { value: 900, suffix: "+", label: "O*NET Occupations" },
    { value: 6, suffix: "", label: "Industry Domains" },
    { value: 0, suffix: "%", label: "Hallucination Rate" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050812]">
      <ParticleCanvas />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#050812]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SkillForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#domains" className="hover:text-foreground transition-colors">Domains</a>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <motion.section
        style={{ y: heroY }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-16"
      >
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-medium mb-8"
        >
          <Sparkles className="w-3 h-3" />
          Multi-Model AI · Graph Algorithms · Zero Hallucination
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight"
        >
          Onboarding that{" "}
          <span className="gradient-text">adapts to you</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Upload your resume and a job description. SkillForge runs a{" "}
          <strong className="text-foreground">14-stage AI pipeline</strong> — NLP extraction,
          knowledge graph analysis, and adaptive scheduling — to build your
          personalized learning pathway in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/upload"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Build My Pathway
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/upload?demo=true"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 font-medium text-lg transition-all"
          >
            Try Demo
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </motion.section>

      {/* ── Stats ── */}
      <section className="relative z-10 py-20 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold gradient-text">
                <Counter end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Built different. <span className="gradient-text">Engineered to win.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every component is a deliberate technical decision — not a wrapper around a single LLM prompt.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              5 steps to <span className="gradient-text">role readiness</span>
            </h2>
          </motion.div>
          <div className="space-y-6">
            {[
              { n: "01", title: "Upload Resume + Job Description", desc: "PDF, DOCX, plain text, or paste. GitHub profile optional for richer signal." },
              { n: "02", title: "14-Stage AI Pipeline Runs", desc: "NER, zero-shot classification, FAISS semantic search, proficiency ML model, and skill decay modeling — all in parallel." },
              { n: "03", title: "Skill Gap Analysis", desc: "Multi-dimensional gaps with HITS, PageRank, and Critical Path Method across your personal knowledge graph." },
              { n: "04", title: "Adaptive Pathway Generated", desc: "Topological sort + Coffman-Graham parallel scheduling + Bloom's Taxonomy progression across prioritized phases." },
              { n: "05", title: "Learn, Quiz, Adapt", desc: "Take the adaptive quiz (2-PL IRT + BKT). The pathway re-optimizes in real time as you improve." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 glass-card p-6"
              >
                <span className="text-4xl font-black gradient-text opacity-40 shrink-0 w-12">{step.n}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section id="domains" className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Works across <span className="gradient-text">every domain</span></h2>
            <p className="text-muted-foreground">O*NET taxonomy covers 900+ occupations. SkillForge adapts to all of them.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { domain: "Technology", roles: "SWE · DevOps · ML Engineer", color: "from-blue-500 to-cyan-500" },
              { domain: "Data", roles: "Data Analyst · Data Scientist", color: "from-violet-500 to-purple-600" },
              { domain: "Business", roles: "Marketing · Sales · HR", color: "from-pink-500 to-rose-600" },
              { domain: "Operations", roles: "Warehouse · Supply Chain", color: "from-orange-500 to-amber-600" },
              { domain: "Healthcare", roles: "RN · Medical Lab Tech", color: "from-green-500 to-emerald-600" },
              { domain: "Finance", roles: "Financial Analyst · CPA", color: "from-yellow-500 to-orange-600" },
            ].map((d, i) => (
              <motion.div
                key={d.domain}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.04 }}
                className="glass-card p-5 group cursor-default"
              >
                <div className={`text-transparent bg-gradient-to-r ${d.color} bg-clip-text font-bold text-xl mb-1`}>
                  {d.domain}
                </div>
                <p className="text-muted-foreground text-xs">{d.roles}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5" />
          <h2 className="relative text-4xl font-extrabold mb-4">
            Ready to forge your <span className="gradient-text">skills?</span>
          </h2>
          <p className="relative text-muted-foreground mb-10 text-lg">
            Join the future of personalized onboarding. Free. Intelligent. Adaptive.
          </p>
          <Link
            href="/upload"
            className="relative inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg transition-all shadow-2xl shadow-blue-500/20"
          >
            <Sparkles className="w-5 h-5" />
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="relative mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {["No signup required", "100% Free", "Results in 30 seconds"].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-foreground">SkillForge</span>
            <span>— AI-Adaptive Onboarding Engine</span>
          </div>
          <p>Built for ARTPARK CodeForge Hackathon · MIT License · Total cost: $0.00</p>
        </div>
      </footer>
    </div>
  );
}
