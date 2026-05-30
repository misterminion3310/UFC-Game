window.EventBus = {

    events: {},

    on(name, callback){

        if(!this.events[name]){
            this.events[name] = [];
        }

        this.events[name].push(callback);
    },

    emit(name, data){

        if(!this.events[name]) return;

        this.events[name].forEach(cb => cb(data));
    }

};