import ChangelogVersion from '@/components/ChangelogVersion';
import Link from 'next/link';

const Changelog: React.FC = () => {
  return (
    <section className="w-full text-sm md:text-md px-5 md:px-24 md:pb-24 pb-48 mt-5">
      <ChangelogVersion
        title="v1.3.6 ⚙️"
        date={new Date(2024, 0, 8)}
        updates={[
          <span key="1.3.6-custon-mode">
            Adição do{' '}
            <span className="text-primary font-bold align-middle">modo personalizado</span> de
            exames. Neste modo podes definir o número de questões por exame e a penalização por cada
            pergunta que errares!
          </span>,
          'Novo sistema de display de score no final do exame',
          'Adicionado contagem de tempo de realização do exame',
          'Correção de margens em toda a plataforma',
          'Correção de questões de usabilidade no menu de autenticação em modo web',
          <span key="1.3.6-asist-questions">
            <span className="text-primary font-bold align-middle">Modo realista</span> dos exames de{' '}
            <span className="font-bold text-primary align-middle">ASIST</span> passa a ter 50
            perguntas.
          </span>,
          'Adição da política de privacidade e de cookies no menu de sobre',
          <span key="1.3.6-exam-mode">
            Adicionado o <span className="font-bold text-primary align-middle">modo do exame </span>
            na tabela de histórico no perfil (exames anteriores ao dia de hoje são marcados como
            <span className="text-primary italic"> default </span> por defeito). Eventualmente,
            vamos usar esta informação para criar scoreboards específicos para cada modo de exame.
          </span>,
          'Adicionado o chart com a distribuição de tipos de exame realizados na página de estatísticas',
          <span key="1.3.6-suggested-exam">
            Adicionado o <span className="font-bold text-primary align-middle">modo sugerido </span>
            na página de estatísticas. Este modo é calculado com base nas estatísticas dos teus
            últimos exames.
          </span>,
          'Adicionado o tempo de realização do exame na tabela de histórico no perfil',
          'Adicionado tempo médio de realização de exames na página de estatísticas',
          'Corrigido o problema de alinhamento do nº das questões ao realizar um exame não ser exibida corretamente em exames com mais de 15 perguntas',
          'Adicionados scoreboards para cada modo de exame',
          'Adicionada animação ao indicador de score de exame',
          'Adicionado indicador de score com a média na página de estatísticas',
          <span key="1.3.6-notes">
            Adicionado página de{' '}
            <span className="align-middle font-bold text-primary">resumos</span>. (Coming soon) 👀
          </span>
        ]}
      />
      <ChangelogVersion
        title="v1.3.5 🤯"
        date={new Date(2024, 0, 6)}
        updates={[
          <span key="1.3.5-hard-mode">
            Adição do <span className="text-primary font-bold align-middle">modo difícil</span> de
            exames. Neste modo estão presentes as perguntas mais erradas por todos os utilizadores
            da plataforma.
          </span>,
          'Correção de um erro no cálculo do score dos exames realistas',
          <span key="1.3.5-shuffle">
            Adicionado <span className="italic">shuffle</span> extra das perguntas nos exames do
            modo <span className="font-bold text-primary">respostas erradas</span>
          </span>
        ]}
      />
      <ChangelogVersion
        title="v1.3.4 🆕"
        date={new Date(2024, 0, 5)}
        updates={[
          <span className="align-middle" key="1.3.4-arqcp-questions">
            <span className="font-bold">+242</span> de{' '}
            <span className="text-primary font-bold align-middle">ARQCP</span> (Obrigado{' '}
            <Link
              className="underline text-primary"
              target="_blank"
              rel="noreferrer"
              href="https://portal.isep.ipp.pt/intranet/areapessoal/docente.aspx?codeuser=18517">
              Prof. Paulo Baltarejo De Sousa
            </Link>{' '}
            e{' '}
            <Link
              className="underline text-primary"
              target="_blank"
              rel="noreferrer"
              href="https://portal.isep.ipp.pt/intranet/areapessoal/docente.aspx?codeuser=6522">
              Prof. Luís Nogueira
            </Link>
            )
          </span>,
          <span className="align-middle" key="1.3.4-prcmp-questions">
            <span className="font-bold">+63</span> perguntas de{' '}
            <span className="text-primary font-bold align-middle">PRCMP</span> (Obrigado{' '}
            <Link
              className="underline text-primary"
              target="_blank"
              rel="noreferrer"
              href="https://portal.isep.ipp.pt/intranet/areapessoal/docente.aspx?codeuser=6303">
              Prof. António Barros
            </Link>
            )
          </span>,
          <span className="align-middle" key="1.3.4-algav-questions">
            <span className="font-bold">+27</span> perguntas de{' '}
            <span className="text-primary font-bold align-middle">ALGAV</span> (Obrigado{' '}
            <Link
              className="underline text-primary"
              target="_blank"
              rel="noreferrer"
              href="https://portal.isep.ipp.pt/intranet/areapessoal/docente.aspx?codeuser=6337">
              Prof. Carlos Ramos
            </Link>
            )
          </span>,
          <span className="align-middle" key="1.3.4-realistic-arqcp">
            Adicionado <span className="font-bold">modo realista</span> de{' '}
            <span className="text-primary align-middle">ARQCP</span>
          </span>,
          <span className="align-middle" key="1.3.4-realistic-prcmp">
            Adicionado <span className="font-bold">modo realista</span> de{' '}
            <span className="text-primary align-middle">PRCMP</span>
          </span>,
          <span className="align-middle" key="1.3.4-realistic-algav">
            Adicionado <span className="font-bold">modo realista</span> de{' '}
            <span className="text-primary align-middle">ALGAV</span>
          </span>,
          <span className="align-middle" key="1.3.4-realistic-sgrai">
            Adicionado <span className="font-bold">modo realista</span> de{' '}
            <span className="text-primary align-middle">SGRAI</span>
          </span>,
          <span className="align-middle" key="1.3.4-realistic-asist">
            Adicionado <span className="font-bold">modo realista</span> de{' '}
            <span className="text-primary align-middle">ASIST</span> (apenas 25 perguntas p/ exame)
          </span>
        ]}>
        Mais uma época de exames, mais perguntas para resolver!
        <span className="text-primary font-bold">
          <br />
          <br />
          Bem-vindos
        </span>{' '}
        a todos os que estão na plataforma pela primeira vez! Espero que gostem e que vos ajude a
        preparar para os exames :) <br />
        <br /> Não se esqueçam que a plataforma é apenas um complemento ao estudo, não é uma solução
        milagrosa para descobrir o que aconteceu nas UC{`'`}s durante o semestre. <br />
        <span className="text-primary font-extrabold">Boa sorte!</span>
      </ChangelogVersion>
      <ChangelogVersion
        title="v1.3.3 🛠️"
        date={new Date(2023, 5, 7)}
        updates={[
          'Correção da paginação de exames no perfil (finalmente)',
          'Adição de suporte a imagem nas perguntas',
          'Correção da contagem de exames reprovados nas estatísticas',
          'Correção da versão dark mode de certos componentes',
          'Correção de comentários que ocupavam mais do que o tamanho do ecrã',
          <span key="1.3.3-new-questions">
            Adição de +30 perguntas de <span className="text-primary">SCOMP</span> (Obrigado{' '}
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
        date={new Date(2023, 6, 7)}
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
          <span key="1.3.0-gravatar-option">
            Suporte a avatar com{' '}
            <Link
              className="underline"
              href="https://en.gravatar.com/"
              target="_blank"
              rel="noreferrer">
              Gravatar
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
          'Adição de estatísticas de utilizador para cada UC',
          'Modo Perguntas Erradas',
          'Modo Perguntas Novas',
          'Calculadora de média na página de estatísticas',
          'Bloqueio de exames de certos modos (realista, novas e erradas) a utilizadores sem conta'
        ]}>
        Adição de novas funcionalidades como a calculadora de média e a possibilidade de ver as
        estatísticas de cada UC.
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
