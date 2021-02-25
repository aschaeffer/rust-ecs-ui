import EntityInstanceFactory from './EntityInstanceFactory'
import ConnectorFactory from './ConnectorFactory'
import PropertyInstanceFactory from './PropertyInstanceFactory'

export default {
  __init__: [
    'entityInstanceFactory',
    'connectorFactory',
    'propertyInstanceFactory',
  ],
  entityInstanceFactory: [ 'type', EntityInstanceFactory ],
  connectorFactory: [ 'type', ConnectorFactory ],
  propertyInstanceFactory: [ 'type', PropertyInstanceFactory ],
}
