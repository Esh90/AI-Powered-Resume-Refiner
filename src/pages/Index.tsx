import { useState } from "react";
import { AuthPage } from "../components/auth-page";
import { Dashboard } from "../components/dashboard";
import { ResumeTailor } from "../components/resume-tailor";
import { ResultsPage } from "../components/results-page";
import { HistoryPage } from "../components/history-page";
import { useAuth } from "@/hooks/useAuth";

type AppState = "auth" | "dashboard" | "tailor" | "results" | "history";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>("dashboard");
  const [tailorResult, setTailorResult] = useState<any>(null);

  const handleAuth = () => {
    setCurrentState("dashboard");
  };

  const handleStartTailoring = () => {
    setCurrentState("tailor");
  };

  const handleTailorComplete = (result: any) => {
    setTailorResult(result);
    setCurrentState("results");
  };

  const handleViewHistory = () => {
    setCurrentState("history");
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
  };

  const handleViewResume = (resume: any) => {
    // In a real app, this would load the specific resume data
    console.log("Viewing resume:", resume);
  };

  const renderCurrentView = () => {
    // Show loading while checking auth
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-hero animate-gradient flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }

    // Show auth page if not authenticated
    if (!user) {
      return <AuthPage onAuth={handleAuth} />;
    }

    switch (currentState) {
      case "auth":
        return <AuthPage onAuth={handleAuth} />;
      
      case "dashboard":
        return (
          <Dashboard 
            onStartTailoring={handleStartTailoring}
            onViewHistory={handleViewHistory}
          />
        );
      
      case "tailor":
        return (
          <ResumeTailor 
            onBack={handleBackToDashboard}
            onComplete={handleTailorComplete}
          />
        );
      
      case "results":
        return (
          <ResultsPage 
            result={tailorResult}
            onBack={handleBackToDashboard}
            onNewTailor={handleStartTailoring}
          />
        );
      
      case "history":
        return (
          <HistoryPage 
            onBack={handleBackToDashboard}
            onViewResume={handleViewResume}
          />
        );
      
      default:
        return (
          <Dashboard 
            onStartTailoring={handleStartTailoring}
            onViewHistory={handleViewHistory}
          />
        );
    }
  };

  return renderCurrentView();
};

export default Index;
