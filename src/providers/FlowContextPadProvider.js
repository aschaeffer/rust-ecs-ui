import SocketTypes from "@/constants/SocketTypes.json"
import InstanceTypes from "@/constants/InstanceTypes.json"

// TODO: split into multiple files:
// - EntityContextPadProvider
// - PropertyContextPadProvider
// - ConnectorContextPadProvider

export default function FlowContextPadProvider(connect, contextPad, modeling) {
    this._connect = connect
    this._modeling = modeling
    contextPad.registerProvider(this)
}

FlowContextPadProvider.$inject = [
    'connect',
    'contextPad',
    'modeling'
]

FlowContextPadProvider.prototype.getContextPadEntries = function (element) {
    let connect = this._connect
    let modeling = this._modeling

    let removeElement = () => {
        modeling.removeElements([ element ])
    }

    let startConnect = (event, element, autoActivate) => {
        connect.start(event, element, autoActivate)
    }

    let contextPadEntries = {}
    // eslint-disable-next-line no-prototype-builtins
    if (element.hasOwnProperty('businessObject') && typeof element.businessObject !== 'undefined') {
        if (element.businessObject.type === InstanceTypes.ENTITY ||
          element.businessObject.type === InstanceTypes.RELATION
        ) {
            contextPadEntries['delete'] = {
                group: 'edit',
                className: 'bpmn-icon-trash',
                title: 'Remove',
                action: {
                    click: removeElement,
                    dragstart: removeElement
                }
            }
        }

        if (element.businessObject.type === InstanceTypes.PROPERTY &&
          element.businessObject.socketType === SocketTypes.OUTPUT
        ) {
            contextPadEntries['connect'] = {
                group: 'edit',
                className: 'bpmn-icon-connection',
                title: 'Connect',
                action: {
                    click: startConnect,
                    dragstart: startConnect
                }
            }
        }
    }

    return contextPadEntries
};
