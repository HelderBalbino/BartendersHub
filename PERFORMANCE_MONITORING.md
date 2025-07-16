# ⚡ Performance & Monitoring Improvements

## Current Performance Status: ✅ Good (Basic optimizations implemented)

### Additional Performance Optimizations Needed

#### 1. Frontend Performance Enhancements

##### Image Optimization & Lazy Loading
Update `src/components/CocktailCard.jsx`:

```jsx
import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, placeholder }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
      {!isLoaded && isInView && (
        <div className="animate-pulse bg-gray-300 w-full h-full" />
      )}
    </div>
  );
};
```

##### Virtual Scrolling for Large Lists
Create `src/components/VirtualizedCocktailList.jsx`:

```jsx
import { FixedSizeList as List } from 'react-window';
import { useMemo } from 'react';
import CocktailCard from './CocktailCard';

const VirtualizedCocktailList = ({ 
  cocktails, 
  height = 600, 
  itemHeight = 300 
}) => {
  const Row = useMemo(() => 
    ({ index, style }) => (
      <div style={style}>
        <CocktailCard cocktail={cocktails[index]} />
      </div>
    ), [cocktails]
  );

  return (
    <List
      height={height}
      itemCount={cocktails.length}
      itemSize={itemHeight}
      overscanCount={5} // Render 5 extra items for smooth scrolling
    >
      {Row}
    </List>
  );
};

export default VirtualizedCocktailList;
```

##### Service Worker for Caching
Create `public/sw.js`:

```javascript
const CACHE_NAME = 'bartendershub-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache first strategy for static assets
  if (event.request.destination === 'image' || 
      event.request.url.includes('static')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
  
  // Network first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  }
});
```

#### 2. Backend Performance Monitoring

##### Request Timing Middleware
Create `backend/src/middleware/timing.js`:

```javascript
import process from 'process';

export const requestTiming = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 500ms)
    if (duration > 500) {
      console.warn(`🐌 Slow request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
    
    // Add timing header
    res.set('X-Response-Time', `${duration.toFixed(2)}ms`);
  });
  
  next();
};

// Memory usage monitoring
export const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  
  // Log memory warnings
  if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
    console.warn('⚠️ High memory usage:', {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    });
  }
  
  next();
};
```

##### Database Query Optimization
Update `backend/src/models/Cocktail.js`:

```javascript
// Add compound indexes for common queries
cocktailSchema.index({ author: 1, createdAt: -1 }); // User's cocktails
cocktailSchema.index({ difficulty: 1, likes: -1 }); // Filter by difficulty, sort by popularity
cocktailSchema.index({ tags: 1, createdAt: -1 }); // Search by tags
cocktailSchema.index({ name: 'text', description: 'text' }); // Text search

// Add aggregation pipeline for popular cocktails
cocktailSchema.statics.getPopularCocktails = function(limit = 10) {
  return this.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo'
      }
    },
    {
      $addFields: {
        popularityScore: {
          $add: [
            '$likes',
            { $multiply: ['$views', 0.1] },
            { $multiply: ['$comments', 2] }
          ]
        }
      }
    },
    { $sort: { popularityScore: -1 } },
    { $limit: limit },
    {
      $project: {
        name: 1,
        description: 1,
        image: 1,
        difficulty: 1,
        likes: 1,
        'authorInfo.name': 1,
        'authorInfo.username': 1,
        popularityScore: 1
      }
    }
  ]);
};
```

#### 3. Advanced Caching Strategy

##### Redis Cache Strategies
Update `backend/src/middleware/cache.js`:

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Cache invalidation patterns
const CACHE_PATTERNS = {
  COCKTAILS: 'cocktails:*',
  USER: 'user:*',
  SEARCH: 'search:*'
};

// Smart cache with automatic invalidation
export const smartCache = (options = {}) => {
  const {
    keyGenerator = (req) => req.originalUrl,
    duration = 300, // 5 minutes default
    invalidateOn = [], // Events that should invalidate this cache
  } = options;

  return async (req, res, next) => {
    const key = `cache:${keyGenerator(req)}`;
    
    try {
      // Try to get from cache
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        
        // Check if cache is still valid
        if (data.expiresAt > Date.now()) {
          console.log(`🎯 Cache hit: ${key}`);
          return res.json(data.body);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error.message);
    }

    // Store original res.json
    res.sendResponse = res.json;

    // Override res.json to cache the response
    res.json = async (body) => {
      if (res.statusCode === 200) {
        try {
          const cacheData = {
            body,
            cachedAt: Date.now(),
            expiresAt: Date.now() + (duration * 1000)
          };
          
          await redis.setex(key, duration, JSON.stringify(cacheData));
          console.log(`💾 Cached: ${key} for ${duration}s`);
        } catch (error) {
          console.warn('Cache write error:', error.message);
        }
      }
      res.sendResponse(body);
    };

    next();
  };
};

// Cache invalidation helper
export const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} cache entries for pattern: ${pattern}`);
    }
  } catch (error) {
    console.warn('Cache invalidation error:', error.message);
  }
};
```

#### 4. Application Performance Monitoring (APM)

##### Custom Metrics Collection
Create `backend/src/utils/metrics.js`:

```javascript
import EventEmitter from 'events';

class MetricsCollector extends EventEmitter {
  constructor() {
    super();
    this.metrics = {
      requests: 0,
      errors: 0,
      responseTime: [],
      activeConnections: 0,
      memoryUsage: [],
      cpuUsage: []
    };
    
    this.startCollection();
  }

  recordRequest(duration, statusCode) {
    this.metrics.requests++;
    this.metrics.responseTime.push(duration);
    
    if (statusCode >= 400) {
      this.metrics.errors++;
    }
    
    // Keep only last 1000 response times
    if (this.metrics.responseTime.length > 1000) {
      this.metrics.responseTime.shift();
    }
    
    this.emit('request', { duration, statusCode });
  }

  recordError(error) {
    this.metrics.errors++;
    this.emit('error', error);
  }

  getMetrics() {
    const responseTime = this.metrics.responseTime;
    
    return {
      ...this.metrics,
      averageResponseTime: responseTime.length > 0 
        ? responseTime.reduce((a, b) => a + b) / responseTime.length 
        : 0,
      p95ResponseTime: this.calculatePercentile(responseTime, 95),
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0
    };
  }

  calculatePercentile(arr, percentile) {
    if (arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  startCollection() {
    // Collect metrics every 30 seconds
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal
      });
      
      // Keep only last 24 hours of data (2880 data points)
      if (this.metrics.memoryUsage.length > 2880) {
        this.metrics.memoryUsage.shift();
      }
    }, 30000);
  }
}

export const metricsCollector = new MetricsCollector();

// Metrics endpoint middleware
export const metricsEndpoint = (req, res) => {
  res.json({
    success: true,
    metrics: metricsCollector.getMetrics(),
    timestamp: new Date().toISOString()
  });
};
```

#### 5. Real-time Performance Dashboard

##### WebSocket Metrics Streaming
Create `backend/src/services/metricsSocket.js`:

```javascript
import { Server } from 'socket.io';
import { metricsCollector } from '../utils/metrics.js';

export const setupMetricsSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('📊 Metrics client connected');
    
    // Send current metrics immediately
    socket.emit('metrics:current', metricsCollector.getMetrics());
    
    // Send metrics updates every 5 seconds
    const metricsInterval = setInterval(() => {
      socket.emit('metrics:update', metricsCollector.getMetrics());
    }, 5000);
    
    socket.on('disconnect', () => {
      console.log('📊 Metrics client disconnected');
      clearInterval(metricsInterval);
    });
  });

  // Listen to metrics events
  metricsCollector.on('request', (data) => {
    io.emit('metrics:request', data);
  });

  metricsCollector.on('error', (error) => {
    io.emit('metrics:error', {
      message: error.message,
      timestamp: Date.now()
    });
  });

  return io;
};
```

### Performance Targets & KPIs

#### Frontend Performance Goals:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

#### Backend Performance Goals:
- **API Response Time (P95)**: < 200ms
- **Database Query Time**: < 50ms
- **Memory Usage**: < 512MB
- **CPU Usage**: < 70%
- **Error Rate**: < 1%

#### Monitoring Alerts:
1. **Response Time** > 500ms (5 consecutive requests)
2. **Error Rate** > 5% (over 5 minutes)
3. **Memory Usage** > 80% (for 2 minutes)
4. **Database Connection Pool** exhaustion
5. **Redis Connection** failures
