# Ajustes de data, local e área administrativa

## Campos de data e horário
- Separar a data e o horário do casamento em dois campos simples, evitando o seletor combinado e corrigindo a diferença de fuso horário.
- Usar seletores próprios de data e hora também na cerimônia e na recepção.
- Manter a data exibida no site em formato brasileiro.

## Localização pelo Google Maps
- Manter o endereço escrito para exibição e para o mapa incorporado.
- Adicionar um campo opcional para colar o link do local no Google Maps, tanto na configuração inicial quanto na edição de cerimônia e recepção.
- Mostrar no site público um botão “Abrir no Google Maps” quando esse link estiver preenchido.
- Validar o link para aceitar apenas endereços seguros do Google Maps.

## Administração
- Criar uma função de administrador separada e protegida no banco, sem depender apenas do e-mail exibido no navegador.
- Autorizar `yarafjprazeres@gmail.com` como administradora somente após login Google com e-mail verificado.
- Criar uma página administrativa privada com a lista dos casais, nome do site, endereço público, data do casamento, situação de publicação, quantidade de confirmações e data de cadastro.
- Adicionar acesso “Administração” no painel somente para a conta autorizada.
- Reservar na listagem uma indicação de cobrança futura, sem ativar pagamentos ou planos agora.

## Segurança e verificação
- Todos os dados gerais dos casais serão consultados somente no servidor após validar a função de administradora.
- Casais comuns continuarão vendo apenas os próprios dados e não conseguirão abrir a administração.
- Testar os novos campos, o link do Maps e os acessos com e sem permissão administrativa.
