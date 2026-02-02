# Configuración de votación para usuarios sin smartnode

Algunos usuarios (por ejemplo, usuarios de Allnodes) no usan el smartnode y pueden necesitar configurar la votación usando interacción directa con contratos.
Esta guía contiene tanto una guía de configuración mínima como completa para dichos usuarios.

::: tip
Tu dirección de nodo debería estar cargada en una wallet de hardware para esto.
:::

## Guía de configuración mínima

Esto permite que tu delegado vote por ti on-chain y offchain. Podrás anular tu delegado on-chain, pero no off-chain.

- Usa etherscan para inicializar el poder de voto ("Connect to Web3" con la dirección del nodo) con un delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Puedes encontrar delegados en https://delegates.rocketpool.net/

## Guía de configuración completa

Usa etherscan para inicializar el poder de voto ("Connect to Web3" con la dirección del nodo)

- [recomendado para la mayoría] Inicializa la votación con un nodo diferente como delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Puedes encontrar delegados en https://delegates.rocketpool.net/
  - Recuerda que siempre podrás anular a tus delegados
- Inicializa la votación con tu propio nodo como delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Aquí serás responsable de votar cada vez
  - Sugeriría principalmente esta opción para personas que deseen ser delegados ya que _necesitan_ votar cada vez.
- Si tu nodo fue registrado después de Houston:
  - Ya tendrás tu poder de voto inicializado con tu propio nodo como delegado
  - Puedes establecer un nuevo delegado con https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Establece la dirección de señalización de snapshot:

- Ve a https://node.rocketpool.net/signalling-address y conecta la dirección de tu nodo
  - Ingresa tu dirección de señalización de snapshot deseada y firma el mensaje para obtener los argumentos r, s y v que necesitarás
  - Nota: tu dirección de señalización de snapshot NO DEBE ser la dirección de tu nodo
- En una nueva pestaña, ve a https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Connect to Web3" con la dirección del nodo
  - Completa los argumentos con tu dirección de señalización y los parámetros r, s, v proporcionados en el paso anterior
