import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Política de Privacidade — VozCX',
  description: 'Saiba como a VozCX coleta, utiliza e protege os dados pessoais de seus usuários e clientes.',
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <PublicHeader />

      <main className="pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Título */}
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-medium mb-3 tracking-wide uppercase">Legal</p>
            <h1 className="text-4xl font-bold text-white mb-3">Política de Privacidade</h1>
            <p className="text-slate-500 text-sm">Última atualização: Junho de 2026</p>
          </div>

          {/* Intro */}
          <p className="text-slate-400 leading-relaxed mb-12">
            A VozCX valoriza a privacidade e a proteção dos dados pessoais de seus usuários e clientes.
            Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos
            as informações tratadas em nossa plataforma.
          </p>

          <div className="flex flex-col gap-10">

            <Section titulo="1. Quem somos">
              <p>
                A VozCX é uma plataforma de Customer Experience desenvolvida para ajudar empresas a coletarem
                e analisarem a satisfação de seus clientes por meio de pesquisas e indicadores de desempenho.
              </p>
            </Section>

            <Section titulo="2. Quais dados coletamos">
              <p className="mb-4">Podemos coletar as seguintes informações:</p>
              <SubTitulo>Dados de cadastro</SubTitulo>
              <Lista items={['Nome', 'E-mail', 'Empresa', 'Cargo']} />
              <SubTitulo>Dados de utilização da plataforma</SubTitulo>
              <Lista items={[
                'Data e hora de acesso',
                'Endereço IP',
                'Informações do navegador e dispositivo',
                'Registros de atividades realizadas no sistema',
              ]} />
              <SubTitulo>Dados das avaliações</SubTitulo>
              <Lista items={[
                'Nota atribuída pelo cliente',
                'Comentários enviados',
                'Loja ou unidade avaliada',
                'Atendente selecionado, quando aplicável',
              ]} />
              <p className="mt-4 text-slate-500 text-sm">
                A VozCX não solicita dados pessoais sensíveis dos consumidores finais.
              </p>
            </Section>

            <Section titulo="3. Como utilizamos os dados">
              <p className="mb-4">Os dados coletados são utilizados para:</p>
              <Lista items={[
                'Disponibilizar os serviços da plataforma',
                'Gerar indicadores e relatórios',
                'Melhorar a experiência dos usuários',
                'Garantir a segurança da plataforma',
                'Cumprir obrigações legais e regulatórias',
                'Entrar em contato quando necessário',
              ]} />
            </Section>

            <Section titulo="4. Compartilhamento de dados">
              <p className="mb-4">A VozCX não comercializa dados pessoais.</p>
              <p className="mb-4">As informações poderão ser compartilhadas apenas quando necessário para:</p>
              <Lista items={[
                'Prestação dos serviços contratados',
                'Cumprimento de obrigações legais',
                'Atendimento a determinações judiciais ou autoridades competentes',
              ]} />
            </Section>

            <Section titulo="5. Armazenamento e segurança">
              <p className="mb-4">
                Adotamos medidas técnicas e administrativas para proteger os dados contra acesso
                não autorizado, perda, alteração ou divulgação indevida.
              </p>
              <p>
                Apesar dos nossos esforços, nenhum sistema é completamente imune a riscos, razão pela
                qual incentivamos nossos usuários a protegerem suas credenciais de acesso.
              </p>
            </Section>

            <Section titulo="6. Cookies e tecnologias semelhantes">
              <p className="mb-4">
                Podemos utilizar cookies e tecnologias semelhantes para melhorar a navegação,
                analisar o uso da plataforma e aprimorar nossos serviços.
              </p>
              <p>O usuário pode gerenciar as permissões de cookies diretamente em seu navegador.</p>
            </Section>

            <Section titulo="7. Direitos do titular dos dados">
              <p className="mb-4">
                Nos termos da Lei Geral de Proteção de Dados (LGPD), o titular poderá solicitar:
              </p>
              <Lista items={[
                'Confirmação do tratamento dos dados',
                'Acesso aos dados pessoais',
                'Correção de informações incompletas ou desatualizadas',
                'Anonimização, bloqueio ou eliminação dos dados quando aplicável',
                'Revogação do consentimento, quando necessário',
              ]} />
            </Section>

            <Section titulo="8. Retenção dos dados">
              <p>
                Os dados serão armazenados pelo tempo necessário para a prestação dos serviços,
                cumprimento de obrigações legais ou exercício regular de direitos.
              </p>
            </Section>

            <Section titulo="9. Alterações desta política">
              <p className="mb-4">
                Esta Política de Privacidade poderá ser atualizada periodicamente para refletir
                melhorias na plataforma ou alterações legais.
              </p>
              <p>Recomendamos que o usuário consulte esta página regularmente.</p>
            </Section>

            <Section titulo="10. Contato">
              <p className="mb-4">
                Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento de dados
                pessoais, entre em contato conosco:
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-slate-300 text-sm">
                  E-mail:{' '}
                  <a href="mailto:contato@vozcx.com.br" className="text-indigo-400 hover:underline">
                    contato@vozcx.com.br
                  </a>
                </p>
                <p className="text-slate-300 text-sm">
                  Site:{' '}
                  <a href="https://www.vozcx.com.br" className="text-indigo-400 hover:underline">
                    www.vozcx.com.br
                  </a>
                </p>
              </div>
            </Section>

          </div>

          {/* Rodapé da página */}
          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-white font-semibold">VozCX</p>
            <p className="text-slate-500 text-sm mt-1">A voz do cliente transformada em resultados.</p>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

function Section({ titulo, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">{titulo}</h2>
      <div className="text-slate-400 leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </div>
  )
}

function SubTitulo({ children }) {
  return <p className="text-slate-300 font-medium mt-4 mb-2">{children}</p>
}

function Lista({ items }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2 text-sm">
          <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
