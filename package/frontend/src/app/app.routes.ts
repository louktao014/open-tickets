import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { PagePlaceholderComponent } from './pages/page-placeholder/page-placeholder.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'workspace', component: WorkspaceComponent },
  { path: 'roles', component: PagePlaceholderComponent, data: { title: 'Roles' } },
  { path: 'archive', component: PagePlaceholderComponent, data: { title: 'Archive' } },
  { path: 'analytics', component: PagePlaceholderComponent, data: { title: 'Analytics' } },
  { path: 'support', component: PagePlaceholderComponent, data: { title: 'Support' } },
  { path: 'docs', component: PagePlaceholderComponent, data: { title: 'Docs' } },
  { path: '**', redirectTo: 'kanban' },
];
