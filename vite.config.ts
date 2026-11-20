// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   const env = loadEnv(mode, process.cwd(), "");
//   const token = process.env.CESIUM_ION_TOKEN ?? env.CESIUM_ION_TOKEN ?? "";

//   define: {
//     CESIUM_BASE_URL: JSON.stringify("/cesiumStatic"),
//     __CESIUM_ION_TOKEN__: JSON.stringify(token),
//   },
//   plugins: [react()],
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = process.env.CESIUM_ION_TOKEN ?? env.CESIUM_ION_TOKEN ?? "";

  return {
    define: {
      CESIUM_BASE_URL: JSON.stringify("/cesiumStatic"),
      __CESIUM_ION_TOKEN__: JSON.stringify(token),
    },
    plugins: [react()],
  };
});