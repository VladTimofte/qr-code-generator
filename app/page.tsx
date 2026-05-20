"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "M"
  );
  const downloadLink = useRef<HTMLAnchorElement>(null);

  const generateQR = async () => {
    if (!url) return alert("Please enter a URL");
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: size,
        errorCorrectionLevel: errorCorrection,
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR");
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl || !downloadLink.current) return;
    downloadLink.current.href = qrDataUrl;
    downloadLink.current.download = "qrcode.png";
    downloadLink.current.click();
  };

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      <label>
        Enter URL:
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>

      <label>
        Size (px):
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
      </label>

      <label>
        Error Correction Level:
        <select
          value={errorCorrection}
          onChange={(e) =>
            setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")
          }
        >
          <option value="L">L (Low - 7%)</option>
          <option value="M">M (Medium - 15%)</option>
          <option value="Q">Q (Quartile - 25%)</option>
          <option value="H">H (High - 30%)</option>
        </select>
      </label>

      <button onClick={generateQR} className="generate">
        Generate QR
      </button>

      {qrDataUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Generated QR Code"
            width={size}
            height={size}
          />
          <button onClick={downloadQR} className="download">
            Download PNG
          </button>
          <a ref={downloadLink} className="hidden" />
        </>
      )}
    </div>
  );
}
