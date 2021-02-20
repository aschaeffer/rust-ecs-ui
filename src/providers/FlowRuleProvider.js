import inherits from 'inherits';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import SocketTypes from "@/constants/SocketTypes.json"
import InstanceTypes from "@/constants/InstanceTypes.json"
import DataTypes from "@/constants/DataTypes.json"

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
        let source = context.source
        let target = context.target
        if (!Object.prototype.hasOwnProperty.call(source, 'businessObject') ||
            !Object.prototype.hasOwnProperty.call(target, 'businessObject') ||
            typeof source.businessObject === 'undefined' ||
            typeof target.businessObject === 'undefined'
        ) {
            return false
        }
        let sourceBO = source.businessObject
        let targetBO = target.businessObject

        return sourceBO.type === InstanceTypes.PROPERTY && targetBO.type === InstanceTypes.PROPERTY &&
            sourceBO.socketType === SocketTypes.OUTPUT && targetBO.socketType === SocketTypes.INPUT &&
            (
                sourceBO.dataType === DataTypes.ANY ||
                targetBO.dataType === DataTypes.ANY ||
                sourceBO.dataType === targetBO.dataType
            ) &&
            target.incoming.length < 1
    })

    this.addRule('shape.resize', function () {
        return false
    })

    this.addRule('shape.move', function (context) {
        let shape = context.shape;
        return shape.businessObject.type === InstanceTypes.ENTITY
    })

    // Disallow properties to be moved
    this.addRule('elements.move', function (context) {
        let shapes = context.shapes
        return shapes.filter(s => s.businessObject.type === InstanceTypes.PROPERTY).length === 0
    })

}
