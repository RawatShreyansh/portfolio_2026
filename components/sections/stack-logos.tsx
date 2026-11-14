import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface TechItem {
  id: string;
  name: string;
  category: string;
}

/**
 * 30 technologies arranged for a 6×5 grid (6 columns × 5 rows), covering
 * core languages, web frameworks, AI/ML libraries, LLM ecosystems, and cloud/data tools.
 */
export const STACK_ITEMS: TechItem[] = [
  // Row 1 — Core Languages & Web Foundations
  { id: "cpp", name: "C++", category: "Language" },
  { id: "java", name: "Java", category: "Language" },
  { id: "python", name: "Python", category: "Language" },
  { id: "html", name: "HTML", category: "Frontend" },
  { id: "css", name: "CSS", category: "Frontend" },
  { id: "javascript", name: "JavaScript", category: "Language" },

  // Row 2 — Modern Web & Backend
  { id: "typescript", name: "TypeScript", category: "Language" },
  { id: "react", name: "React", category: "Frontend" },
  { id: "nextjs", name: "Next.js", category: "Framework" },
  { id: "nodejs", name: "Node.js", category: "Runtime" },
  { id: "fastapi", name: "FastAPI", category: "Backend" },
  { id: "docker", name: "Docker", category: "DevOps" },

  // Row 3 — Deep Learning & Data Science
  { id: "pytorch", name: "PyTorch", category: "Deep Learning" },
  { id: "tensorflow", name: "TensorFlow", category: "Deep Learning" },
  { id: "cuda", name: "CUDA", category: "GPU Compute" },
  { id: "scikit", name: "Scikit-learn", category: "ML" },
  { id: "pandas", name: "Pandas", category: "Data Science" },
  { id: "huggingface", name: "Hugging Face", category: "AI Models" },

  // Row 4 — LLMs & AI Engineering
  { id: "claude", name: "Claude", category: "LLM" },
  { id: "chatgpt", name: "ChatGPT", category: "LLM" },
  { id: "gemini", name: "Gemini", category: "LLM" },
  { id: "langchain", name: "LangChain", category: "AI Agents" },
  { id: "rag", name: "RAG", category: "AI Systems" },
  { id: "vectordb", name: "Vector DB", category: "AI Storage" },

  // Row 5 — Databases, Lakehouse & Cloud
  { id: "postgres", name: "PostgreSQL", category: "Database" },
  { id: "mysql", name: "MySQL", category: "Database" },
  { id: "databricks", name: "Databricks", category: "Data Platform" },
  { id: "spark", name: "Apache Spark", category: "Big Data" },
  { id: "kubernetes", name: "Kubernetes", category: "Infrastructure" },
  { id: "aws", name: "AWS", category: "Cloud" },
];

interface IconProps {
  colored: boolean;
  className: string;
}

const DEFAULT_SVG_CLASS = "size-9 sm:size-10 transition-transform duration-300 group-hover:scale-110";
const GEMINI_STAR = "M16 2C16 9.73 22.27 16 30 16C22.27 16 16 22.27 16 30C16 22.27 9.73 16 2 16C9.73 16 16 9.73 16 2Z";

function tone(colored: boolean, monoHover: string, active: string): string {
  return `${colored ? active : monoHover} transition-colors duration-300`;
}

const ICONS: Record<string, (props: IconProps) => ReactElement> = {
  cpp: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="16,2 28.5,9.2 28.5,22.8 16,30 3.5,22.8 3.5,9.2"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#00599C]", "text-[#00599C]")}
      />
      <polygon
        points="16,16 28.5,22.8 16,30 3.5,22.8"
        fill="currentColor"
        className={tone(colored, "text-foreground/85 group-hover:text-[#004482]", "text-[#004482]")}
      />
      <polygon
        points="16,2 28.5,9.2 28.5,22.8 16,16"
        fill="currentColor"
        className={tone(colored, "text-foreground/60 group-hover:text-[#659AD2]", "text-[#659AD2]")}
      />
      <path
        d="M17.4 19.6a4.8 4.8 0 1 1 0-7.2l-2 1.8a2.2 2.2 0 1 0 0 3.6l2 1.8z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
      <path
        d="M21.2 14.5h1v1.2h1.2v1h-1.2v1.2h-1v-1.2H20v-1h1.2v-1.2zm4 0h1v1.2h1.2v1h-1.2v1.2h-1v-1.2H24v-1h1.2v-1.2z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  java: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M14.2 3.2c1.8 2-2.2 3.6-.5 5.8.9 1.2 2.8 1.5 1.8 3.6.9-1.4.4-2.8-.7-4-1.3-1.5 1.9-3.2-.6-5.4zm4.3 1.4c1.3 1.6-1.8 2.9-.3 4.7.7.9 2.1 1.2 1.4 2.9.8-1.1.3-2.3-.5-3.2-1.1-1.3 1.5-2.6-.6-4.4z"
        fill="currentColor"
        className={tone(colored, "text-foreground/55 group-hover:text-[#E76F00]", "text-[#E76F00]")}
      />
      <path
        d="M9 14h11.5v5.5a5.5 5.5 0 0 1-5.5 5.5h-.5A5.5 5.5 0 0 1 9 19.5V14z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#5382A1] dark:group-hover:text-[#6CA0C4]", "text-[#5382A1] dark:text-[#6CA0C4]")}
      />
      <path
        d="M20.5 15.2h2.2a2.5 2.5 0 0 1 0 5h-2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/75 group-hover:text-[#5382A1] dark:group-hover:text-[#6CA0C4]", "text-[#5382A1] dark:text-[#6CA0C4]")}
      />
      <path
        d="M7.5 27.2c4.8 1.2 10.2 1.2 15 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/55 group-hover:text-[#E76F00]", "text-[#E76F00]")}
      />
    </svg>
  ),

  python: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M15.8 3C11.3 3 11.6 5 11.6 5v2.9h4.4v.9H8.8S5 8.4 5 13.7c0 5.3 3.3 5.1 3.3 5.1h2v-2.5s-.1-3.3 3.3-3.3h5.6s3.2.1 3.2-3.1V6.3S22.9 3 15.8 3zm-2.5 1.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#3776AB]", "text-[#3776AB]")}
      />
      <path
        d="M16.2 29c4.5 0 4.2-2 4.2-2v-2.9H16v-.9h7.2s3.8.4 3.8-4.9c0-5.3-3.3-5.1-3.3-5.1h-2v2.5s.1 3.3-3.3 3.3h-5.6s-3.2-.1-3.2 3.1v3.6S9.1 29 16.2 29zm2.5-1.9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/50 group-hover:text-[#FFD43B]", "text-[#FFD43B]")}
      />
    </svg>
  ),

  html: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="5,3 27,3 25,25.5 16,28.5 7,25.5"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#E34F26]", "text-[#E34F26]")}
      />
      <polygon
        points="16,5.2 24.8,5.2 23.2,23.8 16,26"
        fill="currentColor"
        className={tone(colored, "text-foreground/65 group-hover:text-[#EF652A]", "text-[#EF652A]")}
      />
      <path
        d="M10.4 8.8h11.2l-.3 2.8h-8l.3 3h7.4l-.6 6.8-4.4 1.3-4.4-1.3-.3-3.2h2.7l.2 1.5 1.8.5 1.8-.5.2-2.4H11l-.6-8.5z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  css: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="5,3 27,3 25,25.5 16,28.5 7,25.5"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#1572B6]", "text-[#1572B6]")}
      />
      <polygon
        points="16,5.2 24.8,5.2 23.2,23.8 16,26"
        fill="currentColor"
        className={tone(colored, "text-foreground/65 group-hover:text-[#33A9DC]", "text-[#33A9DC]")}
      />
      <path
        d="M10.4 8.8h11.2l-.4 2.8h-5.3l5 2.1-.6 7.7-4.3 1.3-4.3-1.3-.3-3.2h2.7l.2 1.5 1.7.5 1.7-.5.2-2.8h-6.1l.3-2.6h4.2l-5.6-2.5-.3-3z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  javascript: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        rx="4"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#F7DF1E]", "text-[#F7DF1E]")}
      />
      <path
        d="M18.2 21.8c0 2.3-1.3 3.4-3.3 3.4-1.5 0-2.5-.7-3-1.8l1.9-1.1c.3.6.7 1 1.2 1 .6 0 .9-.3.9-1.4v-6.7h2.3v6.6zm3.8 3.4c-1.8 0-3.1-.8-3.8-2l1.9-1.1c.5.8 1.1 1.2 2 1.2.9 0 1.4-.4 1.4-1 0-.7-.5-1-1.6-1.5l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.6.5 3.3 1.8l-1.8 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.4 1.4l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2-1.6 3.8-3.9 3.8z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-[#000000]", "text-[#000000]")}
      />
    </svg>
  ),

  typescript: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="25"
        height="25"
        rx="4"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#3178C6]", "text-[#3178C6]")}
      />
      <path
        d="M11.6 17.3H8.8v-2h8v2h-2.8V25h-2.4v-7.7zm8.9 7.9c-1.7 0-3-.7-3.7-1.8l1.8-1.1c.4.7 1 1.1 1.9 1.1.8 0 1.3-.4 1.3-.9 0-.6-.5-.9-1.5-1.3l-.6-.3c-1.6-.7-2.6-1.5-2.6-3.2 0-1.6 1.3-2.8 3.2-2.8 1.4 0 2.4.5 3.1 1.6l-1.7 1.1c-.4-.6-.8-.9-1.4-.9-.6 0-1 .4-1 .9 0 .6.4.9 1.3 1.3l.6.3c1.9.8 2.9 1.6 2.9 3.4 0 1.9-1.5 3.6-3.6 3.6z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  react: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle
        cx="16"
        cy="16"
        r="2.4"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#0891B2] dark:group-hover:text-[#61DAFB]", "text-[#0891B2] dark:text-[#61DAFB]")}
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={tone(colored, "text-foreground/70 group-hover:text-[#0891B2] dark:group-hover:text-[#61DAFB]", "text-[#0891B2] dark:text-[#61DAFB]")}
      >
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" />
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12.5" ry="4.8" transform="rotate(120 16 16)" />
      </g>
    </svg>
  ),

  nextjs: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-foreground", "text-foreground")}
      />
      <path
        d="M11.2 21.5V10.8h1.9l7.7 11.4c-.5.4-1.1.7-1.8.9l-6-9.1v7.5h-1.8zm8-4.1v-6.6H21v9l-1.8-2.4z"
        fill="currentColor"
        className="text-background"
      />
    </svg>
  ),

  nodejs: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="16,2.5 28,9.4 28,22.6 16,29.5 4,22.6 4,9.4"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#5FA04E]", "text-[#5FA04E]")}
      />
      <polygon
        points="16,7.5 23.5,11.8 23.5,20.2 16,24.5 8.5,20.2 8.5,11.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
      <circle
        cx="16"
        cy="16"
        r="2.4"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  fastapi: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#009688]", "text-[#009688]")}
      />
      <polygon
        points="17.6,7.5 10.5,17.3 15.6,17.3 14.4,24.5 21.5,14.7 16.4,14.7"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  docker: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M6 16.5h20.2c1.2 0 2.5-.8 3.2-2-.6-.6-1.8-.9-2.7-.6-.2-1.1-.8-2-1.8-2.6-.5 1-.6 2.3 0 3.2-.6.4-1.4.6-2.2.6H4.2c-.3 4.8 2.8 9.2 8.3 9.2 6.8 0 11.8-3.1 13.7-7.8H6z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#2496ED]", "text-[#2496ED]")}
      />
      <path
        d="M8.5 12h2.8v2.6H8.5V12zm3.6 0h2.8v2.6h-2.8V12zm3.6 0h2.8v2.6h-2.8V12zm3.6 0h2.8v2.6h-2.8V12zm-7.2-3.4h2.8v2.6h-2.8V8.6zm3.6 0h2.8v2.6h-2.8V8.6z"
        fill="currentColor"
        className={tone(colored, "text-foreground/60 group-hover:text-[#1D63ED]", "text-[#1D63ED]")}
      />
    </svg>
  ),

  pytorch: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M22.8 10.6l-2.3 2.3a6.5 6.5 0 1 1-9.2 0L16 8.2V3.8L9 10.8a9.8 9.8 0 1 0 13.8-.2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#EE4C2C]", "text-[#EE4C2C]")}
      />
      <circle
        cx="19.8"
        cy="7.8"
        r="1.9"
        fill="currentColor"
        className={tone(colored, "text-foreground/60 group-hover:text-[#EE4C2C]", "text-[#EE4C2C]")}
      />
    </svg>
  ),

  tensorflow: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="15,3.2 4.5,9.3 4.5,14.5 11.2,10.6 11.2,26.8 15,29"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#FF6F00]", "text-[#FF6F00]")}
      />
      <polygon
        points="17,3.2 27.5,9.3 27.5,14.5 20.8,10.6 20.8,14.8 24.8,17.1 24.8,21.5 20.8,19.2 20.8,26.8 17,29"
        fill="currentColor"
        className={tone(colored, "text-foreground/55 group-hover:text-[#FFA800]", "text-[#FFA800]")}
      />
    </svg>
  ),

  cuda: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="3.5"
        y="6.5"
        width="25"
        height="19"
        rx="3.5"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#76B900]", "text-[#76B900]")}
      />
      <path
        d="M8.5 16c2.6-3.6 6.2-5 10.8-4.2v2.4c-3.1-.5-5.6.3-7.6 2.5 1.8 1.6 4.1 2.2 6.8 1.8 2.2-.3 3.9-1.3 4.8-2.8-.6-1.5-2.1-2.5-4-2.8v-2.1c3.4.3 6 2.1 6.7 5-1.1 3.1-4.1 5-7.9 5.3-4.2.3-7.6-1.5-9.6-5.1z"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  scikit: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle
        cx="19"
        cy="17"
        r="8.5"
        fill="currentColor"
        className={tone(colored, "text-foreground/65 group-hover:text-[#3499CD]", "text-[#3499CD]")}
      />
      <ellipse
        cx="13"
        cy="13.5"
        rx="8.5"
        ry="5.5"
        transform="rotate(-24 13 13.5)"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#F7931E]", "text-[#F7931E]")}
      />
    </svg>
  ),

  pandas: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="8"
        y="6"
        width="3.4"
        height="5.5"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#150458] dark:group-hover:text-[#818CF8]", "text-[#150458] dark:text-[#818CF8]")}
      />
      <rect
        x="8"
        y="13"
        width="3.4"
        height="3.2"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/50 group-hover:text-[#FFCA00]", "text-[#FFCA00]")}
      />
      <rect
        x="8"
        y="17.8"
        width="3.4"
        height="8.2"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#150458] dark:group-hover:text-[#818CF8]", "text-[#150458] dark:text-[#818CF8]")}
      />
      <rect
        x="14.3"
        y="3.5"
        width="3.4"
        height="21.5"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/85 group-hover:text-[#150458] dark:group-hover:text-[#818CF8]", "text-[#150458] dark:text-[#818CF8]")}
      />
      <rect
        x="20.6"
        y="6"
        width="3.4"
        height="8.2"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#150458] dark:group-hover:text-[#818CF8]", "text-[#150458] dark:text-[#818CF8]")}
      />
      <rect
        x="20.6"
        y="15.8"
        width="3.4"
        height="3.2"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/60 group-hover:text-[#E70488]", "text-[#E70488]")}
      />
      <rect
        x="20.6"
        y="20.5"
        width="3.4"
        height="8"
        rx="0.6"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#150458] dark:group-hover:text-[#818CF8]", "text-[#150458] dark:text-[#818CF8]")}
      />
    </svg>
  ),

  huggingface: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle
        cx="16"
        cy="15"
        r="11"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#FFD21E]", "text-[#FFD21E]")}
      />
      <circle
        cx="12.2"
        cy="12.8"
        r="1.4"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-[#2B2B2B]", "text-[#2B2B2B]")}
      />
      <circle
        cx="19.8"
        cy="12.8"
        r="1.4"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-[#2B2B2B]", "text-[#2B2B2B]")}
      />
      <path
        d="M11.8 16.8a4.5 4.5 0 0 0 8.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={tone(colored, "text-background group-hover:text-[#2B2B2B]", "text-[#2B2B2B]")}
      />
      <path
        d="M5.5 21.5c0-2 1.4-3.3 2.8-3.3 1.4 0 2.3 1.2 2.3 3.1v4.2a2.5 2.5 0 0 1-5.1 0v-4zm15.9-.2c0-1.9.9-3.1 2.3-3.1 1.4 0 2.8 1.3 2.8 3.3v4a2.5 2.5 0 0 1-5.1 0v-4.2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/60 group-hover:text-[#FF9D00]", "text-[#FF9D00]")}
      />
    </svg>
  ),

  claude: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/75 group-hover:text-[#D97757]", "text-[#D97757]")}
      >
        <line x1="16" y1="3.5" x2="16" y2="28.5" />
        <line x1="3.5" y1="16" x2="28.5" y2="16" />
        <line x1="7.2" y1="7.2" x2="24.8" y2="24.8" />
        <line x1="24.8" y1="7.2" x2="7.2" y2="24.8" />
        <line x1="11.2" y1="4.5" x2="20.8" y2="27.5" />
        <line x1="27.5" y1="11.2" x2="4.5" y2="20.8" />
      </g>
    </svg>
  ),

  chatgpt: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M27.3 13.7a6.6 6.6 0 0 0-.6-5.4 6.7 6.7 0 0 0-7.2-3.2 6.6 6.6 0 0 0-5-2.2 6.7 6.7 0 0 0-6.4 4.6 6.6 6.6 0 0 0-4.4 3.2 6.7 6.7 0 0 0 .8 7.8 6.6 6.6 0 0 0 .6 5.4 6.7 6.7 0 0 0 7.2 3.2 6.6 6.6 0 0 0 5 2.2 6.7 6.7 0 0 0 6.4-4.6 6.6 6.6 0 0 0 4.4-3.2 6.7 6.7 0 0 0-.8-7.8zm-10 13.8a4.9 4.9 0 0 1-3.2-1.1l.2-.1 5.3-3a.9.9 0 0 0 .4-.8v-7.4l2.2 1.3v6.1a5 5 0 0 1-4.9 5zM6.7 23a4.9 4.9 0 0 1-.6-3.3l.2.1 5.3 3a.9.9 0 0 0 .9 0l6.4-3.7v2.6l-5.3 3a5 5 0 0 1-6.9-1.7zm-1.4-11.4A4.9 4.9 0 0 1 7.9 9.4v6.3a.9.9 0 0 0 .4.8l6.4 3.7-2.2 1.3-5.3-3a5 5 0 0 1-1.9-6.9zm18.3 4.3l-6.4-3.7 2.2-1.3 5.3 3a5 5 0 0 1-.8 9v-6.2a.9.9 0 0 0-.3-.8zm2.2-3.4l-.2-.1-5.3-3a.9.9 0 0 0-.9 0l-6.4 3.7v-2.6l5.3-3a5 5 0 0 1 7.5 5zm-14 4.6l-2.2-1.3v-6.1a5 5 0 0 1 8.2-3.8l-.2.1-5.3 3a.9.9 0 0 0-.5.8v7.3zm1.2-2.6l2.9-1.7 2.9 1.7v3.4l-2.9 1.7-2.9-1.7v-3.4z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#10A37F]", "text-[#10A37F]")}
      />
    </svg>
  ),

  gemini: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="gemini-brand-grad" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4796E3" />
          <stop offset="50%" stopColor="#8E75B2" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      {!colored && (
        <path
          d={GEMINI_STAR}
          fill="currentColor"
          className="text-foreground/80 transition-opacity duration-300 group-hover:opacity-0"
        />
      )}
      <path
        d={GEMINI_STAR}
        fill="url(#gemini-brand-grad)"
        className={colored ? "opacity-100" : "opacity-0 transition-opacity duration-300 group-hover:opacity-100"}
      />
    </svg>
  ),

  langchain: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="4"
        y="9.5"
        width="13"
        height="8.5"
        rx="4.25"
        transform="rotate(-25 10.5 13.75)"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        className={tone(colored, "text-foreground/80 group-hover:text-[#10B981]", "text-[#10B981]")}
      />
      <rect
        x="15"
        y="14"
        width="13"
        height="8.5"
        rx="4.25"
        transform="rotate(-25 21.5 18.25)"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        className={tone(colored, "text-foreground/55 group-hover:text-[#059669]", "text-[#059669]")}
      />
      <circle
        cx="25"
        cy="7"
        r="2.2"
        fill="currentColor"
        className={tone(colored, "text-foreground/70 group-hover:text-[#34D399]", "text-[#34D399]")}
      />
    </svg>
  ),

  rag: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect
        x="4.5"
        y="6"
        width="13"
        height="16"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        className={tone(colored, "text-foreground/70 group-hover:text-[#8B5CF6]", "text-[#8B5CF6]")}
      />
      <path
        d="M8 11h6M8 15h4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/55 group-hover:text-[#06B6D4]", "text-[#06B6D4]")}
      />
      <path
        d="M22.5 12c0 3.3 2.7 6 6 6-3.3 0-6 2.7-6 6 0-3.3-2.7-6-6-6 3.3 0 6-2.7 6-6z"
        fill="currentColor"
        className={tone(colored, "text-foreground/85 group-hover:text-[#EC4899]", "text-[#EC4899]")}
      />
    </svg>
  ),

  vectordb: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="16,3.5 27,9.8 27,22.2 16,28.5 5,22.2 5,9.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className={tone(colored, "text-foreground/65 group-hover:text-[#6366F1]", "text-[#6366F1]")}
      />
      <path
        d="M16 16V3.5M16 16l11 6.2M16 16L5 22.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/55 group-hover:text-[#06B6D4]", "text-[#06B6D4]")}
      />
      <circle
        cx="16"
        cy="16"
        r="2.5"
        fill="currentColor"
        className={tone(colored, "text-foreground/85 group-hover:text-[#10B981]", "text-[#10B981]")}
      />
      <circle
        cx="16"
        cy="4"
        r="1.7"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#6366F1]", "text-[#6366F1]")}
      />
      <circle
        cx="26.5"
        cy="22"
        r="1.7"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#06B6D4]", "text-[#06B6D4]")}
      />
      <circle
        cx="5.5"
        cy="22"
        r="1.7"
        fill="currentColor"
        className={tone(colored, "text-foreground/80 group-hover:text-[#10B981]", "text-[#10B981]")}
      />
    </svg>
  ),

  postgres: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M21.2 4.8c-2-.4-3.7.4-5.2 1.6-1.5-1.2-3.2-2-5.2-1.6-3.7.7-6 4.7-5.5 9.2.4 3.5 2 6.8 4.4 7.7 1.3.5 2.4.1 2.9-.8v3.7c0 1.8 1.2 3.1 2.8 3.1s2.6-1.2 2.6-2.8v-1.7c1.6 1 3.7.7 5-.6 1.8-1.9 3.2-5 3.6-8.6.5-4.5-1.7-8.5-5.4-9.2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#336791] dark:group-hover:text-[#5B9BD5]", "text-[#336791] dark:text-[#5B9BD5]")}
      />
      <circle
        cx="13.2"
        cy="11.5"
        r="1.1"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
      <circle
        cx="18.8"
        cy="11.5"
        r="1.1"
        fill="currentColor"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
      <path
        d="M15.2 14.5v5.5c0 1 .7 1.6 1.6 1.6s1.5-.6 1.5-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
    </svg>
  ),

  mysql: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M5 21.5c2.2-5.8 6.4-11 12.2-12.5 2.8-.7 5.5-.1 7.6 1.3-1.4.4-2.5 1.1-3.3 2.2 1.8.8 3.2 2.2 4.3 4.3-.9.5-2.1.4-3.4-.2-1.8-.8-3.4-1.3-5.2-1-3 .5-5.7 2.8-8.1 6-.8 1.1-2.8 1.1-4.1-.1z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#00758F] dark:group-hover:text-[#2EA3BF]", "text-[#00758F] dark:text-[#2EA3BF]")}
      />
      <path
        d="M5.5 25.5c4.5 1.5 10.5 1.5 16.5.2 2.2-.5 3.9-1.2 5-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        className={tone(colored, "text-foreground/55 group-hover:text-[#F29111]", "text-[#F29111]")}
      />
    </svg>
  ),

  databricks: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M16 4L5 10.2 16 16.4l11-6.2L16 4zm0 14.6L5 12.4v3.4L16 22l11-6.2v-3.4l-11 6.2zm0 5.6L5 18v3.4L16 27.6l11-6.2V18l-11 6.2z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#FF3621]", "text-[#FF3621]")}
      />
    </svg>
  ),

  spark: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M21.8 3.5l-4.2 8.7-8.8-1.4 6.2 6.5-4.3 9.2 7.5-6.6 7.8 4.4-2.8-8.6 5.6-6.8-8.4.4 1.4-5.8z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#E25A1C]", "text-[#E25A1C]")}
      />
      <circle
        cx="8.5"
        cy="23.5"
        r="2"
        fill="currentColor"
        className={tone(colored, "text-foreground/50 group-hover:text-[#F59E0B]", "text-[#F59E0B]")}
      />
    </svg>
  ),

  kubernetes: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <polygon
        points="16,3 25.9,7.8 28.3,18.5 21.5,27.2 10.5,27.2 3.7,18.5 6.1,7.8"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#326CE5]", "text-[#326CE5]")}
      />
      <circle
        cx="16"
        cy="16"
        r="6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      />
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={tone(colored, "text-background group-hover:text-white", "text-white")}
      >
        <line x1="16" y1="7.2" x2="16" y2="24.8" />
        <line x1="8.4" y1="11.6" x2="23.6" y2="20.4" />
        <line x1="23.6" y1="11.6" x2="8.4" y2="20.4" />
      </g>
      <circle
        cx="16"
        cy="16"
        r="2.4"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-[#326CE5]", "text-[#326CE5]")}
      />
    </svg>
  ),

  aws: ({ colored, className }) => (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M6.4 17.5c0-1.6 1.2-2.6 3.1-2.6.8 0 1.4.2 1.8.4v-.5c0-1-.6-1.5-1.7-1.5-.8 0-1.6.2-2.2.5l-.5-1.4c.8-.4 1.8-.7 2.9-.7 2.3 0 3.6 1.1 3.6 3.2v4.9h-1.8v-.8c-.5.6-1.2 1-2.2 1-1.7 0-3-1-3-2.5zm4.9-.5v-.7c-.4-.2-.9-.3-1.4-.3-.9 0-1.5.4-1.5 1.1 0 .6.5 1 1.3 1 .8 0 1.4-.4 1.6-1.1zm4.6 2.8l-2-8h1.9l1.2 5.4 1.4-5.4h1.7l1.4 5.4 1.2-5.4h1.9l-2 8h-1.9l-1.3-5-1.3 5h-1.8zm10.2-.3l.5-1.4c.6.3 1.3.5 2 .5.8 0 1.3-.3 1.3-.8 0-.4-.3-.7-1.1-.9l-.8-.2c-1.4-.4-2.1-1.1-2.1-2.2 0-1.4 1.2-2.3 3-2.3.9 0 1.7.2 2.3.5l-.5 1.4c-.5-.3-1.1-.4-1.7-.4-.7 0-1.2.2-1.2.7 0 .4.3.6 1 .8l.8.2c1.5.4 2.2 1.1 2.2 2.3 0 1.5-1.2 2.4-3.2 2.4-1 0-2-.2-2.5-.6z"
        fill="currentColor"
        className={tone(colored, "text-foreground/75 group-hover:text-foreground", "text-foreground")}
      />
      <path
        d="M5.5 22.8c5.6 3.4 12.8 3.6 18.8.4M22.2 21.6l3.4.9-.9 3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone(colored, "text-foreground/60 group-hover:text-[#FF9900]", "text-[#FF9900]")}
      />
    </svg>
  ),
};

export function TechLogo({
  id,
  colored = false,
  className,
}: {
  id: string;
  colored?: boolean;
  className?: string;
}): ReactElement | null {
  const render = ICONS[id];
  return render ? render({ colored, className: cn(DEFAULT_SVG_CLASS, className) }) : null;
}
