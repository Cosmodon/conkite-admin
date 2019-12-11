import { create } from "apisauce";

class Auth {
  logout(msg) {
    alert(`logout! ${msg}`);
  }
  login() {
    alert('login!');
  }
}

const endpoint = 'http://localhost:3000'

class API {
  auth = new Auth();
  api = create({
    baseURL: endpoint,
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

  fetchUserPayments = async ({ corrlinksId }, options?): Promise<any[]> => {
    const response = await this.api.get(`user/${corrlinksId}/payments`, options);

    if (response.data && response.data['data']) {
      const data: [] = (response.data['data'] as []);
      return [...data];
    }
    return [];
  }

  fetchUsers = async (options?) : Promise<any[]>=> {
    const response = await this.api.get('users', options);
  
    if (response.data && response.data['data']) {
      const data:[] = (response.data['data'] as []);
      return [...data];
    }
    return [];
  }

  updateUser = async ({corrlinks_id, user}, options?) : Promise<boolean>=> {
    await this.api.put(`/users/${corrlinks_id}`, user, options);
    return user;
  }
  
  addUser = async (user, options?) : Promise<any>=> {
    const newUser = await this.api.post(`/users`, user, options);
    return newUser;
  }

  deleteUser = async ({corrlinks_id}, options?) : Promise<any>=> {
    await this.api.delete(`/users/${corrlinks_id}`, options);
    return true;
  }


  // // Bookings
  // fetchBookings = async (options?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(
  //     `/api/admin/get-all-bookings`,
  //     options,
  //     headers
  //   );
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // };
  // fetchBookingLogs = async bookingId => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.adminApi.get(
  //     "Admin API",
  //     `/bookings/${bookingId}/logs`
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };
  // cancelBooking = async (bookingId, reason) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.put(
  //     `/api/booking/cancel-silently`,
  //     { bookingId, reason },
  //     headers
  //   );
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // }
  // updateBooking = async (booking) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.patch(`/api/admin/bookings/${booking.bookingId}`, booking, headers);
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // }

  // // Booking Logs
  // postBookingLog = async (log) => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/bookings/${log.bookingId}/logs`,
  //     Object.assign({}, this.adminApiOptions, {}, { body: log })
  //   );
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // };
  // updateBookingLog = async (log) => {
  //   const response = await this.adminApi.patch(
  //     "Admin API",
  //     `/bookings/${log.bookingId}/logs/${log.id}`,
  //     Object.assign({}, this.adminApiOptions, {}, { body: log })
  //   );
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // };
  // deleteBookingLog = async (log) => {
  //   const response = await this.adminApi.del(
  //     "Admin API",
  //     `/bookings/${log.bookingId}/logs/${log.id}`,
  //     this.adminApiOptions
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.error);
  // };

  // //instructors
  // fetchProfile = async () => {
  //   const response = await this.api.get(
  //     `/api/instructor/get-profile`,
  //     {},
  //     this.auth.getAuthConfig()
  //   );
  //   return response.data;
  // };

  // //instructors
  // fetchInstructors = async (options?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(
  //     `/api/admin/get-instructor-list?&wantEvo2Instructors=false`,
  //     options,
  //     headers
  //   );
  //   if (response.data) return response.data.data.res;
  //   throw new Error(response.error);
  // };

  // //schools
  // fetchSchoolsAPIv1 = async (options?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(
  //     `/api/admin/skischool-get-all`,
  //     options,
  //     headers
  //   );
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // };
  // updateSchoolsAPIv1 = async (school?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.put(`/api/skischool`, school, headers);
  //   if (response.data) return true;
  //   throw new Error(response.error);
  // };
  // addSchoolsAPIv1 = async (school?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.post(`/api/skischool`, school, headers);
  //   if (response.data) return true;
  //   throw new Error(response.error);
  // };
  // //resorts
  // fetchResortsAPIv1 = async (options?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(
  //     `/api/admin/get-resorts`,
  //     options,
  //     headers
  //   );
  //   if (response.data) return response.data.data.resorts;
  //   throw new Error(response.error);
  // };

  // ///** Admin API */
  // /// Providers
  // fetchProviders = async (
  //   options = {
  //     queryStringParameters: {
  //       include: ["meetingPoints", "resorts", "languages", "seasonDates"]
  //     }
  //   }
  // ) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/providers`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.data) return response.data.items;
  //   throw new Error(response.statusText);
  // };

  // addProvider = async (
  //   provider,
  //   providerType = "school",
  //   options = {
  //     queryStringParameters: {
  //       include: ["meetingPoints", "resorts", "languages", "seasonDates"]
  //     }
  //   }
  // ) => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/providers?type=${providerType}`,
  //     Object.assign({}, this.adminApiOptions, options, { body: provider })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };
  // updateProvider = async provider => {
  //   const response: AxiosResponse = await this.adminApi.patch(
  //     "Admin API",
  //     `/providers/${provider.id}`,
  //     Object.assign({}, this.adminApiOptions, { body: provider })
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.statusText);
  // };

  // /// Products
  // fetchProducts = async providerId => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/products?providerId=${providerId}&include=levels&include=activities&include=meetingPoints`,
  //     this.adminApiOptions
  //   );
  //   if (response.data) return response.data.items;
  //   throw new Error(response.statusText);
  // };

  // addProduct = async product => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/products`,
  //     Object.assign({}, this.adminApiOptions, { body: product })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };

  // copyProduct = async productId => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/products`,
  //     Object.assign({}, this.adminApiOptions, {
  //       queryStringParameters: {
  //         sourceId: productId,
  //         include: ["meetingPoints", "variants", "levels", "activities"]
  //       },
  //       body: {}
  //     })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };

  // updateProduct = async product => {
  //   const response: AxiosResponse = await this.adminApi.patch(
  //     "Admin API",
  //     `/products/${product.id}`,
  //     Object.assign({}, this.adminApiOptions, { body: product })
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.statusText);
  // };

  // deleteProduct = async product => {
  //   const response = await this.adminApi.del(
  //     "Admin API",
  //     `/products/${product.id}`,
  //     this.adminApiOptions
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.error);
  // };

  // // product variants
  // fetchProductVariants = async productId => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/products/${productId}/variants`,
  //     this.adminApiOptions
  //   );
  //   if (response.data) return response.data.items;
  //   throw new Error(response.statusText);
  // };

  // addProductVariant = async variant => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/products/${variant.productId}/variants`,
  //     Object.assign({}, this.adminApiOptions, { body: variant })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };

  // updateProductVariant = async variant => {
  //   const response = await this.adminApi.patch(
  //     "Admin API",
  //     `/products/${variant.productId}/variants/${variant.id}`,
  //     Object.assign({}, this.adminApiOptions, { body: variant })
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.error);
  // };

  // deleteProductVariant = async variant => {
  //   const response = await this.adminApi.del(
  //     "Admin API",
  //     `/products/${variant.productId}/variants/${variant.id}`,
  //     this.adminApiOptions
  //   );
  //   if (response.status === 204) return true;
  //   throw new Error(response.error);
  // };

  // copyProductVariant = async variant => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/products/${variant.productId}/variants`,
  //     Object.assign({}, this.adminApiOptions, {
  //       queryStringParameters: { sourceId: variant.id },
  //       body: {}
  //     })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };
  // //resorts
  // fetchResorts = async (options = { params: { sort: "name:asc" } }) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/resorts`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.statusText);
  // };
  // addResort = async resort => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/resorts`,
  //     Object.assign({}, this.adminApiOptions, { body: resort })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };
  // updateResort = async resort => {
  //   const response: AxiosResponse = await this.adminApi.patch(
  //     "Admin API",
  //     `/resorts/${resort.id}`,
  //     Object.assign({}, this.adminApiOptions, { body: resort })
  //   );
  //   if (response.status === 200) return true;
  //   throw new Error(response.statusText);
  // };
  // fetchCountries = async (options = { params: { sort: "name:asc" } }) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/countries`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.statusText);
  // };
  // //activities
  // fetchActivities = async (options = { params: { sort: "name:asc" } }) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/activities`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.statusText);
  // };
  // addActivity = async activity => {
  //   const response = await this.adminApi.post(
  //     "Admin API",
  //     `/activities`,
  //     Object.assign({}, this.adminApiOptions, { body: activity })
  //   );
  //   if (response.data) return response.data;
  //   throw new Error(response.error);
  // };
  // updateActivity = async activity => {
  //   const response: AxiosResponse = await this.adminApi.patch(
  //     "Admin API",
  //     `/activities/${activity.id}`,
  //     Object.assign({}, this.adminApiOptions, { body: activity })
  //   );
  //   if (response.status === 200) return true;
  //   throw new Error(response.statusText);
  // };
  // //levels
  // fetchLevels = async (options = { params: { sort: "name:asc" } }) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/levels`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.statusText);
  // };
  // //languages
  // fetchLanguages = async (options = { params: { sort: "name:asc" } }) => {
  //   const response: AxiosResponse = await this.adminApi.get(
  //     "Admin API",
  //     `/languages`,
  //     Object.assign({}, this.adminApiOptions, options)
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.statusText);
  // };

  // //meeting points
  // createMeetingPoints = async (providerId, meetingPoints) => {
  //   const response: AxiosResponse = await this.adminApi.put(
  //     "Admin API",
  //     `/providers/${providerId}/meeting-point-collection`,
  //     Object.assign({}, this.adminApiOptions, { body: meetingPoints })
  //   );
  //   if (response.status === 201) return response.data;
  //   throw new Error(response.statusText);
  // };
  // //meeting points
  // createSeasonDates = async (providerId, seasonDates) => {
  //   const response: AxiosResponse = await this.adminApi.put(
  //     "Admin API",
  //     `/providers/${providerId}/season-date-collection`,
  //     Object.assign({}, this.adminApiOptions, { body: seasonDates })
  //   );
  //   if (response.status === 201) return response.data;
  //   throw new Error(response.statusText);
  // };
  // ////////////////////////

  // //promoCodes
  // fetchPromoCodes = async (options?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(
  //     `/api/v2/admin/promo-codes`,
  //     options,
  //     headers
  //   );
  //   if (response.data)
  //     return [].concat(
  //       response.data.data.activePromoCodes,
  //       response.data.data.expiredPromoCodes
  //     );
  //   throw new Error(response.error);
  // };

  // updatePromoCode = async promoCode => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.put(
  //     `/api/v2/admin/promo-codes`,
  //     promoCode,
  //     headers
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.error);
  // };

  // addPromoCode = async promoCode => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.post(
  //     `/api/v2/admin/promo-codes`,
  //     promoCode,
  //     headers
  //   );
  //   if (response.status === 200) return response.data;
  //   throw new Error(response.error);
  // };

  // fetchPartnersDM1 = async (options?) => {
  //   // const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.get(`/api/partners/get-all`, options);
  //   if (response.data) return response.data.data;
  //   throw new Error(response.error);
  // };
  // updatePartnersAPIv1 = async (record?) => {
  //   const headers = await this.auth.getAuthConfig();
  //   const response = await this.api.post(`/api/partner/update`, record, headers);
  //   if (response.data) return true;
  //   throw new Error(response.error);
  // };
}

export default new API();
