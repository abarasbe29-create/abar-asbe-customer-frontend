const GAS_BACKEND_URL = process.env.GAS_BACKEND_URL || 'https://script.google.com/macros/s/AKfycbyIRsZBYbg4MeIS0jg8z3uncKAx-4YwEw_JmuIiymZPoUG1hiAidhXOx2AJ5kDAzbq7/exec';

const ALLOWED_ACTIONS = new Set([
  'getCustomerMenuData',
  'getAbarAsbePublicOffers',
  'validateAbarAsbeCoupon',
  'submitCustomerOrder',
  'submitCustomerReview',
  'getShubenduOrderDetails',
  'getCustomerOrderTracking',
  'getAbarAsbeCustomerHub',
  'requestCustomerLoginCode',
  'verifyCustomerLoginCode',
  'getCustomerAccount',
  'updateCustomerAccount',
  'customerAccountLogout',
  'getCustomerOrderForReorder'
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const action = String(body.action || '').trim();
    const args = Array.isArray(body.args) ? body.args : [];

    if (!ALLOWED_ACTIONS.has(action)) {
      return res.status(400).json({ ok: false, error: 'Unsupported customer API action.' });
    }

    const gasResponse = await fetch(GAS_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, args })
    });

    const text = await gasResponse.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch (error) {
      console.error('Invalid Apps Script response:', text.slice(0, 500));
      return res.status(502).json({
        ok: false,
        error: 'The Abar Asbe backend returned an invalid response.'
      });
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Abar Asbe bridge error:', error);
    return res.status(502).json({
      ok: false,
      error: 'The Abar Asbe ordering service is temporarily unavailable.'
    });
  }
}
