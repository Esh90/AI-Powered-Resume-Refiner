import html2pdf from 'html2pdf.js';
import { useState, useEffect } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Download, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Copy,
  Share2,
  Zap
} from "lucide-react";

interface ResultsPageProps {
  result: {
    originalResume: string;
    jobDescription: string;
    tailoredResume: string;
    matchScore: number;
    suggestions: string[];
  };
  onBack: () => void;
  onNewTailor: () => void;
}

export const ResultsPage = ({ result, onBack, onNewTailor }: ResultsPageProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result) {
      const history = JSON.parse(localStorage.getItem("tailoredResumes") || "[]");
      history.push({
        ...result,
        id: Date.now(), // unique id
        title: "Tailored Resume",
        company: "Custom",
        createdAt: new Date().toISOString(),
        status: "created",
        tags: [], // or extract from resume
        isFavorite: false,
        matchScore: result.matchScore,
      });
      localStorage.setItem("tailoredResumes", JSON.stringify(history));
    }
  }, [result]);

  const handleDownload = async () => {
    setIsDownloading(true);

    const element = document.getElementById("pdf-content");

    if (!element) {
      setIsDownloading(false);
      alert("PDF content not found.");
      return;
    }

    const opt = {
      margin: 0.5,
      filename: "tailored-resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();

    setIsDownloading(false);
  };


  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.tailoredResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tailored Resume",
          text: result.tailoredResume,
        });
      } catch (err) {
        alert("Sharing was cancelled or failed.");
      }
    } else {
      await navigator.clipboard.writeText(result.tailoredResume);
      alert("Sharing is not supported on this device. Resume copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero animate-gradient">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
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
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <Sparkles className="w-8 h-8 mr-3 text-primary" />
                  Resume Tailored Successfully!
                </h1>
                <p className="text-white/70">Your resume has been optimized for this job posting</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{result.matchScore}%</div>
                <div className="text-white/70 text-sm">Match Score</div>
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard hover className="text-center animate-scale-in">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{result.matchScore}%</div>
              <div className="text-white/70 text-sm">Job Match</div>
            </GlassCard>
            
            <GlassCard hover className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">+47%</div>
              <div className="text-white/70 text-sm">ATS Score</div>
            </GlassCard>
            
            <GlassCard hover className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">23</div>
              <div className="text-white/70 text-sm">Keywords Added</div>
            </GlassCard>
            
            <GlassCard hover className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-white/70 text-sm">Sections Enhanced</div>
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resume Content */}
            <div className="lg:col-span-2">
              <GlassCard className="animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-primary" />
                    Your Tailored Resume
                  </h2>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="tailored" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="tailored" className="data-[state=active]:bg-primary">
                      Tailored Version
                    </TabsTrigger>
                    <TabsTrigger value="original" className="data-[state=active]:bg-primary">
                      Original Resume
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tailored" className="mt-6">
  <div
    id="pdf-content"
    className="bg-white/5 rounded-lg p-6"
    style={{ color: "#000", background: "#fff" }}
  >
    <pre className="text-black text-sm whitespace-pre-wrap font-mono leading-relaxed">
      {result.tailoredResume}
    </pre>
  </div>
</TabsContent>

                  
                  <TabsContent value="original" className="mt-6">
                    <div className="bg-white/5 rounded-lg p-6 max-h-96 overflow-y-auto">
                      <pre className="text-white/70 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {result.originalResume}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-center mt-8 space-x-4">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-gradient-primary hover:opacity-90 text-white font-semibold px-8 py-3 shadow-glow"
                  >
                    {isDownloading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Generating PDF...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Download as PDF
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onNewTailor}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tailor Another
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Suggestions Sidebar */}
            <div className="space-y-6">
              <GlassCard className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  AI Improvements
                </h3>
                
                <div className="space-y-4">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-bold text-white mb-4">Match Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Technical Skills</span>
                      <span className="text-white font-medium">98%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Experience Match</span>
                      <span className="text-white font-medium">92%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-secondary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Keywords</span>
                      <span className="text-white font-medium">89%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-hero h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Apply!</h3>
                <p className="text-white/70 text-sm mb-4">
                  Your resume is now optimized and ready for submission. Good luck!
                </p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  High Match Score
                </Badge>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};