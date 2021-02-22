import {
  assign
} from 'min-dash';

import DataTypeUtils from '@/utils/DataTypeUtils'
import ElementUtils from '@/utils/ElementUtils'

export default function PropertyDirectEditingProvider (directEditing, eventBus) {
  this._eventBus = eventBus
  directEditing.registerProvider(this);
}

PropertyDirectEditingProvider.$inject = [
  'directEditing',
  'eventBus'
]

PropertyDirectEditingProvider.prototype.activate = function (element) {
  let context = {}

  if (ElementUtils.isProperty(element)) {
    assign(context, {
      bounds: element.labelBounds || element,
      text: element.businessObject.value || DataTypeUtils.getDataTypeDefault(element.businessObject.dataType)
    })

    assign(context, {
      options: this.options || {}
    })

    return context
  }

  // if (element.value) {
  //   assign(context, {
  //     bounds: element.labelBounds || element,
  //     text: element.value
  //   })
  //
  //   assign(context, {
  //     options: this.options || {}
  //   })
  //
  //   return context
  // }
}

PropertyDirectEditingProvider.prototype.update = function (element, text, oldText, bounds) {
  // element.label = text
  let eventBus = this._eventBus
  let parsed

  switch (element.businessObject.dataType.toLowerCase()) {
    case 'bool':
      element.businessObject.value = (text === 'true')
      break
    case 'number':
      parsed = parseInt(text, 10)
      if (!isNaN(parsed)) {
        element.businessObject.value = parsed
      }
      break
    default:
    case 'string':
      element.businessObject.value = text
      break
  }

  eventBus.fire('property.changed', {
    element
  })

  var labelBounds = element.labelBounds || element

  assign(labelBounds, bounds)
}

PropertyDirectEditingProvider.prototype.setOptions = function (options) {
  this.options = options;
}
