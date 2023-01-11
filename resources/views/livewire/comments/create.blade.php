<div>
    <form wire:submit.prevent='submit'>
       @guest
           <p><span class="font-semibold text-primary">Cria</span> ou <span class="font-semibold text-primary">entra numa conta</span> para poderes comentar!</p>
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
        @foreach (App\Models\Comment::where(['question_id' => $question->id])->get() as $comment)
            <div class="w-full shadow border border-gray-100 rounded h-auto p-5 bg-white my-5">
                <p class="font-semibold">{{ $comment->user->name }} <span class="font-thin text-xs text-gray-500 ml-3">{{ $comment->created_at->format('d/m/Y') }}</span></p>
                <p class="mt-2 text-xs md:text-md">{{ $comment->comment }}</p>
            </div>
        @endforeach
    </div>
</div>
