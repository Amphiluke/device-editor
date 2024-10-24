<script setup>
import { ref, computed } from 'vue';
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
} = useDeviceStore();
const device = computed(() => devices.find(({ id }) => id === props.deviceId));
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
        <v-list-item
          v-for="{ id, name } in device.meteringUnits"
          :key="id"
          :value="name"
        >
          <template #prepend>
            <v-icon size="small">
              mdi-drag-vertical
            </v-icon>
          </template>
          <template #append>
            <v-btn
              :icon="editedUnitId === id ? 'mdi-check' : 'mdi-pencil'"
              :color="editedUnitId === id ? 'green' : null"
              :title="editedUnitId === id ? 'Завершить редактирование' : 'Редактировать'"
              size="x-small"
              variant="text"
              @click="editedUnitId = editedUnitId === null ? id : null"
            />
            <v-btn
              icon="mdi-trash-can"
              color="red"
              title="Удалить узел учёта"
              size="x-small"
              variant="text"
              @click="removeMeteringUnit(device.id, id)"
            />
          </template>
          <v-list-item-title>
            <v-text-field
              v-if="editedUnitId === id"
              :model-value="name"
              color="primary"
              variant="underlined"
              single-line
              autofocus
              @keypress.enter="({ target }) => renameMeteringUnit(device.id, id, target.value)"
              @change="({ target }) => renameMeteringUnit(device.id, id, target.value)"
            />
            <template v-else>
              {{ name }}
            </template>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-empty-state
        v-else
        title="Устройство не имеет узлов учёта"
        text="Добавьте новый узел"
        icon="mdi-alert-circle-outline"
        size="60"
      />
    </template>

    <template #actions>
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
    </template>
  </v-card>
</template>
