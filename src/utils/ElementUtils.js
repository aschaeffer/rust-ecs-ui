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

function getProperties (element, x, y, width, height) {
  let properties = element.children.reduce(
    (properties, propertyInstance) => Object.assign(
      properties,
      {
        [propertyInstance.businessObject.name]: propertyInstance.businessObject.value
      }
    ),
    {}
  )
  if (typeof x === 'number') {
    properties.f2dx = x
  }
  if (typeof y === 'number') {
    properties.f2dy = y
  }
  if (typeof x === 'number') {
    properties.f2dw = width
  }
  if (typeof y === 'number') {
    properties.f2dh = height
  }
  return properties
}

function getProperty (element, propertyName) {
  let result = element.children.filter(child => {
    return isProperty(child) && child.businessObject.name === propertyName
  })
  if (result.length > 0) {
    return result[0]
  }
  return null
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
  getProperties,
  getProperty
}
