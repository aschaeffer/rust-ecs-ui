import SocketTypes from "@/constants/SocketTypes.json"
import DataTypes from "@/constants/DataTypes.json"
import type_value from '../mock/types/entity/value/value.json'
import type_and from '../mock/types/entity/logical_gates/and.json'
import type_or from '../mock/types/entity/logical_gates/or.json'
import type_divide from '../mock/types/entity/arithmetic_gates/divide.json'
import type_add from '../mock/types/entity/arithmetic_gates/add.json'
import type_sub from '../mock/types/entity/arithmetic_gates/sub.json'
import type_mul from '../mock/types/entity/arithmetic_gates/mul.json'
import type_greater_than from '../mock/types/entity/comparison_gates/greater_than.json'
import type_concat from '../mock/types/entity/string_gates/concat.json'
import type_to_string from '../mock/types/entity/converter/to_string.json'
import type_perlin_noise_4d from '../mock/types/entity/texture/perlin_noise_4d.json'

// Currently mocks / static types
const types = []
types.push(type_value)
types.push(type_and)
types.push(type_or)
types.push(type_divide)
types.push(type_add)
types.push(type_sub)
types.push(type_mul)
types.push(type_greater_than)
types.push(type_concat)
types.push(type_to_string)
types.push(type_perlin_noise_4d)

function getEntityTypes () {
  return types
}

function getEntityType (type_name) {
  let found_types = types.filter(t => t.name === type_name)
  if (found_types.length > 0) {
    return found_types[0]
  }
  return null
}

function getPropertyNames (entityType) {
  return entityType.properties.map(property => property.name)
}

function getPropertyType (entityType, propertyName) {
  if (entityType !== null) {
    let propertyTypes = entityType.properties.filter(t => t.name === propertyName)
    if (propertyTypes.length > 0) {
      return propertyTypes[0]
    }
  }
  return null
}

function getPropertyDataType(propertyType) {
  if (propertyType !== null &&
    Object.prototype.hasOwnProperty.call(propertyType, 'data_type')
  ) {
    return propertyType.data_type
  }
  return DataTypes.ANY
}

function getPropertySocketType(propertyType) {
  if (propertyType !== null &&
    Object.prototype.hasOwnProperty.call(propertyType, 'socket_type')
  ) {
    return propertyType.socket_type
  }
  return SocketTypes.NONE
}

function getSocketDescriptors(entityType) {
  let propertyNames = getPropertyNames(entityType)
  let sockets = {
    input: [],
    output: []
  }
  for (const propertyName of propertyNames) {
    let propertyType = getPropertyType(entityType, propertyName)
    let propertySocketType = getPropertySocketType(propertyType)
    let propertyDataType = getPropertyDataType(propertyType)
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

export default {
  getEntityTypes,
  getEntityType,
  getPropertyNames,
  getPropertyType,
  getPropertyDataType,
  getPropertySocketType,
  getSocketDescriptors
}
