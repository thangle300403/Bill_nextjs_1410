// store/popupStore.ts
import { create } from "zustand";

export type PopupType =
  | "LOGIN"
  | "REGISTER"
  | "CART"
  | "FORGOT_PASSWORD"
  | null;

interface PopupState {
  popupType: PopupType;
  showPopup: (type: PopupType) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  popupType: null,
  showPopup: (type) => set({ popupType: type }),
  closePopup: () => set({ popupType: null }),
}));
