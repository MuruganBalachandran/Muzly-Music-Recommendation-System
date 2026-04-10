import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ModalVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ModalVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const icons: Record<ModalVariant, React.ReactNode> = {
  danger: <AlertTriangle className="w-7 h-7 text-red-500" />,
  warning: <AlertTriangle className="w-7 h-7 text-yellow-400" />,
  info: <Info className="w-7 h-7 text-blue-400" />,
  success: <CheckCircle className="w-7 h-7 text-green-500" />,
};

const confirmColors: Record<ModalVariant, string> = {
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
  info: 'bg-blue-600 hover:bg-blue-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="glass rounded-2xl shadow-elegant p-6 w-full max-w-sm mx-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-0.5">{icons[variant]}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1">{title}</h3>
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <button
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  {cancelLabel}
                </Button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${confirmColors[variant]}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
