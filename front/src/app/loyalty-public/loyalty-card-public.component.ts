import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';
import { LanguagePickerComponent } from '../shared/language-picker.component';
import { PublicGuestHeaderComponent } from '../shared/public-guest-header.component';
import { PublicGuestSalesCtasComponent } from '../shared/public-guest-sales-ctas.component';
import { LegalLinksComponent } from '../shared/legal-links.component';

@Component({
  selector: 'app-loyalty-card-public',
  standalone: true,
  imports: [
    TranslateModule,
    LanguagePickerComponent,
    PublicGuestHeaderComponent,
    PublicGuestSalesCtasComponent,
    LegalLinksComponent,
  ],
  template: `
    <div class="book-page loyalty-card" data-testid="loyalty-card-page">
      @if (tenantId(); as tid) {
        <app-public-guest-header [tenantId]="tid" activePage="loyalty" />
      } @else {
        <header class="book-header">
          <app-language-picker></app-language-picker>
        </header>
      }
      @if (loading()) {
        <p class="hint">{{ 'COMMON.LOADING' | translate }}</p>
      } @else if (error()) {
        <p class="error">{{ 'LOYALTY_PUBLIC.CARD_NOT_FOUND' | translate }}</p>
      } @else {
        <main class="book-main">
          <h1>{{ programName() }}</h1>
          <p>{{ displayName() }}</p>
          <p class="balance">
            {{ 'LOYALTY_PUBLIC.BALANCE' | translate }}: <strong>{{ balance() }}</strong>
          </p>
          @if (vipTier()) {
            <p class="tier" data-testid="loyalty-card-vip">
              {{ 'LOYALTY_PUBLIC.VIP_TIER' | translate }}: <strong>{{ vipTier() }}</strong>
            </p>
          }
          @if (referralCode() && tenantId()) {
            <p class="hint">{{ 'LOYALTY_PUBLIC.REFERRAL_SHARE' | translate }}</p>
            <p class="token">
              <code>{{ origin }}/loyalty/{{ tenantId() }}?ref={{ referralCode() }}</code>
            </p>
          }
          @if (applePkpassUrl() || googleSaveUrl()) {
            <div class="wallet-actions" data-testid="loyalty-card-wallet-actions">
              @if (applePkpassUrl(); as appleUrl) {
                <a class="btn wallet" [href]="appleUrl" data-testid="loyalty-card-add-apple">
                  {{ 'LOYALTY_PUBLIC.ADD_APPLE_WALLET' | translate }}
                </a>
              }
              @if (googleSaveUrl(); as gUrl) {
                <a
                  class="btn wallet"
                  [href]="gUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="loyalty-card-add-google"
                >
                  {{ 'LOYALTY_PUBLIC.ADD_GOOGLE_WALLET' | translate }}
                </a>
              }
            </div>
          }
          @if (tenantId(); as tid) {
            <app-public-guest-sales-ctas [tenantId]="tid" />
          }
        </main>
      }
      <app-legal-links></app-legal-links>
    </div>
  `,
  styles: [
    `
      .loyalty-card {
        padding: 0 0 1.5rem;
      }
      .loyalty-card .book-main {
        padding: 1.25rem 1.5rem;
      }
      .loyalty-card .book-header {
        padding: 0.75rem 1rem;
      }
      .balance,
      .tier {
        font-size: 1.25rem;
      }
      .error {
        color: #b00020;
        padding: 1.5rem;
      }
      .hint {
        color: var(--text-muted, #666);
        padding: 0 1.5rem;
      }
      .token code {
        word-break: break-all;
      }
      .wallet-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1rem;
      }
      .wallet-actions .btn.wallet {
        display: inline-block;
        padding: 0.5rem 0.85rem;
        border-radius: 4px;
        background: #1e5a3c;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
      }
    `,
  ],
})
export class LoyaltyCardPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  loading = signal(true);
  error = signal(false);
  programName = signal('');
  displayName = signal('');
  balance = signal(0);
  vipTier = signal<string | null>(null);
  referralCode = signal<string | null>(null);
  tenantId = signal<number | null>(null);
  applePkpassUrl = signal<string | null>(null);
  googleSaveUrl = signal<string | null>(null);
  origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('memberToken') || '';
    if (!token) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.api.getPublicLoyaltyBalance(token).subscribe({
      next: (res) => {
        this.programName.set(res.program?.program_name || '');
        this.displayName.set(res.membership.display_name);
        this.balance.set(res.membership.balance);
        this.vipTier.set(res.membership.vip_tier ?? null);
        this.referralCode.set(res.membership.referral_code ?? null);
        this.tenantId.set(res.membership.tenant_id ?? null);
        if (res.wallet?.apple_wallet_available) {
          this.applePkpassUrl.set(this.api.getPublicLoyaltyApplePkpassUrl(token));
        }
        if (res.wallet?.google_wallet_available) {
          this.api.getPublicLoyaltyGoogleSave(token).subscribe({
            next: (g) => this.googleSaveUrl.set(g.google_save_url || null),
            error: () => this.googleSaveUrl.set(null),
          });
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
