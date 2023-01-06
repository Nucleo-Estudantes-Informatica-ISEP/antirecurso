<?php

namespace App\Http\Livewire\Penguin;

use Illuminate\Support\Facades\Cache;
use Livewire\Component;

class Index extends Component
{

    public function changePenguinState() {
        if(!Cache::get('penguin')) {
            Cache::set('penguin', true);
        } else {
            Cache::clear('penguin');
        }

        return redirect()->route('exams.index');
    }

    public function render()
    {
        return view('livewire.penguin.index');
    }
}
