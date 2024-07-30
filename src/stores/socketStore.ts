import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref } from 'vue';

export default defineStore('socketStore', () => {
  const socket = io('http://localhost:3000');
  const socketIsConnected = ref(false);
  // methods
  function socketConnect() {
    socketIsConnected.value = true;
  }
  function socketDisConnect() {
    socketIsConnected.value = false;
  }
  function socketEmitEvent(event: string, payload?: any) {
    socket.emit(event, payload);
  }
  function socketOnEvent(event: string, callback: (data: any) => void) {
    socket.on(event, callback);
  }
  function socketOffEvent(event: string, callback: (data: any) => void) {
    socket.off(event, callback);
  }
  function socketOffAllEvent() {
    socket.off();
  }

  return {
    // state
    socket,
    socketIsConnected,
    // method
    socketConnect,
    socketDisConnect,
    socketEmitEvent,
    socketOnEvent,
    socketOffEvent,
    socketOffAllEvent
  };
});
