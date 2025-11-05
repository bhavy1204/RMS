// Simple invoice generator: opens a print window with order details
export function openInvoiceWindow(order) {
  if (!order) return;
  const win = window.open('', '_blank');
  if (!win) return alert('Pop-up blocked. Please allow pop-ups to download bill.');

  const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;
  const createdAt = new Date(order.createdAt || Date.now());
  const dateStr = createdAt.toLocaleString();

  const table = order.tableId || {};
  const customer = order.customerId || {};
  const items = order.items || [];

  const rows = items.map((it, idx) => {
    const name = it.menuItemId?.name || it.name || 'Item';
    const qty = it.quantity || 1;
    const price = it.price || it.menuItemId?.price || 0;
    const total = qty * price;
    return `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${idx + 1}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(price)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(total)}</td>
    </tr>`;
  }).join('');

  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bill - ${order.orderNumber || ''}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;color:#111;}
      .container{max-width:800px;margin:24px auto;padding:24px;border:1px solid #eee;border-radius:12px}
      .row{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
      .muted{color:#666}
      .title{font-size:22px;font-weight:700}
      .badge{padding:4px 8px;border-radius:999px;background:#f3f4f6;font-size:12px}
      .total{font-size:18px;font-weight:700}
      @media print {.no-print { display:none; }}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row" style="margin-bottom:16px;align-items:center;">
        <div>
          <div class="title">Restaurant Bill</div>
          <div class="muted">Order # ${order.orderNumber || order._id || ''}</div>
        </div>
        <div class="badge">${(order.paymentStatus || 'pending').toUpperCase()}</div>
      </div>

      <div class="row" style="margin-bottom:16px">
        <div>
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Table:</strong> ${table.number || 'N/A'}</div>
        </div>
        <div>
          <div><strong>Name:</strong> ${customer.name || 'Guest'}</div>
          <div><strong>Email:</strong> ${customer.email || '-'}</div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #111;">#</th>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #111;">Item</th>
            <th style="text-align:center;padding:8px;border-bottom:2px solid #111;">Qty</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #111;">Price</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #111;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="margin-top:16px;display:flex;justify-content:flex-end">
        <div>
          <div><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</div>
          <div><strong>Tax:</strong> ${formatCurrency(order.tax)}</div>
          <div class="total"><strong>Grand Total:</strong> ${formatCurrency(order.total)}</div>
        </div>
      </div>

      <div class="no-print" style="margin-top:24px;display:flex;gap:8px;justify-content:flex-end;">
        <button onclick="window.print()" style="padding:8px 12px;border:1px solid #ddd;border-radius:8px;background:#111;color:#fff;cursor:pointer">Print / Save PDF</button>
        <button onclick="window.close()" style="padding:8px 12px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer">Close</button>
      </div>
    </div>
  </body>
  </html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}





