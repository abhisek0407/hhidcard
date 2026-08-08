/**
 * ShareQrCode — renders a QR code linking to the shareable /p/<id> page.
 *
 * Only shown when a shareUrl is available (i.e. blob storage was configured
 * and uploadForLink succeeded). Gracefully absent when shareUrl is null.
 */
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function ShareQrCode(props: { shareUrl: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!props.shareUrl || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, props.shareUrl, {
      width: 120,
      margin: 2,
      color: { dark: "#08210F", light: "#FFFBE8" },
    });
  }, [props.shareUrl]);

  if (!props.shareUrl) return null;

  return (
    <div className="mt-4 text-center">
      <p className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-ink/55 mb-2">
        Share this QR code at the event
      </p>
      <canvas ref={canvasRef} width={120} height={120} className="inline-block rounded-lg shadow-[4px_4px_0_rgba(6,63,34,0.25)]" />
    </div>
  );
}