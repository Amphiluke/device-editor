import { reactive, readonly, watch } from 'vue';
import { defineStore } from 'pinia';
import { deviceList } from './devices-data.mjs';

export const useDeviceStore = defineStore('devices', () => {
  const storedDevices = localStorage.getItem('devices');
  /** @type {import('./devices-data.mjs').Device[]} */
  const devices = reactive(storedDevices ? JSON.parse(storedDevices) : structuredClone(deviceList));

  watch(devices, (newDeviceList) => {
    localStorage.setItem('devices', JSON.stringify(newDeviceList));
  });

  /**
   * Add a new device to the list of devices
   * @param {String} name - Device name
   * @returns {String} UUID of the new device
   */
  function addDevice(name) {
    const id = crypto.randomUUID();
    devices.push({
      id,
      name,
      meteringUnits: [],
    });
    return id;
  };

  /**
   * Remove a device from the list of devices
   * @param {String} id - UUID of the device
   */
  function removeDevice(id) {
    const index = devices.findIndex((device) => device.id === id);
    if (index >= 0) {
      devices.splice(index, 1);
    }
  }

  /**
   * Rename a device
   * @param {String} id - UUID of the device
   * @param {String} newName - Device’s new name
   */
  function renameDevice(id, newName) {
    const device = devices.find((device) => device.id === id);
    if (!device) {
      throw new Error('Устройство не найдено');
    }
    device.name = newName;
  }

  /**
   * Add a metering unit to the device
   * @param {String} deviceId - UUID of the device
   * @param {String} unitName - Name of the added metering unit
   * @returns {String} UUID of the new metering unit
   */
  function addMeteringUnit(deviceId, unitName) {
    const device = devices.find(({ id }) => id === deviceId);
    if (!device) {
      throw new Error('Устройство не найдено');
    }
    const id = crypto.randomUUID();
    device.meteringUnits.push({ id, name: unitName });
    return id;
  }

  /**
   * Remove a unit from the device’s metering units list
   * @param {String} deviceId - UUID of the device
   * @param {String} unitId - UUID of the metering unit
   */
  function removeMeteringUnit(deviceId, unitId) {
    const device = devices.find(({ id }) => id === deviceId);
    if (!device) {
      throw new Error('Устройство не найдено');
    }
    device.meteringUnits = device.meteringUnits.filter(({ id }) => id !== unitId);
  }

  /**
   * Rename a metering unit 
   * @param {String} deviceId - UUID of the device
   * @param {String} unitId - UUID of the metering unit
   * @param {String} newName - Unit’s new name
   */
  function renameMeteringUnit(deviceId, unitId, newName) {
    const device = devices.find(({ id }) => id === deviceId);
    if (!device) {
      throw new Error('Устройство не найдено');
    }
    const unit = device.meteringUnits.find(({ id }) => id === unitId);
    if (!unit) {
      throw new Error('Узел учёта не найден');
    }
    unit.name = newName;
  }

  /**
   * Reset device list to defaults
   */
  function reset() {
    devices.length = 0;
    devices.push(...structuredClone(deviceList));
  }

  return {
    devices: readonly(devices),
    addDevice,
    removeDevice,
    renameDevice,
    addMeteringUnit,
    removeMeteringUnit,
    renameMeteringUnit,
    reset,
  };
});
