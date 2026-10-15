import { getMessages } from '@/i18n/server';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { History, Info, Mail, ShieldCheck } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from '@/i18n/navigation';

const About: React.FC = async () => {
  const t = await getMessages();

  const links = [
    {
      icon: FaGithub,
      title: t('copy.git_repository'),
      description: t('copy.antirecurso_is_open_source_on_nei_isep_s_github'),
      href: 'https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso',
      external: true,
      label: t('copy.open_on_github')
    },
    {
      icon: History,
      title: t('copy.versions'),
      description: t('copy.see_the_latest_updates_and_improvements'),
      href: '/changelog',
      label: t('copy.view_changelog')
    },
    {
      icon: ShieldCheck,
      title: t('copy.privacy_policy'),
      description: t('copy.how_we_process_and_protect_your_data'),
      href: '/privacy-policy',
      label: t('copy.read_policy')
    },
    {
      icon: Info,
      title: t('copy.cookie_policy'),
      description: t('copy.how_we_use_cookies_to_run_the_platform'),
      href: '/cookie-policy',
      label: t('copy.read_policy')
    }
  ];

  return (
    <section className="container py-10 md:py-14 w-full max-w-4xl">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          {t('nav.about')}
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          {t('copy.about')} <span className="gradient-text">AntiRecurso</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t(
            'copy.a_platform_developed_by_the_isep_computer_science_students_association_built_by_stude'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {links.map(({ icon: Icon, title, description, href, external, label }) => {
          const Anchor = external ? 'a' : Link;
          const extraProps = external ? { target: '_blank', rel: 'noreferrer' } : {};

          return (
            <Anchor key={title} href={href} {...extraProps} className="group">
              <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold leading-tight">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    <p className="mt-3 text-xs font-medium text-primary inline-flex items-center gap-1">
                      {label} →
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Anchor>
          );
        })}
      </div>

      {/* Contact card */}
      <Card className="relative mt-10 md:mt-12 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <CardContent className="relative p-6 md:p-10 flex flex-col items-center text-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">
              {t('copy.found_an')} <span className="text-primary">{t('copy.error')}</span>{' '}
              {t('copy.or_want_to_share_a_solution')}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t('copy.we_are_an_email_away_tell_us_how_you_can_help_improve_the_platform')}
            </p>
          </div>
          <a
            href="mailto:support.antirecurso@nei-isep.org"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:underline"
          >
            support.antirecurso@nei-isep.org
          </a>
        </CardContent>
      </Card>
    </section>
  );
};

export default About;
