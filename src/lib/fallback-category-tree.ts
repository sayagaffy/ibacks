import type { CategoryNode } from '@/lib/types';

const casingId = 5524;
const cableId = 7423;
const audioId = 5521;
const powerId = 7426;
const screenId = 12642;
const gamingId = 7410;
const otherId = 12649;

const makeChild = (id: number, name: string, filterId: number): CategoryNode => ({
  id,
  name,
  parentId: filterId,
  filterId,
  children: [],
});

export const fallbackCategoryTree: CategoryNode[] = [
  {
    id: casingId,
    name: 'Casing & Cover',
    parentId: null,
    children: [
      makeChild(-552401, 'Anti Crack Case', casingId),
      makeChild(-552402, 'Bumper Case', casingId),
      makeChild(-552403, 'Hard Case', casingId),
      makeChild(-552404, 'Soft Case', casingId),
      makeChild(-552405, 'Leather Case', casingId),
      makeChild(-552406, 'Custom Case', casingId),
    ],
  },
  {
    id: cableId,
    name: 'Kabel & Charger',
    parentId: null,
    children: [
      makeChild(-742301, 'USB-C Cable', cableId),
      makeChild(-742302, 'Lightning Cable', cableId),
      makeChild(-742303, 'Car Charger', cableId),
      makeChild(-742304, 'Wireless Charger', cableId),
      makeChild(-742305, 'Cable Casing', cableId),
    ],
  },
  {
    id: audioId,
    name: 'Audio & Earphone',
    parentId: null,
    children: [
      makeChild(-552101, 'Earphone Kabel', audioId),
      makeChild(-552102, 'TWS', audioId),
      makeChild(-552103, 'Headset Bluetooth', audioId),
    ],
  },
  {
    id: powerId,
    name: 'Powerbank & Baterai',
    parentId: null,
    children: [
      makeChild(-742601, 'Powerbank Magnetic', powerId),
      makeChild(-742602, 'Powerbank Travel', powerId),
    ],
  },
  {
    id: screenId,
    name: 'Screen Guard',
    parentId: null,
    children: [
      makeChild(-1264201, 'Tempered Glass', screenId),
      makeChild(-1264202, 'Anti-Glare', screenId),
      makeChild(-1264203, 'Privacy', screenId),
    ],
  },
  {
    id: gamingId,
    name: 'Gaming',
    parentId: null,
    children: [
      makeChild(-741001, 'Controller', gamingId),
      makeChild(-741002, 'Trigger', gamingId),
    ],
  },
  {
    id: otherId,
    name: 'Lainnya',
    parentId: null,
    children: [
      makeChild(-1264901, 'Holder & Mount', otherId),
      makeChild(-1264902, 'Smartwatch Strap', otherId),
    ],
  },
];

export const fallbackCategoryFlat = fallbackCategoryTree.map((item) => ({
  id: item.id,
  name: item.name,
}));
