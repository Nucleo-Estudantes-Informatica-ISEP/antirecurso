<?php

namespace App\Http\Livewire\Admins\Subjects;

use App\Models\Subject;
use Livewire\Component;

class Edit extends Component
{

    public Subject $subject;

    public string $name = "";
    public string $year = "";
    public string $slug = "";

    protected $rules = [
        'name' => 'required|min:1',
        'year' => 'required|min:1',
        'slug' => 'required|min:1'
    ];


    public function mount(Subject $subject) {
        $this->subject = $subject;

        $this->fill($this->subject);
    }

    public function submit() {
        $data = $this->validate($this->rules);
        $data['slug'] = strtolower($this->slug);

        $this->subject->update($data);

        return redirect()->route('admins.subjects.index');
    }

    public function render()
    {
        return view('livewire.admins.subjects.edit');
    }
}
