'use client';

import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import swal from 'sweetalert';
import useSession from '@/hooks/useSession';

const Resolver: React.FC = () => {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);

  const handleResolve = async (action: 'keep' | 'discard') => {
    if (loading) return;
    setLoading(true);

    const confirmed = await swal({
      title: action === 'discard' ? 'Tens a certeza?' : 'Associar conta?',
      text:
        action === 'discard'
          ? 'Esta ação NÃO pode ser revertida. Todos os teus dados (exames, pontuações e relatórios) serão eliminados permanentemente.'
          : 'Vamos associar esta conta ao email existente. Os teus dados serão mantidos.',
      icon: action === 'discard' ? 'warning' : 'info',
      buttons: ['Cancelar', 'Confirmar'],
      className: document.documentElement.classList.contains('dark') ? 'swal-dark' : '',
    });

    if (!confirmed) {
      setLoading(false);
      return;
    }

    const res = await fetch('/api/backend/user/account-resolution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      await swal({
        title: 'Sucesso',
        text: action === 'discard'
          ? 'Os teus dados antigos foram eliminados. A tua conta foi recriada do zero.'
          : 'A tua conta foi associada com sucesso.',
        icon: 'success',
        buttons: ['Fechar'],
        className: document.documentElement.classList.contains('dark') ? 'swal-dark' : '',
      });
      window.location.href = '/';
    } else {
      await swal({
        title: 'Erro',
        text: 'Não foi possível resolver a conta. Tenta novamente.',
        icon: 'error',
        buttons: ['Fechar'],
        className: document.documentElement.classList.contains('dark') ? 'swal-dark' : '',
      });
    }

    setLoading(false);
  };

  if (!user?.requires_account_resolution) {
    return (
      <section className="container py-10 md:py-14 w-full max-w-2xl">
        <Card>
          <CardContent className="p-10 text-center">
            <ShieldCheck className="mx-auto size-12 text-primary mb-4" />
            <h2 className="text-xl font-bold">Conta sem pendentes</h2>
            <p className="text-muted-foreground mt-2">
              Não é necessário resolver a associação da conta.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const summary = user.account_summary;

  return (
    <section className="container py-10 md:py-14 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resolver associação da conta</CardTitle>
          <CardDescription>
            O email{' '}
            <span className="font-mono font-bold text-foreground">{summary?.email}</span>{' '}
            já existe na nossa base de dados com dados e exames associados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="size-4" />
              <span>Atenção: esta ação não pode ser revertida</span>
            </div>
            <p className="text-sm text-destructive/90">
              Se escolheres descartar os dados antigos, todos os teus exames, pontuações e
              relatórios anteriores serão eliminados permanentemente.
            </p>
          </div>

          <div className="rounded-xl border bg-muted/50 p-4">
            <p className="text-sm font-semibold mb-2">Resumo da conta existente:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Exames realizados: {summary?.answers ?? 0}</li>
              <li>• Pontuações registadas: {summary?.scores ?? 0}</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleResolve('keep')}
              disabled={loading}
              className="flex-1"
              variant="default"
            >
              <ShieldCheck className="mr-2 size-4" />
              Manter dados antigos
            </Button>
            <Button
              onClick={() => handleResolve('discard')}
              disabled={loading}
              className="flex-1"
              variant="destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Descartar dados antigos
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Resolver;
