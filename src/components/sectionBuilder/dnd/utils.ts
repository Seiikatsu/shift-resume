import {GroupField, SectionField} from '~/components/sectionBuilder/fieldRenderer';

const findItemAndParentById = (data: SectionField[], id: string, parent: GroupField | null = null): {
  item: SectionField;
  parent: GroupField | null;
} | null => {
  for (const item of data) {
    if (item.id === id) {
      return {item, parent};
    }
    if (item.type === 'group' && item.fields) {
      const result = findItemAndParentById(item.fields, id, item);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const findField = (data: SectionField[], id: string): SectionField | null => {
  return findItemAndParentById(data, id)?.item ?? null;
}

export const getParents = (data: SectionField[], id1: string, id2: string): [GroupField | null, GroupField | null] => {
  const parent1 = findItemAndParentById(data, id1)?.parent;
  const parent2 = findItemAndParentById(data, id2)?.parent;
  return [
    parent1 ?? null,
    parent2 ?? null,
  ];
};

/**
 * Reorder items on the same level
 */
export const reorderFields = (data: SectionField[], id1: string, id2: string) => {
  const parentInfo = findItemAndParentById(data, id1);
  const parent = parentInfo?.parent;

  if (parent && parent.fields) {
    const items = parent.fields;
    const index1 = items.findIndex(item => item.id === id1);
    const index2 = items.findIndex(item => item.id === id2);

    if (index1 > -1 && index2 > -1) {
      const [movedItem] = items.splice(index1, 1);
      items.splice(index2, 0, movedItem);
    }
  } else {
    // Reorder at the top level
    const index1 = data.findIndex(item => item.id === id1);
    const index2 = data.findIndex(item => item.id === id2);

    if (index1 > -1 && index2 > -1) {
      const [movedItem] = data.splice(index1, 1);
      data.splice(index2, 0, movedItem);
    }
  }
};

/**
 * Move an item to a different parent.
 */
export function promoteOrDemoteNode(data: SectionField[], idToMove: string, targetParentId: string | null) {
  const itemInfo = findItemAndParentById(data, idToMove);
  const newParentInfo = targetParentId ? findItemAndParentById(data, targetParentId) : null;
  const itemToMove = itemInfo?.item;
  const oldParent = itemInfo?.parent;
  const newParent = newParentInfo?.item;

  if (itemToMove) {
    // Remove from old parent
    if (oldParent && oldParent.fields) {
      oldParent.fields = oldParent.fields.filter(item => item.id !== idToMove);
    } else {
      // Remove from top level
      const index = data.findIndex(item => item.id === idToMove);
      if (index > -1) {
        data.splice(index, 1);
      }
    }

    // Add to new parent or top level
    if (newParent !== undefined &&
      newParent.type === 'group' &&
      itemToMove.type !== 'group') {
      newParent.fields.push(itemToMove);
    } else if (!targetParentId) {
      data.push(itemToMove);
    }
  }
}
