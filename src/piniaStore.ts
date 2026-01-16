import { defineStore } from 'pinia';

const usePiniaStore = defineStore({
  id: 'piniaStore',
  state: () => {
    return {
      routeParams: {} as Record<string, any>,
      role: 0 as number,
      debugMode: false as boolean,
    };
  },
  getters: {
    isAdminRole(): boolean {
      return this.role === 255;
    },
  },
  actions: {},
});

export default usePiniaStore;
