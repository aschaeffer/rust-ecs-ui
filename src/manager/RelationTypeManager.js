import type_default_connector from '../mock/types/relation/default_connector.json'
import DataTypes from '@/constants/DataTypes.json'

// Currently mocks / static types
const types = []
types.push(type_default_connector)

function getRelationType (type_name) {
    let found_types = types.filter(t => t.name === type_name)
    if (found_types.length > 0) {
        return found_types[0]
    }
    // Prefix-Search
    found_types = types.filter(t => t.name === type_name.split('--')[0])
    if (found_types.length > 0) {
        return found_types[0]
    }
    return null
}

function getPropertyNames (relationType) {
    return relationType.properties.map(property => property.name)
}

function getPropertyType (relationType, propertyName) {
    if (relationType !== null) {
        let propertyTypes = relationType.properties.filter(t => t.name === propertyName)
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

export default {
    getRelationType,
    getPropertyNames,
    getPropertyType,
    getPropertyDataType,
}
