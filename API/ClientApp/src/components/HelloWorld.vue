<script setup lang="ts">
import { ref } from 'vue'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
</script>

<template>
  <section id="center" class="flex flex-col items-center justify-center py-16 text-center">
    <div class="hero relative flex items-center justify-center mb-8">
      <img :src="heroImg" class="base w-[170px] h-[179px]" alt="" />
      <img :src="vueLogo" class="framework absolute -bottom-2 -right-4 w-12 h-12" alt="Vue logo" />
      <img :src="viteLogo" class="vite absolute -top-2 -left-4 w-12 h-12" alt="Vite logo" />
    </div>

    <div class="mb-6">
      <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">Get started</h1>
      <p class="text-lg text-gray-400">
        Edit <code class="bg-gray-800 px-1 py-0.5 rounded text-pink-400">src/App.vue</code> and save to test 
        <code class="bg-gray-800 px-1 py-0.5 rounded text-blue-400">HMR</code>
      </p>
    </div>

    <button 
      class="counter px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg"
      @click="count++"
    >
      Count is {{ count }}
    </button>
  </section>

  <div class="ticks border-t border-gray-800 my-8 w-full max-w-4xl mx-auto"></div>

  <section id="next-steps" class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto px-6 py-12">
    
    <div id="docs" class="space-y-4">
      <div class="flex items-center gap-3">
        <svg class="icon w-8 h-8 text-indigo-400" role="presentation" aria-hidden="true">
          <use href="/icons.svg#documentation-icon"></use>
        </svg>
        <h2 class="text-2xl font-semibold text-white">Documentation</h2>
      </div>
      <p class="text-gray-400">Your questions, answered</p>
      <ul class="space-y-3 mt-4">
        <li>
          <a href="https://vite.dev/" target="_blank" class="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
            <img class="logo w-5 h-5" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank" class="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
            <img class="button-icon w-5 h-5" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>

    <div id="social" class="space-y-4">
      <div class="flex items-center gap-3">
        <svg class="icon w-8 h-8 text-indigo-400" role="presentation" aria-hidden="true">
          <use href="/icons.svg#social-icon"></use>
        </svg>
        <h2 class="text-2xl font-semibold text-white">Connect with us</h2>
      </div>
      <p class="text-gray-400">Join the Vite community</p>
      <ul class="grid grid-cols-2 gap-4 mt-4">
        <li v-for="(link, name) in { 
          'GitHub': 'github-icon', 
          'Discord': 'discord-icon', 
          'X.com': 'x-icon', 
          'Bluesky': 'bluesky-icon' 
        }" :key="name">
          <a href="#" class="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <svg class="button-icon w-5 h-5 fill-current" role="presentation" aria-hidden="true">
              <use :href="`/icons.svg#${link}`"></use>
            </svg>
            {{ name }}
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks border-t border-gray-800 my-8 w-full max-w-4xl mx-auto"></div>
  <section id="spacer" class="h-24"></section>
</template>