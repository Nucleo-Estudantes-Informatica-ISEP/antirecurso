import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    title: 'O que são cookies?',
    body: 'Cookies são pequenos ficheiros de texto armazenados no teu dispositivo quando visitas um website. São amplamente utilizados para tornar o website mais eficiente e melhorar a tua experiência.'
  },
  {
    title: 'Quais cookies utilizamos?',
    body: (
      <>
        <p>Geralmente existem três categorias de cookies:</p>
        <ul className="mt-3 space-y-2 list-disc list-inside">
          <li>
            <span className="font-semibold">Essenciais:</span> necessários para o funcionamento
            adequado do website (ex: autenticação).
          </li>
          <li>
            <span className="font-semibold">Desempenho e análise:</span> recolhem informação sobre
            como os visitantes usam o website e ajudam a melhorar o desempenho.
          </li>
          <li>
            <span className="font-semibold">Personalização:</span> lembram as tuas preferências e
            fornecem conteúdo personalizado.
          </li>
        </ul>
        <p className="mt-3">
          O AntiRecurso utiliza apenas cookies essenciais para garantir o seu funcionamento
          adequado.
        </p>
      </>
    )
  },
  {
    title: 'Como controlar os cookies?',
    body: 'Podes controlar ou limpar os cookies a qualquer momento e configurar o teu browser para os bloquear. Desativá-los pode afetar a funcionalidade da plataforma.'
  },
  {
    title: 'Alterações nesta política',
    body: 'Podemos atualizar esta política periodicamente para refletir alterações na forma como utilizamos cookies. Recomendamos que a revises regularmente.'
  },
  {
    title: 'Contacta-nos',
    body: (
      <>
        Se tiveres alguma dúvida sobre esta política, fala connosco em{' '}
        <a className="text-primary font-medium hover:underline" href="mailto:info@nei-isep.org">
          info@nei-isep.org
        </a>
        .
      </>
    )
  }
];

const CookiePolicy: React.FC = () => {
  return (
    <section className="container py-10 md:py-14 w-full max-w-3xl">
      <div className="mb-10">
        <Badge variant="soft" className="mb-3">
          Cookies
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Política de <span className="gradient-text">Cookies</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Como utilizamos cookies em <span className="text-primary">antirecurso.nei-isep.org</span>.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            Esta política explica como o website antirecurso.nei-isep.org utiliza cookies e
            tecnologias similares para recolher e armazenar informação quando o visitas. Ao
            continuares a usá-lo, concordas com o uso de cookies de acordo com esta política.
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
