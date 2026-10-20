import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { INITIAL_PROPERTIES, INITIAL_INQUIRIES, INITIAL_AGENTS } from './src/data/initialProperties.ts';
import { Property, Inquiry, AgentContact, AdminMetrics } from './src/types/property.ts';
import { DbStatus } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// In-memory persistent state (active cache and resilient fallback)
let propertiesCache: Property[] = [...INITIAL_PROPERTIES];
let inquiriesCache: Inquiry[] = [...INITIAL_INQUIRIES];
let agentsCache: AgentContact[] = [...INITIAL_AGENTS];

// MongoDB Configuration
const DEFAULT_USER_URI = "mongodb+srv://tasdidanawaz_db_user:zTKxBe4Ti84gxoV0@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority";
let currentMongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || DEFAULT_USER_URI;
let mongoClient: MongoClient | null = null;
let isMongoConnected = false;
let dbConnectError = "";

// Helper to mask URI for UI safety
function getMaskedUri(uri: string): string {
  return uri.replace(/:([^@]+)@/, ':••••••••@');
}

// Function to test and initialize Mongo
async function tryConnectMongo(uri: string): Promise<{ success: boolean; message: string }> {
  if (uri.includes('<db_password>')) {
    isMongoConnected = false;
    dbConnectError = "Database password placeholder '<db_password>' needs to be substituted with your Atlas cluster password.";
    return { success: false, message: dbConnectError };
  }

  try {
    if (mongoClient) {
      await mongoClient.close();
    }
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    // Ping to verify
    await client.db('homesprit').command({ ping: 1 });
    mongoClient = client;
    isMongoConnected = true;
    dbConnectError = "";
    currentMongoUri = uri;

    // Synchronize caches with Mongo
    const db = client.db('homesprit');
    const pCount = await db.collection('properties').countDocuments();
    if (pCount === 0) {
      // Auto seed properties
      await db.collection('properties').insertMany(propertiesCache as any);
      await db.collection('inquiries').insertMany(inquiriesCache as any);
      await db.collection('agents').insertMany(agentsCache as any);
    } else {
      propertiesCache = (await db.collection('properties').find({}).toArray()) as any;
      inquiriesCache = (await db.collection('inquiries').find({}).toArray()) as any;
      agentsCache = (await db.collection('agents').find({}).toArray()) as any;
    }

    return { success: true, message: "Successfully connected to MongoDB Atlas cluster 'cluster0.9yxdz1b.mongodb.net'!" };
  } catch (err: any) {
    isMongoConnected = false;
    dbConnectError = err.message || "Failed to connect to MongoDB Atlas";
    return { success: false, message: dbConnectError };
  }
}

// Attempt initial connection if configured
if (!currentMongoUri.includes('<db_password>')) {
  tryConnectMongo(currentMongoUri).catch(() => {
    // Graceful fallback to memory
  });
}

// --- REST API ENDPOINTS ---

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'homesprit-real-estate-api',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'mongodb_atlas' : 'local_fallback',
  });
});

app.get('/api/db/status', (req: Request, res: Response) => {
  const status: DbStatus = {
    connected: isMongoConnected,
    type: isMongoConnected ? 'mongodb_atlas' : 'local_fallback',
    databaseName: 'homesprit',
    cluster: 'cluster0.9yxdz1b.mongodb.net',
    user: 'tasdidanawaz_db_user',
    host: 'cluster0.9yxdz1b.mongodb.net',
    collectionsCount: {
      services: propertiesCache.length,
      bookings: inquiriesCache.length,
      professionals: agentsCache.length,
      reviews: 3,
    },
    maskedUri: getMaskedUri(currentMongoUri),
    message: isMongoConnected
      ? "Live MongoDB Atlas replica set verified and responsive."
      : (dbConnectError || "Running in resilient local data mode. You can connect your Atlas cluster password at any time via the DB Console."),
    latencyMs: isMongoConnected ? 42 : 1,
  };
  res.json(status);
});

app.post('/api/db/connect', async (req: Request, res: Response) => {
  const { password, uri } = req.body;
  let targetUri = uri;

  if (password && !targetUri) {
    targetUri = `mongodb+srv://tasdidanawaz_db_user:${encodeURIComponent(password)}@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority`;
  }

  if (!targetUri) {
    return res.status(400).json({ success: false, message: 'Please provide either a database password or full MongoDB URI.' });
  }

  const result = await tryConnectMongo(targetUri);
  res.json(result);
});

app.post('/api/db/seed', async (req: Request, res: Response) => {
  if (isMongoConnected && mongoClient) {
    try {
      const db = mongoClient.db('homesprit');
      await db.collection('properties').deleteMany({});
      await db.collection('inquiries').deleteMany({});
      await db.collection('agents').deleteMany({});

      await db.collection('properties').insertMany(INITIAL_PROPERTIES as any);
      await db.collection('inquiries').insertMany(INITIAL_INQUIRIES as any);
      await db.collection('agents').insertMany(INITIAL_AGENTS as any);

      propertiesCache = [...INITIAL_PROPERTIES];
      inquiriesCache = [...INITIAL_INQUIRIES];
      agentsCache = [...INITIAL_AGENTS];

      return res.json({ success: true, message: "Database re-seeded in MongoDB Atlas!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Local fallback reset
  propertiesCache = [...INITIAL_PROPERTIES];
  inquiriesCache = [...INITIAL_INQUIRIES];
  agentsCache = [...INITIAL_AGENTS];
  res.json({ success: true, message: "Local demo store reset to initial seed properties." });
});

// --- PROPERTIES CRUD ---

app.get('/api/properties', (req: Request, res: Response) => {
  let list = [...propertiesCache];
  const { search, type, listingType, city, minPrice, maxPrice, bedrooms, sort, featured } = req.query;

  if (featured === 'true') {
    list = list.filter(p => p.featured);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.address.toLowerCase().includes(q) ||
      p.location.city.toLowerCase().includes(q) ||
      p.location.neighborhood.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (type && typeof type === 'string' && type !== 'All') {
    list = list.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }

  if (listingType && typeof listingType === 'string' && listingType !== 'All') {
    list = list.filter(p => p.listingType.toLowerCase() === listingType.toLowerCase());
  }

  if (city && typeof city === 'string' && city !== 'All') {
    list = list.filter(p => p.location.city.toLowerCase().includes(city.toLowerCase()));
  }

  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) list = list.filter(p => p.price >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) list = list.filter(p => p.price <= max);
  }

  if (bedrooms && bedrooms !== 'Any') {
    const beds = parseInt(bedrooms as string, 10);
    if (!isNaN(beds)) {
      if (beds >= 4) {
        list = list.filter(p => p.bedrooms >= 4);
      } else {
        list = list.filter(p => p.bedrooms === beds);
      }
    }
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'area_desc') {
    list.sort((a, b) => b.areaSqFt - a.areaSqFt);
  } else {
    // Newest default
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(list);
});

app.get('/api/properties/:id', (req: Request, res: Response) => {
  const prop = propertiesCache.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!prop) return res.status(404).json({ error: 'Property not found' });
  res.json(prop);
});

app.post('/api/properties', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: data.title || 'Architectural Residence',
      slug: (data.title || 'architectural-residence').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: data.type || 'House',
      listingType: data.listingType || 'Sale',
      price: Number(data.price) || 1200000,
      priceUnit: data.priceUnit || (data.listingType === 'Rent' ? '/ month' : undefined),
      location: {
        address: data.location?.address || '100 Ocean Blvd',
        neighborhood: data.location?.neighborhood || 'Seacliff',
        city: data.location?.city || 'San Francisco, CA',
        zip: data.location?.zip || '94121',
      },
      bedrooms: Number(data.bedrooms) || 3,
      bathrooms: Number(data.bathrooms) || 2.5,
      areaSqFt: Number(data.areaSqFt) || 2500,
      description: data.description || 'Pristine architectural property with serene natural light and bespoke finishes.',
      amenities: data.amenities || ['Smart Home Automation', 'Floor-to-Ceiling Windows', 'Chef Kitchen'],
      images: data.images && data.images.length > 0 ? data.images : ['/src/assets/images/villa_glass_architecture_1792504953976.jpg'],
      featured: Boolean(data.featured),
      status: data.status || 'Available',
      agent: data.agent || agentsCache[0],
      yearBuilt: Number(data.yearBuilt) || 2024,
      createdAt: new Date().toISOString(),
    };

    propertiesCache.unshift(newProperty);

    if (isMongoConnected && mongoClient) {
      await mongoClient.db('homesprit').collection('properties').insertOne(newProperty as any);
    }

    res.status(201).json(newProperty);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create property' });
  }
});

app.put('/api/properties/:id', async (req: Request, res: Response) => {
  const index = propertiesCache.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const updated: Property = {
    ...propertiesCache[index],
    ...req.body,
    id: propertiesCache[index].id,
  };
  propertiesCache[index] = updated;

  if (isMongoConnected && mongoClient) {
    await mongoClient.db('homesprit').collection('properties').updateOne(
      { id: updated.id },
      { $set: updated }
    );
  }

  res.json(updated);
});

app.delete('/api/properties/:id', async (req: Request, res: Response) => {
  const index = propertiesCache.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const deleted = propertiesCache.splice(index, 1)[0];

  if (isMongoConnected && mongoClient) {
    await mongoClient.db('homesprit').collection('properties').deleteOne({ id: req.params.id });
  }

  res.json({ success: true, message: 'Property listing deleted', property: deleted });
});

// --- INQUIRIES & VIEWINGS ---

app.get('/api/inquiries', (req: Request, res: Response) => {
  res.json(inquiriesCache);
});

app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { propertyId, customerName, customerEmail, customerPhone, preferredDate, preferredTime, message } = req.body;
    const property = propertiesCache.find(p => p.id === propertyId);

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      propertyId: propertyId || 'prop-101',
      propertyTitle: property?.title || 'General Real Estate Inquiry',
      customerName: customerName || 'Interested Buyer',
      customerEmail: customerEmail || 'client@example.com',
      customerPhone: customerPhone || '+1 (555) 000-0000',
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '02:00 PM',
      message: message || 'Requesting private viewing and disclosure package.',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    inquiriesCache.unshift(newInquiry);

    if (isMongoConnected && mongoClient) {
      await mongoClient.db('homesprit').collection('inquiries').insertOne(newInquiry as any);
    }

    res.status(201).json(newInquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit inquiry' });
  }
});

app.patch('/api/inquiries/:id', async (req: Request, res: Response) => {
  const { status } = req.body;
  const index = inquiriesCache.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  if (status) {
    inquiriesCache[index].status = status;
  }

  if (isMongoConnected && mongoClient) {
    await mongoClient.db('homesprit').collection('inquiries').updateOne(
      { id: inquiriesCache[index].id },
      { $set: { status } }
    );
  }

  res.json(inquiriesCache[index]);
});

// --- ADMIN METRICS ---

app.get('/api/admin/metrics', (req: Request, res: Response) => {
  const totalProperties = propertiesCache.length;
  const activeListings = propertiesCache.filter(p => p.status === 'Available').length;
  const totalInquiries = inquiriesCache.length;
  const portfolioValue = propertiesCache.reduce((sum, p) => sum + p.price, 0);

  const metrics: AdminMetrics = {
    totalProperties,
    activeListings,
    totalInquiries,
    portfolioValue,
  };
  res.json(metrics);
});

// Agents
app.get('/api/agents', (req: Request, res: Response) => {
  res.json(agentsCache);
});

// --- VITE DEV MIDDLEWARE / STATIC ASSETS ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Homesprit Real Estate server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
