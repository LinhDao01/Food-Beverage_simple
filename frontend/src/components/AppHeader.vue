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
        </div>
    </nav>
</template>