from datetime import datetime
import json
import uuid
import os

class EventBus:
    def __init__(self):
        self.listeners = []
        self.log_file = 'events_feature_store.jsonl'

    def emit(self, event_type, payload, trace_id=None):
        """
        Emits an event and writes to the simple FeatureStore log.
        """
        event = {
            "event_id": str(uuid.uuid4()),
            "event_type": event_type,
            "trace_id": trace_id or payload.get('trace_id'),
            "timestamp": datetime.utcnow().isoformat(),
            "payload": payload
        }
        
        # Write to FeatureStore-compatible JSONL log
        try:
            with open(self.log_file, 'a') as f:
                f.write(json.dumps(event) + '\n')
        except Exception as e:
            print(f"Failed to write to event log: {e}")

        # Notify internal listeners
        for listener in self.listeners:
            try:
                listener(event)
            except Exception as e:
                print(f"Listener failed for event {event_type}: {e}")

        return event

    def subscribe(self, listener):
        self.listeners.append(listener)

event_bus = EventBus()
