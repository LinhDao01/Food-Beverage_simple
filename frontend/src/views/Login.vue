<script setup>
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import Login from '@/components/Login.vue';
    import userService from '@/services/users.service';

    const router = useRouter();
    const message = ref('');
    const user = ref({
        name: '',
        email: '',
        password: '',
    })

</script>

<template>
    <div v-if="user" class="main">
        <div class="container-fluid">
            <div class="align-self-center d-flex justify-content-center">
                <h1>Đăng nhập</h1>
            </div>
        </div>

        <login />

        <div class="mt-3">
            <p>
                Bạn chưa có tài khoản? Tạo tài khoản mới tại <RouterLink to="/signup">đây nhé!</RouterLink>
            </p>
        </div>

        <p>{{ message }}</p>

    </div>
</template>