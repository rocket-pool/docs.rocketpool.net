# Monitorare il tuo Stack Smartnode con Notifiche di Allerta

La funzionalità di notifica degli alert dello Smartnode ti consente di ricevere notifiche sulla salute e sugli eventi importanti del tuo Smartnode Rocket Pool.

## Panoramica del Sistema di Allerta

La funzionalità di notifica utilizza [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) per recapitare gli alert. L'alerting richiede che tu abbia già seguito la guida [Configurare la Dashboard Grafana](../grafana.mdx) che spiega come configurare il tracker delle metriche dello stack Smartnode. Gli alert vengono attivati quando metriche importanti del tuo Smartnode superano determinate soglie o quando si verificano eventi particolari, come quando il fee recipient del tuo nodo viene modificato.

## Configurare le Notifiche Discord

Attualmente, le notifiche possono essere inviate ai canali Discord. Puoi configurare le notifiche Discord all'interno dell'Interfaccia Utente Testuale (TUI) di Rocket Pool nella pagina "Monitoring / Alerting".

### Aggiungere un URL Webhook Discord:

1. Naviga nel canale Discord desiderato e apri le sue impostazioni.
2. Sotto "Integrazioni", individua e clicca su "Webhook".
3. Clicca su "Crea Webhook".
4. Assegna un nome al tuo webhook e scegli un canale a cui inviare gli alert.
5. Copia l'URL del Webhook fornito.
6. All'interno della TUI di Rocket Pool, naviga alla pagina "Monitoring / Alerting".
7. Incolla l'URL del Webhook copiato nel campo designato e salva la configurazione.

::: tip SUGGERIMENTO
Manca la tua notifica preferita? Il team di Rocket Pool sta attivamente cercando feedback dalla community riguardo a destinazioni di notifica aggiuntive. Sentiti libero di suggerire nuove destinazioni di notifica su https://github.com/rocket-pool/smartnode/issues.
:::

## Disabilitare e Abilitare gli Alert

La TUI di Rocket Pool fornisce un'interfaccia user-friendly per gestire i tuoi alert. Puoi accedere a questa funzionalità tramite la pagina "Monitoring / Alerting". Questa interfaccia ti consente di visualizzare un elenco di tutti gli alert configurati e abilitare o disabilitare i singoli alert in base alle tue preferenze.

## Configurazione Avanzata

::: warning NOTA
Questa sezione è per utenti avanzati che hanno esperienza con Prometheus e con la modifica di file YAML.
:::

Per una configurazione più avanzata degli alert puoi aggiungere i tuoi basandoti su qualsiasi metrica disponibile nel container Prometheus gestito dallo Stack Smartnode. Aggiungi il tuo file yaml contenente [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) nella directory `~/.rocketpool/alerting/rules/` e riavvia il container Prometheus con `docker stop rocketpool_prometheus` seguito da `docker start rocketpool_prometheus`. Quindi esegui `docker logs rocketpool_prometheus` per confermare che Prometheus abbia caricato correttamente il tuo file di configurazione (dovresti vedere una riga con _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ e non _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
