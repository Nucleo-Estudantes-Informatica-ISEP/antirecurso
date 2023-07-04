import ChangelogVersion from '@/components/ChangelogVersion';
import Link from 'next/link';

const Changelog: React.FC = () => {
  return (
    <section className="w-full text-sm md:text-md px-5 md:px-24 md:pb-24 pb-48 mt-5">
      <ChangelogVersion
        title="v1.3.3 🛠️"
        date={new Date(2023, 5, 7)}
        updates={[
          'Correção da paginação de exames no perfil (finalmente)',
          'Correção da contagem de exames reprovados nas estatísticas',
          <span key="1.3.3-new-questions">
            Adição de +30 perguntas de SCOMP (Obrigado{' '}
            <Link
              className="underline text-primary"
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/brunaccosta03/">
              Bruna Costa
            </Link>
            )
          </span>
        ]}
      />
      <ChangelogVersion
        title="v1.3.2 🛠️"
        date={new Date(2023, 5, 7)}
        updates={[
          'Adição da página de changelog',
          'Adição da política de cookies',
          'Criação de um email de support e submissão de resoluções de exames, disponível na página de sobre',
          'Correção de erro com o tempo de invalidação de cache das imagens dos avatares dos utilizadores'
        ]}
      />
      <ChangelogVersion
        title="v1.3.1 Dark Mode 🌙"
        date={new Date(2023, 6, 3)}
        updates={[
          'Adição do modo escuro',
          'Link para alteração do avatar na página de perfil',
          'Correção visual da paginação dos exames na página do perfil (um erro que ocorria principalmente em dispositivos com resolução reduzida)',
          'Adição de calculadora para determinar a nota necessária para atingir uma nota final desejada na UC'
        ]}>
        Adição de um modo escuro para melhorar o conforto visual dos utilizadores.
      </ChangelogVersion>
      <ChangelogVersion
        title="v1.3.0 Revamp Visual 🔥"
        date={new Date(2023, 6, 2)}
        updates={[
          'Alteração visual do leaderboard',
          'Destaque nos primeiros lugares do leaderboard',
          'Adição de animações na leaderboard',
          <span key="1.3.0-gravitar-option">
            Suporte a avatar com{' '}
            <Link
              className="underline"
              href="https://en.gravatar.com/"
              target="_blank"
              rel="noreferrer">
              Gravitar
            </Link>
          </span>
        ]}>
        Mudança visual em várias secções do website.
      </ChangelogVersion>
      <ChangelogVersion
        title="v1.2.1 🛠️"
        date={new Date(2023, 5, 26)}
        updates={[
          'Correção da contagem de perguntas erradas e novas',
          'Correção do algoritmo de geração de exames com perguntas novas'
        ]}
      />
      <ChangelogVersion
        title="v1.2.0 Estatísticas 📊"
        date={new Date(2023, 5, 26)}
        updates={[
          'Adição de estatísticas de utilizador para cada cadeira',
          'Modo Perguntas Erradas',
          'Modo Perguntas Novas',
          'Calculadora de média na página de estatísticas',
          'Bloqueio de exames de certos modos (realista, novas e erradas) a utilizadores sem conta'
        ]}>
        Adição de novas funcionalidades como a calculadora de média e a possibilidade de ver as
        estatísticas de cada cadeira.
      </ChangelogVersion>
      <ChangelogVersion
        title="v1.1.1 🛠️"
        date={new Date(2023, 5, 25)}
        updates={[
          'Correção do cálculo da nota dos exames realistas',
          'Alteração da fórmula de cálculo da pontuação do scoreboard',
          'Aumento da quantidade de lugares visíveis na leaderboard para 30',
          'Mudança de critérios de entrada na leaderboard: mínimo 3 exames',
          'Mudança de critério de desempate na leaderboard: quantidade de exames resolvidos'
        ]}
      />
      <ChangelogVersion
        title="v1.1.0 Modo Realista 📝"
        date={new Date(2023, 5, 24)}
        updates={[
          'Adição de tipos de exame',
          'Adição do modo realista',
          'Correção de erro com o token de sessão',
          'Suporte a Logout',
          'Correção dos erros com a navegação por teclado no exame'
        ]}>
        Adição dos modos de exame para ser possível explorar novas combinações de perguntas
      </ChangelogVersion>
      <ChangelogVersion
        title="v1.0.0 Primeira Release 🎉"
        date={new Date(2023, 5, 21)}
        updates={[
          'Perguntas adicionadas a 7 cadeiras',
          <span key="1.0.0-option-rcomp">
            +600 perguntas de <span className="text-primary">RCOMP</span>
          </span>,
          'Histórico de exames no perfil do utilizador',
          'Melhorias de performance',
          'Melhorias de design'
        ]}>
        A primeira release para uso geral da plataforma foi lançada!
        <br />
        Todos os alunos podem criar conta e aceder aos quizes disponíveis.
      </ChangelogVersion>
      <ChangelogVersion
        title="v0.1.0 Primeira alpha 🚧"
        date={new Date(2023, 0, 7)}
        updates={[
          'Sistema de autenticação',
          'Perfil de utilizador',
          'Sistema de perguntas e respostas simples',
          'Scoreboard',
          <span key="0.1.0-option-prcmp">
            +60 perguntas de <span className="text-primary">PRCMP</span>
          </span>
        ]}>
        A primeira versão <i>alpha</i> do site foi tornada pública! <br />
        <br />
        Nesta versão apenas alguns utilizadores selecionados podem aceder ao site. <br />
      </ChangelogVersion>
    </section>
  );
};

export default Changelog;
