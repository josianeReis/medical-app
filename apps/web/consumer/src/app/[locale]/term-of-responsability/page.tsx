import React from 'react';

const TermOfResponsability = () => {
	return (
		<div className="py-24 sm:px-24 md:px-36  lg:px-44  xl:px-72">
			<div className="flex w-full flex-col justify-between gap-4">
				<h1 className="uppercase font-bold  text-3xl text-medium text-black dark:text-white">
					<p>Termo de consentimento e condições de uso</p>
					<p>
						Plataforma nexdoc - inteligência artificial para apoio à geração de
						laudos
					</p>
				</h1>

				<h2 className="font-bold uppercase text-2xl">
					1. Objetivo e aceitação
				</h2>
				<p>
					1.1 Este Termo disciplina o uso da plataforma NexDoc, solução SaaS que
					emprega Inteligência Artificial (&quot;IA&quot;) para auxiliar na
					redação de laudos ultrassonográficos.
				</p>
				<p>
					1.2 Ao clicar em “Li e aceito” o usuário declara ter lido,
					compreendido e aceito integralmente este instrumento, comprometendo-se
					a cumpri‑lo.
				</p>

				<h2 className="font-bold uppercase text-2xl">
					2. Elegibilidade e registro
				</h2>
				<div>
					<p>2.1 A plataforma destina‑se exclusivamente a:</p>
					<ul className="list-disc pl-5">
						<li>Médicos com CRM ativo;</li>
						<li>
							Clínicas, hospitais e demais pessoas jurídicas legalmente
							habilitadas;
						</li>
						<li>
							Profissionais de apoio administrativo (p. ex. secretárias)
							designados pelo médico ou instituição, com perfil restrito que não
							permite emissão ou assinatura de laudos;
						</li>
						<li>
							Representantes legais capazes de assumir obrigações contratuais.
						</li>
					</ul>
				</div>
				<p>
					2.2 O usuário deverá fornecer dados cadastrais exatos e mantê‑los
					atualizados, responsabilizando‑se civil e criminalmente por falsas
					informações.
				</p>

        <h2 className="font-bold uppercase text-2xl">
					3. Versão beta e atualizações
				</h2>
        <p>
          3.1 O NexDoc encontra‑se em VERSÃO BETA. Podem ocorrer limitações, instabilidades ou imprecisões. Funcionalidades poderão ser modificadas, suspensas ou descontinuadas.
        </p>
        <p>
          3.2 Quando a versão comercial for lançada, o usuário será notificado pelo e‑mail cadastrado e poderá aderir a novos termos.
        </p>

        <h2 className="font-bold uppercase text-2xl">
					4. privacidade e proteção de dados (LGPD)
				</h2>
        <p>
          4.1 Papéis. Nos termos da Lei 13.709/2018 (LGPD), o Controlador é a instituição ou profissional que insere dados; a NexDoc atua como Operadora, tratando dados pessoais apenas conforme instruções do Controlador.
        </p>
        <p>
          4.2 Finalidade e Minimização. O tratamento limita‑se à elaboração de laudos, observando princípios de finalidade, adequação e necessidade (art. 6º, I–III, LGPD). Nenhum dado é usado para fins distintos do contratado.
        </p>
        <p>
          4.3 Dados sensíveis dos pacientes são processados exclusivamente em memória e descartados ou anonimizados logo após a geração do laudo, salvo obrigação legal de retenção. 
        </p>
        <p>
          4.4 Medidas de Segurança. Em conformidade com os arts. 46 e 47 da LGPD, adotamos criptografia TLS/HTTPS, controle granular de acesso, registros de atividade, autenticação multifator e infraestrutura cloud com certificações de segurança.
        </p>
        <p>
          4.5 Acordo de Processamento de Dados (DPA). Disponibilizamos DPA que integra este Termo e detalha obrigações de cada parte, medidas de segurança e procedimentos em caso de incidente.
        </p>
        <p>
          4.6 Encarregado de Dados (DPO). Contato provisório: dpo@nexdoc.ai (*)
        </p>

        <h2 className="font-bold uppercase text-2xl">
					5. Propriedade intelectual, confidencialidade e suporte
				</h2>
        <p>
          5.1 A NexDoc e seus licenciadores detêm todos os direitos de propriedade intelectual sobre códigos‑fonte, modelos de IA, templates e marcas. É concedida licença revogável, não exclusiva e intransferível de uso.
        </p>
        <p>
          5.2 O usuário retém direitos sobre os dados e laudos finais, mas concede à NexDoc licença não exclusiva, gratuita e irrevogável para utilizar dados anonimizados e feedbacks com a finalidade de manutenção, auditoria, prevenção a fraudes, melhorias e pesquisa (art. 7º, IX, LGPD).
        </p>
        <p>
          5.3 As partes comprometem‑se a manter sigilo sobre informações técnicas, comerciais e dados sensíveis, salvo determinação legal ou judicial.
        </p>
        <p>
          5.4 Monitoramento e Auditoria. A NexDoc pode registrar logs de acesso e interações e, se necessário, realizar revisão manual ou automatizada para garantir conformidade com este Termo e com a legislação.
        </p>
        <p>
          5.5 Canais de suporte provisórios (substituir pelos definitivos):
        </p>
        <ul>
          <li>
             E‑mail: suporte@nexdoc.clinic
          </li>
          <li>
             Telefone: (11) 1111‑1234
          </li>
          <li>
             Chat: https://help.nexdoc.clinic
          </li>
        </ul>

        <h2 className="font-bold uppercase text-2xl">
					6. Limitação de responsabilidade da Nexdoc
				</h2>
        <p>
          6.1 A NexDoc não garante a precisão clínica absoluta, ausência de erros ou adequação a fins específicos. Resultados podem conter imperfeições ou alucinações inerentes à IA.
        </p>
        <p>
          6.2 Na máxima extensão legal, a NexDoc não se responsabiliza por danos indiretos, lucros cessantes, perda de chance, danos morais ou qualquer prejuízo decorrente do uso ou da incapacidade de uso da plataforma, inclusive falhas médicas.
        </p>
        <p>
          6.3 A NexDoc poderá modificar, suspender ou encerrar o serviço, bem como alterar este Termo a qualquer tempo. Alterações serão comunicadas por e‑mail ou notificação in‑app; o uso continuado implicará aceitação.
        </p>

         <h2 className="font-bold uppercase text-2xl">
					7. Obrigações e responsabilidades do usuário
				</h2>
        <p>
          7.1 O usuário declara‑se único responsável pela análise, alteração, validação e assinatura dos laudos. O usuário não poderá atribuir êxito ou insucesso em sua prática profissional ao NexDoc.
        </p>
        <p>
          7.2 Consentimento do Paciente. Sempre que a IA influir no resultado, o usuário compromete‑se a informar o paciente e obter TCLE conforme a Resolução CREMERS 6/2025 e demais normas do CFM.
        </p>
        <p>
          7.3 Uso Ético e Legal. É vedado:
        </p>
        <ul>
          <li>
            Inserir informações falsas, ilícitas ou ofensivas;
          </li>
          <li>
            Utilizar resultados sem validação profissional;
          </li>
          <li>
            Compartilhar credenciais ou permitir que terceiros utilizem o perfil de acesso pessoal;
          </li>
          <li>
            Violar direitos de propriedade intelectual ou confidencialidade de terceiros.
          </li>
        </ul>
        <p>
          7.4 Segurança de Conta. O usuário deve proteger suas credenciais e notificar imediatamente usos não autorizados.
        </p>
        <p>
          7.5 Indenização. O usuário indenizará a NexDoc por perdas e despesas decorrentes de uso inadequado ou violação deste Termo.
        </p>
        <p>
          7.6 Suspensão ou Rescisão. O descumprimento deste Termo poderá acarretar suspensão ou cancelamento imediato de acesso, sem direito a restituição de valores já pagos relativos a serviços prestados.
        </p>

        <h2 className="font-bold uppercase text-2xl">
					8. Vigência, rescisão e foro
				</h2>
        <p>
          8.1 Este Termo vigora por prazo indeterminado a partir da aceitação. O usuário pode rescindir a qualquer momento mediante aviso pelos canais de contato disponíveis.
        </p>
        <p>
          8.2 A NexDoc poderá suspender ou encerrar o acesso por violação contratual, uso fraudulento ou ordem de autoridade competente.
        </p>
        <p>
          8.3 Este Termo é regido pelas leis da República Federativa do Brasil, especialmente a Lei 13.709/2018 e demais normas médicas aplicáveis. Fica eleito o foro da Comarca de São Paulo/SP, renunciando a qualquer outro.
        </p>

        <p>
          Ao confirmar <span className="font-bold">“Li e aceito”</span> o usuário reconhece que leu, entendeu e assume todas as obrigações e responsabilidades decorrentes do uso da plataforma Nexdoc.
        </p>




			</div>
		</div>
	);
};

export default TermOfResponsability;
