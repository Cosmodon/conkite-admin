import { create } from "apisauce";
import { inject } from "mobx-react";

class Auth {
  logout(msg) {
    alert(`logout! ${msg}`);
  }
  login() {
    alert('login!');
  }
}

export const endpoints:Array<string> = ['https://theeblvd.ngrok.io', 'http://localhost'];

class API {
  auth = new Auth();
  api = create({
    baseURL: endpoints[0],
    headers: { Accept: "application/json" }
  });
  constructor() {
    const naviMonitor = response => {
      if (response.status === 403 || response.status === 401) {
        this.auth.logout(`due to status code ${response.status}`);
      }
    };
    this.api.addMonitor(naviMonitor);
  }
  setEndpoint(endpoint: string) {
    this.api = create({
      baseURL: endpoint,
      headers: { Accept: "application/json" }
    });
  }
  getEndpoint(): string {
    return this.api.getBaseURL();
  }
  getEndpoints(): Array<string>{
    return endpoints;
  }

  fetchUserPayments = async ({ corrlinksId }, options?): Promise<any[]> => {
    const response = await this.api.get(`users/${corrlinksId}/payments`, options);

    if (response.data && response.data['data']) {
      const data: [] = (response.data['data'] as []);
      return [...data];
    }
    return [];
  }

  fetchUsers = async (options?): Promise<any[]> => {
    const response = await this.api.get('users', options);

    if (response.data && response.data['data']) {
      const data: [] = (response.data['data'] as []);
      return [...data];
    }
    return [];
  }

  updateUser = async ({ corrlinks_id, user }, options?): Promise<boolean> => {
    await this.api.put(`/users/${corrlinks_id}`, user, options);
    return user;
  }

  addUser = async (user, options?): Promise<any> => {
    const newUser = await this.api.post(`/users`, user, options);
    return newUser;
  }

  deleteUser = async ({ corrlinks_id }, options?): Promise<any> => {
    await this.api.delete(`/users/${corrlinks_id}`, options);
    return true;
  }

  addUserPayment = async ({ corrlinks_id, payment }, options?): Promise<any> => {
    const result = await this.api.post(`/users/${corrlinks_id}/payments`, payment, options);
    return result;
  }

}


export default new API();
