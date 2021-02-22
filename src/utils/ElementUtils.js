import InstanceTypes from '@/constants/InstanceTypes.json'
import ConnectorTypes from '@/constants/ConnectorTypes.json'
import SocketTypes from '@/constants/SocketTypes.json'

function isProperty (element) {
    return hasBusinessObject(element) && element.businessObject.type === InstanceTypes.PROPERTY
}

function isOutputSocket (element) {
    return isProperty(element) && element.businessObject.socketType === SocketTypes.OUTPUT
}

function hasOutgoingConnectors (element) {
  return isOutputSocket(element) && element.outgoing.length > 0
}

function isInputSocket (element) {
    return isProperty(element) && element.businessObject.socketType === SocketTypes.INPUT
}

function hasIncomingConnectors (element) {
  return isInputSocket(element) && element.incoming.length > 0
}

function isEntity (element) {
    return hasBusinessObject(element) && element.businessObject.type === InstanceTypes.ENTITY
}

function isRelation (element) {
    return hasBusinessObject(element) && element.businessObject.type === InstanceTypes.RELATION
}

function isDefaultConnector (element) {
    return isRelation(element) && element.businessObject.relationType.name === ConnectorTypes.DEFAULT_CONNECTOR
}

function hasBusinessObject (element) {
    return Object.getOwnPropertyDescriptor(element, 'businessObject') && typeof element.businessObject !== 'undefined'
}

function getProperties (element) {
  return element.children.reduce(
    (properties, propertyInstance) => Object.assign(
      properties,
      {
        [propertyInstance.businessObject.name]: propertyInstance.businessObject.value
      }
    ),
    {}
  )
}

export default {
  isProperty,
  isOutputSocket,
  hasOutgoingConnectors,
  isInputSocket,
  hasIncomingConnectors,
  isEntity,
  isRelation,
  isDefaultConnector,
  hasBusinessObject,
  getProperties
}
