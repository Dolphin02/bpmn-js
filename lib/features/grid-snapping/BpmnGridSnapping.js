import { is } from '../../util/ModelUtil';
import { isAny } from '../modeling/util/ModelingUtil';

var HIGH_PRIORITY = 2000;

export default function BpmnGridSnapping(eventBus) {
  eventBus.on([
    'create.init',
    'shape.move.init'
  ], function(event) {
    var context = event.context,
        shape = event.shape;

    if (isAny(shape, [
      'bpmn:Participant',
      'bpmn:SubProcess',
      'bpmn:TextAnnotation'
    ])) {
      context.gridSnappingContext = {
        snapLocation: 'top-left'
      };
    }
  });

  eventBus.on('commandStack.shape.resize.preExecute', HIGH_PRIORITY, function(event) {
    var context = event.context,
        shape = context.shape,
        hints = context.hints || {},
        autoResize = hints.autoResize;

    if (is(shape, 'bpmn:Participant') && autoResize) {
      hints.autoResize = 'nsew';
    }

    if (is(shape, 'bpmn:SubProcess') && !isCollapsed(shape) && autoResize) {
      hints.autoResize = 'nwse';
    }
  });
}

BpmnGridSnapping.$inject = [ 'eventBus' ];

// helpers //////////

function isCollapsed(shape) {
  return shape.collapsed;
}