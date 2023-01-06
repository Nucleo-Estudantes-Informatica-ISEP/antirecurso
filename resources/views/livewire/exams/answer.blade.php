<div>
    <div class="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
        @for ($i = 1; $i <= 10; $i++)
            <div wire:click="change_question({{ $i - 1 }})" class="h-10 w-10 p-5 flex items-center justify-center @if(($current + 1) == $i) bg-primary text-white @else border border-primary text-primary @endif  @if($this->was_question_answered($i - 1)) bg-primary bg-opacity-70 text-white @endif rounded-full hover:cursor-pointer">
                <p>{{ $i }}</p>
            </div>
        @endfor
    </div>
    <section class="mt-5 px-5 md:px-32">
        <div class="w-full h-48">
            <img class="object-cover h-full w-full" src="/images/prcmp.jpg" />
        </div>

        <section class="mb-10">
            <p class="text-lg font-bold mt-5">{{ $current_question->question }}</p>
            <p class="text-sm text-gray-600 mt-2">Tipo de pergunta '{{ $current_question->question_type->name }}' do exame '{{ $current_question->exam }}'</p>
            <div class="mt-5 space-y-5">
                @foreach ($current_question->options as $option)
                    <div wire:click="select_answer('{{ $option->order }}')"
                        class="w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out @if($this->selected_answer() == $option->order) bg-primary text-white @endif">
                        <p>{{ $option->name }}</p>
                        @if($this->selected_answer() == $option->order)
                        <x-feathericon-check class="ml-5" /> @endif
                    </div>
                @endforeach
            </div>
        </section>

        @if($current == 9)
            <div class="w-full flex justify-end">
                <form wire:submit.prevent="finish">
                    <x-primary-button>Terminar</x-primary-button>
                </form>
            </div>
        @endif
    </section>
</div>
