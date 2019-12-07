import Vue from "vue";
import VueRouter from "vue-router";

import Landing from "../views/Landing";
import HostGame from "../views/host/HostGame";
import PlayerGame from "../views/player/PlayerGame";
import PlayerGameRedirect from "../views/player/PlayerGameRedirect";
import InteractiveDrawCanvas from "../components/InteractiveDrawCanvas";

Vue.use(VueRouter);

const routes = [
  {
    path: "/idc",
    name: "interactive-draw-canvas",
    component: InteractiveDrawCanvas
  },
  {
    path: "/",
    name: "landing",
    component: Landing
  },
  {
    path: "/host",
    name: "host-game",
    component: HostGame
  },
  {
    path: "/game/:id",
    name: "player-game",
    component: PlayerGame
  },
  {
    path: "/:id",
    name: "player-game-redirect",
    component: PlayerGameRedirect
  },
  {
    path: "*",
    name: "error-catch-all",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

//https://css-tricks.com/snippets/css/orientation-lock/
