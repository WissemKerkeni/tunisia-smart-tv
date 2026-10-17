import { Platform } from 'react-native';

/** True on Android TV builds (react-native-tvos sets Platform.isTV from the device UI mode). */
export const isTV: boolean = Platform.isTV;
