import ElementUtils from '@/utils/ElementUtils'

export default function EntityContextPadProvider(contextPad, modeling, directEditing) {
  this._modeling = modeling
  this._directEditing = directEditing
  contextPad.registerProvider(this)
}

EntityContextPadProvider.$inject = [
  'contextPad',
  'modeling',
  'directEditing'
]

EntityContextPadProvider.prototype.getContextPadEntries = function (element) {
  if (!ElementUtils.isEntity(element)) {
    return {}
  }

  let modeling = this._modeling
  let directEditing = this._directEditing

  let removeElement = () => {
    modeling.removeElements([ element ])
  }

  let editElement = () => {
    directEditing.activate(element)
  }

  // let editElementDescription = () => {
  //   directEditing.activate(element, 'description')
  // }

  return {
    'delete': {
      group: 'edit',
      className: 'inexor-ecs-trash',
      title: 'Remove',
      action: {
        click: removeElement,
        dragstart: removeElement
      }
    },
    'edit': {
      group: 'edit',
      className: 'inexor-ecs-pencil-alt',
      title: 'Edit',
      action: {
        click: editElement
      }
    }
    // 'description': {
    //   group: 'edit',
    //   className: 'inexor-ecs-info',
    //   title: 'Edit',
    //   action: {
    //     click: editElementDescription
    //   }
    // }
  }
}
