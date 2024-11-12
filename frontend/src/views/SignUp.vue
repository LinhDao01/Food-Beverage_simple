<script setup>
    import { ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import SignUp from '@/components/SignUp.vue';
    import userService from '@/services/users.service';
    
    const router = useRouter();
    const message = ref('');
    const user = ref({
        name: '',
        email: '',
        pass: '', 
        address_detail: '', 
        district: '', 
        province: '',
        phone: ''
    })

    async function onCreateUser(newUser) {
        try {
            await userService.createUser(newUser);
            message.value = 'Tạo tài khoản thành công.';
        } catch (error) {
            console.log(error);
            message.value = 'Có lỗi xảy ra khi tạo tài khoản.';
        }
    }

</script>

<template>
    <div v-if="user" class="main">
        <div class="container-fluid">
            <div class="align-self-center d-flex justify-content-center">
                <h1>Đăng ký</h1>
            </div>
        </div>
        <div class="mt-3">
            <p>
                Bạn đã có tài khoản. Vào <RouterLink to="/login">đây</RouterLink> để đăng nhập nhé!
            </p>
            <p>Nếu chưa, hãy tạo tài khoản theo form dưới đây.</p>
        </div>
        <SignUp 
            :user="user"
            @submit:user="onCreateUser"    
        />
        
        <p>{{ message }}</p>

    </div>
</template>

<style>
    .logo {
        height: 100px;
        width: 100px;
        border-radius: 50px;
        margin: 20px 0;
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
</style>