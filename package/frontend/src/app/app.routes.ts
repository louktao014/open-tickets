import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { PagePlaceholderComponent } from './pages/page-placeholder/page-placeholder.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'workspace' },
  { path: 'overview', component: DashboardComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: 'files', component: PagePlaceholderComponent, data: { title: 'Files Storage' } },
  { path: 'roles', component: PagePlaceholderComponent, data: { title: 'Roles' } },
  { path: 'settings', component: PagePlaceholderComponent, data: { title: 'Settings' } },
  { path: 'support', component: PagePlaceholderComponent, data: { title: 'Support' } },
  { path: 'docs', component: PagePlaceholderComponent, data: { title: 'Docs' } },
  { path: '**', redirectTo: 'kanban' },
];
