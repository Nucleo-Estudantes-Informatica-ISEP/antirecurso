<div class="w-screen h-20 flex items-center justify-between py-5 px-10 bg-white shadow border-gray-100 sticky top-0 left-0">
    <a href="{{ route('welcome') }}" class="w-48">
        <img src="/images/logo.png" class="w-full" />
    </a>
    <div class="space-x-10">
        <a href="{{ route('welcome') }}" class="hover:text-primary transition ease-in-out">Home</a>
        <a href="{{ route('exams.index') }}" class="hover:text-primary transition ease-in-out">Exames</a>
        <a href="{{ route('scoreboard.index') }}" class="hover:text-primary transition ease-in-out">Scoreboard</a>
        <a href="{{ route('documents') }}" class="hover:text-primary transition ease-in-out">Documentos</a>
    </div>
    <div>
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
