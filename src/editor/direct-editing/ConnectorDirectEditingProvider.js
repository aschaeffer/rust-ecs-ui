import {
  assign
} from 'min-dash';
import ElementUtils from '@/utils/ElementUtils'

export default function ConnectorDirectEditingProvider (directEditing, eventBus) {
  this._eventBus = eventBus
  directEditing.registerProvider(this);

  this.options = {
    centerVertically: true,

  }
}

ConnectorDirectEditingProvider.$inject = [
  'directEditing',
  'eventBus'
]

ConnectorDirectEditingProvider.prototype.activate = function (element) {
  let context = {}

  if (ElementUtils.isRelation(element)) {
    let bounds = {
      x: Math.min(element.waypoints[0].x, element.waypoints[element.waypoints.length - 1].x),
      y: Math.min(element.waypoints[0].y, element.waypoints[element.waypoints.length - 1].y),
      width: Math.abs(element.waypoints[element.waypoints.length - 1].x - element.waypoints[0].x),
      height: Math.abs(element.waypoints[element.waypoints.length - 1].y - element.waypoints[0].y)
    }

    assign(context, {
      bounds,
      text: element.businessObject.description || ''
    })

    assign(context, {
      options: this.options || {}
    })

    return context
  }
}

ConnectorDirectEditingProvider.prototype.update = function (element, text, oldText, bounds) {
  element.businessObject.description = text

  this._eventBus.fire('element.description.changed', {
    element
  })

  let labelBounds = element.labelBounds || element

  assign(labelBounds, bounds)
}

ConnectorDirectEditingProvider.prototype.setOptions = function (options) {
  this.options = options;
}
