<form wire:submit.prevent="submit">
    <div class="overflow-hidden w-full rounded-lg shadow-xs">
        <div class="overflow-x-auto w-full space-y-5">
            <div>
                <x-input-label for="name" :value="__('Nome')" />
                <x-text-input type="text" wire:model="name" id="name" name="name" class="block w-1/3" />
                @error('name')
                <p class="text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div class="w-full">
                <x-input-label for="name" :value="__('Cadeira')" />
                <select wire:model='subject_id'
                    class="w-1/3 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600">
                    <option value={{ null }} disabled selected>Selecione uma opção</option>
                    @foreach (App\Models\Subject::all() as $subject)
                    <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                    @endforeach
                </select>
                @error('subject_id')
                <p class="text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>
    </div>

    <x-primary-button class="mt-5">Criar tipo de pergunta</x-primary-button>
</form>
