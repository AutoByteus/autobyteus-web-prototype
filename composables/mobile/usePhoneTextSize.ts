import { computed, ref } from 'vue';

/** The phone's conversation text size, in four steps the user chooses (autobyteus-506). One setting for every run on this phone. */
export const PHONE_TEXT_SIZES = [
  { id: 'small', label: 'Small', px: 15 },
  { id: 'standard', label: 'Standard', px: 17 },
  { id: 'large', label: 'Large', px: 19 },
  { id: 'larger', label: 'Largest', px: 21 },
] as const;
export type PhoneTextSizeId = (typeof PHONE_TEXT_SIZES)[number]['id'];

const STORAGE_KEY = 'autobyteus.phone.textSize';
const readStored = (): PhoneTextSizeId => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return PHONE_TEXT_SIZES.some((size) => size.id === stored) ? (stored as PhoneTextSizeId) : 'standard';
  } catch { return 'standard'; }
};
const current = ref<PhoneTextSizeId>(typeof window === 'undefined' ? 'standard' : readStored());

export function usePhoneTextSize() {
  const px = computed(() => PHONE_TEXT_SIZES.find((size) => size.id === current.value)?.px ?? 17);
  const set = (id: PhoneTextSizeId): void => {
    current.value = id;
    try { window.localStorage.setItem(STORAGE_KEY, id); } catch { /* the choice still applies until the page closes */ }
  };
  return { sizeId: current, px, set };
}
