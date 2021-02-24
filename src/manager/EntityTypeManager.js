import SocketTypes from "@/constants/SocketTypes.json"
import DataTypes from "@/constants/DataTypes.json"

export default function EntityTypeManager(componentManager) {

  this._componentManager = componentManager

  this.types = []

  // Currently mocks / static components
  this.importAllTypes(require.context('../mock/types/entity/', true, /\.json$/))
  // console.log(this.types.map(t => t.name))
}

EntityTypeManager.$inject = [
  'componentManager'
]

EntityTypeManager.prototype.importAllTypes = function (r) {
  r.keys().forEach((key) => this.types.push(r(key)))
}

EntityTypeManager.prototype.getEntityTypes = function () {
  return this.types
}

EntityTypeManager.prototype.getEntityType = function (type_name) {
  let found_types = this.types.filter(t => t.name === type_name)
  if (found_types.length > 0) {
    return found_types[0]
  }
  return {
    name: type_name,
    description: '',
    components: [],
    behaviours: [],
    properties: []
  }
}

EntityTypeManager.prototype.getPropertyNames = function (entityType) {
  let propertyNames = new Set()
  if (entityType !== null) {
    if (Object.getOwnPropertyDescriptor(entityType, 'properties')) {
      entityType.properties.map(property => property.name).reduce((propertyNames, propertyName) => propertyNames.add(propertyName), propertyNames)
    }
    if (Object.getOwnPropertyDescriptor(entityType, 'components')) {
      entityType.components.forEach(componentName => {
        let component = this._componentManager.getComponent(componentName)
        if (component !== null) {
          this._componentManager.getPropertyNames(component).reduce((propertyNames, propertyName) => propertyNames.add(propertyName), propertyNames) // propertyNames.add(propertyName)
        }
      })
    }
  }
  return Array.from(propertyNames)
}

EntityTypeManager.prototype.getPropertyType = function (entityType, propertyName) {
  if (entityType !== null) {
    if (Object.getOwnPropertyDescriptor(entityType, 'properties')) {
      let propertyTypes = entityType.properties.filter(t => t.name === propertyName)
      if (propertyTypes.length > 0) {
        return propertyTypes[0]
      }
    }
    if (Object.getOwnPropertyDescriptor(entityType, 'components')) {
      for (let componentName of entityType.components) {
        let component = this._componentManager.getComponent(componentName)
        if (component !== null) {
          let propertyType = this._componentManager.getPropertyType(component, propertyName)
          if (propertyType !== null) {
            return propertyType
          }
        }
      }
    }
  }
  return null
}

EntityTypeManager.prototype.getPropertyDataType = function (propertyType) {
  if (propertyType !== null && Object.getOwnPropertyDescriptor(propertyType, 'data_type')) {
    return propertyType.data_type
  }
  return DataTypes.ANY
}

EntityTypeManager.prototype.getPropertySocketType = function (propertyType) {
  if (propertyType !== null &&
    Object.getOwnPropertyDescriptor(propertyType, 'socket_type')
  ) {
    return propertyType.socket_type
  }
  return SocketTypes.NONE
}

EntityTypeManager.prototype.getSocketDescriptors = function (entityType) {
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

EntityTypeManager.prototype.getGroupName = function (entityType) {
  return Object.getOwnPropertyDescriptor(entityType, 'group') ? entityType.group : 'default'
}

EntityTypeManager.prototype.getGroupNames = function () {
  let groupNames = new Set()
  this.types.forEach(entityType => groupNames.add(this.getGroupName(entityType)))
  return Array.from(groupNames)
}

EntityTypeManager.prototype.getEntityTypesByGroupName = function (groupName) {
  return this.types.filter(entityType => this.getGroupName(entityType) === groupName)
}

// export default {
//   getEntityTypes,
//   getEntityType,
//   getPropertyNames,
//   getPropertyType,
//   getPropertyDataType,
//   getPropertySocketType,
//   getSocketDescriptors,
//   getGroupNames,
//   getEntityTypesByGroupName
// }
