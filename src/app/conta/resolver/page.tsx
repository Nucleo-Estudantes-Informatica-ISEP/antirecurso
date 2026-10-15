'use client';

import { useLanguage, useMessages } from '@/i18n/client';

import { useState } from 'react';
import { AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import swal from 'sweetalert';
import useSession from '@/hooks/useSession';
import { apiRequest } from '@/services/apiClient';

const Resolver: React.FC = () => {
  const t = useMessages();
  const lang = useLanguage();

  const { user } = useSession();
  const [loading, setLoading] = useState(false);

  const handleResolve = async (action: 'keep' | 'discard') => {
    if (loading) return;
    setLoading(true);

    const confirmed = await swal({
      title: action === 'discard' ? t('copy.are_you_sure') : t('copy.link_account'),
      text:
        action === 'discard'
          ? t(
              'copy.this_action_cannot_be_undone_all_your_data_exams_scores_and_reports_will_be_permanent'
            )
          : t(
              'copy.we_will_link_this_account_to_the_existing_email_address_your_data_will_be_kept'
            ),
      icon: action === 'discard' ? 'warning' : 'info',
      buttons: [t('copy.cancel'), t('copy.confirm')],
      className: document.documentElement.classList.contains('dark') ? 'swal-dark' : ''
    });

    if (!confirmed) {
      setLoading(false);
      return;
    }

    try {
      await apiRequest('user/account-resolution', {
        authenticated: true,
        method: 'POST',
        json: { action }
      });
      await swal({
        title: t('copy.success'),
        text:
          action === 'discard'
            ? t('copy.your_old_data_was_deleted_your_account_has_been_recreated_from_scratch')
            : t('copy.your_account_was_linked_successfully'),
        icon: 'success',
        buttons: [t('copy.close')],
        className: document.documentElement.classList.contains('dark') ? 'swal-dark' : ''
      });
      window.location.href = `/${lang}`;
    } catch {
      await swal({
        title: t('copy.error_2'),
        text: t('copy.could_not_resolve_the_account_please_try_again'),
        icon: 'error',
        buttons: [t('copy.close')],
        className: document.documentElement.classList.contains('dark') ? 'swal-dark' : ''
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
            <h2 className="text-xl font-bold">{t('copy.no_pending_account_issues')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('copy.your_account_does_not_need_to_be_linked')}
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
          <CardTitle className="text-2xl">{t('copy.resolve_account_linking')}</CardTitle>
          <CardDescription>
            {t('copy.the_email_address')}{' '}
            <span className="font-mono font-bold text-foreground">{summary?.email}</span>{' '}
            {t('copy.already_exists_in_our_database_with_associated_data_and_exams')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="size-4" />
              <span>{t('copy.warning_this_action_cannot_be_undone')}</span>
            </div>
            <p className="text-sm text-destructive/90">
              {t(
                'copy.if_you_discard_your_old_data_all_previous_exams_scores_and_reports_will_be_permanentl'
              )}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/50 p-4">
            <p className="text-sm font-semibold mb-2">{t('copy.existing_account_summary')}</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                {t('copy.completed_exams')} {summary?.answers ?? 0}
              </li>
              <li>
                {t('copy.recorded_scores')} {summary?.scores ?? 0}
              </li>
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
              {t('copy.keep_old_data')}
            </Button>
            <Button
              onClick={() => handleResolve('discard')}
              disabled={loading}
              className="flex-1"
              variant="destructive"
            >
              <Trash2 className="mr-2 size-4" />
              {t('copy.discard_old_data')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Resolver;
