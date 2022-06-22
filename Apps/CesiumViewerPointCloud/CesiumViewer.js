window.CESIUM_BASE_URL = "../../Source/";

import {
  formatError,
  Viewer,
  Cesium3DTileset,
  HeadingPitchRange,
  viewerCesium3DTilesInspectorMixin,
} from "../../Source/Cesium.js";

function main() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  try {
    const viewer = new Viewer("cesiumContainer");
    viewer.extend(viewerCesium3DTilesInspectorMixin);
    const tileset = viewer.scene.primitives.add(
      new Cesium3DTileset({
        url: "./data/pnts/tileset.json",
        maximumScreenSpaceError: 116,
        dynamicScreenSpaceError: true,
        dynamicScreenSpaceErrorDensity: 0.00278,
        dynamicScreenSpaceErrorFactor: 4.0,
        dynamicScreenSpaceErrorHeightFalloff: 0.25,
      })
    );

    tileset.readyPromise.then(function (tileset) {
      // Set the camera to view the newly added tileset
      viewer.camera.viewBoundingSphere(
        tileset.boundingSphere,
        new HeadingPitchRange(0, 0, 0)
      );
    });
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
