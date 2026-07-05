import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidenavLink {
  icon: string;
  label: string;
  route: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  navLinks: SidenavLink[] = [
    { icon: 'view_kanban', label: 'Kanban', route: '/kanban', isActive: true },
    { icon: 'account_tree', label: 'Workspace', route: '/workspace', isActive: true },
    { icon: 'dashboard', label: 'Dashboard', route: '/overview', isActive: false },
    { icon: 'archive', label: 'Files Storage', route: '/files', isActive: true },
    { icon: 'badge', label: 'Roles', route: '/roles', isActive: true },
    { icon: 'settings', label: 'Settings', route: '/settings', isActive: true },
  ];

  bottomNavLinks: SidenavLink[] = [
    { icon: 'help', label: 'Support', route: '/support', isActive: true },
    { icon: 'description', label: 'Docs', route: '/docs', isActive: true },
  ];
}
