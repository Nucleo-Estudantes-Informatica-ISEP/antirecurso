<div>
    <div class="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
        @for ($i = 1; $i <= 10; $i++)
            <div wire:click="change_question({{ $i - 1 }})"
                class="
            @if ($this->is_correct_option($answer_questions[$i - 1]->option->order)) border border-primary text-primary
            @if ($current + 1 == $i) bg-gray-200
             @else bg-white @endif
@else
bg-red-600 text-white
                @if ($current + 1 == $i) bg-red-800
                @else bg-red-600 @endif
             @endif
            h-10 w-10 p-5 flex items-center justify-center
              rounded-full hover:cursor-pointer">
                <p>{{ $i }}</p>
            </div>
        @endfor
    </div>

        <section class="mb-10">
            <p class="text-lg font-bold mt-5">{{ $current_question->question->question }}</p>
            <p class="text-sm text-gray-600 mt-2">Tipo de pergunta
                '{{ $current_question->question->question_type->name }}' do exame
                '{{ $current_question->question->exam }}'</p>
            <div class="mt-5 space-y-5">
                @foreach ($current_question->question->options as $option)
                    <div
                        class="w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded transition ease-in-out @if ($this->is_correct_option($option->order)) bg-primary text-white @endif">
                        <p>{{ $option->name }}</p>
                        @if ($this->is_correct_option($option->order))
                            <x-feathericon-check class="ml-5"></x-feathericon-check>
                        @elseif($current_question->option->order == $option->order)
                            <x-feathericon-x class="ml-5"></x-feathericon-x>
                        @endif
                    </div>
                @endforeach
            </div>
        </section>

        @if ($current == 9)
            <div class="w-full flex justify-end">
                <form action="{{ route('welcome') }}">
                    <x-primary-button>Terminar</x-primary-button>
                </form>
            </div>
        @endif

        <section class="mb-10">
            <p class="text-lg font-bold mt-5">{{ $current_question->question->question }}</p>
            <p class="text-sm text-gray-600 mt-2">Tipo de pergunta '{{ $current_question->question->question_type->name }}' do exame
                '{{ $current_question->question->exam }}'</p>
            <div class="mt-5 space-y-5">
                @foreach ($current_question->question->options as $option)
                    <div
                        class="w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded transition ease-in-out @if($this->is_correct_option($option->order)) bg-primary text-white @endif">
                        <p>{{ $option->name }}</p>
                        @if($this->is_correct_option($option->order))
                            <x-feathericon-check class="ml-5"></x-feathericon-check>
                        @elseif($current_question->option->order == $option->order)
                            <x-feathericon-x class="ml-5"></x-feathericon-x>
                        @endif
                    </div>
                @endforeach
            </div>
        </section>

        @if($current == 9)
            <div class="w-full flex justify-end">
                <form action="{{ route('welcome') }}">
                    <x-primary-button>Terminar</x-primary-button>
                </form>
            </div>
        @endif
    </section>

    <section class="mt-5 px-5 md:px-32">
        <form wire:submit.prevent='comment'>
            @guest
            <p><span class="font-semibold text-primary">Cria</span> ou <span class="font-semibold text-primary">entra numa
                    conta</span> para poderes comentar!</p>
            @endguest

            @auth
            <div class="w-full flex flex-col space-y-5 mb-5">
                <div class="w-full">
                    <x-input-label for="comment" :value="__('Comentário')" />
                    <textarea type="text" wire:model="comment" rows="3" id="comment" name="comment"
                        class="block w-full md:w-1/2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600"
                        style="resize: none"></textarea>
                    @error('comment')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                <x-primary-button class="h-10 w-full md:w-32">Comentar</x-primary-button>
            </div>
            @endauth
        </form>

        <div wire:poll.150>
            @foreach (App\Models\Comment::where(['question_id' => $current_question->question->id])->get() as $comment)
            <div class="w-full shadow border border-gray-100 rounded h-auto p-5 bg-white my-5">
                <p class="font-semibold">{{ $comment->user->name }} <span class="font-thin text-xs text-gray-500 ml-3">{{
                        $comment->created_at->format('d/m/Y') }}</span></p>
                <p class="mt-2 text-xs md:text-md">{{ $comment->comment }}</p>
            </div>
            @endforeach
        </div>
    </section>
</div>
