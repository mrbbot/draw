import "normalize.css";
import "./styles.sass";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faCheck,
  faWifiSlash,
  faCircle
} from "@fortawesome/pro-solid-svg-icons";
import {
  faPaintBrush,
  faFillDrip,
  faSyncAlt
} from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faTimes,
  faCheck,
  faWifiSlash,
  faPaintBrush,
  faFillDrip,
  faSyncAlt,
  faCircle
);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
