import { AxiosInstance } from "axios";

export default class httpRequest {
  service: AxiosInstance;

  constructor(service: AxiosInstance) {
    this.service = service;
  }

  get(url: string) {
    return this.service.get(url);
  }

  post<T>(url: string, data: T) {
    return this.service.post(url, data);
  }

  put<T>(url: string, data: T) {
    return this.service.put(url, data);
  }

  delete(url: string) {
    return this.service.delete(url);
  }
}
