import { useState, useRef } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Upload,
  ArrowLeft,
  Zap,
  Target,
  Download
} from "lucide-react";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

interface TailorResult {
  originalResume: string;
  jobDescription: string;
  tailoredResume: string;
  matchScore: number;
  suggestions: string[];
}

interface ResumeTailorProps {
  onBack: () => void;
  onComplete: (result: TailorResult) => void;
}

export const ResumeTailor = ({ onBack, onComplete }: ResumeTailorProps) => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Replace with actual

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send the correct JSON structure
      body: JSON.stringify({
        resume: resume,
        jobDescription: jobDescription,
      }),
    });

    if (!res.ok) {
      throw new Error(`Bad response: ${res.status} ${res.statusText}`);
    }

    // Parse as JSON
    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error(`Invalid JSON response`);
    }

    // Use the correct key from your n8n response
    const tailoredText = data.key || "";
    if (!tailoredText || tailoredText.trim() === "") {
      throw new Error("Empty or invalid tailored resume from n8n");
    }

    const result: TailorResult = {
      originalResume: resume,
      jobDescription,
      tailoredResume: tailoredText,
      matchScore: 92,
      suggestions: [
        "Matched experience with key job responsibilities",
        "Optimized for ATS by injecting keywords",
        "Aligned skills section with requirements",
      ],
    };

    onComplete(result);
  } catch (err) {
    console.error("Failed to get tailored resume", err);
    onComplete({
      originalResume: resume,
      jobDescription,
      tailoredResume: "❌ Something went wrong. Please try again later.",
      matchScore: 0,
      suggestions: [],
    });
  } finally {
    setIsLoading(false);
  }
};


  const LoadingAnimation = () => (
    <div className="text-center py-12">
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-primary rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 bg-gradient-secondary rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-gradient-hero rounded-full flex items-center justify-center animate-spin">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">AI is tailoring your resume</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-center text-white/70">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-3"></div>
            Analyzing job requirements...
          </div>
          <div className="flex items-center justify-center text-white/70">
            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse mr-3" style={{ animationDelay: '0.5s' }}></div>
            Matching your skills and experience...
          </div>
          <div className="flex items-center justify-center text-white/70">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse mr-3" style={{ animationDelay: '1s' }}></div>
            Optimizing content and keywords...
          </div>
          <div className="flex items-center justify-center text-white/70">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-3" style={{ animationDelay: '1.5s' }}></div>
            Generating your tailored resume...
          </div>
        </div>
        
        <div className="mt-8 bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-4000 ease-out"
            style={{ width: '100%', animation: 'loading-bar 4s ease-out forwards' }}
          ></div>
        </div>
      </div>
    </div>
  );

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      // TXT file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setResume(e.target.result);
        }
      };
      reader.readAsText(file);
    } else if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      // PDF file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: { str: string }) => item.str).join(" ") + "\n";
          }
          setResume(text);
        } catch (err) {
          alert("Could not read PDF file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      // DOCX file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setResume(result.value);
        } catch (err) {
          alert("Could not read DOCX file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload a PDF, TXT, or DOCX file.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero animate-gradient">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 p-6">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-5xl font-bold text-white mb-3">Resume Tailor</h1>
                <p className="text-white/70 text-2xl">Transform your resume to match any job perfectly</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-white/70">
              <Target className="w-5 h-5" />
              <span className="text-sm">AI-Powered Matching</span>
            </div>
          </div>

          {!isLoading ? (
            <GlassCard className="animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Resume Input */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-2xl font-bold text-white">
                        Your Current Resume
                      </Label>
                      <p className="text-white/70 text-lg">
                        Paste your existing resume content here
                      </p>
                    </div>
                  </div>
                  
                  <Textarea
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume content here... Include your experience, skills, education, and projects."
                    className="min-h-64 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary resize-none"
                    required
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50 text-lg">
                    {resume.length} characters
                  </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 mr-2" />
                      Upload File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.docx"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {/* Job Description Input */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-2xl font-bold text-white">
                        Job Description
                      </Label>
                      <p className="text-white/70 text-lg">
                        Paste the job posting you're applying for
                      </p>
                    </div>
                  </div>
                  
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here... Include requirements, responsibilities, and preferred qualifications."
                    className="min-h-48 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-secondary resize-none"
                    required
                  />
                  
                  <span className="text-white/50 text-lg">
                    {jobDescription.length} characters
                  </span>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={!resume.trim() || !jobDescription.trim()}
                    className="bg-gradient-primary hover:opacity-90 text-white font-bold px-16 py-6 text-3xl group shadow-glow"
                  >
                    <Zap className="w-8 h-8 mr-4" />
                    Tailor My Resume
                    <Sparkles className="w-8 h-8 ml-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </div>
              </form>
            </GlassCard>
          ) : (
            <GlassCard className="animate-scale-in">
              <LoadingAnimation />
            </GlassCard>
          )}

          {/* Features */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <GlassCard hover className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Smart Matching</h3>
                <p className="text-white/70 text-xl">AI analyzes job requirements and optimizes your resume accordingly</p>
              </GlassCard>
              
              <GlassCard hover className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Keyword Optimization</h3>
                <p className="text-white/70 text-xl">Automatically includes relevant keywords to pass ATS systems</p>
              </GlassCard>
              
              <GlassCard hover className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Download</h3>
                <p className="text-white/70 text-xl">Get your tailored resume as a professional PDF instantly</p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <style>{`
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};