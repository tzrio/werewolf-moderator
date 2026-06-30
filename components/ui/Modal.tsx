"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${maxWidth} card-panel p-6 max-h-[85vh] overflow-y-auto scrollbar-thin`}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", duration: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              {title && <h2 className="font-display text-xl text-moon">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-full hover:bg-white/10 text-moon/70 hover:text-moon transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  description,
  confirmLabel = "Ya, lanjutkan",
  danger,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-moon/80 text-sm mb-6 leading-relaxed">{description}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-white/15 text-moon/80 hover:bg-white/5 text-sm"
        >
          Batal
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium ${
            danger ? "btn-danger text-moon" : "btn-primary text-moon"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
