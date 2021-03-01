import { assign } from 'min-dash'
import DirectEditingTypes from '@/constants/DirectEditingTypes.json'
import ElementUtils from '@/utils/ElementUtils'
import EntityShapeUtils from '@/utils/EntityShapeUtils'
import DataTypeUtils from '@/utils/DataTypeUtils'

export default function EntityDirectEditingProvider (directEditing, eventBus) {
  this._eventBus = eventBus
  directEditing.registerProvider(this);
}

EntityDirectEditingProvider.$inject = [
  'directEditing',
  'eventBus'
]

EntityDirectEditingProvider.prototype.activate = function (element) {
  let context = {}

  if (ElementUtils.isEntity(element)) {
    let shapeDefinition = EntityShapeUtils.getShapeDefinition(element.businessObject.entityType)
    let directEditingDefinition = shapeDefinition.directEditing
    let text
    let property
    switch (directEditingDefinition.type.toLowerCase()) {
      case DirectEditingTypes.PROPERTY:
        property = ElementUtils.getProperty(element, directEditingDefinition.property)
        if (property) {
          text = DataTypeUtils.toEditableString(property.businessObject.dataType, property.businessObject.value)
        }
        break
      default:
      case DirectEditingTypes.DESCRIPTION:
        text = element.businessObject.description || ''
        break
    }

    assign(context, {
      bounds: element.labelBounds || element,
      text
    })
    console.log(context)

    assign(context, {
      options: this.options || {}
    })

    return context
  }
}

EntityDirectEditingProvider.prototype.update = function (element, text, oldText, bounds) {
  if (ElementUtils.isEntity(element)) {
    let shapeDefinition = EntityShapeUtils.getShapeDefinition(element.businessObject.entityType)
    let directEditingDefinition = shapeDefinition.directEditing
    let property
    switch (directEditingDefinition.type.toLowerCase()) {
      case DirectEditingTypes.PROPERTY:
        property = ElementUtils.getProperty(element, directEditingDefinition.property)
        if (property) {
          property.businessObject.value = DataTypeUtils.parseValue(property.businessObject.dataType, text)
          this._eventBus.fire('element.property.changed', {
            element,
            property
          })
        }
        break
      default:
      case DirectEditingTypes.DESCRIPTION:
        element.businessObject.description = text
        this._eventBus.fire('element.description.changed', {
          element
        })
        break
    }
    if (element.labelBounds) {
      let labelBounds = element.labelBounds || element
      assign(labelBounds, bounds)
    }
  }
}

EntityDirectEditingProvider.prototype.setOptions = function (options) {
  this.options = options;
}
