import EntityInstanceFactory from './EntityInstanceFactory'
import ConnectorFactory from './ConnectorFactory'

export default {
  __init__: [
    'entityInstanceFactory',
    'connectorFactory',
  ],
  entityInstanceFactory: [ 'type', EntityInstanceFactory ],
  connectorFactory: [ 'type', ConnectorFactory ],
}
