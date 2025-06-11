import { createStore } from 'vuex';

export default createStore({
  state: {
    isDarkMode: false,
    currentLanguage: 'ar'
  },
  mutations: {
    SET_DARK_MODE(state, value) {
      state.isDarkMode = value;
    },
    SET_LANGUAGE(state, language) {
      state.currentLanguage = language;
    }
  },
  actions: {
    setDarkMode({ commit }, value) {
      commit('SET_DARK_MODE', value);
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    }
  },
  getters: {
    isDarkMode: state => state.isDarkMode,
    currentLanguage: state => state.currentLanguage
  }
}); 