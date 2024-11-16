<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { useUserStore } from '@/stores/user.store';
    

    const router = useRouter();
    const userStore = useUserStore();

    function handleLogout() {
        userStore.logout();
        router.push({ name: 'Home' });
    } 
    
</script>

<template>
    <nav class="navbar navbar-expand bg-dark" data-bs-theme="dark">
        <div class="container-fluid">
            <a
                href="/"
                class="navbar-brand"
                >Restaurant</a>
            <div class="me-auto navbar-nav">
                <li class="nav-item">
                    <router-link
                    :to="{ name: 'Home' }"
                    class="nav-link"
                    >
                    Trang chủ
                    <i class="fa-solid fa-house"></i>
                    </router-link>
                </li>
            </div>
            <div v-if="userStore.isLoggedIn">
                <button @click="handleLogout" class="btn btn-danger">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
            </div>
        </div>
    </nav>
</template>