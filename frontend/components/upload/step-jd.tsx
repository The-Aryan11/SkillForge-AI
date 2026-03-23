"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { JD_DOMAINS, JD_TEMPLATES, JDDomain } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, ClipboardPaste, Upload, Link, CheckCircle, Search } from "lucide-react";

type JDMode = "paste" | "template" | "upload" | "url";

// JD template content map
const TEMPLATE_CONTENT: Record<string, string> = {
  "swe-mid": `Software Engineer (Mid-level)

We are looking for a mid-level Software Engineer to join our engineering team.

Required Skills:
- Python (3+ years) — primary backend language
- React / Next.js (2+ years) — frontend development
- REST API design and implementation
- SQL / PostgreSQL — database management
- Git, CI/CD pipelines
- AWS or GCP cloud services
- Docker / Kubernetes basics
- Agile / Scrum methodology

Responsibilities:
- Design and build scalable backend services
- Develop responsive frontend features
- Write unit and integration tests
- Participate in code reviews and architecture discussions
- Collaborate with product and design teams`,

  "data-analyst": `Data Analyst

We are seeking a detail-oriented Data Analyst to join our data team.

Required Skills:
- SQL (advanced) — complex queries, window functions, optimization
- Python (pandas, numpy) — data processing and analysis
- Excel / Google Sheets — advanced formulas and pivot tables
- Tableau or Power BI — dashboard development
- Statistical analysis — hypothesis testing, regression
- Data cleaning and ETL pipelines

Responsibilities:
- Analyze business data to extract actionable insights
- Build and maintain dashboards and reports
- Work with stakeholders to understand data requirements
- Identify trends and patterns in large datasets`,

  "ml-engineer": `Machine Learning Engineer

We are looking for an ML Engineer to build and deploy production ML systems.

Required Skills:
- Python (4+ years) — primary language
- TensorFlow or PyTorch — model development
- scikit-learn — classical ML algorithms
- MLflow or similar — experiment tracking
- Docker / Kubernetes — model deployment
- AWS SageMaker or Vertex AI — cloud ML
- SQL — data querying
- Statistics and linear algebra — strong foundation

Responsibilities:
- Design, train, and deploy ML models
- Build scalable ML pipelines
- Monitor model performance in production
- Collaborate with data engineers and product teams`,

  "devops-engineer": `DevOps Engineer

We are hiring a DevOps Engineer to streamline our development and deployment processes.

Required Skills:
- Docker and Kubernetes — container orchestration
- Terraform — infrastructure as code
- Jenkins or GitHub Actions — CI/CD pipelines
- AWS / Azure / GCP — cloud infrastructure
- Linux / Bash scripting
- Python or Go — automation scripting
- Prometheus / Grafana — monitoring
- Security best practices

Responsibilities:
- Design and maintain CI/CD pipelines
- Manage cloud infrastructure
- Ensure system reliability and scalability
- Implement monitoring and alerting`,

  "marketing-manager": `Marketing Manager

We are seeking a Marketing Manager to lead our marketing initiatives.

Required Skills:
- Google Analytics and Google Ads
- SEO / SEM strategy and execution
- HubSpot CRM — campaign management
- Social media marketing
- Email marketing campaigns
- Content strategy and creation
- Data analysis — campaign performance measurement
- Budget management

Responsibilities:
- Develop and execute marketing campaigns
- Manage digital advertising budget
- Analyze and report on marketing KPIs
- Collaborate with sales and product teams`,

  "warehouse-supervisor": `Warehouse Supervisor

We are looking for an experienced Warehouse Supervisor to manage our distribution operations.

Required Skills:
- OSHA 30-hour certification (required)
- Inventory management systems (WMS)
- Forklift operation and certification
- Lean / 5S methodology
- Team leadership and scheduling
- Logistics coordination
- Safety compliance

Responsibilities:
- Supervise warehouse staff and daily operations
- Ensure OSHA safety compliance
- Manage inventory accuracy
- Coordinate with logistics partners`,

  "registered-nurse": `Registered Nurse

We are seeking a compassionate and skilled Registered Nurse.

Required Skills:
- Active RN license (required)
- BSN or ADN degree
- Patient care and assessment
- EHR systems (Epic, Cerner, or equivalent)
- HIPAA compliance
- IV therapy and medication administration
- Triage and critical care
- BLS / ACLS certification

Responsibilities:
- Provide direct patient care
- Document patient information in EHR
- Administer medications and treatments
- Coordinate with physicians and care teams`,

  "financial-analyst": `Financial Analyst

We are looking for a Financial Analyst to support our finance team.

Required Skills:
- Excel (advanced) — financial modeling, VBA
- Financial modeling and DCF valuation
- SQL — data querying
- Python — data analysis (preferred)
- Bloomberg Terminal (preferred)
- Accounting principles — GAAP
- PowerPoint — executive presentations
- CFA Level 1 (preferred)

Responsibilities:
- Build and maintain financial models
- Analyze investment opportunities
- Prepare executive reports and presentations
- Support budgeting and forecasting processes`,
};

export function StepJD() {
  const { jd_text, jd_source, selected_template, setJDText, setJDSource, setSelectedTemplate } = useStore();
  const [mode, setMode] = React.useState<JDMode>((jd_source as JDMode) ?? "paste");
  const [selectedDomain, setSelectedDomain] = React.useState<string>("All");
  const [urlInput, setUrlInput] = React.useState("");
  const [search, setSearch] = React.useState("");

  const filteredTemplates = JD_TEMPLATES.filter((t) => {
    const matchesDomain = selectedDomain === "All" || t.domain === selectedDomain;
    const matchesSearch = t.label.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setJDSource("template");
    const content = TEMPLATE_CONTENT[templateId] ?? "";
    setJDText(content);
  };

  return (
    <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste a JD, choose a template, or import from URL</CardDescription>
          </div>
        </div>
        {/* Mode tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {([
            ["paste",    ClipboardPaste, "Paste JD"],
            ["template", Briefcase,      "Templates"],
            ["url",      Link,           "Import URL"],
          ] as const).map(([m, Icon, lbl]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all border",
                mode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />{lbl}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Paste mode */}
        {mode === "paste" && (
          <div className="space-y-2">
            <Textarea
              placeholder="Paste the job description here..."
              value={jd_text}
              onChange={(e) => { setJDText(e.target.value); setJDSource("paste"); }}
              className="min-h-[320px] text-sm resize-y"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{jd_text.length} characters</span>
              {jd_text.length > 100 && (
                <Badge variant="outline" className="text-green-500 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />Ready
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Template mode */}
        {mode === "template" && (
          <div className="space-y-4">
            {/* Domain filter */}
            <div className="flex flex-wrap gap-2">
              {JD_DOMAINS.map((domain: JDDomain) => (
                <Badge
                  key={domain.id}
                  variant={selectedDomain === domain.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  {domain.icon} {domain.label}
                </Badge>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* Templates grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectTemplate(t.id)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    selected_template === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  <p className="font-medium text-sm">{t.label}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">{t.domain}</Badge>
                  {selected_template === t.id && (
                    <CheckCircle className="w-4 h-4 text-primary float-right -mt-5" />
                  )}
                </motion.button>
              ))}
            </div>
            {/* Preview */}
            {jd_text && selected_template && (
              <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground mb-2">PREVIEW</p>
                <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground max-h-40 overflow-y-auto">
                  {jd_text.slice(0, 400)}...
                </pre>
              </div>
            )}
          </div>
        )}

        {/* URL mode */}
        {mode === "url" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder="https://careers.company.com/job/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button
                onClick={async () => {
                  if (!urlInput) return;
                  setJDText(`[Importing from URL: ${urlInput}]`);
                  setJDSource("url");
                }}
                disabled={!urlInput}
              >
                Import
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste a job posting URL. The system will extract the job description text automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
