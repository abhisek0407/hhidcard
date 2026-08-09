import QRCode from "qrcode";

export const QR_URL = "https://hhidcard.vercel.app/";

export function drawQRCode(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number,
) {
  const qr = QRCode.create(url, {
    errorCorrectionLevel: "M",
  });

  const modules = qr.modules.size;
  const data = qr.modules.data;

  const quietZone = 4;
  const totalModules = modules + quietZone * 2;
  const moduleSize = size / totalModules;

  // White background / quiet zone
  ctx.save();
  ctx.fillStyle = "#FFFBE8";
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = "#08210F";

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (data[row * modules + col]) {
        ctx.fillRect(
          x + (col + quietZone) * moduleSize,
          y + (row + quietZone) * moduleSize,
          moduleSize + 0.5,
          moduleSize + 0.5,
        );
      }
    }
  }

  ctx.restore();
}