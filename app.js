/* =============================================
   FINNEST MOVERS — app.js  (complete)
   ============================================= */
'use strict';

/* ─────────────────────────────────────────────
   UTILITIES
   ───────────────────────────────────────────── */
const fmt = n =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function today() { return new Date().toISOString().split('T')[0]; }
function currentPeriod() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
function saveData(key, data) { try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {} }
function loadData(key)       { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (_) { return []; } }

function statusBadge(s) {
  const map = {
    Active:'badge-success', Occupied:'badge-success', Paid:'badge-success', Completed:'badge-success',
    'Full-Time':'badge-info', Contract:'badge-success', Open:'badge-info', 'For Sale':'badge-info',
    'On Leave':'badge-warning', Vacant:'badge-warning', Pending:'badge-warning', Partial:'badge-warning',
    'In Progress':'badge-warning', 'Expiring Soon':'badge-warning', 'On Hold':'badge-warning',
    'Part-Time':'badge-warning', 'Under Maintenance':'badge-warning', Refunded:'badge-warning',
    Terminated:'badge-danger', Overdue:'badge-danger', Failed:'badge-danger',
  };
  return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
}

function priorityBadge(p) {
  const map = { Low:'badge-priority-low', Medium:'badge-priority-medium',
                High:'badge-priority-high', Urgent:'badge-priority-urgent' };
  return `<span class="badge ${map[p] || ''}">${p}</span>`;
}

function downloadCSV(filename, headers, rows) {
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
    download: filename
  });
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(a.href);
}

const setText = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
const getVal  = id => { const e = document.getElementById(id); return e ? e.value : ''; };
const setVal  = (id, v) => { const e = document.getElementById(id); if (e) e.value = v; };
const showEl  = id => { const e = document.getElementById(id); if (e) e.style.display = ''; };
const hideEl  = id => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };

/* ─────────────────────────────────────────────
   NAVBAR: scroll shadow + mobile hamburger
   ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!navbar) return;

  window.addEventListener('scroll', () =>
    navbar.classList.toggle('scrolled', window.scrollY > 50));

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      }));
  }
})();

/* ─────────────────────────────────────────────
   SMOOTH SCROLL for # anchors
   ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) {
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ─────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll(
    '.service-card,.testimonial-card,.summary-card,.panel,.about-content,.contact-item,.quick-link-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity   = '1';
        en.target.style.transform = 'translateY(0)';
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.07 });
  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
})();

/* ─────────────────────────────────────────────
   INLINE-TAB switcher (homepage embedded sections)
   ───────────────────────────────────────────── */
document.querySelectorAll('.inline-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.dataset.group;
    document.querySelectorAll(`.inline-tab[data-group="${group}"]`).forEach(t => {
      t.classList.remove('active');
      const c = document.getElementById(t.dataset.tab);
      if (c) c.style.display = 'none';
    });
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.style.display = 'block';
  });
});

/* ─────────────────────────────────────────────
   HM-TAB switcher (house-management.html + payment.html)
   ───────────────────────────────────────────── */
document.querySelectorAll('.hm-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.hm-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    tab.classList.add('active');
    const t = document.getElementById('tab-' + tab.dataset.tab);
    if (t) t.style.display = 'block';
  });
});

/* ─────────────────────────────────────────────
   QUOTE FORM (index.html)
   ───────────────────────────────────────────── */
(function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const s = document.getElementById('formSuccess');
    if (s) { s.classList.add('visible'); form.reset(); setTimeout(() => s.classList.remove('visible'), 5000); }
  });
})();

/* ─────────────────────────────────────────────
   SESSION: show user badge in navbar
   ───────────────────────────────────────────── */
(function initSessionUI() {
  const raw = sessionStorage.getItem('fm_user');
  if (!raw) return;
  try {
    const { name } = JSON.parse(raw);
    document.querySelectorAll('a[href="login.html"].btn-quote').forEach(link => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;align-items:center;gap:8px;';
      wrap.innerHTML = `
        <span class="nav-user-badge"><i class="fas fa-user-circle"></i> ${name}</span>
        <button class="nav-logout-btn" onclick="logOut()"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
      link.replaceWith(wrap);
    });
  } catch (_) {}
})();

window.logOut = function () {
  sessionStorage.removeItem('fm_user');
  window.location.href = 'login.html';
};

/* PAY SLIP modal close (shared across index + payroll page) */
window.closePaySlip = function () {
  hideEl('paySlipModal');
  document.body.style.overflow = '';
};
(function () {
  const modal = document.getElementById('paySlipModal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) window.closePaySlip(); });
})();

/* =============================================
   LOGIN PAGE
   ============================================= */
(function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const ACCOUNTS = {
    admin:   { password: 'admin123',   role: 'Administrator', name: 'Admin User'    },
    manager: { password: 'manager123', role: 'Manager',       name: 'Site Manager'  },
    staff:   { password: 'staff123',   role: 'Staff',         name: 'Staff Member'  },
  };

  const alertEl   = document.getElementById('loginAlert');
  const loginBtn  = document.getElementById('loginBtn');
  const toggleBtn = document.getElementById('togglePass');
  const passInput = document.getElementById('loginPass');
  const eyeIcon   = document.getElementById('eyeIcon');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isText = passInput.type === 'text';
      passInput.type    = isText ? 'password' : 'text';
      eyeIcon.className = isText ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
  }

  window.fillDemo = function (user, pass) {
    setVal('loginUser', user);
    setVal('loginPass', pass);
    passInput.type    = 'text';
    if (eyeIcon) eyeIcon.className = 'fas fa-eye-slash';
  };

  function showAlert(msg, type) {
    alertEl.className   = `login-alert ${type}`;
    alertEl.innerHTML   = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${msg}`;
    alertEl.style.display = 'flex';
  }

  /* Pre-fill remembered username */
  const saved = localStorage.getItem('fm_remember');
  if (saved) {
    try {
      const { user } = JSON.parse(saved);
      setVal('loginUser', user);
      const rem = document.getElementById('rememberMe');
      if (rem) rem.checked = true;
    } catch (_) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const user     = getVal('loginUser').trim().toLowerCase();
    const pass     = getVal('loginPass');
    const remember = document.getElementById('rememberMe')?.checked;

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';

    setTimeout(() => {
      const account = ACCOUNTS[user];
      if (account && account.password === pass) {
        sessionStorage.setItem('fm_user', JSON.stringify({ user, role: account.role, name: account.name }));
        if (remember) localStorage.setItem('fm_remember', JSON.stringify({ user }));
        else          localStorage.removeItem('fm_remember');
        showAlert(`Welcome back, ${account.name}! Redirecting…`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
      } else {
        showAlert('Invalid username or password. Please try again.', 'error');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      }
    }, 800);
  });
})();

/* =============================================
   PAYMENT.HTML  — full portal logic
   ============================================= */
(function initPaymentPortal() {
  if (!document.getElementById('paymentPortalForm')) return;

  let transactions = loadData('fm_transactions');

  /* total calc */
  function updateTotal() {
    const sub = parseFloat(getVal('pmtAmount')) || 0;
    const fee = sub * 0.02;
    setText('ptbSubtotal', fmt(sub));
    setText('ptbFee',      fmt(fee));
    setText('ptbTotal',    fmt(sub + fee));
  }
  document.getElementById('pmtAmount')?.addEventListener('input', updateTotal);
  updateTotal();

  /* show/hide card fields */
  function toggleCard() {
    const method = document.querySelector('input[name="pmtMethod"]:checked')?.value || '';
    const sec = document.getElementById('cardDetailsSection');
    if (sec) sec.style.display = method.includes('Card') ? 'block' : 'none';
  }
  document.querySelectorAll('input[name="pmtMethod"]').forEach(r => r.addEventListener('change', toggleCard));
  toggleCard();

  window.formatCard   = el => { let v = el.value.replace(/\D/g,'').slice(0,16); el.value = v.replace(/(.{4})/g,'$1 ').trim(); };
  window.formatExpiry = el => { let v = el.value.replace(/\D/g,'').slice(0,4); if (v.length>=3) v = v.slice(0,2)+' / '+v.slice(2); el.value = v; };
  window.updatePaymentFields = function () {
    const labels = { moving:'Job ID', rent:'Property ID', deposit:'Property ID', storage:'Unit ID', maintenance:'Request ID', other:'Reference' };
    setText('pmtRefLabel', labels[getVal('pmtType')] || 'Reference ID');
  };

  /* summary */
  function updateSummary() {
    setText('pmtTotalPaid', fmt(transactions.filter(t=>t.status==='Completed').reduce((s,t)=>s+Number(t.total),0)));
    setText('pmtCount',     transactions.length);
    setText('pmtPending',   fmt(transactions.filter(t=>t.status==='Pending').reduce((s,t)=>s+Number(t.total),0)));
    setText('pmtFailed',    fmt(transactions.filter(t=>['Failed','Refunded'].includes(t.status)).reduce((s,t)=>s+Number(t.total),0)));
  }

  /* render transactions table */
  function renderTxn() {
    const body  = document.getElementById('txnBody');
    const empty = document.getElementById('emptyTxn');
    if (!body) return;
    const search = getVal('txnSearch').toLowerCase();
    const fType  = getVal('txnFilterType');
    const fStat  = getVal('txnFilterStatus');

    const list = transactions.filter(t =>
      (!search || t.payerName.toLowerCase().includes(search) || t.receipt.toLowerCase().includes(search) || (t.ref||'').toLowerCase().includes(search)) &&
      (!fType  || t.type === fType) &&
      (!fStat  || t.status === fStat));

    body.innerHTML = '';
    if (!list.length) {
      if (empty) empty.style.display = 'block';
      if (body.closest('table')) body.closest('table').style.display = 'none';
      return;
    }
    if (empty) empty.style.display = 'none';
    if (body.closest('table')) body.closest('table').style.display = '';

    list.forEach(t => {
      const ri = transactions.indexOf(t);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.receipt}</strong></td>
        <td>${t.payerName}</td><td>${t.type}</td><td>${t.ref||'—'}</td>
        <td>${fmt(t.amount)}</td><td>${fmt(t.fee)}</td><td><strong>${fmt(t.total)}</strong></td>
        <td>${t.method}</td><td>${t.date}</td><td>${statusBadge(t.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-success" style="padding:7px 12px;font-size:0.8rem;" onclick="viewReceipt(${ri})"><i class="fas fa-receipt"></i></button>
          <button class="btn btn-danger" onclick="portalDeleteTxn(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      body.appendChild(tr);
    });
  }

  /* submit payment */
  document.getElementById('paymentPortalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const method  = document.querySelector('input[name="pmtMethod"]:checked')?.value || 'Other';
    const amount  = parseFloat(getVal('pmtAmount')) || 0;
    const fee     = amount * 0.02;
    const total   = amount + fee;
    const receipt = 'RCP-' + Date.now().toString().slice(-8);
    const sel     = document.getElementById('pmtType');
    const txn = {
      receipt, method, amount, fee, total, status: 'Completed',
      payerName:  getVal('pmtPayerName'),
      payerEmail: getVal('pmtPayerEmail'),
      payerPhone: getVal('pmtPayerPhone'),
      type:  sel?.options[sel.selectedIndex]?.text || getVal('pmtType'),
      ref:   getVal('pmtRef'),
      date:  getVal('pmtDate'),
      notes: getVal('pmtNotes'),
    };
    transactions.unshift(txn);
    saveData('fm_transactions', transactions);
    updateSummary(); renderTxn();

    /* success box */
    const box = document.getElementById('paymentSuccessBox');
    if (box) {
      box.style.display = 'block';
      setText('psbMessage', `Payment of ${fmt(total)} processed for ${txn.payerName}.`);
      const rec = document.getElementById('psbReceipt');
      if (rec) rec.innerHTML = `
        <div><strong>Receipt No:</strong> ${receipt}</div>
        <div><strong>Payer:</strong> ${txn.payerName}</div>
        <div><strong>Type:</strong> ${txn.type}</div>
        <div><strong>Amount:</strong> ${fmt(amount)}</div>
        <div><strong>Fee (2%):</strong> ${fmt(fee)}</div>
        <div><strong>Total:</strong> ${fmt(total)}</div>
        <div><strong>Method:</strong> ${method}</div>
        <div><strong>Date:</strong> ${txn.date}</div>
        <div><strong>Status:</strong> ✓ Completed</div>`;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.reset(); updateTotal(); toggleCard();
  });

  window.resetPaymentForm = function () {
    const box = document.getElementById('paymentSuccessBox');
    if (box) box.style.display = 'none';
    document.getElementById('paymentPortalForm').reset();
    updateTotal(); toggleCard();
  };

  /* receipt modal */
  window.viewReceipt = function (idx) {
    const t = transactions[idx];
    const doc = document.getElementById('receiptDoc');
    if (!doc) return;
    doc.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:1.3rem;font-weight:800;color:var(--secondary);display:flex;align-items:center;justify-content:center;gap:8px;">
          <i class="fas fa-truck-moving" style="color:var(--primary);"></i> Finnest Movers</div>
        <p style="color:var(--text-light);font-size:0.82rem;margin-top:4px;">Official Payment Receipt</p>
      </div>
      <hr style="margin-bottom:16px;border-color:var(--border);" />
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.88rem;">
        <div><span style="color:var(--text-light);">Receipt No.</span><br><strong>${t.receipt}</strong></div>
        <div><span style="color:var(--text-light);">Date</span><br><strong>${t.date}</strong></div>
        <div><span style="color:var(--text-light);">Payer</span><br><strong>${t.payerName}</strong></div>
        <div><span style="color:var(--text-light);">Email</span><br><strong>${t.payerEmail||'—'}</strong></div>
        <div><span style="color:var(--text-light);">Type</span><br><strong>${t.type}</strong></div>
        <div><span style="color:var(--text-light);">Reference</span><br><strong>${t.ref||'—'}</strong></div>
        <div><span style="color:var(--text-light);">Method</span><br><strong>${t.method}</strong></div>
        <div><span style="color:var(--text-light);">Status</span><br>${statusBadge(t.status)}</div>
      </div>
      <div style="background:var(--bg-light);border-radius:var(--radius-sm);padding:14px;margin-top:16px;">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:0.88rem;color:var(--text-light);"><span>Subtotal</span><span>${fmt(t.amount)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:0.88rem;color:var(--text-light);"><span>Processing Fee (2%)</span><span>${fmt(t.fee)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:10px 0 5px;font-size:1rem;font-weight:700;color:var(--secondary);border-top:2px solid var(--border);margin-top:6px;"><span>Total Paid</span><span>${fmt(t.total)}</span></div>
      </div>
      <p style="text-align:center;color:var(--text-light);font-size:0.78rem;margin-top:16px;">Thank you for your payment — info@finnestmovers.com</p>`;
    document.getElementById('receiptModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeReceiptModal = function () {
    hideEl('receiptModal');
    document.body.style.overflow = '';
  };
  window.printReceipt = function () { window.print(); };

  const rModal = document.getElementById('receiptModal');
  if (rModal) rModal.addEventListener('click', e => { if (e.target === rModal) window.closeReceiptModal(); });

  window.portalDeleteTxn = function (idx) {
    if (confirm('Delete this transaction?')) {
      transactions.splice(idx, 1);
      saveData('fm_transactions', transactions);
      updateSummary(); renderTxn();
    }
  };

  /* search/filter */
  ['txnSearch','txnFilterType','txnFilterStatus'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', renderTxn); el.addEventListener('change', renderTxn); }
  });

  /* CSV export */
  document.getElementById('exportTxnBtn')?.addEventListener('click', () => {
    if (!transactions.length) { alert('No data to export.'); return; }
    downloadCSV('transactions_export.csv',
      ['Receipt','Payer','Email','Type','Reference','Amount','Fee','Total','Method','Date','Status'],
      transactions.map(t=>[t.receipt,t.payerName,t.payerEmail||'',t.type,t.ref||'',t.amount,t.fee,t.total,t.method,t.date,t.status]));
  });

  /* Invoice tab */
  let invoiceItems = [];

  window.addInvoiceItem = function () {
    invoiceItems.push({ desc:'', qty:1, price:0 });
    renderInvItems();
  };
  window.invUpdate = function (i, field, val) {
    invoiceItems[i][field] = field==='desc' ? val : parseFloat(val)||0;
    renderInvItems();
  };
  window.removeInvItem = function (i) { invoiceItems.splice(i,1); renderInvItems(); };

  function renderInvItems() {
    const body = document.getElementById('invoiceItemsBody');
    if (!body) return;
    body.innerHTML = '';
    invoiceItems.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'invoice-item-row';
      row.innerHTML = `
        <input class="desc-input" type="text" placeholder="Item description" value="${item.desc}" oninput="invUpdate(${i},'desc',this.value)" />
        <input class="num-input" type="number" min="1" value="${item.qty}" oninput="invUpdate(${i},'qty',this.value)" />
        <input class="num-input" type="number" min="0" step="0.01" placeholder="0.00" value="${item.price}" oninput="invUpdate(${i},'price',this.value)" />
        <div class="item-total">${fmt(item.qty * item.price)}</div>
        <button type="button" class="del-btn" onclick="removeInvItem(${i})"><i class="fas fa-times"></i></button>`;
      body.appendChild(row);
    });
    const sub = invoiceItems.reduce((s,it)=>s+it.qty*it.price, 0);
    const tax = sub * 0.10;
    setText('invSubtotal', fmt(sub));
    setText('invTax',      fmt(tax));
    setText('invTotal',    fmt(sub+tax));
  }

  /* default one row */
  window.addInvoiceItem();

  document.getElementById('invoiceForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const sub   = invoiceItems.reduce((s,it)=>s+it.qty*it.price, 0);
    const tax   = sub * 0.10;
    const invNo = 'INV-' + Date.now().toString().slice(-6);
    const doc   = document.getElementById('invoiceDoc');
    const prev  = document.getElementById('invoicePreview');
    if (!doc) return;
    doc.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;">
        <div>
          <div style="font-size:1.2rem;font-weight:800;color:var(--secondary);display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <i class="fas fa-truck-moving" style="color:var(--primary);"></i> Finnest Movers</div>
          <p style="color:var(--text-light);font-size:0.8rem;margin:0;">1234 Mover's Lane, Atlanta, GA 30301<br>info@finnestmovers.com | +1 (800) 555-MOVE</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.5rem;font-weight:800;color:var(--secondary);">INVOICE</div>
          <div style="color:var(--text-light);font-size:0.85rem;">${invNo}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;font-size:0.88rem;">
        <div><p style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-light);font-weight:700;margin-bottom:5px;">Bill To</p>
          <strong>${getVal('invClient')}</strong><br><span style="color:var(--text-light);">${getVal('invEmail')}</span></div>
        <div style="text-align:right;"><p style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-light);font-weight:700;margin-bottom:5px;">Dates</p>
          <div><strong>Issue:</strong> ${getVal('invDate')}<br><strong>Due:</strong> ${getVal('invDueDate')}</div></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:0.88rem;">
        <thead><tr style="background:var(--bg-light);">
          <th style="padding:9px 12px;text-align:left;border-bottom:2px solid var(--border);">Description</th>
          <th style="padding:9px 12px;text-align:center;border-bottom:2px solid var(--border);">Qty</th>
          <th style="padding:9px 12px;text-align:right;border-bottom:2px solid var(--border);">Unit Price</th>
          <th style="padding:9px 12px;text-align:right;border-bottom:2px solid var(--border);">Total</th>
        </tr></thead>
        <tbody>${invoiceItems.map(it=>`<tr style="border-bottom:1px solid var(--border);">
          <td style="padding:9px 12px;">${it.desc||'—'}</td>
          <td style="padding:9px 12px;text-align:center;">${it.qty}</td>
          <td style="padding:9px 12px;text-align:right;">${fmt(it.price)}</td>
          <td style="padding:9px 12px;text-align:right;font-weight:600;">${fmt(it.qty*it.price)}</td>
        </tr>`).join('')}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;">
        <div style="min-width:250px;font-size:0.9rem;">
          <div style="display:flex;justify-content:space-between;padding:5px 0;color:var(--text-light);"><span>Subtotal</span><span>${fmt(sub)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:5px 0;color:var(--text-light);"><span>Tax (10%)</span><span>${fmt(tax)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0 5px;font-size:1rem;font-weight:800;color:var(--secondary);border-top:2px solid var(--border);margin-top:6px;">
            <span>Total Due</span><span>${fmt(sub+tax)}</span></div>
        </div>
      </div>
      <p style="text-align:center;color:var(--text-light);font-size:0.78rem;margin-top:20px;padding-top:14px;border-top:1px solid var(--border);">
        Thank you for choosing Finnest Movers. Payment due by ${getVal('invDueDate')}.</p>`;
    if (prev) { prev.style.display = 'block'; prev.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });

  updateSummary();
  renderTxn();
})();

/* =============================================
   PAYROLL.HTML — standalone page
   ============================================= */
(function initPayrollPage() {
  if (!document.getElementById('payrollTable')) return;

  let employees = loadData('fm_employees');

  function calcNet(e) {
    const gross = +e.salary + +e.bonus;
    return gross - gross * (+e.tax / 100) - +e.deductions;
  }

  function updateSummary() {
    setText('totalEmployees',  employees.length);
    setText('totalPayroll',    fmt(employees.reduce((s,e)=>s+calcNet(e),0)));
    setText('totalBonuses',    fmt(employees.reduce((s,e)=>s+Number(e.bonus),0)));
    setText('totalDeductions', fmt(employees.reduce((s,e)=>s+Number(e.deductions),0)));
  }

  function renderTable() {
    const tbody  = document.getElementById('payrollBody');
    const empty  = document.getElementById('emptyPayroll');
    const search = getVal('searchInput').toLowerCase();
    const dept   = getVal('filterDept');
    const list   = employees.filter(e =>
      (!search || e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search)) &&
      (!dept   || e.dept === dept));
    tbody.innerHTML = '';
    if (!list.length) { empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(emp => {
      const ri = employees.indexOf(emp);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${emp.id}</strong></td><td>${emp.name}</td><td>${emp.role}</td>
        <td>${emp.dept}</td><td>${fmt(emp.salary)}</td>
        <td class="positive">${fmt(emp.bonus)}</td>
        <td class="negative">${fmt(emp.deductions)}</td>
        <td>${emp.tax}%</td><td><strong>${fmt(calcNet(emp))}</strong></td>
        <td>${statusBadge(emp.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-success" onclick="generatePaySlip(${ri})"><i class="fas fa-file-invoice"></i> Pay Slip</button>
          <button class="btn btn-secondary" style="padding:8px 14px;font-size:0.85rem;" onclick="editEmployee(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteEmployee(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refresh() { updateSummary(); renderTable(); saveData('fm_employees', employees); }

  document.getElementById('employeeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const idx = parseInt(getVal('editIndex'));
    const emp = {
      id:getVal('empId'), name:getVal('empName'), role:getVal('empRole'),
      dept:getVal('empDept'), type:getVal('empType'), period:getVal('empPeriod'),
      salary:getVal('empSalary'), bonus:getVal('empBonus')||0,
      deductions:getVal('empDeductions')||0, tax:getVal('empTax')||15,
      startDate:getVal('empStartDate'), bank:getVal('empBank'), status:getVal('empStatus'),
    };
    if (idx >= 0) employees[idx] = emp; else employees.push(emp);
    clearEmpForm(); refresh();
  });

  function clearEmpForm() {
    document.getElementById('employeeForm').reset();
    setVal('editIndex', -1);
    setText('formTitle',    'Add New Employee');
    setText('submitBtnText','Add Employee');
  }
  document.getElementById('clearFormBtn')?.addEventListener('click', clearEmpForm);

  window.editEmployee = function (idx) {
    const e = employees[idx];
    setVal('editIndex', idx);
    setText('formTitle','Edit Employee'); setText('submitBtnText','Save Changes');
    setVal('empId',e.id); setVal('empName',e.name); setVal('empRole',e.role);
    setVal('empDept',e.dept); setVal('empType',e.type); setVal('empPeriod',e.period);
    setVal('empSalary',e.salary); setVal('empBonus',e.bonus);
    setVal('empDeductions',e.deductions); setVal('empTax',e.tax);
    setVal('empStartDate',e.startDate); setVal('empBank',e.bank||''); setVal('empStatus',e.status);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  window.deleteEmployee = function (idx) {
    if (confirm(`Delete "${employees[idx].name}"?`)) { employees.splice(idx,1); refresh(); }
  };

  window.generatePaySlip = function (idx) {
    const e      = employees[idx];
    const gross  = +e.salary + +e.bonus;
    const taxAmt = gross * (+e.tax / 100);
    const net    = gross - taxAmt - +e.deductions;
    setText('slipPeriod',    'Pay Period: ' + currentPeriod());
    setText('slipId',        e.id);   setText('slipName',      e.name);
    setText('slipRole',      e.role); setText('slipDept',      e.dept);
    setText('slipType',      e.type); setText('slipPayPeriod', e.period);
    setText('slipSalary',    fmt(e.salary));
    setText('slipBonus',     fmt(e.bonus));
    setText('slipDeductions','- ' + fmt(e.deductions));
    setText('slipTaxRate',   e.tax);
    setText('slipTaxAmt',    '- ' + fmt(taxAmt));
    setText('slipNetPay',    fmt(net));
    document.getElementById('paySlipModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const periodEl = document.getElementById('currentPeriod');
  if (periodEl) periodEl.textContent = currentPeriod();

  document.getElementById('searchInput')?.addEventListener('input', renderTable);
  document.getElementById('filterDept')?.addEventListener('change', renderTable);
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    if (!employees.length) { alert('No data.'); return; }
    downloadCSV('payroll_export.csv',
      ['ID','Name','Role','Dept','Type','Period','Salary','Bonus','Deductions','Tax%','Net Pay','Status'],
      employees.map(e=>[e.id,e.name,e.role,e.dept,e.type,e.period,e.salary,e.bonus,e.deductions,e.tax,calcNet(e).toFixed(2),e.status]));
  });

  refresh();
})();

/* =============================================
   HOUSE-MANAGEMENT.HTML — standalone page
   ============================================= */
(function initHouseManagementPage() {
  if (!document.getElementById('propertiesTable')) return;

  /* ─── Properties ─── */
  let props = loadData('fm_properties');

  function calcPropSummary() {
    const occ = props.filter(p=>p.status==='Occupied');
    setText('propTotal',    props.length);
    setText('propOccupied', occ.length);
    setText('propVacant',   props.filter(p=>p.status==='Vacant').length);
    setText('propRevenue',  fmt(occ.reduce((s,p)=>s+Number(p.rent),0)));
  }

  function renderProps() {
    const tbody  = document.getElementById('propertiesBody');
    const empty  = document.getElementById('emptyProperties');
    const search = getVal('propSearchInput').toLowerCase();
    const status = getVal('propFilterStatus');
    const list   = props.filter(p =>
      (!search || p.name.toLowerCase().includes(search) || p.address.toLowerCase().includes(search)) &&
      (!status || p.status === status));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(p => {
      const ri = props.indexOf(p);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${p.id}</strong></td><td>${p.name}</td><td>${p.type}</td>
        <td>${p.address}</td><td>${p.beds||'-'} bd / ${p.baths||'-'} ba</td>
        <td>${p.size ? p.size+' sqft':'-'}</td><td><strong>${fmt(p.rent)}</strong></td>
        <td>${statusBadge(p.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:8px 12px;font-size:0.82rem;" onclick="hmEditProp(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="hmDeleteProp(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshProps(){ calcPropSummary(); renderProps(); saveData('fm_properties',props); }

  document.getElementById('propertyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('propEditIndex'));
    const p = { id:getVal('propId'),name:getVal('propName'),type:getVal('propType'),
      address:getVal('propAddress'),beds:getVal('propBeds'),baths:getVal('propBaths'),
      size:getVal('propSize'),rent:getVal('propRent'),deposit:getVal('propDeposit'),
      status:getVal('propStatus'),owner:getVal('propOwner') };
    if (idx>=0) props[idx]=p; else props.push(p);
    hmClearPropForm(); refreshProps();
  });

  function hmClearPropForm() {
    document.getElementById('propertyForm')?.reset();
    setVal('propEditIndex',-1); setText('propFormTitle','Add New Property'); setText('propSubmitText','Add Property');
  }
  document.getElementById('clearPropFormBtn')?.addEventListener('click', hmClearPropForm);

  window.hmEditProp = function(idx) {
    const p=props[idx]; setVal('propEditIndex',idx);
    setText('propFormTitle','Edit Property'); setText('propSubmitText','Save Changes');
    setVal('propId',p.id); setVal('propName',p.name); setVal('propType',p.type);
    setVal('propAddress',p.address); setVal('propBeds',p.beds); setVal('propBaths',p.baths);
    setVal('propSize',p.size); setVal('propRent',p.rent); setVal('propDeposit',p.deposit||'');
    setVal('propStatus',p.status); setVal('propOwner',p.owner||'');
    document.querySelectorAll('.hm-tab')[0]?.click();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  window.hmDeleteProp = function(idx) {
    if (confirm(`Delete "${props[idx].name}"?`)) { props.splice(idx,1); refreshProps(); }
  };
  document.getElementById('propSearchInput')?.addEventListener('input', renderProps);
  document.getElementById('propFilterStatus')?.addEventListener('change', renderProps);
  refreshProps();

  /* ─── Tenants ─── */
  let tenants = loadData('fm_tenants');

  function calcTenantSummary() {
    setText('tenantTotal',    tenants.length);
    setText('tenantActive',   tenants.filter(t=>t.status==='Active').length);
    setText('tenantExpiring', tenants.filter(t=>t.status==='Expiring Soon').length);
    setText('tenantOverdue',  tenants.filter(t=>t.status==='Overdue').length);
  }

  function renderTenants() {
    const tbody  = document.getElementById('tenantsBody');
    const empty  = document.getElementById('emptyTenants');
    const search = getVal('tenantSearchInput').toLowerCase();
    const list   = tenants.filter(t =>
      !search || t.name.toLowerCase().includes(search) || t.id.toLowerCase().includes(search) || t.propId.toLowerCase().includes(search));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(t => {
      const ri = tenants.indexOf(t);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${t.id}</strong></td><td>${t.name}</td><td>${t.phone}</td>
        <td>${t.propId}</td><td>${t.leaseStart}</td><td>${t.leaseEnd}</td>
        <td><strong>${fmt(t.rent)}</strong></td><td>${statusBadge(t.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:8px 12px;font-size:0.82rem;" onclick="hmEditTenant(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="hmDeleteTenant(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshTenants(){ calcTenantSummary(); renderTenants(); saveData('fm_tenants',tenants); }

  document.getElementById('tenantForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('tenantEditIndex'));
    const t = { id:getVal('tenantId'),name:getVal('tenantName'),phone:getVal('tenantPhone'),
      email:getVal('tenantEmail'),propId:getVal('tenantPropId'),
      leaseStart:getVal('tenantLeaseStart'),leaseEnd:getVal('tenantLeaseEnd'),
      rent:getVal('tenantRent'),occupants:getVal('tenantOccupants'),
      idNum:getVal('tenantIdNum'),status:getVal('tenantStatus') };
    if (idx>=0) tenants[idx]=t; else tenants.push(t);
    hmClearTenantForm(); refreshTenants();
  });

  function hmClearTenantForm() {
    document.getElementById('tenantForm')?.reset();
    setVal('tenantEditIndex',-1); setText('tenantFormTitle','Add New Tenant'); setText('tenantSubmitText','Add Tenant');
  }
  document.getElementById('clearTenantFormBtn')?.addEventListener('click', hmClearTenantForm);

  window.hmEditTenant = function(idx) {
    const t=tenants[idx]; setVal('tenantEditIndex',idx);
    setText('tenantFormTitle','Edit Tenant'); setText('tenantSubmitText','Save Changes');
    setVal('tenantId',t.id); setVal('tenantName',t.name); setVal('tenantPhone',t.phone);
    setVal('tenantEmail',t.email||''); setVal('tenantPropId',t.propId);
    setVal('tenantLeaseStart',t.leaseStart); setVal('tenantLeaseEnd',t.leaseEnd);
    setVal('tenantRent',t.rent); setVal('tenantOccupants',t.occupants||'');
    setVal('tenantIdNum',t.idNum||''); setVal('tenantStatus',t.status);
    document.querySelectorAll('.hm-tab')[1]?.click();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  window.hmDeleteTenant = function(idx) {
    if (confirm(`Remove "${tenants[idx].name}"?`)) { tenants.splice(idx,1); refreshTenants(); }
  };
  document.getElementById('tenantSearchInput')?.addEventListener('input', renderTenants);
  refreshTenants();

  /* ─── Payments ─── */
  let hmPay = loadData('fm_payments');

  function calcHMPaySummary() {
    setText('payPaid',    fmt(hmPay.filter(p=>p.status==='Paid').reduce((s,p)=>s+Number(p.amount),0)));
    setText('payPending', fmt(hmPay.filter(p=>p.status==='Pending').reduce((s,p)=>s+Number(p.amount),0)));
    setText('payCount',   hmPay.length);
    setText('payOverdue', fmt(hmPay.filter(p=>p.status==='Overdue').reduce((s,p)=>s+Number(p.amount),0)));
  }

  function renderHMPayments() {
    const tbody  = document.getElementById('paymentsBody');
    const empty  = document.getElementById('emptyPayments');
    const search = getVal('paySearchInput').toLowerCase();
    const status = getVal('payFilterStatus');
    const list   = hmPay.filter(p =>
      (!search || p.tenantName.toLowerCase().includes(search) || p.propId.toLowerCase().includes(search)) &&
      (!status || p.status === status));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach((pay,i) => {
      const ri = hmPay.indexOf(pay);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${pay.ref}</strong></td>
        <td>${pay.tenantName} <small>(${pay.tenantId})</small></td>
        <td>${pay.propId}</td><td><strong>${fmt(pay.amount)}</strong></td>
        <td>${pay.period}</td><td>${pay.date}</td><td>${pay.method}</td>
        <td>${statusBadge(pay.status)}</td>
        <td><button class="btn btn-danger" onclick="hmDeletePayment(${ri})"><i class="fas fa-trash"></i></button></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshHMPay(){ calcHMPaySummary(); renderHMPayments(); saveData('fm_payments',hmPay); }

  document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const ref = getVal('payRef').trim() || ('RCP-'+Date.now().toString().slice(-6));
    hmPay.unshift({ ref, tenantId:getVal('payTenantId'), tenantName:getVal('payTenantName'),
      propId:getVal('payPropId'), amount:getVal('payAmount'),
      date:getVal('payDate'), method:getVal('payMethod'),
      status:getVal('payStatus'), period:getVal('payPeriod') });
    this.reset(); refreshHMPay();
  });

  window.hmDeletePayment = function(idx) {
    if (confirm('Delete payment?')) { hmPay.splice(idx,1); refreshHMPay(); }
  };

  document.getElementById('paySearchInput')?.addEventListener('input', renderHMPayments);
  document.getElementById('payFilterStatus')?.addEventListener('change', renderHMPayments);
  document.getElementById('exportPaymentsBtn')?.addEventListener('click', () => {
    if (!hmPay.length) { alert('No data.'); return; }
    downloadCSV('rent_payments.csv',
      ['Receipt','Tenant ID','Tenant Name','Property','Amount','Period','Date','Method','Status'],
      hmPay.map(p=>[p.ref,p.tenantId,p.tenantName,p.propId,p.amount,p.period,p.date,p.method,p.status]));
  });
  refreshHMPay();

  /* ─── Maintenance ─── */
  let maint = loadData('fm_maintenance');

  function calcMaintSummary() {
    setText('maintOpen',     maint.filter(m=>m.status==='Open').length);
    setText('maintProgress', maint.filter(m=>m.status==='In Progress').length);
    setText('maintDone',     maint.filter(m=>m.status==='Completed').length);
    setText('maintUrgent',   maint.filter(m=>m.priority==='Urgent').length);
  }

  function renderMaint() {
    const tbody  = document.getElementById('maintenanceBody');
    const empty  = document.getElementById('emptyMaintenance');
    const search = getVal('maintSearchInput').toLowerCase();
    const status = getVal('maintFilterStatus');
    const list   = maint.filter(m =>
      (!search || m.id.toLowerCase().includes(search) || m.propId.toLowerCase().includes(search)) &&
      (!status || m.status === status));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(m => {
      const ri = maint.indexOf(m);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${m.id}</strong></td><td>${m.propId}</td>
        <td>${m.category}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${m.desc}">${m.desc}</td>
        <td>${priorityBadge(m.priority)}</td><td>${m.date}</td>
        <td>${m.tech||'—'}</td><td>${m.cost ? fmt(m.cost):'—'}</td>
        <td>${statusBadge(m.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:8px 12px;font-size:0.82rem;" onclick="hmEditMaint(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="hmDeleteMaint(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshMaint(){ calcMaintSummary(); renderMaint(); saveData('fm_maintenance',maint); }

  document.getElementById('maintenanceForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('maintEditIndex'));
    const m = { id:getVal('maintId'),propId:getVal('maintPropId'),reporter:getVal('maintReporter'),
      category:getVal('maintCategory'),priority:getVal('maintPriority'),status:getVal('maintStatus'),
      date:getVal('maintDate'),desc:getVal('maintDesc'),tech:getVal('maintTech'),cost:getVal('maintCost') };
    if (idx>=0) maint[idx]=m; else maint.push(m);
    hmClearMaintForm(); refreshMaint();
  });

  function hmClearMaintForm() {
    document.getElementById('maintenanceForm')?.reset();
    setVal('maintEditIndex',-1); setText('maintSubmitText','Log Request');
  }
  document.getElementById('clearMaintFormBtn')?.addEventListener('click', hmClearMaintForm);

  window.hmEditMaint = function(idx) {
    const m=maint[idx]; setVal('maintEditIndex',idx); setText('maintSubmitText','Save Changes');
    setVal('maintId',m.id); setVal('maintPropId',m.propId); setVal('maintReporter',m.reporter);
    setVal('maintCategory',m.category); setVal('maintPriority',m.priority);
    setVal('maintStatus',m.status); setVal('maintDate',m.date);
    setVal('maintDesc',m.desc); setVal('maintTech',m.tech||''); setVal('maintCost',m.cost||'');
    document.querySelectorAll('.hm-tab')[3]?.click();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  window.hmDeleteMaint = function(idx) {
    if (confirm('Delete request?')) { maint.splice(idx,1); refreshMaint(); }
  };

  document.getElementById('maintSearchInput')?.addEventListener('input', renderMaint);
  document.getElementById('maintFilterStatus')?.addEventListener('change', renderMaint);
  refreshMaint();
})();

/* =============================================
   INDEX.HTML — embedded management panels
   ============================================= */
(function initIndexEmbeds() {
  if (!document.getElementById('idx-propertyForm')) return;

  /* ─── Properties ─── */
  let props = loadData('fm_properties');

  function calcIdxProps() {
    const occ = props.filter(p=>p.status==='Occupied');
    setText('idx-propTotal',    props.length);
    setText('idx-propOccupied', occ.length);
    setText('idx-propVacant',   props.filter(p=>p.status==='Vacant').length);
    setText('idx-propRevenue',  fmt(occ.reduce((s,p)=>s+Number(p.rent),0)));
  }

  function renderIdxProps() {
    const tbody  = document.getElementById('idx-propertiesBody');
    const empty  = document.getElementById('idx-emptyProperties');
    const search = getVal('idx-propSearch').toLowerCase();
    const status = getVal('idx-propFilterStatus');
    const list   = props.filter(p =>
      (!search || p.name.toLowerCase().includes(search) || (p.address||'').toLowerCase().includes(search)) &&
      (!status || p.status === status));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(p => {
      const ri = props.indexOf(p);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${p.id}</strong></td><td>${p.name}</td><td>${p.type}</td>
        <td>${p.address}</td><td><strong>${fmt(p.rent)}</strong></td>
        <td>${statusBadge(p.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:7px 12px;font-size:0.82rem;" onclick="idxEditProp(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="idxDeleteProp(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxProps(){ calcIdxProps(); renderIdxProps(); saveData('fm_properties',props); }

  document.getElementById('idx-propertyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('idx-propEditIndex'));
    const p = { id:getVal('idx-propId'),name:getVal('idx-propName'),type:getVal('idx-propType'),
      address:getVal('idx-propAddress'),rent:getVal('idx-propRent'),
      status:getVal('idx-propStatus'),owner:getVal('idx-propOwner') };
    if (idx>=0) props[idx]=p; else props.push(p);
    idxClearPropForm(); refreshIdxProps();
  });

  window.idxClearPropForm = function() {
    document.getElementById('idx-propertyForm').reset();
    setVal('idx-propEditIndex',-1);
    setText('idx-propFormTitle','Add Property'); setText('idx-propSubmitText','Add Property');
  };
  window.idxEditProp = function(idx) {
    const p=props[idx]; setVal('idx-propEditIndex',idx);
    setText('idx-propFormTitle','Edit Property'); setText('idx-propSubmitText','Save Changes');
    setVal('idx-propId',p.id); setVal('idx-propName',p.name); setVal('idx-propType',p.type);
    setVal('idx-propAddress',p.address); setVal('idx-propRent',p.rent);
    setVal('idx-propStatus',p.status); setVal('idx-propOwner',p.owner||'');
    document.getElementById('hm-properties')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  window.idxDeleteProp = function(idx) {
    if (confirm(`Delete "${props[idx].name}"?`)) { props.splice(idx,1); refreshIdxProps(); }
  };
  document.getElementById('idx-propSearch')?.addEventListener('input', renderIdxProps);
  document.getElementById('idx-propFilterStatus')?.addEventListener('change', renderIdxProps);
  refreshIdxProps();

  /* ─── Tenants ─── */
  let tenants = loadData('fm_tenants');

  function calcIdxTenants() {
    setText('idx-tenantTotal',    tenants.length);
    setText('idx-tenantActive',   tenants.filter(t=>t.status==='Active').length);
    setText('idx-tenantExpiring', tenants.filter(t=>t.status==='Expiring Soon').length);
    setText('idx-tenantOverdue',  tenants.filter(t=>t.status==='Overdue').length);
  }

  function renderIdxTenants() {
    const tbody  = document.getElementById('idx-tenantsBody');
    const empty  = document.getElementById('idx-emptyTenants');
    const search = getVal('idx-tenantSearch').toLowerCase();
    const list   = tenants.filter(t =>
      !search || t.name.toLowerCase().includes(search) || t.id.toLowerCase().includes(search) || t.propId.toLowerCase().includes(search));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(t => {
      const ri = tenants.indexOf(t);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${t.id}</strong></td><td>${t.name}</td><td>${t.phone}</td>
        <td>${t.propId}</td><td>${t.leaseEnd}</td><td><strong>${fmt(t.rent)}</strong></td>
        <td>${statusBadge(t.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:7px 12px;font-size:0.82rem;" onclick="idxEditTenant(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="idxDeleteTenant(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxTenants(){ calcIdxTenants(); renderIdxTenants(); saveData('fm_tenants',tenants); }

  document.getElementById('idx-tenantForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('idx-tenantEditIndex'));
    const t = { id:getVal('idx-tenantId'),name:getVal('idx-tenantName'),phone:getVal('idx-tenantPhone'),
      propId:getVal('idx-tenantPropId'),leaseStart:getVal('idx-tenantLeaseStart'),
      leaseEnd:getVal('idx-tenantLeaseEnd'),rent:getVal('idx-tenantRent'),status:getVal('idx-tenantStatus') };
    if (idx>=0) tenants[idx]=t; else tenants.push(t);
    idxClearTenantForm(); refreshIdxTenants();
  });

  window.idxClearTenantForm = function() {
    document.getElementById('idx-tenantForm').reset();
    setVal('idx-tenantEditIndex',-1);
    setText('idx-tenantFormTitle','Add Tenant'); setText('idx-tenantSubmitText','Add Tenant');
  };
  window.idxEditTenant = function(idx) {
    const t=tenants[idx]; setVal('idx-tenantEditIndex',idx);
    setText('idx-tenantFormTitle','Edit Tenant'); setText('idx-tenantSubmitText','Save Changes');
    setVal('idx-tenantId',t.id); setVal('idx-tenantName',t.name); setVal('idx-tenantPhone',t.phone);
    setVal('idx-tenantPropId',t.propId); setVal('idx-tenantLeaseStart',t.leaseStart);
    setVal('idx-tenantLeaseEnd',t.leaseEnd); setVal('idx-tenantRent',t.rent); setVal('idx-tenantStatus',t.status);
  };
  window.idxDeleteTenant = function(idx) {
    if (confirm(`Remove tenant "${tenants[idx].name}"?`)) { tenants.splice(idx,1); refreshIdxTenants(); }
  };
  document.getElementById('idx-tenantSearch')?.addEventListener('input', renderIdxTenants);
  refreshIdxTenants();

  /* ─── Rent Payments ─── */
  let hmPay = loadData('fm_payments');

  function calcIdxPay() {
    setText('idx-payPaid',    fmt(hmPay.filter(p=>p.status==='Paid').reduce((s,p)=>s+Number(p.amount),0)));
    setText('idx-payPending', fmt(hmPay.filter(p=>p.status==='Pending').reduce((s,p)=>s+Number(p.amount),0)));
    setText('idx-payCount',   hmPay.length);
    setText('idx-payOverdue', fmt(hmPay.filter(p=>p.status==='Overdue').reduce((s,p)=>s+Number(p.amount),0)));
  }

  function renderIdxPayments() {
    const tbody = document.getElementById('idx-paymentsBody');
    const empty = document.getElementById('idx-emptyPayments');
    tbody.innerHTML='';
    const list = hmPay.slice(0,20);
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach((p,i) => {
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${p.ref}</strong></td>
        <td>${p.tenantName} <small>(${p.tenantId})</small></td>
        <td>${p.propId}</td><td><strong>${fmt(p.amount)}</strong></td>
        <td>${p.period}</td><td>${p.date}</td><td>${p.method}</td>
        <td>${statusBadge(p.status)}</td>
        <td><button class="btn btn-danger" onclick="idxDeletePayment(${i})"><i class="fas fa-trash"></i></button></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxPay(){ calcIdxPay(); renderIdxPayments(); saveData('fm_payments',hmPay); }

  document.getElementById('idx-paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ref = 'RCP-'+Date.now().toString().slice(-6);
    hmPay.unshift({ ref, tenantId:getVal('idx-payTenantId'), tenantName:getVal('idx-payTenantName'),
      propId:getVal('idx-payPropId'), amount:getVal('idx-payAmount'),
      period:getVal('idx-payPeriod'), date:getVal('idx-payDate'),
      method:getVal('idx-payMethod'), status:getVal('idx-payStatus') });
    this.reset(); refreshIdxPay();
  });

  window.idxDeletePayment = function(idx) {
    if (confirm('Delete payment?')) { hmPay.splice(idx,1); refreshIdxPay(); }
  };
  document.getElementById('idx-exportPayBtn')?.addEventListener('click', () => {
    if (!hmPay.length){ alert('No data.'); return; }
    downloadCSV('rent_payments.csv',
      ['Receipt','Tenant ID','Tenant Name','Property','Amount','Period','Date','Method','Status'],
      hmPay.map(p=>[p.ref,p.tenantId,p.tenantName,p.propId,p.amount,p.period,p.date,p.method,p.status]));
  });
  refreshIdxPay();

  /* ─── Maintenance ─── */
  let maint = loadData('fm_maintenance');

  function calcIdxMaint() {
    setText('idx-maintOpen',     maint.filter(m=>m.status==='Open').length);
    setText('idx-maintProgress', maint.filter(m=>m.status==='In Progress').length);
    setText('idx-maintDone',     maint.filter(m=>m.status==='Completed').length);
    setText('idx-maintUrgent',   maint.filter(m=>m.priority==='Urgent').length);
  }

  function renderIdxMaint() {
    const tbody  = document.getElementById('idx-maintenanceBody');
    const empty  = document.getElementById('idx-emptyMaintenance');
    const search = getVal('idx-maintSearch').toLowerCase();
    const list   = maint.filter(m =>
      !search || m.id.toLowerCase().includes(search) || m.propId.toLowerCase().includes(search));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(m => {
      const ri = maint.indexOf(m);
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${m.id}</strong></td><td>${m.propId}</td>
        <td>${m.category}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${m.desc}">${m.desc}</td>
        <td>${priorityBadge(m.priority)}</td><td>${m.date}</td>
        <td>${statusBadge(m.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-secondary" style="padding:7px 12px;font-size:0.82rem;" onclick="idxEditMaint(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="idxDeleteMaint(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxMaint(){ calcIdxMaint(); renderIdxMaint(); saveData('fm_maintenance',maint); }

  document.getElementById('idx-maintenanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('idx-maintEditIndex'));
    const m = { id:getVal('idx-maintId'),propId:getVal('idx-maintPropId'),
      reporter:getVal('idx-maintReporter'),category:getVal('idx-maintCategory'),
      desc:getVal('idx-maintDesc'),priority:getVal('idx-maintPriority'),
      status:getVal('idx-maintStatus'),date:getVal('idx-maintDate') };
    if (idx>=0) maint[idx]=m; else maint.push(m);
    idxClearMaintForm(); refreshIdxMaint();
  });

  window.idxClearMaintForm = function() {
    document.getElementById('idx-maintenanceForm').reset();
    setVal('idx-maintEditIndex',-1); setText('idx-maintSubmitText','Log Request');
  };
  window.idxEditMaint = function(idx) {
    const m=maint[idx]; setVal('idx-maintEditIndex',idx); setText('idx-maintSubmitText','Save Changes');
    setVal('idx-maintId',m.id); setVal('idx-maintPropId',m.propId); setVal('idx-maintReporter',m.reporter);
    setVal('idx-maintCategory',m.category); setVal('idx-maintDesc',m.desc);
    setVal('idx-maintPriority',m.priority); setVal('idx-maintStatus',m.status); setVal('idx-maintDate',m.date);
  };
  window.idxDeleteMaint = function(idx) {
    if (confirm('Delete request?')) { maint.splice(idx,1); refreshIdxMaint(); }
  };
  document.getElementById('idx-maintSearch')?.addEventListener('input', renderIdxMaint);
  refreshIdxMaint();

  /* ─── Payroll (index embedded) ─── */
  let employees = loadData('fm_employees');

  function calcIdxEmp() {
    setText('idx-totalEmployees',  employees.length);
    setText('idx-totalPayroll',    fmt(employees.reduce((s,e)=>s+(+e.salary + +e.bonus - (+e.salary + +e.bonus)*(+e.tax/100) - +e.deductions),0)));
    setText('idx-totalBonuses',    fmt(employees.reduce((s,e)=>s+Number(e.bonus),0)));
    setText('idx-totalDeductions', fmt(employees.reduce((s,e)=>s+Number(e.deductions),0)));
  }

  function renderIdxEmp() {
    const tbody  = document.getElementById('idx-payrollBody');
    const empty  = document.getElementById('idx-emptyPayroll');
    const search = getVal('idx-empSearch').toLowerCase();
    const list   = employees.filter(e =>
      !search || e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search));
    tbody.innerHTML='';
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(emp => {
      const ri  = employees.indexOf(emp);
      const gross = +emp.salary + +emp.bonus;
      const net   = gross - gross*(+emp.tax/100) - +emp.deductions;
      const tr  = document.createElement('tr');
      tr.innerHTML=`<td><strong>${emp.id}</strong></td><td>${emp.name}</td><td>${emp.role}</td>
        <td>${emp.dept}</td><td>${fmt(emp.salary)}</td>
        <td class="positive">${fmt(emp.bonus)}</td>
        <td><strong>${fmt(net)}</strong></td>
        <td>${statusBadge(emp.status)}</td>
        <td><div class="table-actions">
          <button class="btn btn-success" onclick="idxPaySlip(${ri})"><i class="fas fa-file-invoice"></i> Slip</button>
          <button class="btn btn-secondary" style="padding:7px 12px;font-size:0.82rem;" onclick="idxEditEmp(${ri})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="idxDeleteEmp(${ri})"><i class="fas fa-trash"></i></button>
        </div></td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxEmp(){ calcIdxEmp(); renderIdxEmp(); saveData('fm_employees',employees); }

  document.getElementById('idx-employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = parseInt(getVal('idx-editIndex'));
    const emp = { id:getVal('idx-empId'),name:getVal('idx-empName'),role:getVal('idx-empRole'),
      dept:getVal('idx-empDept'),type:getVal('idx-empType'),period:getVal('idx-empPeriod'),
      salary:getVal('idx-empSalary'),bonus:getVal('idx-empBonus')||0,
      deductions:getVal('idx-empDeductions')||0,tax:getVal('idx-empTax')||15,
      startDate:getVal('idx-empStartDate'),status:getVal('idx-empStatus') };
    if (idx>=0) employees[idx]=emp; else employees.push(emp);
    idxClearEmpForm(); refreshIdxEmp();
  });

  window.idxClearEmpForm = function() {
    document.getElementById('idx-employeeForm').reset();
    setVal('idx-editIndex',-1);
    setText('idx-empFormTitle','Add Employee'); setText('idx-empSubmitText','Add Employee');
  };
  window.idxEditEmp = function(idx) {
    const e=employees[idx]; setVal('idx-editIndex',idx);
    setText('idx-empFormTitle','Edit Employee'); setText('idx-empSubmitText','Save Changes');
    setVal('idx-empId',e.id); setVal('idx-empName',e.name); setVal('idx-empRole',e.role);
    setVal('idx-empDept',e.dept); setVal('idx-empType',e.type); setVal('idx-empPeriod',e.period);
    setVal('idx-empSalary',e.salary); setVal('idx-empBonus',e.bonus);
    setVal('idx-empDeductions',e.deductions); setVal('idx-empTax',e.tax);
    setVal('idx-empStartDate',e.startDate||''); setVal('idx-empStatus',e.status);
    document.getElementById('payroll-section')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  window.idxDeleteEmp = function(idx) {
    if (confirm(`Delete employee "${employees[idx].name}"?`)) { employees.splice(idx,1); refreshIdxEmp(); }
  };
  window.idxPaySlip = function(idx) {
    const e=employees[idx];
    const gross  = +e.salary + +e.bonus;
    const taxAmt = gross*(+e.tax/100);
    const net    = gross - taxAmt - +e.deductions;
    setText('slipPeriod',    'Pay Period: '+currentPeriod());
    setText('slipId',        e.id);   setText('slipName',      e.name);
    setText('slipRole',      e.role); setText('slipDept',      e.dept);
    setText('slipType',      e.type||'Full-Time'); setText('slipPayPeriod', e.period||'Monthly');
    setText('slipSalary',    fmt(e.salary));
    setText('slipBonus',     fmt(e.bonus));
    setText('slipDeductions','- '+fmt(e.deductions));
    setText('slipTaxRate',   e.tax);
    setText('slipTaxAmt',    '- '+fmt(taxAmt));
    setText('slipNetPay',    fmt(net));
    document.getElementById('paySlipModal').style.display='flex';
    document.body.style.overflow='hidden';
  };

  document.getElementById('idx-empSearch')?.addEventListener('input', renderIdxEmp);
  document.getElementById('idx-exportPayrollBtn')?.addEventListener('click', () => {
    if (!employees.length){ alert('No data.'); return; }
    const calcNet = e => { const g=+e.salary+ +e.bonus; return g-g*(+e.tax/100)- +e.deductions; };
    downloadCSV('payroll_export.csv',
      ['ID','Name','Role','Dept','Salary','Bonus','Net Pay','Status'],
      employees.map(e=>[e.id,e.name,e.role,e.dept,e.salary,e.bonus,calcNet(e).toFixed(2),e.status]));
  });
  refreshIdxEmp();

  /* ─── Index payment portal (quick payment) ─── */
  let idxTxn = loadData('fm_transactions');

  function calcIdxPmt() {
    setText('idx-pmtTotalPaid', fmt(idxTxn.filter(t=>t.status==='Completed').reduce((s,t)=>s+Number(t.total),0)));
    setText('idx-pmtCount',     idxTxn.length);
    setText('idx-pmtPending',   fmt(idxTxn.filter(t=>t.status==='Pending').reduce((s,t)=>s+Number(t.total),0)));
    setText('idx-pmtFailed',    fmt(idxTxn.filter(t=>['Failed','Refunded'].includes(t.status)).reduce((s,t)=>s+Number(t.total),0)));
  }

  window.idxUpdateTotal = function() {
    const sub = parseFloat(getVal('idx-pmtAmount'))||0;
    const fee = sub*0.02;
    setText('idx-ptbSubtotal', fmt(sub));
    setText('idx-ptbFee',      fmt(fee));
    setText('idx-ptbTotal',    fmt(sub+fee));
  };

  function renderIdxTxn() {
    const tbody = document.getElementById('idx-txnBody');
    const empty = document.getElementById('idx-emptyTxn');
    tbody.innerHTML='';
    const list = idxTxn.slice(0,8);
    if (!list.length){ empty.style.display='block'; tbody.closest('table').style.display='none'; return; }
    empty.style.display='none'; tbody.closest('table').style.display='';
    list.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML=`<td><strong>${t.receipt}</strong></td><td>${t.payerName}</td>
        <td>${t.type}</td><td><strong>${fmt(t.total)}</strong></td><td>${statusBadge(t.status)}</td>`;
      tbody.appendChild(tr);
    });
  }

  function refreshIdxPmt(){ calcIdxPmt(); renderIdxTxn(); saveData('fm_transactions',idxTxn); }

  document.getElementById('idx-paymentPortalForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount  = parseFloat(getVal('idx-pmtAmount'))||0;
    const fee     = amount*0.02;
    const total   = amount+fee;
    const receipt = 'RCP-'+Date.now().toString().slice(-8);
    const sel     = document.getElementById('idx-pmtType');
    idxTxn.unshift({
      receipt, amount, fee, total, status:'Completed',
      payerName: getVal('idx-pmtPayerName'),
      type:  sel?.options[sel.selectedIndex]?.text || getVal('idx-pmtType'),
      method: getVal('idx-pmtMethod'),
      ref:   getVal('idx-pmtRef'),
      date:  getVal('idx-pmtDate'),
    });
    const s = document.getElementById('idx-paySuccessMsg');
    if (s){ s.classList.add('visible'); setTimeout(()=>s.classList.remove('visible'),4000); }
    this.reset(); window.idxUpdateTotal(); refreshIdxPmt();
  });

  refreshIdxPmt();
})();
