import { Component, Input, signal } from '@angular/core';
import { Note } from '../../models/notes.model';
import { DbService } from '../../services/db.service';
import { DatesService } from '../../services/dates.service';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent {
  @Input()
  note: Note;

  constructor(
    private dbService: DbService,
    private datesService: DatesService
  ) {}

  getDateString(date: string) {
    return this.datesService.formatDateString(new Date(Number(date)));
  }

  deleteData(note: Note) {
    this.dbService.deleteData('notes', note.timestamp);
  }

  editData(note: Note) {
    // this.name.set(note.name);
    // this.message.set(note.message);
  }
}
