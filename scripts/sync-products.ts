import https from 'https';
import fs from 'fs';
import path from 'path';

// Load .env manually
const envFile = path.join(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf-8').split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

async function run() {
  const email = process.env.JUBELIO_EMAIL;
  const password = process.env.JUBELIO_PASSWORD;

  if (!email || !password) {
    console.error('Missing JUBELIO_EMAIL or JUBELIO_PASSWORD in .env');
    process.exit(1);
  }

  console.log('Logging in as:', email);
  const loginData = JSON.stringify({ email, password });

  const loginResp = await new Promise<{token: string}>((resolve, reject) => {
    const req = https.request({
      hostname: 'api2.jubelio.com',
      path: '/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginData) }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });

  const token = loginResp.token;
  if (!token) { console.error('No token'); process.exit(1); }

  console.log('Fetching all products from Jubelio...');
  const t0 = Date.now();

  const resp = await new Promise<{data: Record<string, unknown>[]}>((resolve, reject) => {
    const req = https.request({
      hostname: 'api2.jubelio.com',
      path: '/inventory/items/',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });

  const rawProducts = resp.data || [];
  console.log('Fetched', rawProducts.length, 'products in', ((Date.now() - t0) / 1000).toFixed(1) + 's');

  const products = rawProducts.map((p: Record<string, unknown>) => {
    const basePrice = parseFloat(p.sell_price as string) || 0;
    const variants = (p.variants as Record<string, unknown>[] || []).map((v: Record<string, unknown>) => ({
      id: v.item_id,
      name: v.item_name,
      price: v.sell_price as number || basePrice,
      sku: v.item_code || '',
      thumbnail: v.thumbnail || null
    }));
    const price = basePrice || (variants[0] ? variants[0].price : 0);
    const thumbnail = p.thumbnail || (variants.find((v: Record<string, unknown>) => v.thumbnail) || {}).thumbnail || null;
    return {
      id: p.item_group_id,
      name: p.item_name,
      price,
      thumbnail,
      categoryId: p.item_category_id || null,
      variants
    };
  });

  const cache = {
    products,
    totalCount: products.length,
    syncedAt: new Date().toISOString()
  };

  const cacheDir = path.join(process.cwd(), 'data');
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, 'products.json');
  fs.writeFileSync(cachePath, JSON.stringify(cache), 'utf-8');

  const sizeKB = (fs.statSync(cachePath).size / 1024).toFixed(0);
  console.log('Cache saved to:', cachePath);
  console.log('File size:', sizeKB, 'KB');
  console.log('Done! Next API requests will be instant (disk reads).');
}

run().catch(err => { console.error(err); process.exit(1); });
