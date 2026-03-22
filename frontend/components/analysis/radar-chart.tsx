"use client";

import React from "react";
import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ExtractedSkill, SkillGap, ParsedJD } from "@/lib/types";

interface RadarChartProps {
  skills: ExtractedSkill[];
  gaps: SkillGap[];
  parsedJD: ParsedJD | null;
}

export function RadarChart({ skills, gaps, parsedJD }: RadarChartProps) {
  const data = React.useMemo(() => {
    const allRequired = parsedJD?.required_skills || [];
    const topSkills = allRequired.slice(0, 8);

    const skillMap: Record<string, number> = {};
    for (const s of skills) {
      const name = s.name || s.normalized_name || "";
      skillMap[name.toLowerCase()] = s.decay_adjusted_proficiency || s.proficiency || 0;
    }

    return topSkills.map((req) => {
      const name = req.name || "";
      const current = skillMap[name.toLowerCase()] || 0;
      const required = req.required_proficiency || 3;

      return {
        skill: name.length > 12 ? name.substring(0, 12) + "…" : name,
        fullName: name,
        current: current,
        required: required,
      };
    });
  }, [skills, gaps, parsedJD]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
        No skills data available for radar chart
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickCount={6}
          />
          <Radar
            name="Required"
            dataKey="required"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              `${value}/5`,
              name,
            ]}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}