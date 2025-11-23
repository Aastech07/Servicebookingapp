import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

const KEY = 'BOOKINGS';

export const getBookings = async (): Promise<Booking[]> => {
  const json = await AsyncStorage.getItem(KEY);
  return json ? JSON.parse(json) : [];
};

export const saveBooking = async (booking: Booking) => {
  const list = await getBookings();
  list.push(booking);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
};

export const deleteBooking = async (id: string) => {
  const list = await getBookings();
  const newList = list.filter(b => b.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
};
