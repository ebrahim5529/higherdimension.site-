/** @jsxImportSource react */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Download } from 'lucide-react';

interface DigitalSignatureProps {
  onSignatureComplete?: (signatureData: string) => void;
  onSignatureClear?: () => void;
  width?: number;
  height?: number;
  /** يملأ عرض الحاوية ويُحدَّث مع تغيّر الحجم (مناسب للجوال) */
  responsive?: boolean;
  /** أقل ارتفاع للوحة بالبكسل عند responsive */
  minHeight?: number;
  /** الارتفاع كنسبة من العرض (مثلاً 0.4 = 40%) */
  aspectRatio?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function DigitalSignature({
  onSignatureComplete,
  onSignatureClear,
  width = 400,
  height = 200,
  responsive = false,
  minHeight = 120,
  aspectRatio = 0.38,
  strokeColor = '#000000',
  strokeWidth = 2,
  backgroundColor = '#ffffff',
  disabled = false,
  placeholder = 'اضغط هنا للتوقيع'
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState({ width, height });

  const applyCanvasBuffer = useCallback(
    (w: number, h: number) => {
      const canvas = canvasRef.current;
      if (!canvas || w < 1 || h < 1) return;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#9CA3AF';
      const fontSize = Math.min(16, Math.max(12, Math.floor(w / 22)));
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(placeholder, w / 2, h / 2);
    },
    [strokeColor, strokeWidth, backgroundColor, placeholder]
  );

  useEffect(() => {
    if (responsive) return;
    setCanvasSize({ width, height });
  }, [responsive, width, height]);

  useEffect(() => {
    if (!responsive) return;

    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = () => {
      const w = Math.floor(el.clientWidth);
      if (w < 1) return;
      const h = Math.max(minHeight, Math.round(w * aspectRatio));
      setCanvasSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [responsive, minHeight, aspectRatio]);

  useEffect(() => {
    applyCanvasBuffer(canvasSize.width, canvasSize.height);
  }, [canvasSize, applyCanvasBuffer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawing || disabled) return;
      e.preventDefault();
    };

    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => canvas.removeEventListener('touchmove', onTouchMove);
  }, [isDrawing, disabled]);

  const pointerToLogical = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    lw: number,
    lh: number
  ) => {
    const rect = canvas.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      const t = e.touches[0];
      clientX = t.clientX;
      clientY = t.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * lw;
    const y = ((clientY - rect.top) / rect.height) * lh;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;

    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lw = canvasSize.width;
    const lh = canvasSize.height;
    const { x, y } = pointerToLogical(e, canvas, lw, lh);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lw = canvasSize.width;
    const lh = canvasSize.height;
    const { x, y } = pointerToLogical(e, canvas, lw, lh);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setHasSignature(true);
    
    // حفظ التوقيع كـ base64
    const canvas = canvasRef.current;
    if (canvas && onSignatureComplete) {
      const dataURL = canvas.toDataURL('image/png');
      setSignatureData(dataURL);
      onSignatureComplete(dataURL);
    }
  };

  const clearSignature = () => {
    applyCanvasBuffer(canvasSize.width, canvasSize.height);

    setHasSignature(false);
    setSignatureData('');

    if (onSignatureClear) {
      onSignatureClear();
    }
  };

  const downloadSignature = () => {
    if (!hasSignature || !canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `توقيع_${new Date().toISOString().split('T')[0]}.png`;
    link.href = signatureData;
    link.click();
  };

  const canvasShell = (
    <canvas
      ref={canvasRef}
      className={`block w-full max-w-full touch-none border border-gray-300 rounded cursor-crosshair ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );

  return (
    <div className="w-full min-w-0">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
        {responsive ? (
          <div ref={containerRef} className="w-full min-w-0">
            {canvasShell}
          </div>
        ) : (
          canvasShell
        )}
      </div>
      
      {hasSignature && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={downloadSignature}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            تحميل التوقيع
          </button>
          <button
            onClick={clearSignature}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            مسح التوقيع
          </button>
        </div>
      )}
    </div>
  );
}

