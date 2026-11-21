<script setup lang="ts">
defineProps<{
  show: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="emit('close')" />

        <!-- Modal -->
        <div
          class="relative bg-white w-full sm:max-w-lg h-[95dvh] sm:h-auto sm:max-h-[90dvh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Dialog'"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0 bg-white"
          >
            <h2 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h2>

            <button
              type="button"
              @click="emit('close')"
              aria-label="Close modal"
              class="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <!-- Scrollable content -->
          <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div class="p-5">
              <slot />
            </div>
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-5 py-4 border-t border-gray-200 shrink-0 bg-white"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
