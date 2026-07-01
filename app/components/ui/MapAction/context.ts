import type { InjectionKey } from 'vue';

/** Direction a MapActionGroup stacks its actions */
export type MapActionOrientation = 'vertical' | 'horizontal';

/**
 * Provided by MapActionGroup with its orientation. A nested MapAction uses it to
 * drop its own frame and size to the group. Absent (null) when standalone.
 */
export const MAP_ACTION_GROUP: InjectionKey<MapActionOrientation> =
    Symbol('mapActionGroup');
