import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar conectividad con el backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    let backendStatus = 'unknown';
    let backendResponseTime = 0;

    if (backendUrl) {
      const startTime = Date.now();
      try {
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        backendResponseTime = Date.now() - startTime;
        backendStatus = response.ok ? 'healthy' : 'unhealthy';
      } catch (error) {
        backendResponseTime = Date.now() - startTime;
        backendStatus = 'unreachable';
      }
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      backend: {
        url: backendUrl,
        status: backendStatus,
        responseTime: `${backendResponseTime}ms`
      },
      nextjs: {
        version: process.env.npm_package_dependencies_next || 'unknown',
        buildTime: process.env.BUILD_TIME || 'unknown'
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal health check error',
      environment: process.env.NODE_ENV || 'development'
    }, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}