import DataTypes from '@/constants/DataTypes.json'

export default function RelationTypeManager(componentManager) {

    this._componentManager = componentManager

    this.types = []

    // Currently mocks / static components
    this.importAllTypes(require.context('../mock/types/relation/', true, /\.json$/))
    // console.log(this.types.map(t => t.name))
}

RelationTypeManager.$inject = [
    'componentManager'
]

RelationTypeManager.prototype.importAllTypes = function (r) {
    r.keys().forEach((key) => this.types.push(r(key)))
}

RelationTypeManager.prototype.getRelationTypes = function () {
    return this.types
}

RelationTypeManager.prototype.getRelationType = function (type_name) {
    let found_types = this.types.filter(t => t.name === type_name)
    if (found_types.length > 0) {
        return found_types[0]
    }
    // Prefix-Search
    found_types = this.types.filter(t => t.name === type_name.split('--')[0])
    if (found_types.length > 0) {
        return found_types[0]
    }
    return null
}

RelationTypeManager.prototype.getPropertyNames = function (relationType) {
    let propertyNames = new Set()
    if (relationType !== null) {
        if (Object.getOwnPropertyDescriptor(relationType, 'properties')) {
            relationType.properties.map(property => property.name).reduce((propertyNames, propertyName) => propertyNames.add(propertyName), propertyNames)
        }
        if (Object.getOwnPropertyDescriptor(relationType, 'components')) {
            relationType.components.forEach(componentName => {
                let component = this._componentManager.getComponent(componentName)
                if (component !== null) {
                    this._componentManager.getPropertyNames(component).reduce((propertyNames, propertyName) => propertyNames.add(propertyName), propertyNames) // propertyNames.add(propertyName)
                }
            })
        }
    }
    return Array.from(propertyNames)
}

RelationTypeManager.prototype.getPropertyType = function (relationType, propertyName) {
    if (relationType !== null) {
        if (Object.getOwnPropertyDescriptor(relationType, 'properties')) {
            let propertyTypes = relationType.properties.filter(t => t.name === propertyName)
            if (propertyTypes.length > 0) {
                return propertyTypes[0]
            }
        }
        if (Object.getOwnPropertyDescriptor(relationType, 'components')) {
            for (let componentName of relationType.components) {
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

RelationTypeManager.prototype.getPropertyDataType = function (propertyType) {
    if (propertyType !== null && Object.getOwnPropertyDescriptor(propertyType, 'data_type')) {
        return propertyType.data_type
    }
    return DataTypes.ANY
}
