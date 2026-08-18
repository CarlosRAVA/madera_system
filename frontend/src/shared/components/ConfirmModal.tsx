import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = true,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-beige/80 text-sm mb-6">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-btn text-sm font-semibold text-white bg-dark-bg border border-dark-border hover:bg-dark-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={[
            'px-4 py-2 rounded-btn text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 disabled:opacity-50',
            isDestructive
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
              : 'bg-primary hover:bg-secondary focus:ring-primary',
          ].join(' ')}
        >
          {loading ? 'Procesando...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
