"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteMemberDialogProps {
  isOpen: boolean;
  memberName?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteMemberDialog({
  isOpen,
  memberName,
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteMemberDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Member"
      description="This permanently removes the athlete and all their records."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-text-primary leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold">{memberName || "this member"}</span>? Their login
            account, workout plans, diet plans, attendance, progress, and payment records
            will be removed. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="default"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 font-bold"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Member
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
