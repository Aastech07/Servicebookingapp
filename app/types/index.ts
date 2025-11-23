export interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  serviceId: number;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
}
