import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

export interface Resume {
  id: string;
  title: string;
  company: string;
  job_description: string;
  original_resume: string;
  tailored_resume: string;
  match_score: number;
  skills: string[];
  suggestions: string[];
  is_favorite: boolean;
  is_downloaded: boolean;
  created_at: string;
  updated_at: string;
}

export const useResumes = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching resumes",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResumes(data || []);
    }
    
    setLoading(false);
  };

  const createResume = async (resumeData: Omit<Resume, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('resumes')
      .insert([{
        ...resumeData,
        user_id: user.id,
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating resume",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Resume created successfully",
      description: "Your tailored resume has been saved.",
    });

    // Refresh the resumes list
    fetchResumes();
    
    return data;
  };

  const updateResume = async (id: string, updates: Partial<Resume>) => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating resume",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Update local state
    setResumes(prev => prev.map(resume => 
      resume.id === id ? { ...resume, ...updates } : resume
    ));
    
    return data;
  };

  const deleteResume = async (id: string) => {
    if (!user) return false;
    
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting resume",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Resume deleted",
      description: "The resume has been removed successfully.",
    });

    // Remove from local state
    setResumes(prev => prev.filter(resume => resume.id !== id));
    
    return true;
  };

  const toggleFavorite = async (id: string) => {
    const resume = resumes.find(r => r.id === id);
    if (!resume) return;
    
    return updateResume(id, { is_favorite: !resume.is_favorite });
  };

  const markAsDownloaded = async (id: string) => {
    return updateResume(id, { is_downloaded: true });
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      setResumes([]);
    }
  }, [user]);

  return {
    resumes,
    loading,
    createResume,
    updateResume,
    deleteResume,
    toggleFavorite,
    markAsDownloaded,
    refetch: fetchResumes,
  };
};