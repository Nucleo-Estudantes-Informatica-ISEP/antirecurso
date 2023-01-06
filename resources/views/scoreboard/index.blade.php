@extends('layouts.general')

@section('content')
    <section class="h-screen flex flex-col items-center justify-center text-center">
        <p class="text-xl font-bold uppercase"><span class="text-primary">Escolhe</span> uma disciplina para ver o <span class="text-primary">scoreboard</span></p>

        <section class="grid md:grid-cols-4 gap-y-10 md:gap-x-10 mt-10 md:px-16">
            @foreach (App\Models\Subject::all() as $subject)
                <a href="{{ route('scoreboard.show', ['slug' => $subject->slug]) }}"
                    class="w-full md:h-48 p-5 flex flex-col space-y-5 items-center justify-center shadow border border-gray-100 rounded text-center group hover:bg-primary transition ease-in-out">
                    <p class="w-3/4 font-bold uppercase group-hover:text-white">{{ $subject->name }}</p>
                    <p class="uppercase group-hover:text-white">({{ $subject->slug }})</p>
                </a>
            @endforeach
        </section>
    </section>
@stop
