import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaesModule } from './shared/firebase.mobule';
import { DbService } from './services/db.service';
import { Subscription } from 'rxjs';
import { Note } from './models/notes.model';
import { CommonModule } from '@angular/common';
import { DatesService } from './services/dates.service';
import { NoteComponent } from './components/note/note.component';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FirebaesModule,
    CommonModule,
    NoteComponent,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DbService, DatesService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'teamNotesProject';
  notes = signal<Note[]>([]);
  private subscription: Subscription;

  name = signal('');
  message = signal('');

  users = ['John', 'Chris', 'Kostas', 'Elina'];
  form = new FormGroup({
    state: new FormControl(this.users[1]),
  });
  activeWeekStartDate = signal(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - new Date().getDay()
    )
  );

  filteredNotes = signal<Note[]>([]);

  constructor(
    private dbService: DbService,
    private datesService: DatesService
  ) {}

  ngOnInit(): void {
    this.subscription = this.dbService.getData('notes').subscribe((data) => {
      if (!data) {
        this.filteredNotes.set([]);
        return;
      }
      this.notes.set(
        Object.keys(data).map((key) => {
          return {
            timestamp: key,
            name: data[key].name,
            message: data[key].message,
          };
        })
      );
      this.updateFilteredNotes();
      console.log(this.notes());
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setName(name: string) {
    this.name.set(name);
  }

  addNote() {
    this.dbService.addDataa('notes', {
      name: this.name(),
      message: this.message(),
    });
    this.name.set('');
    this.message.set('');
  }

  updateFilteredNotes(): void {
    this.filteredNotes.set(
      this.notes().filter((note) => {
        return (
          Number(note.timestamp) >= this.activeWeekStartDate().getTime() &&
          Number(note.timestamp) <
            this.datesService.getEndDate(this.activeWeekStartDate()).getTime()
        );
      })
    );
  }

  public changeWeek(direction: string): void {
    if (direction === 'prev') {
      this.activeWeekStartDate.set(
        this.datesService.getPrevWeekStartDate(this.activeWeekStartDate())
      );
    } else if (direction === 'next') {
      this.activeWeekStartDate.set(
        this.datesService.getNextWeekStartDate(this.activeWeekStartDate())
      );
    } else if (direction === 'current') {
      this.activeWeekStartDate.set(
        this.datesService.getActiveWeekStartDate(new Date())
      );
    }
    this.updateFilteredNotes();
  }

  get startWeekFromattedText() {
    return this.datesService.formatDateString(this.activeWeekStartDate());
  }

  get endWeekFromattedText() {
    return this.datesService.formatDateString(
      this.datesService.getEndDate(this.activeWeekStartDate())
    );
  }
}
