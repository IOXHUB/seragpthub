'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity } from 'lucide-react';

interface HealthStatus {
  status: 'ok' | 'error';
  responseTime: number;
  timestamp: string;
  message?: string;
}

export function SystemHealth() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      const response = await fetch('/api/health');
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (response.ok) {
        const data = await response.json();
        setHealthData({
          status: 'ok',
          responseTime,
          timestamp: data.timestamp,
          message: data.message
        });
      } else {
        setHealthData({
          status: 'error',
          responseTime,
          timestamp: new Date().toISOString(),
          message: 'Sistem yanıt vermiyor'
        });
      }
      setLastChecked(new Date());
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      setHealthData({
        status: 'error',
        responseTime,
        timestamp: new Date().toISOString(),
        message: 'Bağlantı hatası'
      });
      setLastChecked(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const getResponseTimeBadge = (responseTime: number) => {
    if (responseTime > 3000) {
      return <Badge variant="destructive">{responseTime}ms</Badge>;
    } else if (responseTime > 1500) {
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">{responseTime}ms</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">{responseTime}ms</Badge>;
    }
  };

  const getStatusBadge = (status: 'ok' | 'error') => {
    if (status === 'ok') {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Çevrimiçi</Badge>;
    } else {
      return <Badge variant="destructive">Çevrimdışı</Badge>;
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="size-5" />
          Sistem Sağlığı
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkHealth}
          disabled={isLoading}
          className="size-8 p-0"
        >
          <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthData ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Durum:</span>
              {getStatusBadge(healthData.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Yanıt Süresi:</span>
              {getResponseTimeBadge(healthData.responseTime)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mesaj:</span>
              <span className="text-sm text-muted-foreground">
                {healthData.message || 'Sistem normal çalışıyor'}
              </span>
            </div>
            
            {lastChecked && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Son kontrol: {lastChecked.toLocaleTimeString('tr-TR')}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Sistem durumu kontrol ediliyor...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
