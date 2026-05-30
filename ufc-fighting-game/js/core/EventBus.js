// Event Bus for communication between components
var EventBus = (function() {
    var events = {};
    
    function subscribe(event, callback) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);
    }
    
    function publish(event, data) {
        if (events[event]) {
            events[event].forEach(function(callback) {
                callback(data);
            });
        }
    }
    
    function unsubscribe(event, callback) {
        if (events[event]) {
            events[event] = events[event].filter(function(cb) {
                return cb !== callback;
            });
        }
    }
    
    return {
        subscribe: subscribe,
        publish: publish,
        unsubscribe: unsubscribe
    };
})();