<script setup>
    import { ref } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { toTypedSchema } from '@vee-validate/zod';
    import { z } from 'zod';

    const props = defineProps({
        user: { 
            type: Object, 
            // required: true,
            default: () => ({
                email: '',
                pass: '',
            }) 
        },
    });

    const $emit = defineEmits(['submit:user']);

    let validationSchema = toTypedSchema(
        z.object({
            email: z.string()
                .email({ message: 'Email không đúng.' })
                .max(50, { message: 'Email tối đa 50 ký tự.' }),
            pass: z.string()
                .min(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
                .max(50, { message: 'Mật khẩu tối đa 50 ký tự.' }),
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