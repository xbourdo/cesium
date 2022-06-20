window.CESIUM_BASE_URL = "../../Source/";

import {
  formatError,
  Viewer,
  Cesium3DTileset,
  HeadingPitchRange,
} from "../../Source/Cesium.js";

function main() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  try {
    const viewer = new Viewer("cesiumContainer", {});
    const tileset = viewer.scene.primitives.add(
      new Cesium3DTileset({
        url: "./data/pnts/tileset.json",
      })
    );

    viewer.zoomTo(tileset, new HeadingPitchRange(0, -0.5, 0));
  } catch (exception) {
    loadingIndicator.style.display = "none";
    const message = formatError(exception);
    console.error(message);
    if (!document.querySelector(".cesium-widget-errorPanel")) {
      //eslint-disable-next-line no-alert
      window.alert(message);
    }
    return;
  }

  loadingIndicator.style.display = "none";
}

main();
