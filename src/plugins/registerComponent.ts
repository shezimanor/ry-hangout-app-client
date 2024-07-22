import type { App, Component } from 'vue';

export default function (app: App) {
  // Layout Components
  const layoutComponents = import.meta.glob<{ default: Component }>('@/components/layout/*.vue', {
    eager: true
  });
  // UI Components
  const uiComponents = import.meta.glob<{ default: Component }>('@/components/ui/*.vue', {
    eager: true
  });
  const vueComponents = { ...layoutComponents, ...uiComponents };
  Object.keys(vueComponents).forEach((path) => {
    const component = vueComponents[path];
    const componentName = path.split('/').at(-1)?.split('.')[0];
    if (componentName) {
      app.component(componentName, component.default);
    }
  });
}
