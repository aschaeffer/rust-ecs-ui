<template>
  <div>
    <b-button-toolbar key-nav justify>
      <b-button-group>
        <div v-if="selection !== null">
          <b-input-group>
            <b-input-group-prepend>
              <b-button>
                {{selection.businessObject.type}}
              </b-button>
            </b-input-group-prepend>
            <b-input-group-prepend>
              <b-button>
                {{selection.businessObject.name}}
              </b-button>
            </b-input-group-prepend>
            <b-form-input v-if="selection.businessObject.type === 'property' && selection.businessObject.dataType === 'string'"
                          v-model="selection.businessObject.value"
                          @update="updateSelectionValue"
                          @keyup.enter.prevent="commitSelectionValue" />
            <b-form-input v-if="selection.businessObject.type === 'property' && selection.businessObject.dataType === 'number'"
                          v-model="selection.businessObject.value"
                          type="number"
                          @update="updateSelectionValue"
                          @keyup.enter.prevent="commitSelectionValue" />
            <b-form-checkbox v-if="selection.businessObject.type === 'property' && selection.businessObject.dataType === 'bool'"
                             v-model="selection.businessObject.value"
                             @change="updateAndCommitSelectionValue" />
            <b-input-group-addon>
              <b-button>
                Action
              </b-button>
            </b-input-group-addon>
          </b-input-group>
        </div>
      </b-button-group>
      <b-button-group class="float-right">
        <b-button @click="toggleSidebar">
          Entities
          <b-icon-list />
        </b-button>
      </b-button-group>
    </b-button-toolbar>
    <div>
      <div class="flow-canvas" ref="container">
      </div>
    </div>
    <flow-editor-entities-sidebar :show-sidebar="showSidebar"
                                  :flow-id="flowId"
                                  @hidden="showSidebar=false"/>
  </div>
</template>

<script>
import EntityInstanceFactory from '@/factory/EntityInstanceFactory'
import EntityShapeManager from '@/manager/EntityShapeManager'
import EntityTypeManager from '@/manager/EntityTypeManager'
import FlowEditorEntitiesSidebar from '@/components/FlowEditorEntitiesSidebar'
import FlowEditorModules from '@/editor/FlowEditorModules'
import FlowManager from '@/manager/FlowManager'
import PropertyInstanceFactory from '@/factory/PropertyInstanceFactory'
import ConnectorFactory from '@/factory/ConnectorFactory'
import RelationTypeManager from '@/manager/RelationTypeManager'
import DataTypeUtils from '@/utils/DataTypeUtils'
import ElementUtils from '@/utils/ElementUtils'
import InstanceTypes from '@/constants/InstanceTypes.json'
import ConnectorTypes from '@/constants/ConnectorTypes.json'

import { connectPoints } from 'diagram-js/lib/layout/ManhattanLayout'
import Diagram from 'diagram-js'

import {
  BButtonToolbar,
  BButtonGroup,
  BButton,
  BFormInput,
  BInputGroup,
  BInputGroupAddon,
  BInputGroupPrepend
} from 'bootstrap-vue'

export default {
  name: 'FlowEditor',
  components: {
    FlowEditorEntitiesSidebar,
    BButtonToolbar,
    BButtonGroup,
    BButton,
    BFormInput,
    BInputGroup,
    BInputGroupAddon,
    BInputGroupPrepend
  },
  props: {
    flowId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      diagram: null,
      canvas: null,
      eventBus: null,
      selection: null,
      rootElement: null,
      showSidebar: false,
      x: 100,
      y: 100,
      margin: {
        x: 100,
        y: 50,
      },
      height: 0
    }
  },
  mounted () {
    this.initEditor()
    let flow = FlowManager.getFlow(this.flowId)
    flow.entities.forEach(entityInstance => this.createEntity(entityInstance))
    flow.relations.forEach(relationInstance => this.createRelation(relationInstance))
  },
  methods: {
    initEditor() {
      let container = this.$refs['container']
      // console.log(FlowEditorModules)
      this.diagram = new Diagram({
        canvas: {
          container
        },
        modules: FlowEditorModules
      })
      this.eventBus = this.diagram.get('eventBus')
      this.eventBus.on('create.end', 250, this.entityCreated)
      this.eventBus.on('connection.added', 250, this.connectorCreated)
      this.eventBus.on('selection.changed', 250, this.select)
      this.eventBus.on('element.dblclick', 250, this.elementDblClick)
      this.eventBus.on('shape.move.end', 250, this.entityMoved)
      this.canvas = this.diagram.get('canvas')
      this.elementFactory = this.diagram.get('elementFactory')
      this.elementRegistry = this.diagram.get('elementRegistry')
      this.overlays = this.diagram.get('overlays')
      this.connectionDocking = this.diagram.get('connectionDocking')
      this.connect = this.diagram.get('connect')
      this.rootElement = this.elementFactory.createRoot({
        id: `flow-${this.flowId}`
      })
      this.canvas.setRootElement(this.rootElement)
    },
    entityCreated (event) {
      let entityInstance = event.shape
      let entityType = EntityTypeManager.getEntityType(entityInstance.businessObject.entityType.name)
      let sockets = EntityTypeManager.getSocketDescriptors(entityType)
      this.createEntitySockets(sockets, entityInstance)
      if (Object.getOwnPropertyDescriptor(event.context, 'outboundProperty') &&
          Object.getOwnPropertyDescriptor(event.context, 'inboundPropertyName') &&
          Object.getOwnPropertyDescriptor(event.context, 'relationTypeName')
      ) {
        let relationTypeName = event.context.relationTypeName
        let outboundProperty = event.context.outboundProperty
        let inboundPropertyName = event.context.inboundPropertyName
        let relationInstanceTypeName = `${relationTypeName}-${outboundProperty.businessObject.name}-${inboundPropertyName}`
        entityInstance.children
            .filter(p => p.businessObject.name === inboundPropertyName)
            .forEach(inboundProperty => {
              let connection = ConnectorFactory.connectProperties(
                  this.elementFactory,
                  relationTypeName,
                  outboundProperty,
                  relationInstanceTypeName,
                  inboundProperty
              )
              connection.waypoints = this.connectionDocking.getCroppedWaypoints(connection);
              this.canvas.addConnection(connection, this.rootElement)
              this.autoLayoutConnector(connection)
            })
      }
      // TODO: Register in flow
    },
    // TODO: entityRemoved
    connectorCreated (event) {
      let connector = event.element
      // eslint-disable-next-line no-prototype-builtins
      if (connector.hasOwnProperty('businessObject') && typeof connector.businessObject !== 'undefined') {
        return
      }

      let outboundId = connector.source.id
      let inboundId = connector.target.id

      let outboundPropertyName = connector.source.businessObject.name
      let inboundPropertyName = connector.target.businessObject.name

      let relationTypeName = ConnectorTypes.DEFAULT_CONNECTOR
      let relationType = RelationTypeManager.getRelationType(relationTypeName)
      let relationInstanceTypeName = `${relationTypeName}-${outboundPropertyName}-${inboundPropertyName}`

      connector.businessObject = {
        type: InstanceTypes.RELATION,
        relationType,
        name: relationInstanceTypeName,
        outboundPropertyName: outboundPropertyName,
        inboundPropertyName: inboundPropertyName,
      }
      connector.waypoints = connectPoints(connector.waypoints[0], connector.waypoints[1])
      connector.waypoints = this.connectionDocking.getCroppedWaypoints(connector);

      let outboundPropertyShapeId = `${outboundId}-${outboundPropertyName}`
      let inboundPropertyShapeId = `${inboundId}-${inboundPropertyName}`
      let edgeKey = `${outboundPropertyShapeId}-${relationTypeName}-${inboundPropertyShapeId}`
      this.elementRegistry.updateId(connector, edgeKey)
      // TODO: Register connector in flow
    },
    // TODO: connectorRemoved
    createEntity (entityInstance) {
      let entityType = EntityTypeManager.getEntityType(entityInstance.type)
      let shapeDefinition = EntityShapeManager.getShapeDefinition(entityType)

      let entityInstanceShape = EntityInstanceFactory.createEntityInstance(
        this.elementFactory,
        entityInstance.type,
        this.x,
        this.y,
        entityInstance.id
      )
      this.canvas.addShape(entityInstanceShape, this.rootElement)

      let sockets = EntityTypeManager.getSocketDescriptors(entityType)
      this.createEntitySockets(sockets, entityInstanceShape, entityInstance)

      // Move pointer for next element
      this.x = this.x + shapeDefinition.entity.width + this.margin.x
      this.height = Math.max(this.height, entityInstanceShape.height)
      if (this.x > 1024) {
        this.x = 100
        this.y = this.y + this.height + this.margin.y
        this.height = 0
      }
    },
    // eslint-disable-next-line no-unused-vars
    createRelation (relationInstance) {
      // console.log(relationInstance)
      // TODO: Get outboundId, get inboundId
      // TODO: Get outboundPropertyName, get inboundPropertyName
      // eslint-disable-next-line no-unused-vars
      let relationType = RelationTypeManager.getRelationType(relationInstance.type)
      // console.log(relationType.name)
      if (relationType.name === ConnectorTypes.DEFAULT_CONNECTOR) {
        // console.log(`Connector ${relationInstance.outbound_id}.${relationInstance.properties.outbound_property_name} ${relationInstance.inbound_id}.${relationInstance.properties.inbound_property_name}`)
        let connection = ConnectorFactory.createConnectorInstance(
          this.elementFactory,
          this.elementRegistry,
          relationType.name,
          relationInstance.outbound_id,
          relationInstance.properties.outbound_property_name,
          relationInstance.type,
          relationInstance.inbound_id,
          relationInstance.properties.inbound_property_name,
        )
        connection.waypoints = this.connectionDocking.getCroppedWaypoints(connection);
        this.canvas.addConnection(connection, this.rootElement)
      }
    },
    createEntitySockets (sockets, entityInstanceShape, entityInstance) {
      sockets.input.forEach((socket, idx) => {
        let value = this.getPropertyValue(entityInstance, socket)
        const propertyShape = PropertyInstanceFactory.createEntityProperty(this.elementFactory, socket, idx, entityInstanceShape, value)
        return this.canvas.addShape(propertyShape, entityInstanceShape)
      })

      sockets.output.forEach((socket, idx) => {
        let value = this.getPropertyValue(entityInstance, socket)
        const propertyShape = PropertyInstanceFactory.createEntityProperty(this.elementFactory, socket, idx, entityInstanceShape, value)
        return this.canvas.addShape(propertyShape, entityInstanceShape)
      })
    },
    getPropertyValue (entityInstance, socket) {
      try {
        return entityInstance.properties[socket.propertyName]
      } catch {
        return DataTypeUtils.getDataTypeDefault(socket.dataType)
      }
    },
    select (event) {
      if (event.newSelection.length === 1) {
        let selection = event.newSelection[0]
        if (ElementUtils.hasBusinessObject(selection)) {
          this.selection = selection
        }
      }
    },
    updateAndCommitSelectionValue () {
      this.updateSelectionValue()
      this.commitSelectionValue()
    },
    rerenderElement (element) {
      this.eventBus.fire('shape.changed', {
        element,
        gfx: this.elementRegistry.getGraphics(element)
      })
    },
    rerenderConnector (element) {
      this.eventBus.fire('connection.changed', {
        element,
        gfx: this.elementRegistry.getGraphics(element)
      })
    },
    entityMoved (event) {
      if (ElementUtils.isEntity(event.shape)) {
        this.autoLayoutEntity(event.shape)
      }
    },
    autoLayoutEntity (element) {
      if (ElementUtils.isEntity(element)) {
        element.children.forEach(this.autoLayoutProperty)
      }
    },
    autoLayoutProperty (element) {
      if (ElementUtils.isProperty(element)) {
        element.incoming.forEach(this.autoLayoutRelation)
        element.outgoing.forEach(this.autoLayoutRelation)
      }
    },
    autoLayoutRelation (element) {
      if (ElementUtils.isDefaultConnector(element)) {
        this.autoLayoutConnector(element)
      }
    },
    autoLayoutConnector (connector) {
      connector.waypoints = connectPoints(connector.waypoints[0], connector.waypoints[connector.waypoints.length - 1])
      connector.waypoints = this.connectionDocking.getCroppedWaypoints(connector);
      this.rerenderConnector(connector)
    },
    updateSelectionValue () {
      this.rerenderElement(this.selection)
    },
    commitSelectionValue () {
      console.log('TODO: commit selection value')
    },
    elementDblClick (event) {
      let element = event.element
      if (ElementUtils.isOutputSocket(element)) {
        this.connect.start(event.originalEvent, element, true)
      }
      if (ElementUtils.isDefaultConnector(element)) {
        this.autoLayoutConnector(element)
      }
      if (ElementUtils.isEntity(element)) {
        this.autoLayoutEntity(element)
      }
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  },
}
</script>

<style>
.flow-canvas {
  /*height: 100%;*/
  height: 1024px;
  width: 100%;
  border: 1px dashed rgba(255, 0, 255, 0.2);
}

#canvas,
#canvas > div {
  margin: 0;

}

/*.djs-overlay-context-pad {*/
/*  background: white;*/
/*  height: 40px;*/
/*  padding: 5px;*/
/*  border: 2px solid fuchsia;*/
/*  border-radius: 0 10px 10px 0;*/
/*}*/

.context-pad-icon-remove {
  background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20width%3D%2246%22%20height%3D%2246%22%3E%3Cline%20x1%3D%225%22%20y1%3D%225%22%20x2%3D%2215%22%20y2%3D%2215%22%2F%3E%3Cline%20x1%3D%2215%22%20y1%3D%225%22%20x2%3D%225%22%20y2%3D%2215%22%2F%3E%3C%2Fsvg%3E') !important;
}

.context-pad-icon-connect {
  background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20width%3D%2246%22%20height%3D%2246%22%3E%3Cline%20x1%3D%2215%22%20y1%3D%225%22%20x2%3D%225%22%20y2%3D%2215%22%2F%3E%3C%2Fsvg%3E') !important;
}

/* .hover   .dj-element .dj-shape */

</style>
