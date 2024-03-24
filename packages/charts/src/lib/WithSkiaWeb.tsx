import type { CanvasKit as CanvasKitType } from 'canvaskit-wasm';
// @ts-ignore
import CanvasKitInit from 'canvaskit-wasm/bin/canvaskit.js';
import type { ComponentProps, ComponentType } from 'react';
import React, { lazy, Suspense, useMemo } from 'react';

declare global {
  // eslint-disable-next-line no-var, no-inner-declarations
  var CanvasKit: CanvasKitType;
}

async function loadSkiaWeb() {
  if (global.CanvasKit !== undefined) {
    return;
  }
  const CanvasKit = await CanvasKitInit({
    locateFile: () => './canvaskit.wasm',
  });
  // The CanvasKit API is stored on the global object and used
  // to create the JsiSKApi in the Skia.web.ts file.
  global.CanvasKit = CanvasKit;
}

interface WithSkiaProps {
  fallback?: ComponentProps<typeof Suspense>['fallback'];
  getComponent: () => Promise<{ default: ComponentType }>;
}

export const WithSkiaWeb = ({ getComponent, fallback }: WithSkiaProps) => {
  const Inner = useMemo(
    () =>
      lazy(async () => {
        await loadSkiaWeb();
        return getComponent();
      }),
    [getComponent],
  );
  return (
    <Suspense fallback={fallback ?? null}>
      <Inner />
    </Suspense>
  );
};
