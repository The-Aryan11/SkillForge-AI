"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { WizardStep } from "@/lib/types";
import { StepResume } from "./step-resume";
import { StepJD } from "./step-jd";
import { StepPreferences } from "./step-preferences";
import { StepVerification } from "./step-verification";
import { ProcessingPipeline } from "./processing-pipeline";
import {
  FileText,
  Briefcase,
  Settings2,
  CheckCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardStepConfig {
  id: WizardStep;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: WizardStepConfig[] = [
  {
    id: "resume",
    label: "Resume",
    description: "Upload your resume",
    icon: FileText,
  },
  {
    id: "jd",
    label: "Job Description",
    description: "Provide target role",
    icon: Briefcase,
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "Learning preferences",
    icon: Settings2,
  },
  {
    id: "verification",
    label: "Review",
    description: "Verify extracted skills",
    icon: CheckCircle,
  },
  {
    id: "processing",
    label: "Analysis",
    description: "AI pipeline running",
    icon: Sparkles,
  },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.98,
  }),
};

export function UploadWizard({ isDemo }: { isDemo: boolean }) {
  const router = useRouter();
  const {
    wizard_step,
    setWizardStep,
    resume_text,
    jd_text,
    skill_profile,
    is_processing,
  } = useStore();

  const [direction, setDirection] = React.useState(0);

  const currentIndex = STEPS.findIndex((s) => s.id === wizard_step);

  const canProceed = React.useMemo(() => {
    switch (wizard_step) {
      case "resume":
        return resume_text.length > 50;
      case "jd":
        return jd_text.length > 50;
      case "preferences":
        return true;
      case "verification":
        return skill_profile !== null;
      case "processing":
        return false;
      default:
        return false;
    }
  }, [wizard_step, resume_text, jd_text, skill_profile]);

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setDirection(1);
      setWizardStep(STEPS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setWizardStep(STEPS[currentIndex - 1].id);
    }
  };

  const goToStep = (step: WizardStep) => {
    const targetIndex = STEPS.findIndex((s) => s.id === step);
    if (targetIndex <= currentIndex) {
      setDirection(targetIndex < currentIndex ? -1 : 1);
      setWizardStep(step);
    }
  };

  // Load demo data
  React.useEffect(() => {
    if (isDemo) {
      loadDemoData();
    }
  }, [isDemo]);

  const loadDemoData = async () => {
    const { setResumeText, setJdText, setSelectedTemplate, setJdSource } = useStore.getState();
    
    // Demo resume text
    setResumeText(`John Doe
Software Developer | San Francisco, CA | john@email.com

EXPERIENCE

Senior Software Developer, TechCorp Inc. (2021 - Present)
• Built and maintained microservices using Python and FastAPI, serving 2M+ requests/day
• Led migration from monolithic architecture to Kubernetes-based microservices, reducing deployment time by 70%
• Designed and implemented real-time data pipelines using Apache Kafka and Apache Spark
• Mentored team of 4 junior developers, conducting weekly code reviews and knowledge sharing sessions
• Implemented CI/CD pipelines using GitHub Actions and Docker, achieving 99.9% deployment success rate

Software Developer, StartupXYZ (2019 - 2021)
• Developed RESTful APIs using Node.js and Express, integrated with PostgreSQL and MongoDB
• Built responsive web applications using React and TypeScript
• Implemented unit and integration testing achieving 85% code coverage
• Collaborated with UX designers to implement pixel-perfect interfaces
• Optimized database queries reducing average response time by 40%

Junior Developer, WebAgency Co. (2018 - 2019)
• Created dynamic web pages using HTML, CSS, JavaScript
• Assisted in developing e-commerce platforms using PHP and MySQL
• Participated in Agile/Scrum ceremonies and sprint planning

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley (2018)
GPA: 3.6/4.0

SKILLS

Programming: Python, JavaScript, TypeScript, Node.js, SQL, Java, PHP
Frameworks: React, FastAPI, Express, Django
Databases: PostgreSQL, MongoDB, MySQL, Redis
DevOps: Docker, Kubernetes, GitHub Actions, AWS (EC2, S3, Lambda)
Tools: Git, Jira, Confluence, VS Code, Linux
Soft Skills: Team Leadership, Mentoring, Agile/Scrum, Technical Writing

CERTIFICATIONS

AWS Certified Solutions Architect - Associate (2022)
Google Cloud Professional Data Engineer (2023)`);

    setJdSource("template");
    setSelectedTemplate("senior_data_engineer");
    setJdText(`Senior Data Engineer

About the Role:
We are looking for an experienced Senior Data Engineer to join our Data Platform team. You will be responsible for designing, building, and maintaining scalable data infrastructure that powers analytics and machine learning across the organization.

Key Responsibilities:
• Design and build scalable data pipelines processing terabytes of data daily
• Architect data warehouse solutions using modern cloud technologies
• Implement real-time streaming data processing using Apache Kafka and Apache Flink
• Optimize data storage and query performance for analytical workloads
• Build and maintain ETL/ELT processes using Apache Airflow and dbt
• Collaborate with data scientists and analysts to ensure data quality and accessibility
• Mentor junior engineers and establish data engineering best practices
• Design and implement data governance frameworks including data lineage and cataloging

Required Qualifications:
• 5+ years of experience in data engineering or related field
• Strong proficiency in Python and SQL
• Experience with Apache Spark, Apache Kafka, or similar distributed systems
• Experience with cloud platforms (AWS, GCP, or Azure)
• Knowledge of data warehousing concepts and tools (Snowflake, BigQuery, or Redshift)
• Experience with workflow orchestration tools (Airflow, Dagster, or Prefect)
• Strong understanding of data modeling and database design
• Experience with containerization (Docker, Kubernetes)

Preferred Qualifications:
• Experience with real-time streaming (Flink, Spark Streaming)
• Knowledge of dbt for data transformation
• Experience with data quality frameworks (Great Expectations)
• Familiarity with machine learning pipelines and MLOps
• Experience with Infrastructure as Code (Terraform)
• Strong communication skills and ability to work cross-functionally`);
  };

  return (
    <div className="space-y-8">
      {/* ── Step Indicator ── */}
      <div className="relative">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isClickable = index <= currentIndex;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && goToStep(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative z-10 flex flex-col items-center gap-2 group transition-all",
                    isClickable ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2",
                      isActive
                        ? "gradient-bg border-transparent shadow-lg shadow-primary/30"
                        : isCompleted
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted/50 border-border text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                    ) : isActive && is_processing ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isActive && "text-white"
                        )}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-xs font-semibold transition-colors",
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>

                  {/* Active Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="step-glow"
                      className="absolute -inset-2 rounded-3xl bg-primary/5 -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-4 relative h-0.5 top-[-18px]">
                    <div className="absolute inset-0 bg-border rounded-full" />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={wizard_step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {wizard_step === "resume" && <StepResume />}
            {wizard_step === "jd" && <StepJD />}
            {wizard_step === "preferences" && <StepPreferences onStartAnalysis={() => {
              setDirection(1);
              setWizardStep("processing");
            }} />}
            {wizard_step === "verification" && <StepVerification />}
            {wizard_step === "processing" && <ProcessingPipeline />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation Buttons ── */}
      {wizard_step !== "processing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between max-w-3xl mx-auto"
        >
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, -1).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : i < currentIndex
                    ? "bg-primary/40"
                    : "bg-border"
                )}
              />
            ))}
          </div>

          {wizard_step === "preferences" ? (
            <Button
              onClick={() => {
                setDirection(1);
                setWizardStep("processing");
              }}
              className="gap-2 gradient-bg border-0 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Analyze
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!canProceed}
              className="gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}