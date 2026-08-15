import { Component, OnInit, inject } from '@angular/core';
import { TestService } from '../_services/test.service';
import { CommonModule } from '@angular/common';

interface TestResult {
  status: number | null;
  body: any;
  error: string | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  private readonly testService = inject(TestService);

  // 🟢 État des tests d'autorisation
  authorizationTests = {
    everyone: { status: null, body: null, error: null } as TestResult,
    user: { status: null, body: null, error: null } as TestResult,
    mod: { status: null, body: null, error: null } as TestResult,
    admin: { status: null, body: null, error: null } as TestResult,
    loading: true
  };

  ngOnInit(): void {
    this.testAuthorizations();
  }

  testAuthorizations(): void {
    // Test 1 : Everyone (public)
    this.testService.getEveryone().subscribe({
      next: (res) => {
        this.authorizationTests.everyone = {
          status: res.status,
          body: res.body,
          error: null
        };
      },
      error: (err) => {
        this.authorizationTests.everyone = {
          status: err.status,
          body: null,
          error: err.error?.message || err.message || 'Erreur inconnue'
        };
      }
    });

    // Test 2 : User role
    this.testService.getUserRole().subscribe({
      next: (res) => {
        this.authorizationTests.user = {
          status: res.status,
          body: res.body,
          error: null
        };
      },
      error: (err) => {
        this.authorizationTests.user = {
          status: err.status,
          body: null,
          error: err.error?.message || err.message || 'Erreur inconnue'
        };
      }
    });

    // Test 3 : Mod role
    this.testService.getModRole().subscribe({
      next: (res) => {
        this.authorizationTests.mod = {
          status: res.status,
          body: res.body,
          error: null
        };
      },
      error: (err) => {
        this.authorizationTests.mod = {
          status: err.status,
          body: null,
          error: err.error?.message || err.message || 'Erreur inconnue'
        };
      }
    });

    // Test 4 : Admin role
    this.testService.getAdminRole().subscribe({
      next: (res) => {
        this.authorizationTests.admin = {
          status: res.status,
          body: res.body,
          error: null
        };
        this.authorizationTests.loading = false; // ✅ Marquer comme chargé quand dernier test fini
      },
      error: (err) => {
        this.authorizationTests.admin = {
          status: err.status,
          body: null,
          error: err.error?.message || err.message || 'Erreur inconnue'
        };
        this.authorizationTests.loading = false;
      }
    });
  }

  // 🟢 Force reload les tests
  reloadTests(): void {
    this.authorizationTests = {
      everyone: { status: null, body: null, error: null },
      user: { status: null, body: null, error: null },
      mod: { status: null, body: null, error: null },
      admin: { status: null, body: null, error: null },
      loading: true
    };
    this.testAuthorizations();
  }

  // 🟢 Helper pour déterminer la couleur du badge status
  getStatusClass(status: number | null): string {
    if (status === null || status === undefined) return 'status-loading';
    if (status === 200) return 'status-ok';
    if (status === 401) return 'status-401';
    if (status === 403) return 'status-403';
    return 'status-error';
  }

  getStatusLabel(status: number | null): string {
    if (status === null) return '⏳ Chargement...';
    if (status === 200) return '✅ 200 OK';
    if (status === 401) return '🔴 401 Unauthorized';
    if (status === 403) return '🟠 403 Forbidden';
    return `❌ ${status}`;
  }
}