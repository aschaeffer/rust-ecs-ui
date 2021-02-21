import InstanceTypes from '@/constants/InstanceTypes.json'
import ConnectorTypes from '@/constants/ConnectorTypes.json'
import SocketTypes from '@/constants/SocketTypes.json'

function isProperty (element) {
    return hasBusinessObject(element) && element.businessObject.type === InstanceTypes.PROPERTY
}

function isOutputSocket (element) {
    return isProperty(element) && element.businessObject.socketType === SocketTypes.OUTPUT
}

function isInputSocket (element) {
    return isProperty(element) && element.businessObject.socketType === SocketTypes.INPUT
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

export default {
    isProperty,
    isOutputSocket,
    isInputSocket,
    isEntity,
    isRelation,
    isDefaultConnector,
    hasBusinessObject
}
