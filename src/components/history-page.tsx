import { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Download, 
  Trash2,
  Calendar,
  TrendingUp,
  Filter,
  MoreVertical,
  Star,
  Eye
} from "lucide-react";

interface HistoryPageProps {
  onBack: () => void;
  onViewResume: (resume: any) => void;
}

export const HistoryPage = ({ onBack, onViewResume }: HistoryPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  // Mock data - in real app this would come from API
  const resumeHistory = [
    {
      id: 1,
      title: "Senior Software Engineer - Google",
      company: "Google",
      matchScore: 94,
      createdAt: "2024-01-15",
      status: "downloaded",
      tags: ["React", "TypeScript", "Cloud"],
      isFavorite: true
    },
    {
      id: 2,
      title: "Product Manager - Meta",
      company: "Meta",
      matchScore: 87,
      createdAt: "2024-01-12",
      status: "created",
      tags: ["Product", "Strategy", "Analytics"],
      isFavorite: false
    },
    {
      id: 3,
      title: "UX Designer - Apple",
      company: "Apple",
      matchScore: 91,
      createdAt: "2024-01-10",
      status: "downloaded",
      tags: ["Design", "Figma", "Research"],
      isFavorite: true
    },
    {
      id: 4,
      title: "DevOps Engineer - Amazon",
      company: "Amazon",
      matchScore: 89,
      createdAt: "2024-01-08",
      status: "created",
      tags: ["AWS", "Docker", "Kubernetes"],
      isFavorite: false
    },
    {
      id: 5,
      title: "Full Stack Developer - Netflix",
      company: "Netflix",
      matchScore: 92,
      createdAt: "2024-01-05",
      status: "downloaded",
      tags: ["React", "Node.js", "MongoDB"],
      isFavorite: false
    }
  ];

  const filteredResumes = resumeHistory.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "favorites") return matchesSearch && resume.isFavorite;
    if (filterBy === "downloaded") return matchesSearch && resume.status === "downloaded";
    return matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (score >= 80) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
                <h1 className="text-3xl font-bold text-white mb-2">Resume History</h1>
                <p className="text-white/70">Manage all your tailored resumes in one place</p>
              </div>
            </div>
            
            <div className="text-white/70">
              <span className="text-2xl font-bold text-white">{filteredResumes.length}</span> resumes
            </div>
          </div>

          {/* Search and Filter */}
          <GlassCard className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  placeholder="Search resumes by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterBy === "all" ? "default" : "outline"}
                  onClick={() => setFilterBy("all")}
                  className={filterBy === "all" 
                    ? "bg-gradient-primary text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  All
                </Button>
                <Button
                  variant={filterBy === "favorites" ? "default" : "outline"}
                  onClick={() => setFilterBy("favorites")}
                  className={filterBy === "favorites" 
                    ? "bg-gradient-primary text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  <Star className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
                <Button
                  variant={filterBy === "downloaded" ? "default" : "outline"}
                  onClick={() => setFilterBy("downloaded")}
                  className={filterBy === "downloaded" 
                    ? "bg-gradient-primary text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Downloaded
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Resume Cards */}
          <div className="space-y-4">
            {filteredResumes.map((resume, index) => (
              <GlassCard 
                key={resume.id} 
                hover 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{resume.title}</h3>
                        {resume.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(resume.createdAt)}
                        </span>
                        <span>Company: {resume.company}</span>
                        <Badge 
                          variant="outline" 
                          className={`${getScoreColor(resume.matchScore)} border`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {resume.matchScore}% match
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resume.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex}
                            variant="outline"
                            className="bg-white/10 text-white/80 border-white/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewResume(resume)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Empty State */}
          {filteredResumes.length === 0 && (
            <GlassCard className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No resumes found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm 
                  ? `No resumes match "${searchTerm}"`
                  : "You haven't created any tailored resumes yet"
                }
              </p>
              <Button
                onClick={onBack}
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                Create Your First Resume
              </Button>
            </GlassCard>
          )}

          {/* Stats Footer */}
          {filteredResumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <GlassCard className="text-center animate-fade-in">
                <div className="text-3xl font-bold text-white">{resumeHistory.length}</div>
                <div className="text-white/70 text-sm">Total Resumes</div>
              </GlassCard>
              
              <GlassCard className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl font-bold text-white">
                  {Math.round(resumeHistory.reduce((acc, r) => acc + r.matchScore, 0) / resumeHistory.length)}%
                </div>
                <div className="text-white/70 text-sm">Avg Match Score</div>
              </GlassCard>
              
              <GlassCard className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-white">
                  {resumeHistory.filter(r => r.status === "downloaded").length}
                </div>
                <div className="text-white/70 text-sm">Downloads</div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};