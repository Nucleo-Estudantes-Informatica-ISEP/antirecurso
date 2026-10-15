import { getMessages } from '@/i18n/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy: React.FC = async () => {
  const t = await getMessages();

  const sections = [
    {
      title: t('copy.what_are_cookies'),
      body: t(
        'copy.cookies_are_small_text_files_stored_on_your_device_when_you_visit_a_website_they_are_'
      )
    },
    {
      title: t('copy.which_cookies_do_we_use'),
      body: (
        <>
          <p>{t('copy.there_are_generally_three_categories_of_cookies')}</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>
              <span className="font-semibold">{t('copy.essential')}</span>{' '}
              {t('copy.necessary_for_the_website_to_work_correctly_for_example_authentication')}
            </li>
            <li>
              <span className="font-semibold">{t('copy.performance_and_analytics')}</span>{' '}
              {t(
                'copy.collect_information_about_how_visitors_use_the_website_and_help_improve_performance'
              )}
            </li>
            <li>
              <span className="font-semibold">{t('copy.personalization')}</span>{' '}
              {t('copy.remember_your_preferences_and_provide_personalized_content')}
            </li>
          </ul>
          <p className="mt-3">
            {t('copy.antirecurso_only_uses_essential_cookies_to_ensure_it_works_correctly')}
          </p>
        </>
      )
    },
    {
      title: t('copy.how_can_you_control_cookies'),
      body: t(
        'copy.you_can_manage_or_clear_cookies_at_any_time_and_configure_your_browser_to_block_them_'
      )
    },
    {
      title: t('copy.changes_to_this_policy'),
      body: t(
        'copy.we_may_update_this_policy_periodically_to_reflect_changes_in_how_we_use_cookies_we_re'
      )
    },
    {
      title: t('common.contact'),
      body: (
        <>
          {t('copy.if_you_have_any_questions_about_this_policy_contact_us_at')}{' '}
          <a className="text-primary font-medium hover:underline" href="mailto:info@nei-isep.org">
            info@nei-isep.org
          </a>
          .
        </>
      )
    }
  ];

  return (
    <section className="container py-10 md:py-14 w-full max-w-3xl">
      <div className="mb-10">
        <Badge variant="soft" className="mb-3">
          {t('copy.cookies')}
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          <span className="gradient-text">{t('policy.cookiesTitle')}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t('copy.how_we_use_cookies_on')}{' '}
          <span className="text-primary">antirecurso.nei-isep.org</span>.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            {t(
              'copy.this_policy_explains_how_antirecurso_nei_isep_org_uses_cookies_and_similar_technologi'
            )}
          </p>
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="font-bold text-primary text-lg mb-2">{section.title}</h2>
              <div className="text-foreground/90">{section.body}</div>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default CookiePolicy;
