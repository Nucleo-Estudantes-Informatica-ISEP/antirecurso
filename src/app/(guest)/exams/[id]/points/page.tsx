'use client';

import { useContext, useEffect, useState } from 'react';

import Link from 'next/link';

import ScoreIndicator from '@/components/profile/ScoreIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { ArrowRight, Clock, PartyPopper, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { ExamContext } from 'src/contexts/ExamContext';
import { BASE_URL, PROTECTED_API_BASE_URL } from '@/services/api';
import swal from 'sweetalert';

const Points: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const [fire, setFire] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const { examResult, setExamResult, examTime } = useContext(ExamContext);

  const { theme } = useTheme();

  useEffect(() => {
    async function fetchExamResult() {
      if (examResult) return;
      setLoading(true);
      setFetchError(false);

      try {
        const isAuthenticated = Boolean(session?.token);
        const apiBase = isAuthenticated ? PROTECTED_API_BASE_URL : BASE_URL;
        const res = await fetch(`${apiBase}/exams/${router.query.id}/review`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(isAuthenticated && session.token
              ? { Authorization: `Bearer ${session.token}` }
              : {}),
          },
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setExamResult({
            id: data.id,
            score: data.score,
            passed: data.score >= 50,
            subject: data.subject,
          });
        } else {
          setFetchError(true);
        }
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExamResult();
  }, [examResult, setExamResult, session?.token, router.query.id]);

  function handleReview() {
    if (!examResult) {
      swal({
        title: 'Erro',
        text: 'Não foi possível obter o resultado do exame.',
        icon: 'error',
        className: theme === 'dark' ? 'swal-dark' : '',
      });
      router.push('/');
      return;
    }
    router.push('/exams/' + examResult.id + '/review');
  }

  if (loading) {
    return (
      <section className="container max-w-3xl py-10 md:py-16 w-full">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
          <CardContent className="relative p-6 md:p-10 flex flex-col items-center text-center">
            <p className="text-muted-foreground">A carregar resultado...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (fetchError || !examResult) {
    swal({
      title: 'Erro',
      text: 'Não foi possível obter o resultado do exame.',
      icon: 'error',
      className: theme === 'dark' ? 'swal-dark' : '',
    });
    router.push('/');
    return null;
  }

  const minutes = Math.floor(examTime / 60);
  const seconds = examTime % 60;

  return (
    <section className="container max-w-3xl py-10 md:py-16 w-full">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-6 md:p-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-4">
            {examResult.passed ? (
              <PartyPopper className="size-7" />
            ) : (
              <Sparkles className="size-7" />
            )}
          </div>

          <p className="text-sm text-muted-foreground">Exame de</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 capitalize">
            {examResult.subject}
          </h1>

          <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            Demoraste{' '}
            <span className="text-primary font-semibold">
              {minutes ? `${minutes}m ` : ''}
              {seconds}s
            </span>
          </div>

          <div className="mt-6 md:mt-8">
            <ScoreIndicator score={examResult.score} />
          </div>

          <div className="mt-8 max-w-md">
            {examResult.passed ? (
              <>
                <p className="text-xl md:text-2xl font-semibold">
                  <span className="gradient-text">Parabéns!</span> Passaste no exame!
                </p>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  Continua com o teu excelente trabalho! Podes verificar a tua evolução no teu{' '}
                  <Link className="underline text-primary" href="/profile">
                    perfil
                  </Link>
                  .
                </p>
                <ReactCanvasConfetti
                  particleCount={150}
                  fire={fire}
                  origin={{ y: 0.9 }}
                  className="fixed inset-0 z-20 pointer-events-none"
                />
              </>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-semibold">
                  <span className="text-primary">Ohhh...</span> reprovaste no exame
                </p>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  Os professores bem avisaram que as teóricas eram importantes... Continua a
                  estudar e a resolver exames para melhorares. Vê a tua evolução no teu{' '}
                  <Link className="underline text-primary" href="/profile">
                    perfil
                  </Link>
                  .
                </p>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={handleReview} size="lg" className="w-full sm:w-auto">
              Verificar respostas
              <ArrowRight className="size-4" />
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/exams">Outro exame</Link>
            </Button>
          </div>

          {!session.user && (
            <p className="mt-4 text-xs text-muted-foreground">
              Cria uma conta para guardar o teu progresso{' '}
              <Link className="underline text-primary" href="/register">
                aqui
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Points;
