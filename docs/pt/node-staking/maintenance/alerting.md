# Monitorando seu Smartnode Stack com Notificações de Alerta

A funcionalidade de notificação de alerta do Smartnode permite que você receba notificações sobre a saúde e eventos importantes do seu Rocket Pool Smartnode.

## Visão Geral do Sistema de Alertas

A funcionalidade de notificação utiliza o [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) para entregar alertas. O sistema de alertas requer que você já tenha seguido o [Configurando o Dashboard Grafana](../grafana.mdx) que orienta a configuração do rastreador de métricas do Smartnode stack. Os alertas são acionados quando métricas importantes do seu Smartnode excedem determinados limites ou quando eventos particulares ocorrem, como quando o destinatário de taxa do seu node é alterado.

## Configurando Notificações do Discord

Atualmente, as notificações podem ser enviadas para canais do Discord. Você pode configurar as notificações do Discord na Interface de Usuário de Texto do Rocket Pool (TUI) na página "Monitoring / Alerting".

### Adicionando uma URL de Webhook do Discord:

1. Navegue até o canal do Discord desejado e abra suas configurações.
2. Em "Integrations", localize e clique em "Webhooks".
3. Clique em "Create Webhook".
4. Dê um nome ao seu webhook e escolha um canal para enviar os alertas.
5. Copie a URL do Webhook fornecida.
6. Dentro da TUI do Rocket Pool, navegue até a página "Monitoring / Alerting".
7. Cole a URL do Webhook copiada no campo designado e salve a configuração.

::: tip DICA
Está faltando sua notificação favorita? A equipe do Rocket Pool está ativamente buscando feedback da comunidade sobre destinos de notificação adicionais. Sinta-se à vontade para sugerir novos destinos de notificação em https://github.com/rocket-pool/smartnode/issues.
:::

## Desabilitando e Habilitando Alertas

A TUI do Rocket Pool fornece uma interface amigável para gerenciar seus alertas. Você pode acessar esta funcionalidade através da página "Monitoring / Alerting". Esta interface permite que você visualize uma lista de todos os alertas configurados e habilite ou desabilite alertas individuais com base em sua preferência.

## Configuração Avançada

::: warning NOTA
Esta seção é para usuários avançados que têm experiência com Prometheus e modificação de arquivos YAML.
:::

Para configuração mais avançada de alertas, você pode adicionar seus próprios baseados em qualquer métrica que esteja disponível no container Prometheus gerenciado pelo Smartnode Stack. Adicione seu próprio arquivo yaml contendo [Regras de Alerta do Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) no diretório `~/.rocketpool/alerting/rules/` e essas regras serão carregadas após reiniciar o container Prometheus com `docker stop rocketpool_prometheus` seguido de `docker start rocketpool_prometheus`. Em seguida, execute `docker logs rocketpool_prometheus` para confirmar que o Prometheus carregou seu arquivo de configuração com sucesso (você deve ver uma linha com _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ e não _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
