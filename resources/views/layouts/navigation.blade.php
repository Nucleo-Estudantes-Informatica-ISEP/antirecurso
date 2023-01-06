<aside class="z-20 hidden w-64 overflow-y-auto bg-white md:block flex-shrink-0">
    <div class="py-4 text-gray-500">
        <a class="pl-6 text-lg font-bold text-gray-800" href="{{ route('admins.index') }}">
            <img src="/images/logo.png" class="w-32 ml-6" />
        </a>

        <ul class="mt-6">
            <li class="relative px-6 py-3">
                <x-nav-link href="{{ route('admins.index') }}" :active="request()->routeIs('admins.index')">
                    <x-slot name="icon">
                        <x-feathericon-home class="w-5"></x-feathericon-home>
                    </x-slot>
                    {{ __('Dashboard') }}
                </x-nav-link>
            </li>

            <li class="relative px-6 py-3">
                <x-nav-link href="{{ route('users.index') }}" :active="request()->routeIs('users.index')">
                    <x-slot name="icon">
                        <x-feathericon-users class="w-5"></x-feathericon-users>
                    </x-slot>
                    {{ __('Users') }}
                </x-nav-link>
            </li>

            <li class="relative px-6 py-3">
                <button
                    class="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 text-gray-800"
                    @click="toggleMultiLevelMenu" aria-haspopup="true">
                    <span class="inline-flex items-center">
                        <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                        </svg>
                        <span class="ml-4">Cadeiras</span>
                    </span>
                    <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </button>
                <template x-if="isMultiLevelMenuOpen">
                    <ul x-transition:enter="transition-all ease-in-out duration-300" x-transition:enter-start="opacity-25 max-h-0"
                        x-transition:enter-end="opacity-100 max-h-xl" x-transition:leave="transition-all ease-in-out duration-300"
                        x-transition:leave-start="opacity-100 max-h-xl" x-transition:leave-end="opacity-0 max-h-0"
                        class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50"
                        aria-label="submenu">
                        <li class="px-2 py-1 transition-colors duration-150">
                            <a class="w-full" href="{{ route('admins.subjects.index') }}">Cadeiras</a>
                        </li>
                        <li class="px-2 py-1 transition-colors duration-150">
                            <a class="w-full" href="{{ route('admins.question-types.index') }}">Tipos de perguntas</a>
                        </li>
                        <li class="px-2 py-1 transition-colors duration-150">
                            <a class="w-full" href="{{ route('admins.questions.index') }}">Perguntas</a>
                        </li>
                    </ul>
                </template>
            </li>
        </ul>
    </div>
</aside>
