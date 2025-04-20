"use client";

import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface ToastOptions {
  id?: string | number;
  duration?: number;
  description?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  position?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
  closeButton?: boolean;
}

interface DisplayToastProps {
  message?: ReactNode;
  type?: "success" | "error" | "loading" | "warning" | "custom";
  duration?: number;
  id?: string;
  description?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  position?:
    | "top-center"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "bottom-right"
    | "bottom-left";
  closeButton?: boolean;
  options?: Omit<
    ToastOptions,
    | "id"
    | "duration"
    | "description"
    | "action"
    | "icon"
    | "position"
    | "closeButton"
  >;
}

export function DisplayToast({
  message,
  type,
  duration,
  id,
  description,
  action,
  icon,
  position,
  closeButton,
  options = {},
}: DisplayToastProps) {
  useEffect(() => {
    if (!message) return;
    setTimeout(() => {
      const toastOptions = {
        id: id || (typeof message === "string" ? message : undefined),
        duration,
        description,
        action,
        icon,
        position,
        closeButton,
        ...options,
      };

      if (type === "success") {
        toast.success(message, toastOptions);
      } else if (type === "error") {
        toast.error(message, toastOptions);
      } else if (type === "loading") {
        toast.loading(message, toastOptions);
      } else if (type === "warning") {
        toast.warning(message, toastOptions);
      } else if (type === "custom" && React.isValidElement(message)) {
        toast.custom(() => message, toastOptions);
      } else {
        toast(message, toastOptions);
      }
    }, 100);
  }, [
    message,
    type,
    duration,
    id,
    description,
    action,
    icon,
    position,
    closeButton,
    options,
  ]);

  return <></>;
}

// Helper function to display toast without component mounting
export function displayToast(
  message: ReactNode,
  type: "success" | "error" | "loading" | "warning" | "custom" = "success",
  options: Omit<DisplayToastProps, "message" | "type"> = {}
) {
  const { duration, id, description, action, icon, position, closeButton } =
    options;

  const toastOptions = {
    id: id || (typeof message === "string" ? message : undefined),
    duration,
    description,
    action,
    icon,
    position,
    closeButton,
    ...options,
  };

  if (type === "success") {
    toast.success(message, toastOptions);
  } else if (type === "error") {
    toast.error(message, toastOptions);
  } else if (type === "loading") {
    toast.loading(message, toastOptions);
  } else if (type === "warning") {
    toast.warning(message, toastOptions);
  } else if (type === "custom" && React.isValidElement(message)) {
    toast.custom(() => message, toastOptions);
  } else {
    toast(message, toastOptions);
  }
}
