"use strict";

import Vue from "vue";
import App from "@/App.vue";
import "@/registerServiceWorker.js";

Vue.config.productionTip = false;

new Vue({
	template: "<app />",
	components: { App }
}).$mount("#app");
