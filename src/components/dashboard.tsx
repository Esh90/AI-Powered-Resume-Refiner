import { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Download,
  Plus,
  ArrowRight,
  Zap,
  Target,
  Award,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";

interface DashboardProps {
  onStartTailoring: () => void;
  onViewHistory: () => void;
}

export const Dashboard = ({ onStartTailoring, onViewHistory }: DashboardProps) => {
  const { user, signOut } = useAuth();
  const { resumes, loading } = useResumes();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const totalResumes = resumes.length;
  const averageScore = resumes.length > 0 
    ? Math.round(resumes.reduce((sum, resume) => sum + resume.match_score, 0) / resumes.length)
    : 0;
  const downloadsCount = resumes.filter(resume => resume.is_downloaded).length;
  const recentResumesList = resumes.slice(0, 3);

  const stats = [
    { label: "Resumes Tailored", value: totalResumes.toString(), icon: FileText, trend: "+12%" },
    { label: "Average Score", value: `${averageScore}%`, icon: TrendingUp, trend: "+8%" },
    { label: "Time Saved", value: "18h", icon: Clock, trend: "+3h" },
    { label: "Downloads", value: downloadsCount.toString(), icon: Download, trend: "+23" },
  ];

  return (
    <div className="min-h-screen h-screen bg-gradient-hero animate-gradient">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 h-full p-4 flex flex-col">
        {/* Header */}
        <div className="w-full mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <h1 className="text-5xl font-bold text-white mb-3">
                Welcome back{user?.email && `, ${user.email.split('@')[0]}`}! 👋
              </h1>
              <p className="text-white/70 text-2xl">
                Ready to craft your next perfect resume?
              </p>
            </div>
            
            <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button
                variant="outline"
                onClick={onViewHistory}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-2xl"
              >
                <Clock className="w-6 h-6 mr-2" />
                History
              </Button>
              <Button
                onClick={onStartTailoring}
                className="bg-gradient-primary hover:opacity-90 text-white font-semibold group shadow-glow text-2xl"
              >
                <Plus className="w-6 h-6 mr-2" />
                New Resume
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-2xl"
              >
                <LogOut className="w-6 h-6 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto flex-1 flex flex-col space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <GlassCard 
                key={stat.label} 
                hover
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xl font-medium">{stat.label}</p>
                    <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
                    <p className="text-green-400 text-lg mt-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.trend}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Quick Actions */}
            <div className="lg:col-span-2 flex flex-col space-y-10 h-full">
              <GlassCard className="animate-slide-up h-1/2" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <Zap className="w-8 h-8 mr-2 text-primary" />
                  Quick Actions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <div
                    className="group cursor-pointer p-6 rounded h-3/4 bg-gradient-primary/10 border border-primary/20 hover:bg-gradient-primary/20 transition-all duration-300"
                    onClick={onStartTailoring}
                    onMouseEnter={() => setHoveredCard('tailor')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <ArrowRight className={`w-6 h-6 text-primary transition-transform ${hoveredCard === 'tailor' ? 'translate-x-1' : ''}`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Tailor Resume</h3>
                    <p className="text-white/70 text-lg">Match your resume to any job description with AI precision</p>
                  </div>
                  
                  <div
                    className="group cursor-pointer p-6 rounded-xl bg-gradient-secondary/10 border border-secondary/20 hover:bg-gradient-secondary/20 transition-all duration-300"
                    onClick={onViewHistory}
                    onMouseEnter={() => setHoveredCard('history')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-6 h-6 text-secondary" />
                      </div>
                      <ArrowRight className={`w-6 h-6 text-secondary transition-transform ${hoveredCard === 'history' ? 'translate-x-1' : ''}`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">View History</h3>
                    <p className="text-white/70 text-lg">Access all your previously tailored resumes</p>
                  </div>
                </div>
              </GlassCard>

              {/* AI Insights */}
              <GlassCard className="animate-slide-up h-full" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <Sparkles className="w-8 h-10 mr-2 text-accent" />
                  AI Insights
                </h2>
                
                <div className="space-y-8 h-full">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 h-1/3">
                    <p className="text-white font-medium mb-2 text-xl">💡 Trending Skills</p>
                    <p className="text-white/70 text-lg">Add "React 18", "TypeScript", and "Cloud Architecture" to boost your profile for tech roles.</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 h-1/3">
                    <p className="text-white font-medium mb-2 text-xl">🎯 Optimization Tip</p>
                    <p className="text-white/70 text-lg">Your last resume scored 94% match. Try emphasizing leadership experience for management roles.</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col h-full space-y-4">
              <GlassCard className="animate-slide-up flex-1 flex flex-col h-full" style={{ animationDelay: '0.5s' }}>
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Recent Activity
                </h2>
                
                <div className="space-y-3 flex-1 overflow-auto">
                  {loading ? (
                    <div className="text-white/70 text-center py-4">Loading...</div>
                  ) : recentResumesList.length > 0 ? (
                    recentResumesList.map((resume, index) => (
                      <div key={resume.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-xl">{resume.title} - {resume.company}</p>
                            <p className="text-white/50 text-lg">{new Date(resume.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${
                          resume.match_score >= 90 ? 'text-green-400' : 
                          resume.match_score >= 80 ? 'text-blue-400' : 
                          'text-purple-400'
                        }`}>
                          {resume.match_score}%
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/70 text-center py-8 text-3xl">
                      No resumes yet. Start by tailoring your first resume!
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-white/5 border-white/20 text-white text-3xl hover:bg-white/10"
                  onClick={onViewHistory}
                >
                  View All
                </Button>
              </GlassCard>

              {/* Pro Tip */}
              <GlassCard className="animate-slide-up h-1/3" style={{ animationDelay: '0.6s' }}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-semibold text-white mb-2">Pro Tip</h3>
                  <p className="text-white/70 text-xl mb-4">
                    Tailor your resume for each application to increase your chances by 3x!
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-secondary hover:opacity-90 text-white"
                    onClick={onStartTailoring}
                  >
                    <h3 className="text-4xl font-semibold text-white mb-2">Start Now</h3>
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
    </div>
  );
};