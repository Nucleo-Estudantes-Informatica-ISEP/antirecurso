<?php

namespace App\Http\Livewire\Penguin;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cache;
use Livewire\Component;

class Index extends Component
{

    public function changePenguinState() {
        if(!Session::get('penguin')) {
            Session::put('penguin', true);
        } else {
            Session::remove('penguin');
        }

        return redirect()->route('exams.index');
    }

    public function render()
    {
        return view('livewire.penguin.index');
    }
}
