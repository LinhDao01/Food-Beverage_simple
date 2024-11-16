<script setup>
    import { ref } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { toTypedSchema } from '@vee-validate/zod';
    import { z } from 'zod';
    import { useUserStore } from '@/stores/user.store';
    import userService from '@/services/users.service';
    import router from '@/router';

    const props = defineProps({
        user: { 
            type: Object, 
            required: true,
            default: () => ({
                name: '',
                email: '',
                pass: '', 
                address_detail: '', 
                district: '', 
                province: '',
                phone: ''
            }) 
        },
    });

    const $emit = defineEmits(['submit:user']);

    let validationSchema = toTypedSchema(
        z.object({
            name: z.string()
                .min(2, { message: 'Tên tối thiểu 2 ký tự' })
                .max(50, { message: 'Tên tối đa 50 ký tự' }),
            email: z.string()
                .email({ message: 'Email không đúng.' })
                .max(50, { message: 'Email tối đa 50 ký tự' }),
            pass: z.string()
                .min(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
                .max(50, { message: 'Mật khẩu tối đa 50 ký tự' }),
            address_detail: z.string()
                .min(1, { message: 'Vui lòng nhập địa chỉ cụ thể' }),
            district: z.string()
                .min(1, { message: 'Vui lòng nhập Quận/Huyện' }),
            province: z.string()
                .min(1, { message: 'Vui lòng nhập Tỉnh/Thành phố' }),
            phone: z.string()
                .regex(
                    /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g,
                    { message: 'Số điện thoại không hợp lệ.' }
                ),
        })
    );

    async function submitUser(values) {
        let formData = new FormData();
        for (let key in values) {
            if (values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        }
        try {
            const response = await userService.createUser(formData);  // Gọi API tạo tài khoản
            alert('Tạo tài khoản thành công!');
            console.log('User response:', response);

            const { user, token } = response;
            const userResponse = {
                email: user.email,
                token: token,
                role: user.role // Assuming default non-admin role
                };
            // Cập nhật trạng thái đăng nhập trong store
            const userStore = useUserStore();
            userStore.loggedIn(userResponse);  // Đăng nhập người dùng tự động

            router.push('/');  // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        } catch (error) {
            console.log(error);
            
            if (error.message.includes('Email đã được sử dụng. Vui lòng chọn email khác.')) {
                alert('Email đã được sử dụng. Vui lòng chọn email khác!');
            } else if (error.message.includes('Số điện thoại đã được sử dụng. Vui lòng chọn số khác.')) {
                alert('Số điện thoại đã được sử dụng. Vui lòng chọn số khác!');
            } else {
                alert('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại sau!');
            }
        }
        // $emit('submit:user', formData);
    }
</script>

<template>
    <div class="main-form mt-3">
        <div class="form-container">
            <Form :validation-schema="validationSchema" @submit="submitUser">
                <div class="row d-flex form py-4">
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="name" class="form-label">Họ và Tên</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="name"
                                type="text"
                                class="form-control"
                                :value="user.name"
                            />
                            <ErrorMessage name="name" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="email" class="form-label">Email</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="email"
                                type="email"
                                class="form-control"
                                :value="user.email"
                            />
                            <ErrorMessage name="email" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="pass" class="form-label">Mật khẩu</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="pass"
                                type="password"
                                class="form-control"
                                :value="user.pass"
                            />
                            <ErrorMessage name="pass" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="address_detail" class="form-label">Địa chỉ chi tiết</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="address_detail"
                                type="text"
                                class="form-control"
                                :value="user.address_detail"
                            />
                            <ErrorMessage name="address_detail" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="district" class="form-label">Quận / Huyện</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="district"
                                type="text"
                                class="form-control"
                                :value="user.district"
                            />
                            <ErrorMessage name="district" class="error-feedback" />
                        </div>
                    </div>
                    
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="province" class="form-label">Tỉnh / Thành phố</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="province"
                                type="text"
                                class="form-control"
                                :value="user.province"
                            />
                            <ErrorMessage name="province" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="mb-3 row g-1 justify-content-center">
                        <div class="col-2 mt-2">
                            <label for="phone" class="form-label">Số điện thoại</label>
                        </div>
                        <div class="col-5">
                            <Field
                                name="phone"
                                type="tel"
                                class="form-control"
                                :value="user.phone"
                            />
                            <ErrorMessage name="phone" class="error-feedback" />
                        </div>
                    </div>
        
                    <div class="my-3 d-flex justify-content-center">
                        <button class="btn btn-secondary">
                            <i class="fas fa-save"></i>
                            Đăng ký
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