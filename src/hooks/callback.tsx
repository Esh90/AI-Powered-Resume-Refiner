// pages/auth/callback.tsx
'use client';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleRedirect = async () => {
      await supabase.auth.getSession()
      navigate('/dashboard') // or your logged-in page
    }

    handleRedirect()
  }, [navigate])

  return <p>Signing you in...</p>
}
