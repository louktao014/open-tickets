import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeSnippetItem } from '../../../interface/workspace.interface';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
})
export class CodeSnippetComponent {
  @Input({ required: true }) item!: CodeSnippetItem;

  getLineNumbers(code: string): number[] {
    const lineCount = code.length ? code.split('\n').length : 1;
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }

  onCodeInput(value: string) {
    this.item.code = value;
  }
}
