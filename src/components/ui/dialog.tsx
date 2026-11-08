'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
export const Dialog = DialogPrimitive.Root;
export function DialogContent({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay" />
      <DialogPrimitive.Content className="dialog-content">
        <DialogPrimitive.Title className="dialog-title">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="dialog-description">
          {description || 'Проверьте информацию перед продолжением.'}
        </DialogPrimitive.Description>
        <DialogPrimitive.Close className="dialog-close" aria-label="Закрыть">
          <X size={20} />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
