@extends('layouts.general')

@section('content')
<section class="h-screen flex flex-col items-center">
    <p class="text-xl font-bold uppercase mt-10 ml-5">Exame de <span class="text-primary">{{ $subject->name }}</span> ({{ $answer->created_at->format('d/m/Y') }})</p>
    <section>
        <livewire:exams.check :subject="$subject" :answer="$answer" />
    </section>
</section>
@stop
