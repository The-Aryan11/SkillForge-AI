"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { UploadWizard } from "@/components/upload/upload-wizard";
import { useStore } from "@/lib/store";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const { resetAnalysis } = useStore();

  React.useEffect(() => {
    // If coming fresh, reset previous analysis
    if (!isDemo) {
      resetAnalysis();
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20 pb-12">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 mesh-gradient opacity-50" />
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Let&apos;s build your{" "}
              <span className="gradient-text">learning pathway</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload your resume and a job description. Our multi-model AI pipeline
              will extract your skills, analyze gaps, and generate a personalized
              onboarding plan.
            </p>
          </motion.div>

          {/* Wizard */}
          <UploadWizard isDemo={isDemo} />
        </div>
      </main>
    </>
  );
}