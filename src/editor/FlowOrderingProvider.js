import inherits from 'inherits'

import OrderingProvider from "diagram-js/lib/features/ordering/OrderingProvider"

import InstanceTypes from "@/constants/InstanceTypes.json"
// import ConnectorTypes from "@/constants/ConnectorTypes.json"

/**
 * An abstract provider that allows modelers to implement a custom
 * ordering of diagram elements on the canvas.
 *
 * It makes sure that the order is always preserved during element
 * creation and move operations.
 *
 * In order to use this behavior, inherit from it and override
 * the method {@link OrderingProvider#getOrdering}.
 *
 * @example
 *
 * ```javascript
 * function CustomOrderingProvider(eventBus) {
 *   OrderingProvider.call(this, eventBus);
 *
 *   this.getOrdering = function(element, newParent) {
 *     // always insert elements at the front
 *     // when moving
 *     return {
 *       index: 0,
 *       parent: newParent
 *     };
 *   };
 * }
 * ```
 *
 * @param {EventBus} eventBus
 */
export default function FlowOrderingProvider() {

  // CommandInterceptor.call(this, eventBus)

}

/**
 * Return a custom ordering of the element, both in terms
 * of parent element and index in the new parent.
 *
 * Implementors of this method must return an object with
 * `parent` _and_ `index` in it.
 *
 * @param {djs.model.Base} element
 * @param {djs.model.Shape} newParent
 *
 * @return {Object} ordering descriptor
 */
FlowOrderingProvider.prototype.getOrdering = function(element, newParent) {
  // eslint-disable-next-line no-prototype-builtins
  if (!element.hasOwnProperty('businessObject') ||
    element.businessObject !== undefined ||
    // eslint-disable-next-line no-prototype-builtins
    element.businessObject.hasOwnProperty('type')
  ) {
    return null
  }
  let index
  switch (element.businessObject.type) {
    case InstanceTypes.RELATION:
      index = 1
      break
    case InstanceTypes.ENTITY:
      index = 2
      break
    case InstanceTypes.PROPERTY:
      index = 3
      break
    default:
      index = 0;
      break
  }
  console.log(element.businessObject.type, index)
    // element.businessObject.type === InstanceTypes.RELATION &&
    // element.businessObject.relationType.name === ConnectorTypes.DEFAULT_CONNECTOR

  return {
    index,
    parent: newParent
  }

}

inherits(FlowOrderingProvider, OrderingProvider)
