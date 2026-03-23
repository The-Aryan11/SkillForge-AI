"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { ACCEPTED_RESUME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FileText, Upload, X, Github, ClipboardPaste,
  CheckCircle, AlertTriangle,
} from "lucide-react";

type InputMode = "upload" | "paste" | "github";

export function StepResume() {
  const { resume_file, resume_text, github_username, setResumeFile, setResumeText, setGithubUsername } = useStore();
  const [mode, setMode] = React.useState<InputMode>("upload");
  const [error, setError] = React.useState<string>("");
  const [githubInput, setGithubInput] = React.useState(github_username ?? "");

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10 MB.");
      return;
    }
    setError("");
    setResumeFile(file);

    // Extract text client-side for txt files
    if (file.type === "text/plain") {
      const text = await file.text();
      setResumeText(text);
    } else {
      // For PDF/DOCX — will be parsed server-side; store placeholder
      setResumeText(`[File: ${file.name} — will be parsed server-side]`);
    }
  }, [setResumeFile, setResumeText]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_RESUME_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: () => setError("Invalid file type or file too large."),
  });

  const clearFile = () => { setResumeFile(null); setResumeText(""); setError(""); };

  return (
    <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>PDF, DOCX, or plain text — or paste directly</CardDescription>
          </div>
        </div>
        {/* Mode tabs */}
        <div className="flex gap-2 mt-4">
          {([
            ["upload", Upload,         "Upload File"],
            ["paste",  ClipboardPaste, "Paste Text"],
            ["github", Github,         "GitHub Profile"],
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
        {/* Upload mode */}
        {mode === "upload" && (
          <>
            {!resume_file ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">
                  {isDragActive ? "Drop it here!" : "Drag & drop your resume"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, DOC, or TXT — max 10 MB</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-green-500/30 bg-green-500/5"
              >
                <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{resume_file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(resume_file.size / 1024).toFixed(1)} KB · {resume_file.type || "text/plain"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
          </>
        )}

        {/* Paste mode */}
        {mode === "paste" && (
          <div className="space-y-2">
            <Textarea
              placeholder="Paste your resume text here..."
              value={resume_text}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[300px] font-mono text-sm resize-y"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{resume_text.length} characters</span>
              {resume_text.length > 100 && (
                <Badge variant="outline" className="text-green-500 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />Ready
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* GitHub mode */}
        {mode === "github" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="your-github-username"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button
                onClick={() => { setGithubUsername(githubInput); setResumeText(`[GitHub: ${githubInput}]`); }}
                disabled={!githubInput.trim()}
              >
                Import
              </Button>
            </div>
            {github_username && (
              <div className="flex items-center gap-2 text-sm text-green-500 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                <CheckCircle className="w-4 h-4" />
                GitHub profile @{github_username} will be analysed
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              We use the GitHub REST API to extract your top languages, recent commit activity, repo topics, and contribution frequency to build a richer skill profile.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
