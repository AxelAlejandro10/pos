import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Product, Table, CanvasTable } from '../services/api.service';

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
})
export class PosComponent implements OnInit {
  private api = inject(ApiService);

  // State
  products = signal<Product[]>([]);
  tables = signal<CanvasTable[]>([]);
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');
  
  orderChannel = signal<'take_away' | 'dine_in'>('take_away');
  selectedTableId = signal<number | null>(null);
  showTableModal = signal<boolean>(false);
  customerName = signal<string>('');
  orderNotes = signal<string>('');
  
  cart = signal<CartItem[]>([]);
  isSubmitting = signal<boolean>(false);
  
  // Payment Modal
  showPaymentModal = signal<boolean>(false);
  paymentMethod = signal<'cash' | 'terminal'>('cash');
  cashGiven = signal<number>(0);
  
  // Success / Receipt Modal
  lastSale = signal<{
    order_id: number;
    table_name: string;
    total_cents: number;
    is_paid: boolean;
    created_at: string;
  } | null>(null);

  toast = signal<string | null>(null);

  // Computeds
  selectedTableName = computed(() => {
    if (this.orderChannel() === 'take_away') return 'Para Llevar (Mostrador)';
    const t = this.tables().find((tbl) => tbl.id === this.selectedTableId());
    return t ? t.name : 'Seleccionar Mesa';
  });

  diningTables = computed(() => {
    return this.tables().filter(t => !t.name.toLowerCase().includes('take away') && !t.name.toLowerCase().includes('para llevar'));
  });

  categories = computed(() => {
    const list = this.products()
      .map((p) => p.category)
      .filter((c): c is string => !!c && c.trim().length > 0);
    return Array.from(new Set(list));
  });

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const q = this.searchQuery().toLowerCase().trim();

    return this.products().filter((p) => {
      const matchCat = cat === 'all' || p.category === cat;
      const matchQ = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  });

  cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotalCents = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);
  });

  totalCents = computed(() => {
    return this.subtotalCents();
  });

  changeDueCents = computed(() => {
    if (this.paymentMethod() !== 'cash') return 0;
    const givenCents = Math.round(this.cashGiven() * 100);
    return Math.max(0, givenCents - this.totalCents());
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.getProducts().subscribe({
      next: (prods) => this.products.set(prods),
      error: (err) => this.showToast('Error cargando productos'),
    });

    this.api.getTablesWithStatus().subscribe({
      next: (tbls) => {
        this.tables.set(tbls);
        // Default to first table if in dine_in
        if (tbls.length > 0 && !this.selectedTableId()) {
          const firstNonTakeaway = tbls.find(t => !t.name.toLowerCase().includes('take away') && !t.name.toLowerCase().includes('para llevar'));
          if (firstNonTakeaway && firstNonTakeaway.id != null) {
            this.selectedTableId.set(firstNonTakeaway.id);
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  setOrderChannel(channel: 'take_away' | 'dine_in'): void {
    this.orderChannel.set(channel);
    if (channel === 'dine_in' && !this.selectedTableId()) {
      const first = this.diningTables()[0];
      if (first && first.id != null) {
        this.selectedTableId.set(first.id);
      }
    }
  }

  selectTable(tableId: number): void {
    this.selectedTableId.set(tableId);
    this.showTableModal.set(false);
  }

  getProductCartQty(product: Product): number {
    const found = this.cart().find((i) => i.product.id === product.id);
    return found ? found.quantity : 0;
  }

  getItemInitials(name: string): string {
    if (!name) return 'KR';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  addToCart(product: Product): void {
    const current = [...this.cart()];
    const index = current.findIndex((i) => i.product.id === product.id);

    if (index > -1) {
      current[index].quantity += 1;
    } else {
      current.push({ product, quantity: 1 });
    }
    this.cart.set(current);
  }

  decreaseProductQty(product: Product): void {
    const index = this.cart().findIndex((i) => i.product.id === product.id);
    if (index > -1) {
      this.decreaseQty(index);
    }
  }

  increaseQty(index: number): void {
    const current = [...this.cart()];
    if (current[index]) {
      current[index].quantity += 1;
      this.cart.set(current);
    }
  }

  decreaseQty(index: number): void {
    const current = [...this.cart()];
    if (current[index]) {
      if (current[index].quantity > 1) {
        current[index].quantity -= 1;
        this.cart.set(current);
      } else {
        this.removeFromCart(index);
      }
    }
  }

  removeFromCart(index: number): void {
    const current = [...this.cart()];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      this.cart.set(current);
    }
  }

  clearCart(): void {
    this.cart.set([]);
    this.customerName.set('');
    this.orderNotes.set('');
  }

  openPayment(): void {
    if (this.cart().length === 0) return;
    this.paymentMethod.set('cash');
    this.cashGiven.set(this.totalCents() / 100);
    this.showPaymentModal.set(true);
  }

  closePayment(): void {
    this.showPaymentModal.set(false);
  }

  setQuickCash(amount: number): void {
    this.cashGiven.set(amount);
  }

  sendToKitchen(): void {
    this.submitOrder(false);
  }

  confirmPayment(): void {
    this.submitOrder(true);
  }

  private submitOrder(markAsPaid: boolean): void {
    if (this.cart().length === 0 || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const validItems = this.cart()
      .filter((item) => item.product.id != null)
      .map((item) => ({
        product_id: item.product.id as number,
        quantity: item.quantity,
        notes: item.notes || null,
      }));

    if (validItems.length === 0) {
      this.isSubmitting.set(false);
      this.showToast('Los productos en el carrito no son válidos');
      return;
    }

    const payload = {
      table_id: this.orderChannel() === 'dine_in' ? this.selectedTableId() : null,
      order_channel: this.orderChannel(),
      customer_name: this.customerName() || (this.orderChannel() === 'take_away' ? 'Mostrador / Llevar' : undefined),
      notes: this.orderNotes() || undefined,
      mark_as_paid: markAsPaid,
      payment_method: markAsPaid ? this.paymentMethod() : undefined,
      payment_amount_cents: markAsPaid ? this.totalCents() : undefined,
      items: validItems,
    };

    this.api.createPosOrder(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showPaymentModal.set(false);
        this.lastSale.set(res);
        this.clearCart();
        this.showToast(markAsPaid ? '¡Venta cobrada con éxito!' : '¡Comanda enviada a cocina!');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error(err);
        this.showToast('Error al procesar la orden');
      },
    });
  }

  closeLastSale(): void {
    this.lastSale.set(null);
  }

  printReceipt(): void {
    window.print();
  }

  formatPrice(cents: number): string {
    return '$' + (cents / 100).toFixed(2);
  }

  getProductImageUrl(product: Product): string | null {
    return this.api.getProductImageUrl(product);
  }

  showToast(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
