<div class="w-screen h-20 flex items-center justify-between py-5 px-10 bg-white shadow border-gray-100 sticky top-0 left-0">
    <a href="{{ route('welcome') }}" class="w-32 md:w-48">
        <img src="/images/logo.png" alt="Our beautiful logo" class="w-full" />
    </a>
    <div class="hidden md:flex md:items-center">
        <div class="space-x-10">
            <a href="{{ route('welcome') }}" class="hover:text-primary transition ease-in-out">Home</a>
            <a href="{{ route('exams.index') }}" class="hover:text-primary transition ease-in-out">Exames</a>
            <a href="{{ route('scoreboard.index') }}" class="hover:text-primary transition ease-in-out">Scoreboard</a>
            <a href="{{ route('documents') }}" class="hover:text-primary transition ease-in-out">Documentos</a>
        </div>
        <div class="ml-5">
            @auth
                <form action="{{ route('profile.index') }}">
                    <x-primary-button>
                        Aceder ao perfil
                    </x-primary-button>
                </form>
            @endguest
            @guest
                <form action="{{ route('register') }}">
                    <x-primary-button>
                        Criar uma conta
                    </x-primary-button>
                </form>
            @endguest
        </div>
    </div>
    <div class="flex md:hidden" x-data="{ open: false }">
        <x-feathericon-menu class="text-primary hover:cursor-pointer" @click="open = !open"></x-feathericon-menu>
        <div x-show="open" class="absolute left-0 top-20 w-screen bg-white h-auto p-5 border border-gray-100 shadow rounded flex flex-col space-y-5">
            <a href="{{ route('welcome') }}" class="hover:text-primary transition ease-in-out">Home</a>
            <a href="{{ route('exams.index') }}" class="hover:text-primary transition ease-in-out">Exames</a>
            <a href="{{ route('scoreboard.index') }}" class="hover:text-primary transition ease-in-out">Scoreboard</a>
            <a href="{{ route('documents') }}" class="hover:text-primary transition ease-in-out">Documentos</a>

            <div class="mt-5">
                @auth
                    <form action="{{ route('profile.index') }}">
                        <x-primary-button class="w-full">
                            Aceder ao perfil
                        </x-primary-button>
                    </form>
                @endguest
                @guest
                    <form action="{{ route('register') }}">
                        <x-primary-button class="w-full">
                            Criar uma conta
                        </x-primary-button>
                    </form>
                @endguest
            </div>
        </div>
    </div>
</div>
