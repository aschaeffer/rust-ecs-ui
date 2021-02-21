import ElementUtils from '@/utils/ElementUtils'

export default function EntityContextPadProvider(contextPad, modeling) {
  this._modeling = modeling
  contextPad.registerProvider(this)
}

EntityContextPadProvider.$inject = [
  'contextPad',
  'modeling'
]

EntityContextPadProvider.prototype.getContextPadEntries = function (element) {
  if (!ElementUtils.isEntity(element)) {
    return {}
  }

  let modeling = this._modeling

  let removeElement = () => {
    modeling.removeElements([ element ])
  }

  return {
    'delete': {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: 'Remove',
      action: {
        click: removeElement,
        dragstart: removeElement
      }
    }
  }
}
