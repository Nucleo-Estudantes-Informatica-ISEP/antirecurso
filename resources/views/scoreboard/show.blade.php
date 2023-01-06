@extends('layouts.general')

@section('content')
    <section class="h-screen flex flex-col items-center mt-32 px-10">
        <p class="text-xl font-bold uppercase">Scoreboard de <span class="text-primary">{{ $subject->name }}</span></p>

        <section class="mt-10 w-full grid place-items-center">
            @if(App\Models\User::count() < 0)
                <p>Sem nenhum utilizador registado</p>
            @else
                <table class="w-1/2 text-sm text-center">
                    <thead class="text-xs text-white uppercase bg-primary">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Posição
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Pontuação
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach (App\Models\Score::where(['subject_id' => $subject->id])->orderByDesc('score')->get() as $key => $score)
                        <tr class="bg-white border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-primary whitespace-nowrap">
                                {{ $key + 1 }}
                            </th>
                            <td class="px-6 py-4">
                                {{ $score->user->name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ $score->score }}
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </section>
    </section>
@stop
