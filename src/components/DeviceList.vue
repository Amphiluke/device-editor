<script setup>
import { ref, computed } from 'vue';
import { useDeviceStore } from '@/stores/devices.mjs';

const { devices, renameDevice, addDevice, reset } = useDeviceStore();
const deviceData = computed(() => devices.map(({ id, name, meteringUnits }) => ({
  id,
  name,
  units: meteringUnits.length,
})));
const headers = [
  { title: 'Устройство', key: 'name' },
  { title: 'Узлов', key: 'units' },
];

const editedDeviceId = ref(null);
const expandedDevices = computed({
  get: () => editedDeviceId.value ? [editedDeviceId.value] : [],
  set: (ids) => editedDeviceId.value = ids.find((id) => id !== editedDeviceId.value),
});
</script>

<template>
  <v-data-table
    v-model:expanded="expandedDevices"
    :headers="headers"
    :items="deviceData"
    item-value="id"
    show-expand
    hide-default-footer
  >
    <template #item.name="{ internalItem, value, isExpanded }">
      <v-text-field
        v-if="isExpanded(internalItem)"
        :model-value="value"
        color="primary"
        variant="underlined"
        single-line
        @keypress.enter="({ target }) => renameDevice(editedDeviceId, target.value)"
        @change="({ target }) => renameDevice(editedDeviceId, target.value)"
      />
      <template v-else>
        {{ value }}
      </template>
    </template>
    <template #item.data-table-expand="{ internalItem, toggleExpand, isExpanded }">
      <v-btn
        :icon="isExpanded(internalItem) ? 'mdi-check' : 'mdi-pencil'"
        :color="isExpanded(internalItem) ? 'green' : null"
        :title="isExpanded(internalItem) ? 'Свернуть' : 'Редактировать'"
        size="small"
        variant="text"
        @click="() => toggleExpand(internalItem)"
      />
    </template>
    <template #expanded-row="{ columns }">
      <tr>
        <td :colspan="columns.length">
          <DeviceDetails
            :device-id="editedDeviceId"
            class="my-4"
          />
        </td>
      </tr>
    </template>
    <template #tfoot="{ columns }">
      <tfoot>
        <tr>
          <td :colspan="columns.length">
            <div class="d-flex justify-space-between flex-wrap ga-2 py-4">
              <v-btn
                color="secondary"
                text="Добавить устройство"
                variant="tonal"
                @click="editedDeviceId = addDevice('Новое устройство')"
              />
              <v-btn
                color="red"
                text="Сброс"
                variant="tonal"
                @click="reset"
              />
            </div>
          </td>
        </tr>
      </tfoot>
    </template>
    <template #no-data>
      <v-empty-state
        title="Список устройств пуст"
        text="Добавьте новое устройство или выполните сброс к начальному состоянию"
        icon="mdi-alert-circle-outline"
        size="60"
      />
    </template>
  </v-data-table>
</template>
