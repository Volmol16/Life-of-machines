<template>
    <div class="flex">
        <div class="bg-[#0554F2] w-[50%] h-[100vh] pt-16"
            style="background-image: url(/img/Auth/1.png); background-position: right bottom; background-size: auto; background-repeat: no-repeat;">
            <div class="px-10">
                <h1 class="text-[40px] text-white font-semibold leading-10">{{ greetings }}</h1>
                <p class="mt-5 text-white text-xl">{{ descritpionPage }}</p>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center w-[50%]">
            <div class="flex flex-col w-full max-w-[424px]">
                <h2 class="text-[#001233] font-semibold text-4xl">{{ titleForm }}</h2>
                <div class="flex flex-col gap-y-6 mt-8">
                    <div class="flex flex-col">
                        <label class="text-lg text-[#001233]">Имя</label>
                        <input
                            class="mt-2 px-6 py-4 text-xl text-[#979DAC] rounded-[32px] border-[#979DAC] border leading-6"
                            type="text" placeholder="имя">
                    </div>
                    <div class="flex flex-col">
                        <label class="text-lg text-[#001233]">Email</label>
                        <input
                            class="mt-2 px-6 py-4 text-xl text-[#979DAC] rounded-[32px] border-[#979DAC] border leading-6"
                            type="email" placeholder="Email (root@server.local)" v-model="username">
                    </div>
                    <div v-if="isAuth" class="flex flex-col gap-y-6">
                        <div class="flex flex-col">
                            <label class="text-lg text-[#001233]">Придумайте пароль</label>
                            <input
                                class="mt-2 px-6 py-4 text-xl text-[#979DAC] rounded-[32px] border-[#979DAC] border leading-6"
                                type="password" placeholder="Пароль (whoami)" v-model="password">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-lg text-[#001233]">Повторите пароль</label>
                            <input
                                class="mt-2 px-6 py-4 text-xl text-[#979DAC] rounded-[32px] border-[#979DAC] border leading-6"
                                type="password" placeholder="Пароль" v-model="passwordReapet">
                            <span class="pl-6 text-sm text-[#979DAC]">Пароль должен содержать*</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="flex flex-col">
                            <label class="text-lg text-[#001233]">Введите пароль</label>
                            <input
                                class="mt-2 px-6 py-4 text-xl text-[#979DAC] rounded-[32px] border-[#979DAC] border leading-6"
                                type="password" placeholder="Пароль" v-model="password">
                        </div>
                    </div>
                </div>
                <div class="h-5 text-center mt-2">
                    <span v-if="authStore.errorMessage" class="text-red-500">Неправильные данные</span>
                </div>
                <div class="flex flex-col items-center mt-6">
                    <button class="py-4 w-full bg-[#0554F2] text-white text-xl leading-6 font-semibold rounded-3xl"
                        @click="auth">Авторизоваться</button>
                    <button @click="toggleAuth"
                        class="text-[#0554F2] text-xl font-medium mt-5 flex gap-x-2 items-center">{{
                            toggle }}
                        <img class="mt-1" src="/img/Auth/Right.svg" alt="->"></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from '@/store/auth';
import { ref, computed } from 'vue';

const authStore = useAuthStore();
const isAuth = ref(false);
const username = ref('');
const password = ref('');
const passwordReapet = ref('');

const auth = async () => {
    try {
        await authStore.login({ username: username.value, password: password.value });
    } catch (error) {
        console.error('Ошибка авторизации:', error);

    }
}

const toggleAuth = () => {
    isAuth.value = !isAuth.value
}

const greetings = computed(() => {
    return isAuth.value ? 'Начните работать эффективнее и быстрее!' : 'Рады видеть вас!';
})

const descritpionPage = computed(() => {
    return isAuth.value
        ? 'Зарегистрируйтесь, чтобы получить доступ к аналитике, графикам и инструментам мониторинга для оптимизации работы строительной техники.'
        : 'Войдите в систему и продолжайте отслеживать и контролировать работу строительной техники в режиме реального времени.';
})

const titleForm = computed(() => {
    return isAuth.value ? 'Регистрация' : 'Войти';
})

const toggle = computed(() => {
    return isAuth.value ? 'Вход' : 'Зарегистрироваться';
})

</script>
<style></style>