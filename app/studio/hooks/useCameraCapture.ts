/**
 * useCameraCapture — camera lifecycle for the Studio.
 *
 * Owns the `camera` boolean. Does NOT own any shared refs — those are
 * created in Studio.tsx and passed in. Calls `renderNow` (from
 * usePreviewRender) inside the camera rAF loop and `scheduleRender`
 * (also from usePreviewRender) after capturing a still.
 *
 * Extracted from the monolithic Studio.tsx.
 */

import { useCallback, useState } from "react";
import { DEFAULT_FOCUS, type Drawable, type Focus } from "@/lib/canvas";
import { release } from "@/lib/image";

export type CameraCapture = {
  camera: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capture: () => void;
};

export function useCameraCapture(params: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  loopRef: React.MutableRefObject<number | null>;
  focusRef: React.MutableRefObject<Focus>;
  imageRef: React.MutableRefObject<Drawable | null>;
  renderNow: () => void;
  scheduleRender: () => void;
  setHasImage: (v: boolean) => void;
  setStatus: (v: string | null) => void;
}): CameraCapture {
  const {
    videoRef,
    streamRef,
    loopRef,
    focusRef,
    imageRef,
    renderNow,
    scheduleRender,
    setHasImage,
    setStatus,
  } = params;

  const [camera, setCamera] = useState(false);

  /* ---------- stop ---------- */

  const stopCamera = useCallback(() => {
    if (loopRef.current !== null) cancelAnimationFrame(loopRef.current);
    loopRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamera(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- start ---------- */

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("This browser has no camera access. Upload a photo instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCamera(true);
      setHasImage(true);
      focusRef.current = { ...DEFAULT_FOCUS };
      const loop = () => {
        renderNow();
        loopRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      setStatus("Camera permission was declined. Upload a photo instead.");
    }
  }, [renderNow]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- capture still ---------- */

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const frame = document.createElement("canvas");
    frame.width = video.videoWidth;
    frame.height = video.videoHeight;
    const ctx = frame.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopCamera();
    release(imageRef.current);
    imageRef.current = frame;
    setHasImage(true);
    scheduleRender();
  }, [stopCamera, scheduleRender]); // eslint-disable-line react-hooks/exhaustive-deps

  return { camera, startCamera, stopCamera, capture };
}