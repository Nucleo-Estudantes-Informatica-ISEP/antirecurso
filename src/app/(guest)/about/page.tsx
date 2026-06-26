import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Github, History, Info, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const links = [
  {
    icon: Github,
    title: 'Repositório Git',
    description: 'AntiRecurso é open-source no GitHub do NEI-ISEP',
    href: 'https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso',
    external: true,
    label: 'Abrir no GitHub'
  },
  {
    icon: History,
    title: 'Versões',
    description: 'Vê todas as novidades e melhorias mais recentes',
    href: '/changelog',
    label: 'Ver changelog'
  },
  {
    icon: ShieldCheck,
    title: 'Política de privacidade',
    description: 'Como tratamos e protegemos os teus dados',
    href: '/privacy-policy',
    label: 'Ler política'
  },
  {
    icon: Info,
    title: 'Política de cookies',
    description: 'Como usamos cookies para a plataforma funcionar',
    href: '/cookie-policy',
    label: 'Ler política'
  }
];

const About: React.FC = () => {
  return (
    <section className="container py-10 md:py-14 w-full max-w-4xl">
      <div className="flex flex-col items-center text-center mb-10">
        <Badge variant="soft" className="mb-3">
          Sobre
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Sobre o <span className="gradient-text">AntiRecurso</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Uma plataforma desenvolvida pelo Núcleo de Estudantes de Informática do ISEP, feita por
          estudantes para estudantes.
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
              Encontraste algum <span className="text-primary">erro</span> ou queres enviar uma
              resolução?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Estamos à distância de um email. Conta-nos como podes ajudar a melhorar a
              plataforma.
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
