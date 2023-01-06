<div>
    <div class="p-4 bg-white rounded-lg shadow-xs">
        <div class="overflow-hidden w-full rounded-lg shadow-xs">
            <div class="overflow-x-auto w-full space-y-5">
                <div>
                    <x-input-label for="question" :value="__('Pergunta')" />
                    <x-text-input type="text" wire:model="question" id="question" name="question" class="block w-1/2" />
                    @error('question')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-input-label for="correct_option" :value="__('Opção correta (a, b, c, d)')" />
                    <x-text-input type="text" wire:model="correct_option" id="correct_option" name="correct_option"
                        class="block w-1/3" />
                    @error('correct_option')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-input-label for="exam" :value="__('Exame')" />
                    <x-text-input type="text" wire:model="exam" id="exam" name="exam" class="block w-1/3" />
                    @error('exam')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div class="w-full">
                    <x-input-label for="subject_id" :value="__('Cadeira')" />
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

                <div class="w-full">
                    <x-input-label for="question_type_id" :value="__('Tipo de pergunta')" />
                    <select wire:model='question_type_id'
                        class="w-1/3 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600"
                        @if(!$subject_id) disabled @endif>
                        <option value={{ null }} disabled selected>Selecione uma opção</option>
                        @if($questionTypes)
                            @foreach ($questionTypes as $questionType)
                                <option value="{{ $questionType->id }}">{{ $questionType->name }}</option>
                            @endforeach
                        @endif
                    </select>
                    @error('question_type_id')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
        </div>
    </div>

    <div class="p-4 bg-white rounded-lg shadow-xs mt-10">
        <div class="overflow-hidden w-full rounded-lg shadow-xs">
            <div class="overflow-x-auto w-full space-y-5">
                <p class="text-xl font-bold">Opções</p>

                <div class="w-3/4">
                    <x-input-label for="option" :value="__('Opção')" />
                    <div class="flex items-center space-x-10 w-full">
                        <x-text-input type="text" wire:model="option" id="option" name="option" class="block w-3/4"
                            autofocus />
                        <x-primary-button wire:click='submitOption' class="1/3">{{ $is_editing ? 'Editar opção' : 'Adicionar opção' }}</x-primary-button>
                    </div>
                    @error('option')
                    <p class="text-xs text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div class="py-10">
                    <table class="w-full whitespace-no-wrap">
                        <thead>
                            <tr
                                class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase bg-gray-50 border-b">
                                <th class="px-4 py-3">Nome</th>
                                <th class="px-4 py-3">Ordem</th>
                                <th class="px-4 py-3">Opções</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y">
                            @foreach($options as $key => $option)
                            <tr class="text-gray-700">
                                <td class="px-4 py-3 text-sm">
                                    {{ $option['name'] }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    {{ $option['order'] }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    <button wire:click="editOption({{ $key }})" class="text-yellow-400">Editar</button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <form wire:submit.prevent="submit">
        <x-primary-button class="my-5">Editar pergunta</x-primary-button>
    </form>
</div>
