<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { onMounted } from 'vue';
    import { useUserStore } from '@/stores/user.store';
    import { watch } from 'vue';
    
    const router = useRouter();
    const userStore = useUserStore();
    
    onMounted(() => {
        if (!userStore.hasAdminAccess) {
            router.push('/');
        }
    });
    // Watch for changes in admin status
    watch(() => userStore.hasAdminAccess, (isAdmin) => {
        if (!isAdmin) {
            router.push('/');
        }
    });
    
</script>


<template>
    <div class="home-container">
        <h1 class="text-center mb-4">Welcome to our admin dashboard</h1>
        
        <div v-if="userStore.isLoggedIn" class="user-info">
            <div v-if="userStore.isLoggedIn" class="user-info">
                <p class="welcome-message">
                    Xin chào, <span class="user-email">{{ userStore.email }}</span>!
                </p>
                <div>
                    <p>User is: {{ userStore.isAuthenticated ? 'Logged In' : 'Logged Out' }}</p>
                    <p>Role: {{ userStore.isAdmin ? 'Admin' : 'User' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>