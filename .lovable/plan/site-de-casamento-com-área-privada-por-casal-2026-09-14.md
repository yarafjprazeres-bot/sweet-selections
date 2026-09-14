# Site de casamento com área privada por casal

## Objetivo
Reconstruir o arquivo enviado como um site moderno e responsivo, preservando seus textos, seções e recursos, mas substituindo o armazenamento quebrado e o PIN inseguro por contas Google e dados privados no Lovable Cloud.

## Experiência pública
- Manter: início com foto e contagem regressiva, história, cerimônia, recepção, mapas, galerias, confirmação de presença, presentes via Pix e contato por WhatsApp.
- Modernizar a direção visual com composição editorial romântica, tipografia elegante, navegação adaptada ao celular e interações acessíveis.
- Corrigir validações do formulário, campos dinâmicos de acompanhantes, feedback de envio, geração/cópia do Pix e estados de presentes.
- Usar um endereço público exclusivo por casal para que convidados acessem o casamento correto.

## Conta e painel do casal
- Login seguro com Google.
- Criar automaticamente o perfil do casal no primeiro acesso.
- Painel privado para editar nomes, data, foto, história, contato, aparência, cerimônia, recepção, lista de convidados, presentes e dados Pix.
- Visão resumida com confirmações positivas/negativas e totais de adultos, crianças e ajudantes.
- Tabela pesquisável das confirmações e download em CSV, compatível com planilhas.
- Encerrar sessão com limpeza dos dados privados exibidos.

## Dados e segurança
- Guardar perfis, configurações, convidados, presentes e confirmações no Lovable Cloud.
- Separar rigorosamente os dados por conta; cada casal só poderá ler e alterar o próprio casamento.
- Permitir acesso público apenas ao conteúdo publicado do casamento e ao envio de confirmação para aquele casal.
- Remover o PIN visível, o armazenamento inexistente `window.storage`, HTML injetado sem proteção e dependências externas frágeis do arquivo original.

## Estrutura de páginas
- `/` — apresentação do serviço e entrada com Google.
- `/casamento/:slug` — site público do casal.
- `/painel` — visão geral privada.
- `/painel/site`, `/painel/convidados`, `/painel/presentes`, `/painel/confirmacoes` — edição e relatórios.
- Metadados próprios em cada página pública para título, descrição e compartilhamento.

## Verificação
- Testar criação de conta, proteção do painel e saída da conta.
- Testar edição do site e isolamento entre casais.
- Testar confirmação de presença completa, resumo e exportação CSV.
- Conferir visual e navegação em desktop e celular, além de erros de carregamento.

## Premissas
- O relatório inicial será CSV; não será criado PDF nesta etapa.
- O conteúdo do arquivo será usado como modelo inicial de cada nova conta e poderá ser editado no painel.
- A foto de capa e fotos dos locais serão informadas por URL, como no arquivo enviado.
