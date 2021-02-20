import RelationTypeManager from "@/manager/RelationTypeManager";
import InstanceTypes from "@/constants/InstanceTypes.json"
// eslint-disable-next-line no-unused-vars
import EntityShapeManager from "@/manager/EntityShapeManager";

// TODO: source
// TODO: target
function createConnectorInstance(
  elementFactory,
  elementRegistry,
  relationTypeName,
  outboundId,
  outboundPropertyName,
  relationInstanceTypeName,
  inboundId,
  inboundPropertyName
) {
  let relationType = RelationTypeManager.getRelationType(relationTypeName);
  console.log(relationType, relationInstanceTypeName, outboundId, outboundPropertyName, inboundId, inboundPropertyName)

  let outboundShape = elementRegistry.get(outboundId)
  let inboundShape = elementRegistry.get(inboundId)

  let outboundPropertyShapeId = `${outboundId}-${outboundPropertyName}`
  let inboundPropertyShapeId = `${inboundId}-${inboundPropertyName}`
  let edgeKey = `${outboundPropertyShapeId}-${relationTypeName}-${inboundPropertyShapeId}`

  let outboundPropertyShape = outboundShape.children.filter(p => p.id === outboundPropertyShapeId)[0]
  let inboundPropertyShape = inboundShape.children.filter(p => p.id === inboundPropertyShapeId)[0]

  let outboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(outboundPropertyShape.businessObject.entityType)
  let inboundPropertyShapeDefinition = EntityShapeManager.getShapeDefinition(inboundPropertyShape.businessObject.entityType)

  let connection = elementFactory.createConnection({
    id: edgeKey,
    waypoints: [
      {
        x: outboundPropertyShape.x + outboundPropertyShapeDefinition.socket.width,
        y: outboundPropertyShape.y + outboundPropertyShapeDefinition.socket.height / 2
      },
      {
        x: (outboundPropertyShape.x + inboundPropertyShape.x) / 2,
        y: (outboundPropertyShape.y + inboundPropertyShape.y) / 2
      },
      {
        x: inboundPropertyShape.x + inboundPropertyShapeDefinition.socket.width,
        y: inboundPropertyShape.y + inboundPropertyShapeDefinition.socket.height / 2
      },
    ],
    businessObject: {
      type: InstanceTypes.RELATION,
      relationType,
      name: relationInstanceTypeName,
      outboundPropertyName,
      inboundPropertyName,

    },
    source: outboundPropertyShape,
    target: inboundPropertyShape
  });
  return connection;
}

export default {
  createConnectorInstance,
  // createConnectorInstanceLabel,
  // createEntityProperty,
  // importEntityInstance,
}
