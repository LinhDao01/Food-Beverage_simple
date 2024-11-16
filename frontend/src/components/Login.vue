<script setup>
    import { ref } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { toTypedSchema } from '@vee-validate/zod';
    import { z } from 'zod';
    import { useUserStore } from '@/stores/user.store';
    import usersService from '@/services/users.service';
    import router from '@/router';
   
    const userStore = useUserStore();
    const email = ref('');
    const password = ref('');

    let validationSchema = toTypedSchema(
        z.object({
            email: z.string()
                .email({ message: 'Email không đúng.' })
                .max(50, { message: 'Email tối đa 50 ký tự.' }),
            password: z.string()
                .min(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
                .max(50, { message: 'Mật khẩu tối đa 50 ký tự.' }),
        })
    );

    async function handleSubmit() {
        try {
            const response = await usersService.login(email.value, password.value);
            // console.log(response);
            if (response.token) {
                // Update user store with login data
                const userRole = response.user?.role || '1';

                await userStore.loggedIn({
                    email: email.value,
                    token: response.token,
                    role: userRole
                });
                
                alert('Đăng nhập thành công!');

                console.log('Login successful:', {
                    role: userRole,
                    hasAdminAccess: userStore.hasAdminAccess
                });

                if (userRole === '0') {
                    console.log('Login successful admin', response);
                    router.push('/admin');
                } else {
                    console.log('Login successful user', response);
                    router.push('/');
                }
                
            } else {
                console.log('Token không tồn tại trong response!');
            }
        } catch (error) {
            if (error.message.includes('Email not exist!')) {
                alert('Email chưa đúng hoặc không tồn tại. Vui lòn nhập lại!');
            } else if (error.message.includes('Password is incorrect!')) {
                alert('Mật khẩu chưa đúng. Vui lòng nhập lại mật khẩu!');
            } else {
                console.log('Đăng nhập không thành công!');
                alert('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập.');
            }
        }
    }

</script>

<template>
    <div class="main-form mt-3">
        <div class="form-container">
            <Form :validation-schema="validationSchema" @submit="handleSubmit">
                <div class="row d-flex form py-4">
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="email" class="form-label">Email</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="email"
                                type="email"
                                class="form-control"
                                v-model="email"
                            />
                            <ErrorMessage name="email" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="password" class="form-label">Mật khẩu</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="password"
                                type="password"
                                class="form-control"
                                v-model="password"
                            />
                            <ErrorMessage name="password" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="my-3 d-flex justify-content-center">
                        <button class="btn btn-secondary">
                            <i class="fas fa-save"></i>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    </div>

</template>

<style>
    .main-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .form-container {
        width: 100%;
        padding-left: 50px;
    }

    .form-container .row {
        width: 100%; 
    }

    .list input {
        width: 300px;
    }
    
    .form {
        background-color: antiquewhite;
        border-radius: 25px;
    }
</style>