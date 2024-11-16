<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { onMounted } from 'vue';
    import { useUserStore } from '@/stores/user.store';
    import { computed } from 'vue';
    
    const router = useRouter();
    const userStore = useUserStore();

    const isAuthenticated = computed(() => userStore.isAuthenticated);
    const isAdmin = computed(() => userStore.isAdmin);
    
    onMounted(() => {
        userStore.checkAuthStatus(); // Check user status on page load
    });
    
    
</script>

<template>
    <div class="home-container">
        <h1 class="text-center mb-4">Welcome to our Restaurant!</h1>
        
        <div v-if="userStore.isLoggedIn" class="user-info">
            <p class="welcome-message">
                Xin chào, <span class="user-email">{{ userStore.email }}</span>!
            </p>
            <div>
                <p>User is: {{ isAuthenticated ? 'Logged In' : 'Logged Out' }}</p>
                <p>Role: {{ isAdmin ? 'Admin' : 'User' }}</p>
            </div>
        </div>
    
        <div v-else class="guest-info">
            <p>Bạn chưa đăng nhập.</p>
            <RouterLink to="/login" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> Đăng nhập
            </RouterLink>
        </div>
    </div>
</template>