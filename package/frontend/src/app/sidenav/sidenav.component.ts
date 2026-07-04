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
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  navLinks: SidenavLink[] = [
    { icon: 'view_kanban', label: 'Kanban', route: '/kanban', isActive: true },
    { icon: 'account_tree', label: 'Workspace', route: '/workspace', isActive: true },
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', isActive: false },
    { icon: 'badge', label: 'Roles', route: '/roles', isActive: true },
    { icon: 'archive', label: 'Archive', route: '/archive', isActive: false },
    { icon: 'leaderboard', label: 'Analytics', route: '/analytics', isActive: false },
  ];

  bottomNavLinks: SidenavLink[] = [
    { icon: 'help', label: 'Support', route: '/support', isActive: true },
    { icon: 'description', label: 'Docs', route: '/docs', isActive: true },
  ];
}
