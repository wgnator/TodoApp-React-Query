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
    console.log("requested: POST ", data);
    return this.service.post(url, data);
  }

  patch<T>(url: string, data: T) {
    return this.service.patch(url, data);
  }

  delete(url: string) {
    return this.service.delete(url);
  }
}
