const CookiePolicy: React.FC = () => {
  return (
    <section className="w-full text-sm md:text-md px-5 md:px-24 md:pb-24 pb-48 mt-5">
      <h1 className="text-primary font-black text-xl">Política de Cookies</h1>
      <div className="flex flex-col h-full gap-5 text-base">
        <article className="mt-5">
          <p>
            Esta Política de Cookies explica como o website antirecurso.nei-isep.org
            (&quot;Website&quot;) utiliza cookies e tecnologias similares para recolher e armazenar
            informações quando um utilizador visita o Website. Ao continuar a usar o Website,
            concorda com o uso de cookies de acordo com esta política.
          </p>
        </article>
        <article>
          <h3 className="mt-2 font-bold text-primary">O que são cookies?</h3>
          <p>
            Cookies são pequenos ficheiros de texto que são armazenados no seu dispositivo
            (computador, telemóvel, etc.) quando visita um website. São amplamente utilizados para
            tornar o website mais eficiente e melhorar a experiência do utilizador, fornecendo
            informações aos proprietários do website.
          </p>
        </article>
        <article>
          <h3 className="mt-2 font-bold text-primary">Quais cookies utilizamos?</h3>
          <p>Geralmente existem três categorias de cookies:</p>
          <ul>
            <li className="mt-1 ml-2">
              - Cookies essenciais: São cookies necessários para o funcionamento adequado do
              Website. Incluem, por exemplo, cookies de autenticação.
            </li>
            <li className="mt-1 ml-2">
              - Cookies de desempenho e análise: São cookies que recolhem informações sobre como os
              visitantes usam o Website, incluindo quais páginas são visitadas, como navegam pelo
              Website e se encontram algum erro. Esses cookies ajudam a melhorar o desempenho do
              Website.
            </li>
            <li className="mt-1 ml-2">
              - Cookies de personalização: São cookies que lembram preferências do utilizador e
              fornecem conteúdo personalizado com base nas interações anteriores com o Website.
            </li>
          </ul>
          <p className="mt-2">
            O Website utiliza cookies essencias de forma a garantir o seu funcionamento adequado.
          </p>
        </article>
        <article>
          <h3 className="mt-2 font-bold text-primary">Como controlar os cookies?</h3>
          <p>
            Pode controlar e/ou limpar os cookies do Website a qualquer momento. Também pode
            configurar o seu browser para bloquear todos os cookies ou para receber um aviso antes
            que um cookie seja armazenado. No entanto, observe que o desativar dos cookies pode
            afetar a funcionalidade do Website.
          </p>
          <p>
            A maioria dos browser permite gerir as preferências de cookies através das definições.
            Para mais informações sobre como controlar os cookies, consulte a documentação do seu
            browser.
          </p>
        </article>
        <article>
          <h3 className="mt-2 font-bold text-primary">Alterações nesta Política de Cookies</h3>
          <p>
            Podemos atualizar esta Política de Cookies periodicamente para refletir alterações na
            forma como utilizamos cookies. Recomendamos que revise esta Política regularmente para
            se manter informado sobre como usamos os cookies.
          </p>
        </article>
        <article>
          <h3 className="mt-2 font-bold text-primary">Entre em contato</h3>
          <p>
            Se tiver alguma dúvida ou preocupação sobre esta política, pode entrar em contacto com o
            núcleo através do email{' '}
            <a
              className="text-blue-700 dark:text-blue-300 hover:underline"
              href="mailto:info@nei-isep.org">
              info@nei-isep.org
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  );
};

export default CookiePolicy;
