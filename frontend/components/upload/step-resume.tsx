"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ACCEPTED_RESUME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Upload,
  ClipboardPaste,
  Github,
  CheckCircle2,
  X,
  File,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export function StepResume() {
  const {
    resume_file,
    resume_text,
    github_username,
    setResumeFile,
    setResumeText,
    setGithubUsername,
  } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>(
    resume_text ? "paste" : "upload"
  );
  const [isParsing, setIsParsing] = React.useState(false);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const [githubLoading, setGithubLoading] = React.useState(false);
  const [githubData, setGithubData] = React.useState<any>(null);

  // ── File Upload via Dropzone ──
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsParsing(true);
      setParseError(null);
      setResumeFile(file);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to parse resume");
        }

        const data = await response.json();
        setResumeText(data.text);
        toast.success("Resume parsed successfully!", {
          description: `${data.text.length} characters extracted from ${file.name}`,
        });
      } catch (err: any) {
        setParseError(err.message || "Failed to parse resume");
        toast.error("Failed to parse resume", {
          description: "Try pasting the text directly instead.",
        });
      } finally {
        setIsParsing(false);
      }
    },
    [setResumeFile, setResumeText]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_RESUME_TYPES,
      maxSize: MAX_FILE_SIZE,
      maxFiles: 1,
      onDropRejected: (fileRejections) => {
        const error = fileRejections[0]?.errors[0];
        if (error?.code === "file-too-large") {
          toast.error("File too large", { description: "Maximum file size is 10MB" });
        } else if (error?.code === "file-invalid-type") {
          toast.error("Invalid file type", {
            description: "Please upload a PDF, DOCX, or TXT file",
          });
        }
      },
    });

  // ── GitHub Import ──
  const handleGithubImport = async () => {
    if (!github_username.trim()) return;

    setGithubLoading(true);
    try {
      const response = await fetch(`/api/github-profile?username=${github_username.trim()}`);
      if (!response.ok) throw new Error("GitHub profile not found");

      const data = await response.json();
      setGithubData(data.data);

      // Append GitHub data to resume text
      const githubSection = `\n\nGITHUB PROFILE (${github_username}):\n` +
        `Top Languages: ${data.data.languages?.join(", ") || "N/A"}\n` +
        `Public Repos: ${data.data.public_repos || 0}\n` +
        `Recent Activity: ${data.data.recent_repos?.map((r: any) => `${r.name} (${r.language})`).join(", ") || "N/A"}\n` +
        `Topics: ${data.data.topics?.join(", ") || "N/A"}`;

      setResumeText((prev: string) => prev + githubSection);
      toast.success("GitHub profile imported!", {
        description: `Found ${data.data.public_repos} repos, ${data.data.languages?.length} languages`,
      });
    } catch (err: any) {
      toast.error("Failed to import GitHub profile", {
        description: err.message,
      });
    } finally {
      setGithubLoading(false);
    }
  };

  const charCount = resume_text.length;
  const isValid = charCount > 50;

  return (
    <Card className="max-w-3xl mx-auto glass border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Your Resume</CardTitle>
            <CardDescription>
              Upload, paste, or import from GitHub — we&apos;ll extract every skill
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 bg-muted/50">
            <TabsTrigger value="upload" className="gap-2 text-sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload File</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2 text-sm">
              <ClipboardPaste className="w-4 h-4" />
              <span className="hidden sm:inline">Paste Text</span>
              <span className="sm:hidden">Paste</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-2 text-sm">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Upload Tab ── */}
          <TabsContent value="upload" className="mt-0">
            <div
              {...getRootProps()}
              className={cn(
                "relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
                isDragActive && isDragAccept
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : isDragReject
                  ? "border-destructive bg-destructive/5"
                  : resume_file
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <input {...getInputProps()} />

              {isParsing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  </div>
                  <p className="text-sm font-medium">Parsing your resume...</p>
                  <p className="text-xs text-muted-foreground">
                    Extracting text and detecting structure
                  </p>
                </motion.div>
              ) : resume_file && !parseError ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <File className="w-4 h-4" />
                      {resume_file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(resume_file.size / 1024).toFixed(1)} KB •{" "}
                      {charCount.toLocaleString()} characters extracted
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                      setResumeText("");
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Remove & re-upload
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                    <Upload className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      {isDragActive ? (
                        <span className="text-primary">Drop your resume here</span>
                      ) : (
                        <>
                          Drag & drop your resume, or{" "}
                          <span className="text-primary">browse</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOCX, TXT • Max 10MB
                    </p>
                  </div>
                </>
              )}

              {parseError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4" />
                  {parseError}
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* ── Paste Tab ── */}
          <TabsContent value="paste" className="mt-0">
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  placeholder={`Paste your full resume text here...

Example:
John Doe
Software Developer | San Francisco, CA

EXPERIENCE
Senior Developer at TechCorp (2021-Present)
• Built microservices using Python and FastAPI...

SKILLS
Python, JavaScript, React, Docker, AWS...`}
                  value={resume_text}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[300px] resize-none font-mono text-sm bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl transition-colors"
                />

                {/* Character counter */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  {resume_text.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                  )}
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

              {charCount > 0 && charCount <= 50 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-500 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Resume seems too short. Paste your complete resume for best results.
                </motion.p>
              )}
            </div>
          </TabsContent>

          {/* ── GitHub Tab ── */}
          <TabsContent value="github" className="mt-0">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-border/50 bg-muted/30">
                <div className="flex items-center gap-3 mb-4">
                  <Github className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Import from GitHub</p>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll analyze your repos, languages, and contributions to
                      enrich your skill profile
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="github-username"
                      value={github_username}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="bg-background"
                      onKeyDown={(e) => e.key === "Enter" && handleGithubImport()}
                    />
                  </div>
                  <Button
                    onClick={handleGithubImport}
                    disabled={!github_username.trim() || githubLoading}
                    className="gap-2"
                  >
                    {githubLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Github className="w-4 h-4" />
                    )}
                    Import
                  </Button>
                </div>
              </div>

              {/* GitHub Results */}
              <AnimatePresence>
                {githubData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">
                        GitHub Profile Imported
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-background/50">
                        <p className="text-xs text-muted-foreground">Repos</p>
                        <p className="text-lg font-bold">{githubData.public_repos}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-background/50">
                        <p className="text-xs text-muted-foreground">Languages</p>
                        <p className="text-lg font-bold">
                          {githubData.languages?.length || 0}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-background/50">
                        <p className="text-xs text-muted-foreground">Contributions</p>
                        <p className="text-lg font-bold">
                          {githubData.total_contributions || "N/A"}
                        </p>
                      </div>
                    </div>

                    {githubData.languages && (
                      <div className="flex flex-wrap gap-1.5">
                        {githubData.languages.map((lang: string) => (
                          <Badge
                            key={lang}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      GitHub data has been appended to your profile for richer skill extraction.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Still need resume text */}
              {!resume_text && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 inline mr-1.5" />
                    GitHub import is supplementary. Please also upload or paste your
                    resume for a complete analysis.
                  </p>
                </div>
              )}
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
              className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20"
            >
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Resume ready</p>
                <p className="text-xs text-muted-foreground">
                  {charCount.toLocaleString()} characters •{" "}
                  {resume_text.split("\n").filter((l) => l.trim()).length} lines detected
                  {githubData && " • GitHub profile imported"}
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                Step 1 ✓
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}