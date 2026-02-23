# 알림 알림으로 Smartnode 스택 모니터링

Smartnode 알림 알림 기능을 사용하면 Rocket Pool Smartnode의 상태 및 중요한 이벤트에 대한 알림을 받을 수 있습니다.

## 알림 시스템 개요

알림 기능은 [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)를 사용하여 알림을 전달합니다. 알림을 사용하려면 Smartnode 스택의 메트릭 추적기 설정을 안내하는 [Grafana 대시보드 설정](../grafana.mdx)을 이미 따라야 합니다. 알림은 Smartnode의 중요한 메트릭이 특정 임계값을 초과하거나 노드의 fee recipient가 변경되는 것과 같은 특정 이벤트가 발생할 때 트리거됩니다.

## Discord 알림 설정

현재 알림은 Discord 채널로 전송할 수 있습니다. "모니터링/알림" 페이지의 Rocket Pool 텍스트 사용자 인터페이스(TUI) 내에서 Discord 알림을 구성할 수 있습니다.

### Discord Webhook URL 추가:

1. 원하는 Discord 채널로 이동하여 설정을 엽니다.
2. "통합"에서 "Webhooks"를 찾아 클릭합니다.
3. "Webhook 만들기"를 클릭합니다.
4. Webhook에 이름을 지정하고 알림을 보낼 채널을 선택합니다.
5. 제공된 Webhook URL을 복사합니다.
6. Rocket Pool TUI 내에서 "모니터링/알림" 페이지로 이동합니다.
7. 복사한 Webhook URL을 지정된 필드에 붙여넣고 구성을 저장합니다.

::: tip 팁
좋아하는 알림이 누락되었나요? Rocket Pool 팀은 추가 알림 대상에 대한 커뮤니티의 피드백을 적극적으로 찾고 있습니다. https://github.com/rocket-pool/smartnode/issues에서 새로운 알림 대상을 제안해 주시기 바랍니다.
:::

## 알림 비활성화 및 활성화

Rocket Pool TUI는 알림을 관리하기 위한 사용자 친화적인 인터페이스를 제공합니다. "모니터링/알림" 페이지를 통해 이 기능에 액세스할 수 있습니다. 이 인터페이스를 사용하면 구성된 모든 알림 목록을 보고 선호도에 따라 개별 알림을 활성화하거나 비활성화할 수 있습니다.

## 고급 구성

::: warning 참고
이 섹션은 Prometheus 및 YAML 파일 수정 경험이 있는 고급 사용자를 위한 것입니다.
:::

더 고급 알림 구성을 위해 Smartnode 스택에서 관리하는 Prometheus 컨테이너에서 사용 가능한 모든 메트릭을 기반으로 고유한 알림을 추가할 수 있습니다. [Prometheus 알림 규칙](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)이 포함된 고유한 yaml 파일을 `~/.rocketpool/alerting/rules/` 디렉토리에 추가하고 해당 규칙을 추가한 다음 `docker stop rocketpool_prometheus`와 `docker start rocketpool_prometheus`를 사용하여 Prometheus 컨테이너를 재시작합니다. 그런 다음 `docker logs rocketpool_prometheus`를 실행하여 Prometheus가 구성 파일을 성공적으로 로드했는지 확인합니다(*msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml*이 포함된 줄이 표시되고 *err="error loading config from \"/etc/prometheus/prometheus.yml\"...*이 표시되지 않아야 합니다).
