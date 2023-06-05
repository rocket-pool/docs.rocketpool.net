import Theme from "vitepress/theme";
import "./styles/index.styl";
import "./styles/palette.styl";
import "./styles/tabs.styl";
import PluginTabs from "./components/PluginTabs.vue";
import ZoomImg from "../components/zoomImg.vue";

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component("PluginTabs", PluginTabs);
    app.component('ZoomImg', ZoomImg)
  },
};
