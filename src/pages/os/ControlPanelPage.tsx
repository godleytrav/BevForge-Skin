import { useState } from 'react';
import { Power, Droplet, Thermometer, Gauge, AlertCircle, CheckCircle2, XCircle, Plus, Trash2, Settings, Edit, Play, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    name: 'HLT',
    type: 'tank',
    status: 'online',
    position: { x: 100, y: 150 },
    temperature: 75.5,
    targetTemp: 168.0,
    pressure: 0,
    level: 750,
    capacity: 1000,
  },
  {
    id: 'pump-1',
    name: 'HLT Pump',
    type: 'pump',
    status: 'online',
    position: { x: 100, y: 400 },
    isOn: false,
    flowRate: 0,
  },
  {
    id: 'valve-1',
    name: 'HLT Outlet',
    type: 'valve',
    status: 'online',
    position: { x: 200, y: 350 },
    isOn: false,
  },
  {
    id: 'sensor-1',
    name: 'HLT Temp',
    type: 'sensor',
    status: 'online',
    position: { x: 150, y: 200 },
    temperature: 75.5,
  },
  {
    id: 'heater-1',
    name: 'HLT Heater',
    type: 'heater',
    status: 'online',
    position: { x: 50, y: 300 },
    isOn: false,
    targetTemp: 168.0,
  },
  {
    id: 'tank-2',
    name: 'Mash Tun',
    type: 'tank',
    status: 'online',
    position: { x: 400, y: 150 },
    temperature: 152.0,
    targetTemp: 152.0,
    pressure: 0,
    level: 500,
    capacity: 800,
  },
  {
    id: 'pump-2',
    name: 'Mash Pump',
    type: 'pump',
    status: 'online',
    position: { x: 400, y: 400 },
    isOn: false,
    flowRate: 0,
  },
];

const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'tank':
      return <Droplet className="h-5 w-5" />;
    case 'pump':
      return <Power className="h-5 w-5" />;
    case 'valve':
      return <Settings className="h-5 w-5" />;
    case 'sensor':
      return <Thermometer className="h-5 w-5" />;
    case 'heater':
      return <Thermometer className="h-5 w-5" />;
    case 'chiller':
      return <Gauge className="h-5 w-5" />;
  }
};

const getStatusColor = (status: Device['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-gray-500';
    case 'error':
      return 'bg-red-500';
    case 'warning':
      return 'bg-yellow-500';
  }
};

export default function ControlPanelPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Partial<Device>>({});
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    name: '',
    type: 'sensor',
    status: 'online',
    position: { x: 300, y: 300 },
  });
  const [draggedDevice, setDraggedDevice] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDeviceClick = (device: Device) => {
    // Only handle clicks in control mode (edit mode uses drag)
    if (!isEditMode) {
      // Control mode: Select device to show control panel
      setSelectedDevice(selectedDevice?.id === device.id ? null : device);
    }
  };

  const handleDeviceDoubleClick = (device: Device) => {
    if (isEditMode) {
      // Edit mode: Double-click opens edit dialog
      setEditingDevice(device);
      setIsEditDialogOpen(true);
    }
  };

  const handleToggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

  const handleSaveEdit = () => {
    if (!editingDevice.id) return;

    setDevices((prev) =>
      prev.map((device) =>
        device.id === editingDevice.id ? { ...device, ...editingDevice } : device
      )
    );
    setIsEditDialogOpen(false);
    setEditingDevice({});
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type) {
      return;
    }

    const device: Device = {
      id: `${newDevice.type}-${Date.now()}`,
      name: newDevice.name,
      type: newDevice.type as Device['type'],
      status: 'online',
      position: newDevice.position || { x: 300, y: 300 },
      isOn: false,
      temperature: newDevice.type === 'sensor' ? 20.0 : undefined,
      targetTemp: newDevice.type === 'tank' || newDevice.type === 'heater' ? 20.0 : undefined,
      pressure: newDevice.type === 'tank' ? 0 : undefined,
      flowRate: newDevice.type === 'pump' ? 0 : undefined,
      level: newDevice.type === 'tank' ? 0 : undefined,
      capacity: newDevice.type === 'tank' ? 1000 : undefined,
    };

    setDevices((prev) => [...prev, device]);
    setIsAddDialogOpen(false);
    setNewDevice({
      name: '',
      type: 'sensor',
      status: 'online',
      position: { x: 300, y: 300 },
    });
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    setIsEditDialogOpen(false);
  };

  const handleQuickAdd = (type: Device['type']) => {
    const typeNames: Record<Device['type'], string> = {
      tank: 'New Tank',
      pump: 'New Pump',
      valve: 'New Valve',
      sensor: 'New Sensor',
      heater: 'New Heater',
      chiller: 'New Chiller',
    };

    setNewDevice({
      name: typeNames[type],
      type,
      status: 'online',
      position: { x: 300, y: 300 },
    });
    setIsAddDialogOpen(true);
  };

  const handleMouseDown = (e: React.MouseEvent, deviceId: string) => {
    if (!isEditMode) return;
    
    e.stopPropagation();
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    // Get the canvas position
    const canvas = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!canvas) return;

    // Calculate offset from mouse to device position (relative to canvas)
    const mouseX = e.clientX - canvas.left;
    const mouseY = e.clientY - canvas.top;
    
    setDragOffset({
      x: mouseX - device.position.x,
      y: mouseY - device.position.y,
    });
    setDraggedDevice(deviceId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedDevice || !isEditMode) return;

    const canvas = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - canvas.left;
    const mouseY = e.clientY - canvas.top;
    
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    setDevices((prev) =>
      prev.map((device) =>
        device.id === draggedDevice
          ? { ...device, position: { x: Math.max(100, Math.min(canvas.width - 100, newX)), y: Math.max(100, Math.min(canvas.height - 100, newY)) } }
          : device
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedDevice(null);
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Control Panel</h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Edit Mode: Drag to reposition, double-click to edit' : 'Control Mode: Click devices to activate'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </Badge>
            <Button
              variant={isEditMode ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Layout
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Mode
                </>
              )}
            </Button>
            {isEditMode && (
              <Button variant="default" size="sm" className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            )}
            <Button variant="outline" size="sm">
              Emergency Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Add Palette - Only in Edit Mode */}
      {isEditMode && (
        <div className="border-b bg-muted/30 px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Quick Add:</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('tank')}
            >
              <Droplet className="h-3 w-3" />
              Tank
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('pump')}
            >
              <Power className="h-3 w-3" />
              Pump
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('valve')}
            >
              <Settings className="h-3 w-3" />
              Valve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('sensor')}
            >
              <Thermometer className="h-3 w-3" />
              Sensor
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('heater')}
            >
              <Thermometer className="h-3 w-3" />
              Heater
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8"
              onClick={() => handleQuickAdd('chiller')}
            >
              <Thermometer className="h-3 w-3" />
              Chiller
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              {devices.length} devices
            </div>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-background"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid background - only visible in edit mode */}
          {isEditMode && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted/20" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* Devices */}
          {devices.map((device) => (
            <div
              key={device.id}
              className={`absolute transition-all duration-200 ${
                isEditMode ? 'cursor-move' : 'cursor-pointer'
              } ${draggedDevice === device.id ? 'z-50 scale-105' : 'z-10'}`}
              style={{
                left: device.position.x,
                top: device.position.y,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseDown={(e) => isEditMode ? handleMouseDown(e, device.id) : undefined}
              onClick={() => !draggedDevice && handleDeviceClick(device)}
              onDoubleClick={() => handleDeviceDoubleClick(device)}
            >
              <Card
                className={`w-48 shadow-lg hover:shadow-xl transition-all ${
                  selectedDevice?.id === device.id && !isEditMode ? 'ring-2 ring-primary' : ''
                } ${
                  device.isOn && !isEditMode ? 'bg-primary/5 border-primary' : ''
                } ${
                  isEditMode ? 'hover:ring-2 hover:ring-muted-foreground/50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(device.status)}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Tank Display */}
                  {device.type === 'tank' && (
                    <>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temp:</span>
                          <span className="font-mono">{device.temperature?.toFixed(1)}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-mono">{device.targetTemp?.toFixed(1)}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Level:</span>
                          <span className="font-mono">{device.level}L / {device.capacity}L</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(device.level! / device.capacity!) * 100}%` }}
                        />
                      </div>
                    </>
                  )}

                  {/* Pump Display */}
                  {device.type === 'pump' && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={device.isOn ? 'default' : 'secondary'} className="text-xs">
                          {device.isOn ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      {device.isOn && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Flow:</span>
                          <span className="font-mono">{device.flowRate} L/min</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Valve Display */}
                  {device.type === 'valve' && (
                    <div className="text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Position:</span>
                        <Badge variant={device.isOn ? 'default' : 'secondary'} className="text-xs">
                          {device.isOn ? 'OPEN' : 'CLOSED'}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Sensor Display */}
                  {device.type === 'sensor' && (
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reading:</span>
                        <span className="font-mono">{device.temperature?.toFixed(1)}°F</span>
                      </div>
                    </div>
                  )}

                  {/* Heater Display */}
                  {device.type === 'heater' && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={device.isOn ? 'default' : 'secondary'} className="text-xs">
                          {device.isOn ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-mono">{device.targetTemp?.toFixed(1)}°F</span>
                      </div>
                    </div>
                  )}

                  {/* Chiller Display */}
                  {device.type === 'chiller' && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={device.isOn ? 'default' : 'secondary'} className="text-xs">
                          {device.isOn ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-mono">{device.targetTemp?.toFixed(1)}°F</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Control Panel - Bottom Right (Only in Control Mode) */}
      {!isEditMode && selectedDevice && (
        <div className="absolute bottom-6 right-6 w-96 z-20">
          <Card className="shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(selectedDevice.type)}
                  <CardTitle className="text-base">{selectedDevice.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedDevice(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tank Controls */}
              {selectedDevice.type === 'tank' && (
                <>
                  <div>
                    <Label className="text-sm">Target Temperature</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Slider
                        value={[selectedDevice.targetTemp || 0]}
                        onValueChange={(value) =>
                          setDevices((prev) =>
                            prev.map((d) =>
                              d.id === selectedDevice.id ? { ...d, targetTemp: value[0] } : d
                            )
                          )
                        }
                        min={32}
                        max={212}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-16 text-right">
                        {selectedDevice.targetTemp?.toFixed(1)}°F
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Temp</span>
                      <p className="font-mono text-lg">{selectedDevice.temperature?.toFixed(1)}°F</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Level</span>
                      <p className="font-mono text-lg">{selectedDevice.level}L</p>
                    </div>
                  </div>
                </>
              )}

              {/* Pump Controls */}
              {selectedDevice.type === 'pump' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Power</Label>
                    <Switch
                      checked={selectedDevice.isOn}
                      onCheckedChange={() => handleToggleDevice(selectedDevice.id)}
                    />
                  </div>
                  {selectedDevice.isOn && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground">Flow Rate</span>
                        <p className="font-mono text-2xl">{selectedDevice.flowRate} L/min</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Valve Controls */}
              {selectedDevice.type === 'valve' && (
                <div className="flex items-center justify-between">
                  <Label>Position</Label>
                  <Switch
                    checked={selectedDevice.isOn}
                    onCheckedChange={() => handleToggleDevice(selectedDevice.id)}
                  />
                </div>
              )}

              {/* Heater Controls */}
              {selectedDevice.type === 'heater' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Power</Label>
                    <Switch
                      checked={selectedDevice.isOn}
                      onCheckedChange={() => handleToggleDevice(selectedDevice.id)}
                    />
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm">Target Temperature</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Slider
                        value={[selectedDevice.targetTemp || 0]}
                        onValueChange={(value) =>
                          setDevices((prev) =>
                            prev.map((d) =>
                              d.id === selectedDevice.id ? { ...d, targetTemp: value[0] } : d
                            )
                          )
                        }
                        min={32}
                        max={212}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-16 text-right">
                        {selectedDevice.targetTemp?.toFixed(1)}°F
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Modify device properties and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Device Name</Label>
              <Input
                id="edit-name"
                value={editingDevice.name || ''}
                onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Device Type</Label>
              <Select
                value={editingDevice.type}
                onValueChange={(value) => setEditingDevice({ ...editingDevice, type: value as Device['type'] })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tank">Tank / Vessel</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="valve">Valve</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="heater">Heater</SelectItem>
                  <SelectItem value="chiller">Chiller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-pos-x">Position X</Label>
                <Input
                  id="edit-pos-x"
                  type="number"
                  value={editingDevice.position?.x || 0}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      position: { ...editingDevice.position!, x: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-pos-y">Position Y</Label>
                <Input
                  id="edit-pos-y"
                  type="number"
                  value={editingDevice.position?.y || 0}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      position: { ...editingDevice.position!, y: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
            {editingDevice.type === 'tank' && (
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity (L)</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editingDevice.capacity || 1000}
                  onChange={(e) =>
                    setEditingDevice({ ...editingDevice, capacity: parseInt(e.target.value) })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleDeleteDevice(editingDevice.id!)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Device Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Add a new device to the control panel canvas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                placeholder="e.g., HLT Temperature Sensor"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select
                value={newDevice.type}
                onValueChange={(value) => setNewDevice({ ...newDevice, type: value as Device['type'] })}
              >
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tank">Tank / Vessel</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="valve">Valve</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="heater">Heater</SelectItem>
                  <SelectItem value="chiller">Chiller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pos-x">Position X</Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={newDevice.position?.x || 300}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      position: { ...newDevice.position!, x: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pos-y">Position Y</Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={newDevice.position?.y || 300}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      position: { ...newDevice.position!, y: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDevice}>Add Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
