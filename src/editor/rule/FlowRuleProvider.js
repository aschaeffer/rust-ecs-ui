import inherits from 'inherits'

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

import SocketTypes from '@/constants/SocketTypes.json'
import InstanceTypes from '@/constants/InstanceTypes.json'
import ElementUtils from '@/utils/ElementUtils'
import DataTypeUtils from '@/utils/DataTypeUtils'

export default function FlowRuleProvider(eventBus) {
  RuleProvider.call(this, eventBus);
}

FlowRuleProvider.$inject = [ 'eventBus' ]

inherits(FlowRuleProvider, RuleProvider)


FlowRuleProvider.prototype.init = function () {
  this.addRule('shape.create', function (context) {
    let target = context.target
    let shape = context.shape
    return target.parent === shape.target;
  })

  // Allow outgoing properties to be the start of a connection
  this.addRule('connection.start', function (context) {
    let source = context.source
    if (!Object.prototype.hasOwnProperty.call(source, 'businessObject') ||
      typeof source.businessObject === 'undefined'
    ) {
      return false
    }
    let sourceBO = source.businessObject
    return sourceBO.type === InstanceTypes.PROPERTY && sourceBO.socketType === SocketTypes.OUTPUT
  })

  this.addRule('connection.create', function (context) {
    let outbound = context.source
    let inbound = context.target
    return ElementUtils.isOutputSocket(outbound) &&
      ElementUtils.isInputSocket(inbound) &&
      !ElementUtils.hasIncomingConnectors(inbound) &&
      inbound.incoming.length < 1 &&
      DataTypeUtils.haveCompatibleDataTypes(outbound, inbound)
  })

  // eslint-disable-next-line no-unused-vars
  this.addRule('connection.reconnect', function (context) {
    console.log(context)
    return false
  })

  this.addRule('shape.resize', function (context) {
    let element = context.shape
    return ElementUtils.isEntity(element) && element.businessObject.entityType.name === 'comment'
  })

  this.addRule('shape.move', function (context) {
    return ElementUtils.isEntity(context.shape)
  })

  // Disallow properties to be moved
  this.addRule('elements.move', function (context) {
    return context.shapes.filter(ElementUtils.isProperty).length === 0
  })

}
