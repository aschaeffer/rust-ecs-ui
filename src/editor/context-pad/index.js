import EntityContextPadProvider from './EntityContextPadProvider'
import ConnectorContextPadProvider from './ConnectorContextPadProvider'
import PropertyContextPadProvider from './PropertyContextPadProvider'

export default {
  __init__: [
    'entityContextPadProvider',
    'connectorContextPadProvider',
    'propertyContextPadProvider',
  ],
  entityContextPadProvider: [ 'type', EntityContextPadProvider ],
  connectorContextPadProvider: [ 'type', ConnectorContextPadProvider ],
  propertyContextPadProvider: [ 'type', PropertyContextPadProvider ],
}
