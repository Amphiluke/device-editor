/**
 * Metering unit
 * @typedef {Object} MeteringUnit
 * @property {String} id - UUID of the unit
 * @property {String} name - Name of the unit
 */

/**
 * Device
 * @typedef {Object} Device
 * @property {String} id - UUID of the device
 * @property {String} name - Name of the device
 * @property {MeteringUnit[]} meteringUnits - The list of metering units for the device
 */

/** @type {Device[]} */
export const deviceList = [
  {
    id: crypto.randomUUID(),
    name: 'Отопительная станция',
    meteringUnits: [
      { id: crypto.randomUUID(), name: 'УУТЭ-1' },
      { id: crypto.randomUUID(), name: 'УУТЭ-2' },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Газораспределительная станция',
    meteringUnits: [
      { id: crypto.randomUUID(), name: 'УУГ-1' },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Станция холодного водоснабжения',
    meteringUnits: [
      { id: crypto.randomUUID(), name: 'УУХВ-1' },
      { id: crypto.randomUUID(), name: 'УУХВ-2' },
      { id: crypto.randomUUID(), name: 'УУХВ-3' },
    ],
  },
];
