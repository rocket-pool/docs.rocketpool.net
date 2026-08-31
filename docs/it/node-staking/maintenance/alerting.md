# Monitorare il tuo Stack Smartnode con Notifiche di Allerta

La funzionalità di notifica degli alert dello Smartnode ti consente di ricevere notifiche sulla salute e sugli eventi importanti del tuo Smartnode Rocket Pool.

## Panoramica del Sistema di Allerta

La funzionalità di notifica utilizza [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) per recapitare gli alert. L'alerting richiede che tu abbia già seguito la guida [Configurare la Dashboard Grafana](../grafana.mdx) che spiega come configurare il tracker delle metriche dello stack Smartnode. Gli alert vengono attivati quando metriche importanti del tuo Smartnode superano determinate soglie o quando si verificano eventi particolari, come quando il fee recipient del tuo nodo viene modificato.

## Configurare le Notifiche Discord

Attualmente, le notifiche possono essere inviate ai canali Discord e alle chat Telegram. Puoi configurare una o entrambe le destinazioni all'interno dell'Interfaccia Utente Testuale (TUI) di Rocket Pool nella pagina "Monitoring / Alerting".

### Aggiungere un URL Webhook Discord:

1. Naviga nel canale Discord desiderato e apri le sue impostazioni.
2. Sotto "Integrazioni", individua e clicca su "Webhook".
3. Clicca su "Crea Webhook".
4. Assegna un nome al tuo webhook e scegli un canale a cui inviare gli alert.
5. Copia l'URL del Webhook fornito.
6. All'interno della TUI di Rocket Pool, naviga alla pagina "Monitoring / Alerting".
7. Incolla l'URL del Webhook copiato nel campo designato e salva la configurazione.

## Configurare le notifiche Telegram

Puoi configurare le notifiche Telegram all'interno dell'Interfaccia Utente Testuale (TUI) di Rocket Pool nella pagina "Monitoring / Alerting". Le notifiche Telegram vengono inviate tramite le API Bot di Telegram. Sono richiesti sia un token del bot sia un ID chat numerico; compilarne solo uno non produce alcun effetto.

### Aggiungere un token del bot e un ID chat Telegram:

1. Apri [@BotFather](https://t.me/BotFather) in Telegram e crea un nuovo bot.
2. Copia il token del bot fornito da BotFather (solo il token — non includere il prefisso `bot`).
3. Decidi se gli avvisi devono essere inviati a una chat privata (DM) con te, a un gruppo o a un canale.
4. Se desideri ricevere gli avvisi in DM, invia prima `/start` al tuo bot. Quindi apri `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in un browser (sostituisci `<YOUR_BOT_TOKEN>` con il token del passaggio 2) e cerca l'oggetto `"chat"`:

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

Il valore `"id"` è l'ID chat che devi impostare nel campo Telegram Chat ID.

5. Se desideri ricevere gli avvisi in un gruppo o in un canale, aggiungi il bot come membro (per i canali il bot deve essere amministratore). Gli ID di gruppi e canali sono negativi (in genere iniziano con `-100`). Una volta che il bot può vedere la chat, usa lo stesso URL `getUpdates` per trovare l'ID chat numerico. I nomi utente come `@mychannel` non funzioneranno.
6. All'interno della TUI di Rocket Pool, vai alla pagina "Monitoring / Alerting".
7. Incolla il token del bot e l'ID chat numerico nei campi designati e salva la configurazione.

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
