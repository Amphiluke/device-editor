<script setup>
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import { useDeviceStore } from '@/stores/devices.mjs';

const props = defineProps({
  deviceId: {
    type: String,
    required: true,
  },
});

const {
  devices,
  removeDevice,
  removeMeteringUnit,
  addMeteringUnit,
  renameMeteringUnit,
  resetMeteringUnits,
} = useDeviceStore();
const device = computed(() => devices.find(({ id }) => id === props.deviceId));
const units = computed({
  get: () => device.value.meteringUnits,
  set: (updatedUnits) => resetMeteringUnits(device.value.id, updatedUnits),
});
const editedUnitId = ref(null);
</script>

<template>
  <v-card variant="tonal">
    <template #title>
      {{ device.name }}
    </template>

    <template #text>
      <v-list
        v-if="!!device.meteringUnits.length"
        density="compact"
      >
        <v-list-subheader>
          Узлы учёта
        </v-list-subheader>
        <draggable
          v-model="units"
          item-key="id"
        >
          <template #item="{ element }">
            <v-list-item
              :value="element.name"
              :class="$style.unitItem"
              :link="false"
            >
              <template #prepend>
                <v-icon size="small">
                  mdi-drag-vertical
                </v-icon>
              </template>
              <template #append>
                <v-btn
                  :icon="editedUnitId === element.id ? 'mdi-check' : 'mdi-pencil'"
                  :color="editedUnitId === element.id ? 'green' : null"
                  :title="editedUnitId === element.id ? 'Завершить редактирование' : 'Редактировать'"
                  size="x-small"
                  variant="text"
                  @click="editedUnitId = editedUnitId === null ? element.id : null"
                />
                <v-btn
                  icon="mdi-trash-can"
                  color="red"
                  title="Удалить узел учёта"
                  size="x-small"
                  variant="text"
                  @click="removeMeteringUnit(device.id, element.id)"
                />
              </template>
              <v-list-item-title>
                <v-text-field
                  v-if="editedUnitId === element.id"
                  :model-value="element.name"
                  color="primary"
                  variant="underlined"
                  single-line
                  autofocus
                  @keypress.enter="({ target }) => renameMeteringUnit(device.id, element.id, target.value)"
                  @change="({ target }) => renameMeteringUnit(device.id, element.id, target.value)"
                />
                <template v-else>
                  {{ element.name }}
                </template>
              </v-list-item-title>
            </v-list-item>
          </template>
        </draggable>
      </v-list>
      <v-empty-state
        v-else
        title="Устройство не имеет узлов учёта"
        text="Добавьте новый узел"
        icon="mdi-alert-circle-outline"
        size="60"
      />
    </template>

    <v-card-actions class="flex-wrap justify-center">
      <v-btn
        color="secondary"
        text="Добавить узел учёта"
        variant="tonal"
        @click="editedUnitId = addMeteringUnit(device.id, 'Новый узел')"
      />
      <v-btn
        color="red"
        text="Удалить устройство"
        variant="tonal"
        @click="removeDevice(device.id)"
      />
    </v-card-actions>
  </v-card>
</template>

<style module>
.unitItem[data-draggable="true"] {
  cursor: grab;
}
</style>
