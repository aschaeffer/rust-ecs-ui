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

  this.addRule('shape.resize', function () {
    return false
  })

  this.addRule('shape.move', function (context) {
    return ElementUtils.isEntity(context.shape)
  })

  // Disallow properties to be moved
  this.addRule('elements.move', function (context) {
    return context.shapes.filter(ElementUtils.isProperty).length === 0
  })

}
