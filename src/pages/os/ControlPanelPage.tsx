import { useState } from 'react';
import { Power, Droplet, Thermometer, Gauge, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface Device {
  id: string;
  name: string;
  type: 'tank' | 'pump' | 'valve' | 'sensor' | 'heater' | 'chiller';
  status: 'online' | 'offline' | 'error' | 'warning';
  position: { x: number; y: number };
  // Control properties
  isOn?: boolean;
  temperature?: number;
  targetTemp?: number;
  pressure?: number;
  flowRate?: number;
  level?: number;
  capacity?: number;
}

const mockDevices: Device[] = [
  {
    id: 'tank-1',
    name: 'Fermentor #1',
    type: 'tank',
    status: 'online',
    position: { x: 100, y: 100 },
    temperature: 18.5,
    targetTemp: 18.0,
    pressure: 12.5,
    level: 750,
    capacity: 1000,
  },
  {
    id: 'tank-2',
    name: 'Bright Tank #1',
    type: 'tank',
    status: 'online',
    position: { x: 300, y: 100 },
    temperature: 2.5,
    targetTemp: 2.0,
    pressure: 15.0,
    level: 500,
    capacity: 1000,
  },
  {
    id: 'pump-1',
    name: 'Transfer Pump #1',
    type: 'pump',
    status: 'online',
    position: { x: 200, y: 250 },
    isOn: false,
    flowRate: 0,
  },
  {
    id: 'valve-1',
    name: 'Valve V-101',
    type: 'valve',
    status: 'online',
    position: { x: 150, y: 200 },
    isOn: false,
  },
  {
    id: 'valve-2',
    name: 'Valve V-102',
    type: 'valve',
    status: 'online',
    position: { x: 250, y: 200 },
    isOn: true,
  },
];

const getStatusIcon = (status: Device['status']) => {
  switch (status) {
    case 'online':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'offline':
      return <XCircle className="h-4 w-4 text-muted-foreground" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusBadge = (status: Device['status']) => {
  switch (status) {
    case 'online':
      return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">Online</Badge>;
    case 'offline':
      return <Badge variant="secondary">Offline</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'warning':
      return <Badge variant="default" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Warning</Badge>;
  }
};

export default function ControlPanelPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);

  const handleToggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

  const handleTempChange = (deviceId: string, value: number[]) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, targetTemp: value[0] } : device
      )
    );
  };

  const tanks = devices.filter((d) => d.type === 'tank');
  const pumps = devices.filter((d) => d.type === 'pump');
  const valves = devices.filter((d) => d.type === 'valve');

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Control Panel</h1>
            <p className="text-sm text-muted-foreground">Real-time device monitoring and control</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </Badge>
            <Button variant="outline" size="sm">
              Emergency Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100vh-88px)] overflow-auto">
        {/* Tanks Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Fermentation Vessels
          </h2>
          {tanks.map((tank) => (
            <Card key={tank.id} className="shadow-glow-md hover:shadow-glow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{tank.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tank.status)}
                    {getStatusBadge(tank.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Temperature Control */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature
                    </label>
                    <span className="text-sm font-mono">
                      {tank.temperature?.toFixed(1)}°C / {tank.targetTemp?.toFixed(1)}°C
                    </span>
                  </div>
                  <Slider
                    value={[tank.targetTemp || 0]}
                    onValueChange={(value) => handleTempChange(tank.id, value)}
                    min={-5}
                    max={30}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Pressure */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Pressure
                  </label>
                  <span className="text-sm font-mono">{tank.pressure?.toFixed(1)} PSI</span>
                </div>

                <Separator />

                {/* Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      Level
                    </label>
                    <span className="text-sm font-mono">
                      {tank.level}L / {tank.capacity}L ({((tank.level! / tank.capacity!) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(tank.level! / tank.capacity!) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pumps Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Power className="h-5 w-5" />
            Pumps
          </h2>
          {pumps.map((pump) => (
            <Card key={pump.id} className="shadow-glow-md hover:shadow-glow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{pump.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(pump.status)}
                    {getStatusBadge(pump.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Power Control */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Power className="h-4 w-4" />
                    Power
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pump.isOn ? 'ON' : 'OFF'}</span>
                    <Switch
                      checked={pump.isOn}
                      onCheckedChange={() => handleToggleDevice(pump.id)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Flow Rate */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4" />
                    Flow Rate
                  </label>
                  <span className="text-sm font-mono">{pump.flowRate || 0} L/min</span>
                </div>

                {pump.isOn && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Pump is running</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Valves Section */}
          <h2 className="text-lg font-semibold flex items-center gap-2 mt-6">
            <Power className="h-5 w-5" />
            Valves
          </h2>
          {valves.map((valve) => (
            <Card key={valve.id} className="shadow-glow-md hover:shadow-glow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{valve.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(valve.status)}
                    {getStatusBadge(valve.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Position</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{valve.isOn ? 'OPEN' : 'CLOSED'}</span>
                    <Switch
                      checked={valve.isOn}
                      onCheckedChange={() => handleToggleDevice(valve.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">System Overview</h2>
          
          <Card className="shadow-glow-md">
            <CardHeader>
              <CardTitle className="text-base">Active Processes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Batch #2024-045</p>
                  <Badge variant="secondary">Fermenting</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Fermentor #1 • Day 5 of 14</p>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Batch #2024-044</p>
                  <Badge variant="secondary">Conditioning</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Bright Tank #1 • Day 10 of 14</p>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="h-full bg-primary rounded-full" style={{ width: '71%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-glow-md">
            <CardHeader>
              <CardTitle className="text-base">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Temperature variance</p>
                    <p className="text-xs text-muted-foreground">Fermentor #1 • 2 min ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Transfer completed</p>
                    <p className="text-xs text-muted-foreground">Pump #1 • 15 min ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-glow-md">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                Start Transfer
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                Log Reading
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                View All Batches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
