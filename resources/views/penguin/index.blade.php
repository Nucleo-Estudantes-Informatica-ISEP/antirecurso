@extends('layouts.general')

@section('content')
    <section class="flex flex-col items-center mt-16">
        <p class="text-xl font-bold uppercase mt-16 text-center">O teu <span class="text-primary">score</span> ao longo das disciplinas</p>

        <livewire:penguin.index />
    </section>
@stop
