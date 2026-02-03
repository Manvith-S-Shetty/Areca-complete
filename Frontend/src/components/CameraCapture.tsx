'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import { enqueueCapture } from '@/lib/idb-queue';
import { uploadCapture } from '@/lib/api';
import { useLocale } from '@/lib/locale';

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [queued, setQueued] = useState(0);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { t } = useLocale();

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('[Areca] Camera access denied:', error);
        setMessage({
          type: 'error',
          text: t('capture.cameraError'),
        });
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [t]);

  // Update queued count periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { getAllQueued } = await import('@/lib/idb-queue');
        const items = await getAllQueued();
        setQueued(items.length);
      } catch (error) {
        console.error('[Areca] Failed to fetch queue:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
    setPhoto(dataUrl);
  };

  const queuePhoto = async () => {
    if (!photo) return;

    setLoading(true);
    try {
      const id = await enqueueCapture({
        dataUrl: photo,
        timestamp: Date.now(),
      });
      setMessage({
        type: 'success',
        text: t('capture.queued'),
      });
      setPhoto(null);
      setQueued((prev) => prev + 1);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('[Areca] Failed to queue photo:', error);
      setMessage({
        type: 'error',
        text: t('capture.queueError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const result = await uploadCapture();
      setMessage({
        type: 'success',
        text: result.synced > 0 ? `${t('capture.synced')} ${result.synced}` : t('capture.noItems'),
      });
      setQueued(Math.max(0, queued - (result.synced || 0)));
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('[Areca] Sync error:', error);
      setMessage({
        type: 'error',
        text: t('capture.syncError'),
      });
    } finally {
      setSyncing(false);
    }
  };

  const speakTips = async () => {
    if ('speechSynthesis' in window) {
      const tips = [t('capture.tip1'), t('capture.tip2'), t('capture.tip3')];
      const text = tips.join('. ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Guidance & Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-3">
          <h3 className="font-semibold text-primary">{t('capture.tips')}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{t('capture.tip1')}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{t('capture.tip2')}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{t('capture.tip3')}</span>
            </li>
          </ul>
          <Button
            variant="secondary"
            size="sm"
            onClick={speakTips}
            className="mt-4"
          >
            🔊 {t('capture.speakTips')}
          </Button>
        </div>
      </Card>

      {/* Camera Feed or Photo Preview */}
      {photo ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative"
        >
          <Card>
            <img src={photo || "/placeholder.svg"} alt="Captured photo" className="w-full rounded-lg" />
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPhoto(null)}
                className="flex-1"
              >
                {t('capture.retake')}
              </Button>
              <Button
                variant="primary"
                onClick={queuePhoto}
                disabled={loading}
                className="flex-1"
              >
                {loading ? t('common.loading') : t('capture.queueIt')}
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="camera"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Card className="relative overflow-hidden bg-black">
            <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Guidance Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 border-primary rounded-lg opacity-60" />
              </div>
            </div>
            <motion.button
              onClick={capturePhoto}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 mx-auto mt-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl hover:bg-green-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Capture photo"
            >
              📷
            </motion.button>
          </Card>
        </motion.div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Queue Status & Sync */}
      <Card className="bg-secondary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral">{t('capture.queuedCount')}</p>
            <p className="text-2xl font-bold text-primary">{queued}</p>
          </div>
          <Button
            variant="primary"
            onClick={handleSyncNow}
            disabled={queued === 0 || syncing}
          >
            {syncing ? t('common.loading') : `⬆️ ${t('capture.syncNow')}`}
          </Button>
        </div>
      </Card>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
            }`}
            role="alert"
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
