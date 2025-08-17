"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"

interface ConfirmationPopoverProps {
  children: React.ReactNode
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  disabled?: boolean
}

export function ConfirmationPopover({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  variant = "default",
  disabled = false
}: ConfirmationPopoverProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 !bg-white dark:!bg-slate-900" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={disabled}
              className="hover:!bg-slate-100 dark:hover:!bg-slate-700"
            >
              <X className="w-4 h-4 mr-1" />
              {cancelText || t('cancel')}
            </Button>
            <Button
              variant={variant}
              size="sm"
              onClick={handleConfirm}
              disabled={disabled}
              className={
                variant === "destructive" 
                  ? "bg-red-600 hover:!bg-red-700 text-white" 
                  : "bg-brand-yellow hover:!bg-yellow-400 text-black"
              }
            >
              <Check className="w-4 h-4 mr-1" />
              {confirmText || t('confirm')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
