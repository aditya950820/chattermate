import mitt from 'mitt'

type Events = {
  'socket:reconnected': void
  'knowledge-updated': void
  // Add other events here as needed
}

const emitter = mitt<Events>()
export default emitter 