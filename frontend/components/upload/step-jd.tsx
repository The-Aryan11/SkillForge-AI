"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { JD_DOMAINS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  ClipboardPaste,
  LayoutTemplate,
  Link2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronRight,
  Search,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ── Pre-built JD Templates ──
const JD_TEMPLATES: Record<
  string,
  { title: string; domain: string; icon: string; seniority: string; text: string }
> = {
  software_engineer: {
    title: "Software Engineer",
    domain: "technology",
    icon: "💻",
    seniority: "Mid-Senior",
    text: `Software Engineer\n\nWe are looking for a skilled Software Engineer to join our team...\n\nResponsibilities:\n• Design, develop, and maintain scalable software solutions\n• Write clean, testable code in Python and/or JavaScript\n• Build and maintain RESTful APIs and microservices\n• Collaborate with cross-functional teams using Agile methodologies\n• Participate in code reviews and mentor junior developers\n• Optimize application performance and troubleshoot issues\n\nRequired:\n• 3+ years software development experience\n• Strong proficiency in Python or JavaScript/TypeScript\n• Experience with React, Angular, or Vue.js\n• Experience with SQL and NoSQL databases\n• Git version control\n• Understanding of CI/CD pipelines\n\nPreferred:\n• Experience with cloud platforms (AWS, GCP, Azure)\n• Docker and Kubernetes experience\n• Familiarity with system design principles`,
  },
  senior_data_engineer: {
    title: "Senior Data Engineer",
    domain: "data",
    icon: "📊",
    seniority: "Senior",
    text: `Senior Data Engineer\n\nAbout the Role:\nWe are looking for an experienced Senior Data Engineer to join our Data Platform team. You will be responsible for designing, building, and maintaining scalable data infrastructure.\n\nKey Responsibilities:\n• Design and build scalable data pipelines processing terabytes daily\n• Architect data warehouse solutions using modern cloud technologies\n• Implement real-time streaming using Apache Kafka and Apache Flink\n• Build and maintain ETL/ELT processes using Airflow and dbt\n• Collaborate with data scientists and analysts\n• Mentor junior engineers\n\nRequired:\n• 5+ years in data engineering\n• Strong proficiency in Python and SQL\n• Experience with Apache Spark, Kafka, or similar distributed systems\n• Cloud platforms (AWS, GCP, or Azure)\n• Data warehousing (Snowflake, BigQuery, or Redshift)\n• Workflow orchestration (Airflow, Dagster)\n• Docker, Kubernetes\n\nPreferred:\n• Real-time streaming (Flink, Spark Streaming)\n• dbt for data transformation\n• Data quality frameworks (Great Expectations)\n• Machine learning pipelines and MLOps\n• Terraform`,
  },
  marketing_manager: {
    title: "Marketing Manager",
    domain: "business",
    icon: "📈",
    seniority: "Mid-Senior",
    text: `Marketing Manager\n\nWe are seeking a creative and data-driven Marketing Manager to lead our marketing initiatives.\n\nResponsibilities:\n• Develop and execute comprehensive marketing strategies\n• Manage digital marketing campaigns across channels (SEO, SEM, social media, email)\n• Analyze campaign performance using Google Analytics and marketing analytics tools\n• Manage marketing budget and optimize ROI\n• Lead A/B testing and conversion rate optimization\n• Collaborate with sales teams to align marketing with revenue goals\n• Create and manage content marketing strategy\n• Oversee brand positioning and messaging\n\nRequired:\n• 4+ years marketing experience\n• Expertise in digital marketing (SEO, SEM, social media)\n• Proficiency in Google Analytics, Google Ads, Facebook Ads Manager\n• Experience with CRM systems (Salesforce, HubSpot)\n• Strong analytical and project management skills\n• Excellent communication and presentation skills\n\nPreferred:\n• Experience with marketing automation (Marketo, Mailchimp)\n• Knowledge of HTML/CSS for email marketing\n• Experience with Tableau or similar visualization tools`,
  },
  warehouse_supervisor: {
    title: "Warehouse Supervisor",
    domain: "operations",
    icon: "🏭",
    seniority: "Mid-Level",
    text: `Warehouse Supervisor\n\nWe are looking for a dedicated Warehouse Supervisor to oversee daily warehouse operations.\n\nResponsibilities:\n• Supervise and coordinate warehouse team of 15-20 employees\n• Manage inventory control and cycle counting processes\n• Ensure compliance with OSHA safety regulations\n• Operate and certify operators on forklifts and warehouse equipment\n• Implement lean warehouse management practices\n• Manage shipping and receiving operations\n• Maintain quality control standards\n• Use WMS (Warehouse Management System) software\n\nRequired:\n• 3+ years warehouse experience, 1+ year supervisory\n• OSHA safety certification or willingness to obtain\n• Forklift certification\n• Experience with WMS software (SAP WM, Manhattan, or similar)\n• Strong organizational and leadership skills\n• Basic computer proficiency (Excel, email)\n• Ability to lift 50+ lbs\n\nPreferred:\n• Lean/Six Sigma certification\n• Experience with inventory management systems\n• Bilingual (English/Spanish)`,
  },
  registered_nurse: {
    title: "Registered Nurse",
    domain: "healthcare",
    icon: "🏥",
    seniority: "Entry-Mid",
    text: `Registered Nurse (RN) — Medical-Surgical Unit\n\nJoin our dedicated nursing team providing exceptional patient care.\n\nResponsibilities:\n• Provide direct patient care in medical-surgical unit\n• Assess, plan, implement, and evaluate nursing care\n• Administer medications and IV therapy\n• Monitor vital signs and patient conditions\n• Document patient care in Electronic Health Record (EHR) systems\n• Collaborate with physicians and multidisciplinary teams\n• Educate patients and families on health management\n• Follow infection control and safety protocols\n• Respond to emergency situations following BLS/ACLS protocols\n\nRequired:\n• Active RN license in the state\n• BSN or ADN degree\n• BLS certification\n• HIPAA compliance training\n• Experience with EHR systems (Epic, Cerner)\n• Strong clinical assessment skills\n• Patient triage experience\n\nPreferred:\n• ACLS certification\n• Medical-surgical nursing certification (CMSRN)\n• 1-2 years clinical experience\n• Experience with patient education programs`,
  },
  financial_analyst: {
    title: "Financial Analyst",
    domain: "finance",
    icon: "💰",
    seniority: "Entry-Mid",
    text: `Financial Analyst\n\nWe are seeking a detail-oriented Financial Analyst to support our finance team.\n\nResponsibilities:\n• Prepare financial reports, forecasts, and budgets\n• Analyze financial data and create financial models\n• Conduct variance analysis and identify trends\n• Support month-end and year-end close processes\n• Create presentations for senior leadership\n• Develop and maintain Excel-based financial models\n• Assist with annual budgeting and quarterly forecasting\n• Analyze business unit performance and provide recommendations\n\nRequired:\n• Bachelor's degree in Finance, Accounting, or Economics\n• 2+ years financial analysis experience\n• Advanced Excel skills (pivot tables, VLOOKUP, macros)\n• Experience with financial modeling and forecasting\n• Knowledge of GAAP accounting principles\n• Strong analytical and problem-solving skills\n• Proficiency in PowerPoint for executive presentations\n\nPreferred:\n• CFA or CPA certification (or in progress)\n• Experience with SAP, Oracle, or similar ERP\n• Knowledge of Tableau or Power BI\n• Experience with SQL for data analysis`,
  },
};

export function StepJD() {
  const { jd_text, jd_source, selected_template, setJdText, setJdSource, setSelectedTemplate } =
    useStore();

  const [urlInput, setUrlInput] = React.useState("");
  const [urlLoading, setUrlLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);

  const filteredTemplates = React.useMemo(() => {
    return Object.entries(JD_TEMPLATES).filter(([key, template]) => {
      const matchesSearch =
        !searchTerm ||
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = !selectedDomain || template.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
  }, [searchTerm, selectedDomain]);

  const handleSelectTemplate = (key: string) => {
    const template = JD_TEMPLATES[key];
    setSelectedTemplate(key);
    setJdText(template.text);
    toast.success(`Loaded: ${template.title}`, {
      description: "Job description template applied",
    });
  };

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      // In production, this would scrape the URL server-side
      toast.info("URL import", {
        description: "For the demo, please paste the job description text directly.",
      });
    } catch (err) {
      toast.error("Failed to fetch URL");
    } finally {
      setUrlLoading(false);
    }
  };

  const charCount = jd_text.length;
  const isValid = charCount > 50;

  return (
    <Card className="max-w-3xl mx-auto glass border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Target Role</CardTitle>
            <CardDescription>
              Provide the job description for the role you&apos;re onboarding into
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          value={jd_source}
          onValueChange={(v) => setJdSource(v as any)}
        >
          <TabsList className="grid grid-cols-3 mb-6 bg-muted/50">
            <TabsTrigger value="template" className="gap-2 text-sm">
              <LayoutTemplate className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
              <span className="sm:hidden">Template</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2 text-sm">
              <ClipboardPaste className="w-4 h-4" />
              <span className="hidden sm:inline">Paste Text</span>
              <span className="sm:hidden">Paste</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2 text-sm">
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">From URL</span>
              <span className="sm:hidden">URL</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Templates Tab ── */}
          <TabsContent value="template" className="mt-0">
            <div className="space-y-4">
              {/* Domain Filter */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedDomain === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setSelectedDomain(null)}
                >
                  All Roles
                </Badge>
                {JD_DOMAINS.map((domain) => (
                  <Badge
                    key={domain.id}
                    variant={selectedDomain === domain.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() =>
                      setSelectedDomain(
                        selectedDomain === domain.id ? null : domain.id
                      )
                    }
                  >
                    {domain.icon} {domain.label}
                  </Badge>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-muted/30"
                />
              </div>

              {/* Template Grid */}
              <ScrollArea className="h-[280px]">
                <div className="grid sm:grid-cols-2 gap-3 pr-4">
                  {filteredTemplates.map(([key, template]) => {
                    const isSelected = selected_template === key;
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectTemplate(key)}
                        className={cn(
                          "relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                          isSelected
                            ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                            : "border-border/50 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                        )}
                      >
                        <span className="text-2xl mt-0.5">{template.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold truncate">
                              {template.title}
                            </p>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {template.seniority}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground capitalize">
                              {template.domain}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                            isSelected && "text-primary"
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Selected Template Preview */}
              <AnimatePresence>
                {selected_template && JD_TEMPLATES[selected_template] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden"
                  >
                    <div className="p-3 border-b border-border/50 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Preview: {JD_TEMPLATES[selected_template].title}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {jd_text.length.toLocaleString()} chars
                      </Badge>
                    </div>
                    <ScrollArea className="h-[120px]">
                      <pre className="p-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                        {jd_text.substring(0, 500)}
                        {jd_text.length > 500 && "..."}
                      </pre>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* ── Paste Tab ── */}
          <TabsContent value="paste" className="mt-0">
            <div className="space-y-3">
              <Textarea
                placeholder={`Paste the full job description here...

Include:
• Job title and department
• Key responsibilities
• Required qualifications / skills
• Preferred qualifications
• Experience requirements`}
                value={jd_text}
                onChange={(e) => {
                  setJdText(e.target.value);
                  setSelectedTemplate(null);
                }}
                className="min-h-[300px] resize-none font-mono text-sm bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl"
              />
              <div className="flex justify-end">
                <Badge
                  variant={isValid ? "default" : "secondary"}
                  className={cn(
                    "text-xs font-mono",
                    isValid && "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {charCount.toLocaleString()} chars
                </Badge>
              </div>
            </div>
          </TabsContent>

          {/* ── URL Tab ── */}
          <TabsContent value="url" className="mt-0">
            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-border/50 bg-muted/30">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Import from Job Posting URL
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://company.com/jobs/data-engineer"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-background"
                  />
                  <Button
                    onClick={handleUrlFetch}
                    disabled={!urlInput.trim() || urlLoading}
                    className="gap-2"
                  >
                    {urlLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Fetch
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports LinkedIn, Indeed, Greenhouse, Lever, and most ATS pages
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground py-4">
                — or use a template / paste text from the other tabs —
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Status Footer ── */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Job description ready
                </p>
                <p className="text-xs text-muted-foreground">
                  {charCount.toLocaleString()} characters
                  {selected_template &&
                    ` • Template: ${JD_TEMPLATES[selected_template]?.title}`}
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-amber-500/20 text-amber-500">
                Step 2 ✓
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}