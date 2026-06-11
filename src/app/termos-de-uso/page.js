import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Termos de Uso — VozCX',
  description: 'Conheça as regras para utilização da plataforma e dos serviços oferecidos pela VozCX.',
}

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <PublicHeader />

      <main className="pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Título */}
          <div className="mb-12">
            <p className="text-indigo-400 text-sm font-medium mb-3 tracking-wide uppercase">Legal</p>
            <h1 className="text-4xl font-bold text-white mb-3">Termos de Uso</h1>
            <p className="text-slate-500 text-sm">Última atualização: Junho de 2026</p>
          </div>

          {/* Intro */}
          <p className="text-slate-400 leading-relaxed mb-12">
            Bem-vindo à VozCX. Estes Termos de Uso estabelecem as regras para utilização da plataforma
            e dos serviços oferecidos pela VozCX. Ao criar uma conta ou utilizar nossos serviços,
            o usuário declara que leu e concorda com estas condições.
          </p>

          <div className="flex flex-col gap-10">

            <Section titulo="1. Sobre a VozCX">
              <p>
                A VozCX é uma plataforma de Customer Experience desenvolvida para auxiliar empresas
                na coleta, gestão e análise da satisfação dos seus clientes por meio de indicadores,
                pesquisas e relatórios.
              </p>
            </Section>

            <Section titulo="2. Cadastro">
              <p>
                Para utilizar a plataforma, o usuário deverá fornecer informações verdadeiras,
                completas e atualizadas.
              </p>
              <p>
                O usuário é responsável por manter a confidencialidade de suas credenciais de acesso
                e por todas as atividades realizadas em sua conta.
              </p>
            </Section>

            <Section titulo="3. Período de teste">
              <p>
                A VozCX poderá oferecer um período gratuito de utilização para novos clientes.
              </p>
              <p>
                Ao término desse período, a continuidade do serviço poderá depender da contratação
                de um dos planos disponíveis.
              </p>
            </Section>

            <Section titulo="4. Planos e pagamentos">
              <p>
                Os valores, recursos e limites de cada plano serão apresentados na página oficial
                de planos da plataforma.
              </p>
              <p>
                A VozCX poderá atualizar preços ou funcionalidades, respeitando os contratos e
                condições vigentes.
              </p>
            </Section>

            <Section titulo="5. Uso permitido">
              <p className="mb-4">
                O usuário compromete-se a utilizar a plataforma de forma ética e legal, sendo proibido:
              </p>
              <Lista items={[
                'Utilizar a plataforma para atividades ilícitas',
                'Tentar obter acesso não autorizado a sistemas ou dados',
                'Interferir na operação da plataforma',
                'Inserir conteúdos que violem direitos de terceiros',
              ]} />
            </Section>

            <Section titulo="6. Dados das avaliações">
              <p>
                Os dados coletados por meio da plataforma pertencem ao cliente contratante, que é
                responsável pelo tratamento adequado dessas informações e pelo cumprimento da
                legislação aplicável, incluindo a LGPD.
              </p>
              <p>
                A VozCX atua como fornecedora da tecnologia necessária para a coleta e visualização
                desses dados.
              </p>
            </Section>

            <Section titulo="7. Disponibilidade do serviço">
              <p>
                Empregamos nossos melhores esforços para manter a plataforma disponível e segura.
              </p>
              <p>
                No entanto, poderão ocorrer interrupções temporárias para manutenção, atualizações
                ou situações fora do nosso controle.
              </p>
            </Section>

            <Section titulo="8. Limitação de responsabilidade">
              <p>
                A VozCX não garante aumento de faturamento, crescimento de vendas ou qualquer
                resultado comercial específico decorrente do uso da plataforma.
              </p>
              <p>
                As decisões tomadas com base nos dados apresentados são de responsabilidade
                exclusiva do usuário.
              </p>
            </Section>

            <Section titulo="9. Propriedade intelectual">
              <p>
                Todos os direitos relacionados à plataforma, incluindo software, identidade visual,
                logotipos, textos e funcionalidades, pertencem à VozCX, sendo proibida sua
                reprodução ou utilização sem autorização prévia.
              </p>
            </Section>

            <Section titulo="10. Cancelamento">
              <p>
                O cliente poderá solicitar o cancelamento da assinatura a qualquer momento,
                conforme as condições do plano contratado.
              </p>
              <p>
                Após o encerramento da conta, os dados poderão ser armazenados pelo período
                necessário para cumprimento de obrigações legais e regulatórias.
              </p>
            </Section>

            <Section titulo="11. Alterações destes Termos">
              <p>
                A VozCX poderá atualizar estes Termos de Uso sempre que necessário para refletir
                melhorias na plataforma ou alterações legais.
              </p>
              <p>A versão mais recente estará sempre disponível em nosso site.</p>
            </Section>

            <Section titulo="12. Contato">
              <p className="mb-4">
                Em caso de dúvidas sobre estes Termos de Uso, entre em contato:
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
