import { ref } from "vue";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const toasts = ref<Toast[]>([]);

let nextId = 0;

export function useToast() {
  function showToast(
    message: string,
    type: ToastType = "success",
    duration = 3000,
  ) {
    const id = ++nextId;

    toasts.value.push({
      id,
      message,
      type,
    });

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return {
    toasts,
    showToast,
    removeToast,
  };
}
