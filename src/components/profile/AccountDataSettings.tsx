'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { useLanguage, useMessages } from '@/i18n/client';
import { localizedPath } from '@/i18n/translations';
import { signOutFromApp } from '@/lib/client-auth-actions';
import { apiRequest } from '@/services/apiClient';
import swal from 'sweetalert';

export default function AccountDataSettings() {
  const { user, clear } = useSession();
  const lang = useLanguage();
  const t = useMessages();
  const [working, setWorking] = useState(false);
  if (!user || user.requires_account_resolution) return null;

  async function deleteData() {
    setWorking(true);
    try {
      const confirmed = await swal({
        title: t('auth.deleteAppData'),
        text: t('auth.deleteAppDataWarning'),
        icon: 'warning',
        buttons: [t('copy.cancel'), t('auth.deleteAppData')],
        dangerMode: true
      });
      if (!confirmed) return;
      await apiRequest('user', {
        method: 'DELETE',
        authenticated: true,
        json: { confirmation: 'DELETE_ANTIRECURSO_DATA' }
      });
      clear();
      await signOutFromApp(localizedPath('/', lang));
    } catch {
      await swal({ title: t('auth.error'), icon: 'error' });
    } finally {
      setWorking(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-3 p-6">
        <h2 className="text-lg font-semibold">{t('auth.appData')}</h2>
        <Button variant="destructive" onClick={deleteData} disabled={working}>
          {t('auth.deleteAppData')}
        </Button>
      </CardContent>
    </Card>
  );
}
