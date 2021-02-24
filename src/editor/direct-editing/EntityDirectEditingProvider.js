import {
  assign
} from 'min-dash';
import ElementUtils from '@/utils/ElementUtils'

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
    console.log(element)
    assign(context, {
      bounds: element.labelBounds || element,
      text: element.businessObject.description || ''
    })

    assign(context, {
      options: this.options || {}
    })

    return context
  }
}

EntityDirectEditingProvider.prototype.update = function (element, text, oldText, bounds) {
  element.businessObject.description = text

  this._eventBus.fire('element.description.changed', {
    element
  })

  let labelBounds = element.labelBounds || element

  assign(labelBounds, bounds)
}

EntityDirectEditingProvider.prototype.setOptions = function (options) {
  this.options = options;
}
