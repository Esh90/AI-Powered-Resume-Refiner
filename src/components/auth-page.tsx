import { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sparkles, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const AuthPage = ({ onAuth }: { onAuth: () => void }) => {
  const { signInWithMagicLink, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await signInWithMagicLink(email);
    
    if (!error) {
      setIsEmailSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero animate-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Resume Tailor
          </h1>
          <p className="text-white/70 text-lg">
            Transform your resume with AI precision
          </p>
        </div>

        <GlassCard className="space-y-6">
          {!isEmailSent ? (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-white/70">
                  Enter your email to receive a magic link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-3 group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending Magic Link...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Send Magic Link
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Check Your Email
              </h2>
              <p className="text-white/70">
                We've sent a magic link to <br />
                <span className="text-primary font-medium">{email}</span>
              </p>
              <p className="text-white/50 text-sm">
                Redirecting you in a moment...
              </p>
            </div>
          )}
        </GlassCard>

        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            Trusted by 10,000+ professionals worldwide
          </p>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
    </div>
  );
};