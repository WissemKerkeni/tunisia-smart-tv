import { createContext, useContext } from 'react';

/**
 * react-native-tvos' ScrollView doesn't reliably scroll focused children into
 * view on Android TV (verified on the API 36 emulator). Screens provide this
 * context so rows can scroll themselves into place when they receive focus.
 */
export type TVScrollTo = (y: number) => void;

const noop: TVScrollTo = () => {};

export const TVScrollContext = createContext<TVScrollTo>(noop);

export const useTVScrollTo = () => useContext(TVScrollContext);
