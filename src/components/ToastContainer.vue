<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-[100] flex flex-col gap-3 sm:w-80"
      aria-live="polite"
      aria-label="Notifications"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 p-4 rounded-xl shadow-lg border bg-white"
          :class="{
            'border-green-200': toast.type === 'success',
            'border-red-200': toast.type === 'error',
            'border-gray-200': toast.type === 'info',
          }"
          role="status"
        >
          <!-- Success icon -->
          <CheckCircle2
            v-if="toast.type === 'success'"
            :size="22"
            class="text-green-600 shrink-0"
          />

          <!-- Error icon -->
          <AlertCircle
            v-else-if="toast.type === 'error'"
            :size="22"
            class="text-red-600 shrink-0"
          />

          <!-- Info icon -->
          <Info v-else :size="22" class="text-gray-600 shrink-0" />

          <!-- Message -->
          <p class="flex-1 text-sm font-medium text-gray-700">
            {{ toast.message }}
          </p>

          <!-- Close button -->
          <button
            type="button"
            @click="removeToast(toast.id)"
            aria-label="Dismiss notification"
            class="text-gray-400 hover:text-gray-700 shrink-0"
          >
            <X :size="18" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from "lucide-vue-next";
import { useToast } from "@/composables/useToast";

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.toast-leave-active {
  position: absolute;
}
</style>
