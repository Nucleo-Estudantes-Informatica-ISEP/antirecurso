import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpenText,
  GraduationCap,
  LineChart,
  ListChecks,
  Sparkles,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: ListChecks,
    title: 'Simulações de exames',
    description:
      'Resolve exames das tuas cadeiras em vários modos: aleatório, realista, novas perguntas e mais.',
    href: '/exams'
  },
  {
    icon: BookOpenText,
    title: 'Resumos partilhados',
    description:
      'Acede a resumos preparados pelos teus colegas para te ajudarem a estudar para qualquer cadeira.',
    href: '/notes'
  },
  {
    icon: Trophy,
    title: 'Scoreboard competitivo',
    description:
      'Compete com os teus colegas e sobe nos rankings de cada cadeira do DEI-ISEP.',
    href: '/scoreboard'
  },
  {
    icon: LineChart,
    title: 'Estatísticas pessoais',
    description:
      'Acompanha a tua evolução pergunta a pergunta com gráficos e métricas detalhadas.',
    href: '/profile'
  }
];

const stats = [
  { value: '+25', label: 'Cadeiras DEI cobertas' },
  { value: '+3.500', label: 'Perguntas em base de dados' },
  { value: '+100k', label: 'Exames realizados' }
];

const Hero: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

        <div className="container relative flex flex-col items-center text-center pt-20 pb-24 md:pt-28 md:pb-32">
          <Badge variant="soft" className="mb-6 gap-1.5">
            <Sparkles className="size-3.5" />
            Uma iniciativa do NEI-ISEP • Instituto Superior de Engenharia do Porto
          </Badge>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl">
            Queres mesmo ir a{' '}
            <span className="gradient-text">recurso</span>?
            <br className="hidden md:block" /> Para quê, se tens o{' '}
            <span className="gradient-text">AntiRecurso</span>.
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button asChild size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
              <Link href="/exams">
                <GraduationCap className="size-5" />
                Resolver exames
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
              <Link href="/notes">
                <BookOpenText className="size-5" />
                Ver resumos
              </Link>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-12 w-full max-w-3xl">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-2 py-4 rounded-xl border bg-card/40 backdrop-blur-sm"
              >
                <p className="text-2xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4">
            Tudo o que precisas
          </Badge>
          <h2 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
            Estuda de forma <span className="gradient-text">mais inteligente</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Uma plataforma pensada ao detalhe para te tirar do recurso e levar-te a passar à
            primeira em todas as cadeiras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link key={title} href={href} className="group">
              <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:bg-accent/30">
                <CardContent className="p-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-6" />
                  </div>
                  <CardTitle className="text-lg mb-2">{title}</CardTitle>
                  <CardDescription className="leading-6">{description}</CardDescription>
                  <div className="mt-5 inline-flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Explorar
                    <ArrowRight className="ml-1.5 size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-brand-500 to-brand-700 px-6 py-12 md:px-14 md:py-16 text-center text-white shadow-xl shadow-primary/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="relative">
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-balance">
              Pronto para deixar o recurso para trás?
            </h3>
            <p className="mt-3 max-w-xl mx-auto text-white/80 text-balance">
              Cria a tua conta gratuita e começa a estudar com a comunidade do DEI-ISEP.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 shadow-md"
              >
                <Link href="/register">
                  Começar agora
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/about">Saber mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
