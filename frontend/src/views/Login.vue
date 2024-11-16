<script setup>
    import Login from '@/components/Login.vue';

</script>

<template>
    <div class="main">
        <div class="container-fluid">
            <div class="align-self-center d-flex justify-content-center">
                <h1>Đăng nhập</h1>
            </div>
        </div>

        <Login />
        <div class="mt-3">
            <p>
                Bạn chưa có tài khoản? Tạo tài khoản mới tại <RouterLink to="/signup">đây nhé!</RouterLink>
            </p>
        </div>

    </div>
</template>