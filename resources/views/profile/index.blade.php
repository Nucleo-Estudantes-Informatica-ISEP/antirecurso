@extends('layouts.general')

@section('content')
    <section class="flex flex-col items-center mt-16">
        <p class="text-xl font-semibold">Boas vindas, <span class="font-bold text-primary">{{ $user->name }}</span>!</p>
        <p class="mt-5">Hoje é dia {{ \Carbon\Carbon::now()->format('d/m/Y') }}. Tens algum exame perto?</p>

        <p class="text-xl font-bold uppercase mt-16">O teu <span class="text-primary">score</span> ao longo das disciplinas</p>

        <section class="mt-5 md:px-16 w-full grid place-items-center">
            <table class="w-1/2 text-sm text-center">
                <thead class="text-xs text-white uppercase bg-primary">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Disciplina
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Pontuação
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (App\Models\Subject::all() as $subject)
                        @if (App\Models\Score::where(['subject_id' => $subject->id, 'user_id' => $user->id])->first())
                            <tr class="bg-white border-b">
                                <td class="px-6 py-4">
                                    {{ App\Models\Score::where(['subject_id' => $subject->id, 'user_id' => $user->id])->first()->subject->name }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ App\Models\Score::where(['subject_id' => $subject->id, 'user_id' => $user->id])->first()->score }}
                                </td>
                            </tr>
                        @endif
                    @endforeach
                </tbody>
            </table>
        </section>

        <p class="text-xl font-bold uppercase mt-10">Os teus <span class="text-primary">exames</span></p>

        <section class="my-5 md:px-16 w-full grid place-items-center">
            <table class="w-1/2 text-sm text-center">
                <thead class="text-xs text-white uppercase bg-primary">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Disciplina
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Pontuação para ranking
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (App\Models\Answer::where(['user_id' => $user->id])->get() as $answer)
                        <tr class="bg-white border-b">
                            <td class="px-6 py-4">
                                <a href="{{ route('exams.checkPrevious', ['slug' => $subject->slug, 'answer' => $answer]) }}" class="underline hover:text-primary transition ease-in-out">{{ $answer->subject->name }}</a>
                            </td>
                            <td class="px-6 py-4">
                                {{ $answer->score }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </section>
    </section>
@stop
