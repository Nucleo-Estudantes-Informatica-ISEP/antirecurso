@extends('layouts.general')

@section('content')
    <section class="h-screen flex flex-col items-center">
        <p class="text-xl font-bold uppercase mt-10 ml-5">Exame de <span class="text-primary">{{ $subject->name }}</p>
        <section>
            <livewire:exams.answer :subject="$subject" />
        </section>
    </section>
@stop
