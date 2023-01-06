<!DOCTYPE html>
<html x-data="data" lang="en">
    <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="csrf-token" content="{{ csrf_token() }}">

            <title>Antirecurso</title>

            @vite(['resources/css/app.css', 'resources/js/app.js'])
            <!-- Scripts -->
            <script src="{{ asset('js/init-alpine.js') }}"></script>

            @livewireStyles
    </head>
    <body>
        <x-topbar></x-topbar>

        <section>
            @yield('content')
        </section>

        @if (Illuminate\Support\Facades\Cache::get('penguin'))
            <div class="absolute bottom-5 right-5 w-20 h-20">
                <img src="/images/penguin.gif" />
            </div>
        @endif

        @livewireScripts

        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <x-livewire-alert::scripts />
    </body>
</html>
