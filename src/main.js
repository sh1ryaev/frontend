import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from "./store"
import axios from "axios"
import 'mdb-vue-ui-kit/css/mdb.min.css';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import 'vue-snap/dist/vue-snap.css'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add some free styles */
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faPlus} from "@fortawesome/free-solid-svg-icons";

/* add each imported icon to the library */
library.add(faTwitter, faHeart, faPlus)


axios.defaults.baseURL="http://127.0.0.1:8000"
createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router, axios ).mount('#app')

