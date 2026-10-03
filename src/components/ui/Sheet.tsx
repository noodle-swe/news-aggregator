import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { IconButton } from './IconButton';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Bottom sheet built on the native <dialog>: focus trapping, Esc-to-close,
 * inert background and top-layer stacking come from the browser for free.
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      className="animate-sheet-in bg-surface text-ink m-0 mt-auto max-h-[88dvh] w-full max-w-none flex-col rounded-t-3xl p-0 shadow-2xl open:flex"
    >
      <div className="border-line flex items-center justify-between border-b px-5 py-3">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2" />
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
      {footer && <div className="pb-safe border-line border-t px-5 py-3">{footer}</div>}
    </dialog>
  );
}
