const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full text-sm md:text-md px-5 md:px-24 md:pb-24 pb-48">
      <h1 className="text-primary font-black text-xl">Política de Privacidade</h1>
      <span className="h-full">
        <h3 className="mt-2 font-bold text-primary">
          Aplicação do Regulamento Geral sobre a Proteção de Dados
        </h3>
        <p>
          Em vigor a partir de 20 de junho de 2023. De maneira a compreender que informações são
          recolhidas e como são utilizadas o Núcleo de Estudantes de Informática do Instituto
          Superior de Engenharia do Porto (NEI-ISEP) aconselha que leia esta Política de Privacidade
          que visa explicar as nossas práticas no que diz respeito à recolha, utilização e
          conservação de determinadas informações, incluindo os seus dados pessoais, no âmbito da
          aplicação AntiRecurso. Criamos o nosso serviço tendo como base o respeito pela sua
          privacidade e que cumpre a legislação de proteção de dados pessoais em vigor nomeadamente
          o Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho, de 27 de Abril de 2016.
        </p>
        <p>
          O AntiRecurso é uma aplicação que auxilia os alunos pertencentes ao Departamento de
          Engenharia Informática do ISEP a estudarem de maneira mais simples e eficaz para os exames
          de certas Unidades Curriculares. Responsável pelo tratamento O NEI-ISEP é a organização
          responsável pelo tratamento dos seus dados pessoais. Poderá entrar em contacto com o
          núcleo através do email{' '}
          <a className="text-blue-700 hover:underline" href="mailto:info@nei-isep.org">
            info@nei-isep.org
          </a>
          .
        </p>
        <h3 className="mt-2 font-bold text-primary">Recolha de Informações</h3>
        <p>
          Para usar a nossa aplicação é necessário ter uma conta de utilizador e por esse motivo é
          preciso fornecer-nos certas informações. Isto inclui o nome, uma palavra-passe e um
          endereço de email. O endereço de email e a palavra-passe são requeridos para autenticação
          no sistema e o nome tem o propósito para a identificação. Podemos então concluir que todos
          os dados solicitados têm um fim específico e justificado, conforme a disposição legal da
          alínea c) do nº1 do Artigo 5° do RGPD.
        </p>
        <h3 className="mt-2 font-bold text-primary">Direitos dos Titulares dos Dados</h3>
        <p>
          Ao abrigo da legislação de proteção de dados aplicável, tem o direito de aceder à sua
          informação pessoal (Artigo 15° do Regulamento Geral sobre a Proteção de Dados), retificar
          os seus dados (Artigo 16° do Regulamento Geral sobre a Proteção de Dados), efetuar a
          portabilidade, apagar as suas informações (Artigo 17° do Regulamento Geral sobre a
          Proteção de Dados) e limitar e opor-se a determinados tratamentos das suas informações,
          bem como o direito de apresentação de uma reclamação junto da CNPD – Comissão Nacional de
          Proteção de Dados (
          <a className="text-blue-700 hover:underline" href="mailto:geral@cnpd.pt">
            geral@cnpd.pt
          </a>
          ). Para exercer os seus direitos, ou caso tenha uma questão relacionada com a nossa
          política de privacidade, contacte o nosso Encarregado da Proteção de Dados, através do
          email{' '}
          <a className="text-blue-700 hover:underline" href="mailto:info@nei-isep.org">
            info@nei-isep.org
          </a>
          .
        </p>
        <h3 className="mt-2 font-bold text-primary">Conservação das Informações</h3>
        <p>
          Quando a sua conta for eliminada, O NEI-ISEP anonimiza as suas informações pessoais não
          sendo possível recuperar esse conteúdo mais tarde.
        </p>
        <h3 className="mt-2 font-bold text-primary">Obrigações do utilizador</h3>
        <p>
          O utilizador declara que leu a política de privacidade, concordando na sua totalidade com
          todas as informações nela presentes.
        </p>
        <h3 className="mt-2 font-bold text-primary">Outros Termos</h3>
        <p>
          Os seus dados pessoais poderão ser comunicados a entidades públicas ou autoridades
          judiciais, se assim for obrigatório por lei ou para prevenir ou punir a prática de crimes.
        </p>
      </span>
    </div>
  );
};

export default PrivacyPolicy;
