<script setup>
    import { ref, watch } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { toTypedSchema } from '@vee-validate/zod';
    import { z } from 'zod';

    const props = defineProps({
        user: { 
            type: Object, 
            // required: true,
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

    const avatarFileInput = ref(null);
    const avatarFile = ref(props.user?.avatar || '');

    const $emit = defineEmits(['submit:user']);

    let validationSchema = toTypedSchema(
        z.object({
            name: z.string()
                .min(2, { message: 'Tên tối thiểu 2 ký tự.' })
                .max(50, { message: 'Tên tối đa 50 ký tự.' }),
            email: z.string()
                .email({ message: 'Email không đúng.' })
                .max(50, { message: 'Email tối đa 50 ký tự.' }),
            pass: z.string()
                .min(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
                .max(50, { message: 'Mật khẩu tối đa 50 ký tự.' }),
            address_detail: z.string()
                .max(100, { message: 'Địa chỉ tối đa 100 ký tự.' }),
            district: z.string()
                .max(100, { message: 'Quận/huyện tối đa 100 ký tự.' }),
            province: z.string()
                .max(100, { message: 'Tỉnh/Thành phố tối đa 100 ký tự.' }),
            phone: z.string()
                .regex(
                    /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g,
                    { message: 'Số điện thoại không hợp lệ.' }
                ),
            avatarFile: z.instanceof(File).optional(),
        })
    );

    function submitUser(values) {
        let formData = new FormData();
        for (let key in values) {
            if (values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        } 

        $emit('submit:user', formData);
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