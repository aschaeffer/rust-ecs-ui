<template>
  <div>
    <b-button-toolbar key-nav justify>
      <b-button-group size="sm">
        <b-breadcrumb style="background: transparent; height: 16px;">
          <b-breadcrumb-item v-if="flow !== null">
            Flow {{flow.description || flow.id}}
          </b-breadcrumb-item>
          <b-breadcrumb-item v-if="selection !== null && selection.businessObject.type === 'property'">
            {{selection.parent.businessObject.type}}
          </b-breadcrumb-item>
          <b-breadcrumb-item v-if="selection !== null && selection.businessObject.type === 'property'">
            {{selection.parent.businessObject.description || selection.id }}
          </b-breadcrumb-item>
          <b-breadcrumb-item v-if="selection !== null">
            {{selection.businessObject.type}}
          </b-breadcrumb-item>
          <b-breadcrumb-item v-if="selection !== null && selection.businessObject.type === 'property'">
            {{selection.businessObject.name || selection.id }}
          </b-breadcrumb-item>
          <b-breadcrumb-item v-if="selection !== null && selection.businessObject.type !== 'property'">
            {{selection.businessObject.description || selection.id }}
          </b-breadcrumb-item>
        </b-breadcrumb>
      </b-button-group>
      <b-button-group size="sm" class="float-right">
        <b-button variant="primary" @click="exportFlow">
          Export
        </b-button>
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
import EntityShapeManager from '@/utils/EntityShapeUtils'
import FlowEditorEntitiesSidebar from '@/components/FlowEditorEntitiesSidebar'
import FlowEditorModules from '@/editor/FlowEditorModules'
import FlowManager from '@/manager/FlowManager'
import DataTypeUtils from '@/utils/DataTypeUtils'
import ElementUtils from '@/utils/ElementUtils'
import InstanceTypes from '@/constants/InstanceTypes.json'
import ConnectorTypes from '@/constants/ConnectorTypes.json'
import SocketTypes from '@/constants/SocketTypes.json'

import { connectPoints } from 'diagram-js/lib/layout/ManhattanLayout'
import Diagram from 'diagram-js'

import {
  BButtonToolbar,
  BButtonGroup,
  BButton,
  BBreadcrumb
} from 'bootstrap-vue'

export default {
  name: 'FlowEditor',
  components: {
    FlowEditorEntitiesSidebar,
    BButtonToolbar,
    BButtonGroup,
    BButton,
    BBreadcrumb
  },
  props: {
    flowId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      flow: null,
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
    this.flow = FlowManager.getFlow(this.flowId)
    this.createFlowSockets()
    this.flow.entities.forEach(entityInstance => this.createEntity(entityInstance))
    this.flow.relations.forEach(relationInstance => this.createRelation(relationInstance))
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
      this.eventBus.on('element.start.drag', 250, this.elementDblClick)
      this.eventBus.on('shape.move.end', 250, this.entityMoved)
      this.eventBus.on('shape.removed', 250, this.entityRemoved)
      this.eventBus.on('connection.removed', 250, this.connectorRemoved)
      this.eventBus.on('property.changed', 250, this.setPropertyValue)
      this.eventBus.on('element.description.changed', 250, this.setDescription)


      this.canvas = this.diagram.get('canvas')
      this.elementFactory = this.diagram.get('elementFactory')
      this.elementRegistry = this.diagram.get('elementRegistry')
      this.overlays = this.diagram.get('overlays')
      this.connectionDocking = this.diagram.get('connectionDocking')
      this.connect = this.diagram.get('connect')
      this.directEditing = this.diagram.get('directEditing')
      this.entityTypeManager = this.diagram.get('entityTypeManager')
      this.relationTypeManager = this.diagram.get('relationTypeManager')
      this.entityInstanceFactory = this.diagram.get('entityInstanceFactory')
      this.connectorFactory = this.diagram.get('connectorFactory')
      this.propertyInstanceFactory = this.diagram.get('propertyInstanceFactory')

      this.rootElement = this.elementFactory.createRoot({
        id: `flow-${this.flowId}`
      })
      this.canvas.setRootElement(this.rootElement)
    },
    entityCreated (event) {
      let entityInstance = event.shape
      let entityType = entityInstance.businessObject.entityType
      if (entityType !== null) {
        entityType = this.entityTypeManager.getEntityType(entityType.name)
      }
      let sockets = this.entityTypeManager.getSocketDescriptors(entityType)
      this.createSockets(sockets, entityInstance)
      if (Object.getOwnPropertyDescriptor(event.context, 'outboundProperty') &&
          Object.getOwnPropertyDescriptor(event.context, 'inboundPropertyName') &&
          Object.getOwnPropertyDescriptor(event.context, 'relationTypeName')
      ) {
        let relationTypeName = event.context.relationTypeName
        let outboundProperty = event.context.outboundProperty
        let inboundPropertyName = event.context.inboundPropertyName
        let outboundPropertyName = outboundProperty.businessObject.name
        let relationInstanceTypeName = `${relationTypeName}--${outboundPropertyName}--${inboundPropertyName}`
        entityInstance.children
            .filter(p => p.businessObject.name === inboundPropertyName)
            .forEach(inboundProperty => {
              let connector = this.connectorFactory.connectProperties(
                  relationTypeName,
                  outboundProperty,
                  relationInstanceTypeName,
                  inboundProperty
              )
              connector.waypoints = this.connectionDocking.getCroppedWaypoints(connector);
              this.canvas.addConnection(connector, this.rootElement)
              this.autoLayoutConnector(connector)

              // Register the new relation in the flow
              this.flow.relations.push({
                outbound_id: connector.source.parent.id,
                type: relationInstanceTypeName,
                inbound_id: connector.target.parent.id,
                description: connector.businessObject.description,
                properties: {
                  outbound_property_name: outboundPropertyName,
                  inbound_property_name: inboundPropertyName
                }
              })

            })
      }
      this.flow.entities.push({
        type: entityType.name,
        id: entityInstance.id,
        description: entityInstance.businessObject.entityType.name,
        properties: ElementUtils.getProperties(entityInstance)
      })
    },
    entityRemoved (event) {
      if (ElementUtils.isEntity(event.element)) {
        this.flow.entities = this.flow.entities.filter(entity => entity.id !== event.element.id)
      }
    },
    connectorCreated (event) {
      let connector = event.element
      if (ElementUtils.hasBusinessObject(connector)) {
        return
      }

      let relationTypeName = ConnectorTypes.DEFAULT_CONNECTOR
      let edgeKey = `${connector.source.id}--${relationTypeName}--${connector.target.id}`

      let outboundPropertyName = connector.source.businessObject.name
      let inboundPropertyName = connector.target.businessObject.name

      let relationType = this.relationTypeManager.getRelationType(relationTypeName)
      let relationInstanceTypeName = `${relationTypeName}--${outboundPropertyName}--${inboundPropertyName}`

      connector.businessObject = {
        type: InstanceTypes.RELATION,
        relationType,
        name: relationInstanceTypeName,
        outboundPropertyName: outboundPropertyName,
        inboundPropertyName: inboundPropertyName,
      }
      connector.waypoints = connectPoints(connector.waypoints[0], connector.waypoints[1])
      connector.waypoints = this.connectionDocking.getCroppedWaypoints(connector);

      this.elementRegistry.updateId(connector, edgeKey)

      let outbound_id = connector.source.parent.id
      if (outbound_id === `${this.flowId}-start`) {
        outbound_id = this.flowId
      }
      let inbound_id = connector.target.parent.id
      if (inbound_id === `${this.flowId}-end`) {
        inbound_id = this.flowId
      }

      // Register the new relation in the flow
      this.flow.relations.push({
        outbound_id,
        type: relationInstanceTypeName,
        inbound_id,
        description: '',
        properties: {
          outbound_property_name: outboundPropertyName,
          inbound_property_name: inboundPropertyName
        }
      })
    },
    connectorRemoved (event) {
      console.log(event)
      if (ElementUtils.isDefaultConnector(event.element)) {
        this.flow.relations = this.flow.relations.filter(relation => {
          let parts = event.element.id.split('--')
          let outbound_id = parts[0].split('-').slice(0, -1).join('-')
          let inbound_id = parts[2].split('-').slice(0, -1).join('-')

          if (outbound_id === `${this.flowId}-start`) {
            outbound_id = this.flowId
          }
          if (inbound_id === `${this.flowId}-end`) {
            inbound_id = this.flowId
          }

          return !(
              relation.type === event.element.businessObject.name &&
              relation.outbound_id === outbound_id &&
              relation.inbound_id === inbound_id
          )
        })
      }
    },
    createFlowSockets () {
      if (Object.getOwnPropertyDescriptor(this.flow, 'properties')) {
        console.log(this.flow)
        let sockets = this.entityTypeManager.getSocketDescriptors(this.flow)
        console.log(sockets)
        let entityInstance = this.flow.entities.filter(e => e.id === this.flowId)
        if (entityInstance.length === 1) {
          entityInstance = entityInstance[0]
          let flowStart = this.entityInstanceFactory.createEntityInstance(
            'flow-start',
            0,
            0,
            `${this.flowId}-start`,
            'Start'
          )
          this.canvas.addShape(flowStart, this.rootElement)
          let startNodeSockets = {
            input: [],
            output: sockets.input.map(socket => {
              return {
                propertyDataType: socket.propertyDataType,
                propertyName: socket.propertyName,
                propertySocketType: SocketTypes.OUTPUT,
                propertyType: {
                  data_type: socket.propertyType.data_type,
                  name: socket.propertyType.name,
                  socket_type: SocketTypes.OUTPUT
                }
              }
            })
          }
          console.log(startNodeSockets)
          this.createSockets(startNodeSockets, flowStart, entityInstance)

          let flowEnd = this.entityInstanceFactory.createEntityInstance(
            'flow-end',
            1024,
            0,
            `${this.flowId}-end`,
            'End'
          )
          this.canvas.addShape(flowEnd, this.rootElement)

          let endNodeSockets = {
            input: sockets.output.map(socket => {
              return {
                propertyDataType: socket.propertyDataType,
                propertyName: socket.propertyName,
                propertySocketType: SocketTypes.INPUT,
                propertyType: {
                  data_type: socket.propertyType.data_type,
                  name: socket.propertyType.name,
                  socket_type: SocketTypes.INPUT
                }
              }
            }),
            output: []
          }
          console.log(endNodeSockets)
          this.createSockets(endNodeSockets, flowEnd, entityInstance)
        }
      }
    },
    createEntity (entityInstance) {
      try {
        if (entityInstance.type === 'flow' && this.flowId === entityInstance.id) {
          // Do not render the flow itself
          return
        }

        let entityType = this.entityTypeManager.getEntityType(entityInstance.type)
        let shapeDefinition = EntityShapeManager.getShapeDefinition(entityType)

        let x = this.x
        let y = this.y
        if (Object.getOwnPropertyDescriptor(entityInstance, 'properties')) {
          if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dx')) {
            x = entityInstance.properties.f2dx
          }
          if (Object.getOwnPropertyDescriptor(entityInstance.properties, 'f2dy')) {
            y = entityInstance.properties.f2dy
          }
        }

        let entityInstanceShape = this.entityInstanceFactory.createEntityInstance(
          entityInstance.type,
          x,
          y,
          entityInstance.id,
          entityInstance.description
        )
        this.canvas.addShape(entityInstanceShape, this.rootElement)

        let sockets = this.entityTypeManager.getSocketDescriptors(entityType)
        this.createSockets(sockets, entityInstanceShape, entityInstance)

        // Move pointer for next element
        this.x = this.x + shapeDefinition.entity.width + this.margin.x
        this.height = Math.max(this.height, entityInstanceShape.height)
        if (this.x > 1024) {
          this.x = 100
          this.y = this.y + this.height + this.margin.y
          this.height = 0
        }
      } catch (err) {
        console.error(err)
      }
    },
    createRelation (relationInstance) {
      try {
        let relationType = this.relationTypeManager.getRelationType(relationInstance.type)
        if (relationType.name === ConnectorTypes.DEFAULT_CONNECTOR) {
          let outboundId = relationInstance.outbound_id
          let inboundId = relationInstance.inbound_id
          if (outboundId === this.flowId) {
            outboundId = `${this.flowId}-start`
          }
          if (inboundId === this.flowId) {
            inboundId = `${this.flowId}-end`
          }
          let connector = this.connectorFactory.createConnectorInstance(
            relationType.name,
            outboundId,
            relationInstance.properties.outbound_property_name,
            relationInstance.type,
            inboundId,
            relationInstance.properties.inbound_property_name,
            relationInstance.description,
          )
          if (connector) {
            connector.waypoints = this.connectionDocking.getCroppedWaypoints(connector);
            this.canvas.addConnection(connector, this.rootElement)
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    createSockets (sockets, instanceShape, instance) {
      sockets.input.forEach((socket, idx) => {
        let value = this.getPropertyValue(instance, socket)
        const propertyShape = this.propertyInstanceFactory.createPropertyInstance(socket, idx, instanceShape, value)
        return this.canvas.addShape(propertyShape, instanceShape)
      })

      sockets.output.forEach((socket, idx) => {
        let value = this.getPropertyValue(instance, socket)
        const propertyShape = this.propertyInstanceFactory.createPropertyInstance(socket, idx, instanceShape, value)
        return this.canvas.addShape(propertyShape, instanceShape)
      })
    },
    getPropertyValue (instance, socket) {
      try {
        return instance.properties[socket.propertyName]
      } catch {
        return DataTypeUtils.getDataTypeDefault(socket.dataType)
      }
    },
    setPropertyValue (event) {
      let element = event.element
      this.rerenderShape(event.element)
      this.commitProperty(element)
    },
    select (event) {
      if (event.newSelection.length === 1) {
        let selection = event.newSelection[0]
        if (ElementUtils.hasBusinessObject(selection)) {
          this.selection = selection
        }
      }
    },
    rerenderShape (element) {
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
      this.commitEntity(event.shape, event.x, event.y)
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
    commitEntity (element, x, y) {
      let idx = this.flow.entities.findIndex(entity => entity.id === element.id)
      if (idx >= 0) {
        let properties = Object.assign({}, this.flow.entities[idx].properties)
        properties = Object.assign(properties, ElementUtils.getProperties(element, x, y))
        this.flow.entities[idx] = {
          type: element.businessObject.entityType.name,
          id: element.id,
          description: element.businessObject.description || '',
          properties
        }
      }
    },
    commitConnector (element) {
      let outboundPropertyName = element.businessObject.outboundPropertyName
      let inboundPropertyName = element.businessObject.inboundPropertyName
      let relationInstanceTypeName = `${element.businessObject.relationType.name}--${outboundPropertyName}--${inboundPropertyName}`
      let idx = this.flow.relations.findIndex(relation =>
        relation.outbound_id === element.source.parent.id &&
        relation.type === relationInstanceTypeName &&
        relation.inbound_id === element.target.parent.id
      )
      if (idx >= 0) {
        let outbound_id = element.source.parent.id
        if (outbound_id === `${this.flowId}-start`) {
          outbound_id = this.flowId
        }
        let inbound_id = element.target.parent.id
        if (inbound_id === `${this.flowId}-end`) {
          inbound_id = this.flowId
        }
        this.flow.relations[idx] = {
          outbound_id,
          type: relationInstanceTypeName,
          inbound_id,
          description: element.businessObject.description,
          properties: {
            outbound_property_name: outboundPropertyName,
            inbound_property_name: inboundPropertyName
          }
        }
      }
    },
    commitProperty (element) {
      this.commitEntity(element.parent)
    },
    elementDblClick (event) {
      let element = event.element
      if (ElementUtils.isInputSocket(element) && !ElementUtils.hasIncomingConnectors(element)) {
        if (DataTypeUtils.isBool(element.businessObject.dataType)) {
          // Toggle boolean value
          element.businessObject.value = !element.businessObject.value
          this.eventBus.fire('property.changed', {
            element
          })

          this.rerenderShape(element)
        } else {
          // Open direct editing for all other data types
          this.directEditing.activate(element)
        }
        // this.connect.start(event.originalEvent, element, true)
      }
      if (ElementUtils.isOutputSocket(element)) {
        this.connect.start(event.originalEvent, element, true)
      }
      if (ElementUtils.isDefaultConnector(element)) {
        this.autoLayoutConnector(element)
        this.directEditing.activate(element)
      }
      if (ElementUtils.isEntity(element)) {
        this.autoLayoutEntity(element)
        this.directEditing.activate(element)
      }
    },
    setDescription (event) {
      let element = event.element
      if (ElementUtils.isEntity(element)) {
        this.rerenderShape(element)
        this.commitEntity(element)
      } else if (ElementUtils.isRelation(element)) {
        this.rerenderConnector(element)
        this.commitConnector(element)
      }
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    },
    exportFlow () {
      let flowJson = JSON.stringify(this.flow, null, 2)
      let a = document.createElement('a')
      a.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(flowJson)}`)
      a.setAttribute('download', `${this.flow.id}.json`)
      a.click()
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
/*  background: rgba(255, 255, 255, 0.8);*/
/*  height: 40px;*/
/*  padding: 5px;*/
/*  !*border: 2px solid fuchsia;*!*/
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
