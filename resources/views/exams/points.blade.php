@extends('layouts.general')

@section('content')
<section class="h-screen flex flex-col items-center">
    <p class="text-xl font-bold uppercase md:mt-60 ml-5">Exame de <span class="text-primary">{{ $subject->name }}</p>
    <div class="flex items-center justify-center mt-10 space-x-3">
        <div class="text-white bg-primary p-5 w-8 h-8 flex items-center justify-center rounded-full">{{
            Illuminate\Support\Facades\Session::get('wrong_answers') }}</div>
        <p class="text-xl font-bold uppercase">erradas</p>
    </div>

    <section class="mt-10 px-4 flex text-center flex-col items-center justify-center">
        @if(Illuminate\Support\Facades\Session::get('points') > 10)
            <p class="font-semibold text-xl"><span class="text-primary">Parabéns!</span> Passaste no exame! 🎉</p>
            <p class="mt-5">Contudo, tens de saber que o caminho para o sucesso é feito de pequenos avanços e, como tal, não te deves focar
                apenas neste exame e sim em tentar fazer o máximo possível.</p>
            <p class="semibold">Bom trabalho!</p>
        @else
            <p class="font-semibold text-xl"><span class="text-primary">Ohhh...</span> reprovaste no exame... 😔</p>
            <p class="mt-5">Mas hey, não te preocupes! O caminho faz-se caminhando, e tu ainda tens muito pela frente para poderes responder! Eu
                acredito em ti!</p>
            <p class="semibold">Continua!</p>
        @endif

        <form class="mt-16" action="{{ route('exams.check', ['slug' => $subject->slug]) }}">
            <x-primary-button>Verificar respostas</x-primary-button>
        </form>

        <p class="text-xs mt-5 mx-5">Não te esqueças que podes criar uma conta para guardar o teu progresso clicando <a href="{{ route('register') }}" class="underline">aqui</a>.</p>
    </section>
</section>
@stop
