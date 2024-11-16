import { defineStore } from 'pinia';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    email: '',
    token: ''
  }),
  // để kiểm tra trạng thái
  getters: {
    isAuthenticated: (state) => state.isLoggedIn, //kiểm tra đã login chưa
    // userRole: () => (state) => (state.isAdmin ? '0' : '1'),
    hasAdminAccess: (state) => {
      console.log('Checking admin access:', {
        role: state.role,
        isAdmin: state.isAdmin
      });
      return state.role === '0';
    }
  },

  actions: {
    loggedIn(response) {
      // receive data
      console.log('Received login data:', response);

      if (!response || !response.email || !response.token) {
        console.error('Invalid login data:', response);
        throw new Error('Please enter email and password!');
      }

      const userRole = String(response.role);

      // Set user data after successful login
      this.isLoggedIn = true;
      this.email = response.email;
      this.token = response.token;
      this.role = userRole;


      // Store in localStorage
      localStorage.setItem('email', response.email);
      localStorage.setItem('role', userRole);
      localStorage.setItem('authToken', response.token);
      //debug
      console.log('Store updated:', {
        isLoggedIn: this.isLoggedIn,
        isAdmin: this.isAdmin,
        role: this.role,
        hasAdminAccess: this.hasAdminAccess
      });
    },

    checkAuthStatus() {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('role');

      if (email && token) {
        this.isLoggedIn = true;
        this.email = email;
        this.token = token;
        this.role = role || '1';
        this.isAdmin = role === '0';
        // debug
        console.log('Auth status checked:', {
          isLoggedIn: this.isLoggedIn,
          isAdmin: this.isAdmin,
          role: this.role
        });

        return true;
      }

      return false;
    },

    logout() {
      // Xóa thông tin người dùng trong localStorage
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('authToken');

      this.isLoggedIn = false;
      this.isAdmin = false;
      this.email = '';
      this.token = '';
      this.role = '';

      router.push('/');
    }
  }
});
