import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="container py-10 md:py-14 w-full max-w-3xl">
      <div className="mb-10">
        <Badge variant="soft" className="mb-3">
          Privacidade
        </Badge>
        <h1 className="text-balance text-3xl md:text-4xl font-bold tracking-tight">
          Política de <span className="gradient-text">Privacidade</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Em vigor a partir de 20 de junho de 2023.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed">
          <article>
            <h2 className="font-bold text-primary text-lg mb-2">
              Aplicação do Regulamento Geral sobre a Proteção de Dados
            </h2>
            <p>
              Para compreenderes que informações são recolhidas e como são utilizadas, o Núcleo de
              Estudantes de Informática do Instituto Superior de Engenharia do Porto (NEI-ISEP)
              aconselha que leias esta Política de Privacidade. O AntiRecurso respeita a tua
              privacidade e cumpre a legislação em vigor, nomeadamente o Regulamento (UE) 2016/679
              do Parlamento Europeu e do Conselho. O AntiRecurso ajuda os alunos do DEI-ISEP a
              estudarem de forma mais simples e eficaz.
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Responsável pelo tratamento</h2>
            <p>
              O NEI-ISEP é a organização responsável pelo tratamento dos teus dados pessoais. Podes
              contactar-nos por{' '}
              <a
                className="text-primary font-medium hover:underline"
                href="mailto:info@nei-isep.org"
              >
                info@nei-isep.org
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Recolha de informações</h2>
            <p>
              Para usares a aplicação é necessário ter uma conta. Para isso precisamos do teu nome,
              palavra-passe e endereço de email. Todos os dados solicitados têm um fim específico e
              justificado, conforme a alínea c) do nº1 do Artigo 5° do RGPD.
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Direitos dos titulares dos dados</h2>
            <p>
              Tens o direito de aceder, retificar, portar, apagar, limitar e opor-te ao tratamento
              dos teus dados, bem como apresentar reclamação junto da CNPD (
              <a className="text-primary font-medium hover:underline" href="mailto:geral@cnpd.pt">
                geral@cnpd.pt
              </a>
              ). Para exercer os teus direitos contacta o nosso Encarregado da Proteção de Dados
              em{' '}
              <a
                className="text-primary font-medium hover:underline"
                href="mailto:info@nei-isep.org"
              >
                info@nei-isep.org
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Conservação das informações</h2>
            <p>
              Quando a tua conta for eliminada, o NEI-ISEP anonimiza as tuas informações pessoais,
              não sendo possível recuperar esse conteúdo mais tarde.
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Obrigações do utilizador</h2>
            <p>
              Ao usares o AntiRecurso, declaras que leste esta política de privacidade e concordas
              com todas as informações nela presentes.
            </p>
          </article>

          <article>
            <h2 className="font-bold text-primary text-lg mb-2">Outros termos</h2>
            <p>
              Os teus dados pessoais poderão ser comunicados a entidades públicas ou autoridades
              judiciais, se assim for obrigatório por lei ou para prevenir ou punir a prática de
              crimes.
            </p>
          </article>
        </CardContent>
      </Card>
    </section>
  );
};

export default PrivacyPolicy;
