import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/app">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-8">Última atualização: 17 de dezembro de 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              O MindMate ("nós", "nosso" ou "aplicativo") respeita sua privacidade e está comprometido 
              em proteger seus dados pessoais. Esta política descreve como coletamos, usamos e 
              protegemos suas informações quando você usa nosso aplicativo de produtividade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Dados que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coletamos apenas os dados necessários para fornecer nossos serviços:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Dados de conta:</strong> Email para autenticação</li>
              <li><strong>Dados de uso:</strong> Tarefas, projetos, hábitos, reflexões e notas que você cria</li>
              <li><strong>Dados de progresso:</strong> Status de conclusão, streaks e estatísticas de produtividade</li>
              <li><strong>Preferências:</strong> Configurações do aplicativo e preferências de notificação</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Como Usamos seus Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos suas informações exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Fornecer e manter o serviço do MindMate</li>
              <li>Sincronizar seus dados entre dispositivos</li>
              <li>Enviar lembretes e notificações (quando autorizados)</li>
              <li>Calcular estatísticas de produtividade e streaks</li>
              <li>Melhorar a experiência do usuário</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Armazenamento e Segurança</h2>
            <p className="text-muted-foreground leading-relaxed">
              Seus dados são armazenados de forma segura utilizando criptografia em trânsito (HTTPS/TLS) 
              e em repouso. Utilizamos infraestrutura de nuvem com certificações de segurança padrão 
              da indústria. Seus dados são protegidos por políticas de acesso que garantem que apenas 
              você pode visualizar e modificar suas informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong> para 
              fins de marketing. Podemos compartilhar dados apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com provedores de serviço essenciais (hospedagem, autenticação) sob acordos de confidencialidade</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você tem os seguintes direitos sobre seus dados:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
              <li><strong>Correção:</strong> Atualizar informações incorretas</li>
              <li><strong>Exclusão:</strong> Solicitar remoção permanente dos seus dados</li>
              <li><strong>Exportação:</strong> Baixar seus dados em formato portátil (JSON/Markdown)</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Dados Offline</h2>
            <p className="text-muted-foreground leading-relaxed">
              O MindMate funciona offline armazenando dados localmente no seu dispositivo. Esses dados 
              são sincronizados com nossos servidores quando você reconecta à internet. Dados locais 
              podem ser limpos através das configurações do navegador ou desinstalando o aplicativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos armazenamento local (localStorage, IndexedDB) para manter sua sessão ativa 
              e permitir funcionalidade offline. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Menores de Idade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O MindMate não é direcionado a menores de 13 anos. Não coletamos intencionalmente 
              dados de crianças. Se você acredita que coletamos dados de um menor, entre em contato 
              conosco imediatamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
              através do aplicativo ou por email. O uso continuado após alterações constitui aceitação 
              da nova política.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões sobre privacidade ou exercer seus direitos, entre em contato:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Email:</strong> privacy@mindmate.app
            </p>
          </section>

          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2025 MindMate. Todos os direitos reservados.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Privacy;
