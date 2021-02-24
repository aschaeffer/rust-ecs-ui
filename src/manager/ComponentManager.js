import SocketTypes from '@/constants/SocketTypes.json'
import DataTypes from '@/constants/DataTypes.json'

export default function ComponentManager() {
  // Currently mocks / static components
  this.components = []
  this.importAll(require.context('../mock/components/', true, /\.json$/))
  // console.log(this.components.map(t => t.name))
}

ComponentManager.prototype.importAll = function (r) {
  r.keys().forEach((key) => this.components.push(r(key)))
}

ComponentManager.prototype.getComponents = function () {
  return this.components
}

ComponentManager.prototype.getComponent = function (component_name) {
  let found_components = this.components.filter(c => c.name === component_name)
  if (found_components.length > 0) {
    return found_components[0]
  }
  return null
}

ComponentManager.prototype.getPropertyNames = function (component) {
  return component.properties.map(property => property.name)
}

ComponentManager.prototype.getPropertyType = function (component, propertyName) {
  if (component !== null) {
    let propertyTypes = component.properties.filter(c => c.name === propertyName)
    if (propertyTypes.length > 0) {
      return propertyTypes[0]
    }
  }
  return null
}

ComponentManager.prototype.getPropertyDataType = function (propertyType) {
  if (propertyType !== null &&
    Object.prototype.hasOwnProperty.call(propertyType, 'data_type')
  ) {
    return propertyType.data_type
  }
  return DataTypes.ANY
}

ComponentManager.prototype.getPropertySocketType = function (propertyType) {
  if (propertyType !== null &&
    Object.prototype.hasOwnProperty.call(propertyType, 'socket_type')
  ) {
    return propertyType.socket_type
  }
  return SocketTypes.NONE
}

ComponentManager.prototype.getSocketDescriptors = function (entityType) {
  let propertyNames = this.getPropertyNames(entityType)
  let sockets = {
    input: [],
    output: []
  }
  for (const propertyName of propertyNames) {
    let propertyType = this.getPropertyType(entityType, propertyName)
    let propertySocketType = this.getPropertySocketType(propertyType)
    let propertyDataType = this.getPropertyDataType(propertyType)
    let socketDescriptor = {
      entityType,
      propertyName,
      propertyType,
      propertyDataType,
      propertySocketType
    }
    switch (propertySocketType) {
      case SocketTypes.INPUT:
        sockets.input.push(socketDescriptor);
        break
      case SocketTypes.OUTPUT:
        sockets.output.push(socketDescriptor)
        break
      default:
        break
    }
  }
  return sockets
}
