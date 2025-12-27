# BevForge OS Control Panel - Database Schema Design

## Overview
This document defines the complete database schema for the OS Control Panel system, including device tiles, hardware endpoints, telemetry, safety interlocks, and audit logging.

## Design Principles
1. **Separation of Concerns**: Device configuration (layout) vs runtime state (telemetry)
2. **Hardware Abstraction**: Tiles reference hardware endpoints, not physical pins directly
3. **Extensibility**: JSON fields for device-specific configurations
4. **Safety First**: Interlock rules stored and enforced at database level
5. **Audit Everything**: Complete command/response logging
6. **Time-Series Ready**: Telemetry tables optimized for time-series queries

---

## Table Definitions

### 1. `controller_nodes`
**Purpose**: Physical hardware controllers (Raspberry Pi, Arduino, ESP32, etc.)

```typescript
interface ControllerNode {
  id: number;
  nodeId: string;              // Unique identifier (e.g., "pi-brewhouse-01")
  name: string;                // Human-readable name
  nodeType: string;            // "raspberry_pi", "esp32", "arduino", "io_hub"
  ipAddress: string | null;    // Network address
  macAddress: string | null;   // Hardware MAC
  firmwareVersion: string | null;
  
  // Status
  status: 'online' | 'offline' | 'fault' | 'maintenance';
  lastSeen: Date | null;       // Last heartbeat
  lastHeartbeat: Date | null;  // Last successful ping
  
  // Capabilities
  capabilities: {
    digitalOutputs?: number;   // Number of digital output channels
    digitalInputs?: number;    // Number of digital input channels
    pwmOutputs?: number;       // Number of PWM-capable outputs
    analogInputs?: number;     // Number of analog input channels
    oneWireBus?: boolean;      // DS18B20 support
    i2cBus?: boolean;          // I2C device support
    spiBus?: boolean;          // SPI device support
    bleBluetooth?: boolean;    // BLE support (for Tilt)
  };
  
  // Configuration
  config: {
    pollingIntervalMs?: number;
    timeoutMs?: number;
    retryAttempts?: number;
    failsafeMode?: 'all_off' | 'hold_last' | 'custom';
  };
  
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: `nodeId` (unique), `status`, `isActive`

---

### 2. `hardware_endpoints`
**Purpose**: Individual I/O channels on controller nodes

```typescript
interface HardwareEndpoint {
  id: number;
  controllerId: number;        // FK to controller_nodes
  channelId: string;           // Physical identifier ("GPIO17", "PIN_A0", "1WIRE_0")
  channelType: EndpointType;
  
  // Capability
  direction: 'input' | 'output' | 'bidirectional';
  dataType: 'digital' | 'analog' | 'pwm' | 'pulse' | 'onewire' | 'i2c' | 'ble';
  
  // Configuration
  config: {
    // Digital output
    invertLogic?: boolean;     // True = active low
    
    // PWM output
    pwmFrequencyHz?: number;
    pwmResolutionBits?: number;
    
    // Analog input
    adcResolutionBits?: number;
    voltageRangeMin?: number;
    voltageRangeMax?: number;
    
    // Pulse input (flow meter)
    pulsesPerUnit?: number;    // Pulses per gallon/liter
    debounceMs?: number;
    
    // Temperature sensor
    sensorAddress?: string;    // 1-Wire address
    offsetCalibration?: number;
    
    // BLE device
    bleAddress?: string;       // MAC address
    bleServiceUuid?: string;
  };
  
  // Status
  status: 'ok' | 'fault' | 'disconnected' | 'calibrating';
  lastRead: Date | null;
  lastWrite: Date | null;
  
  // Current value (cached for quick access)
  currentValue: number | boolean | string | null;
  currentValueUpdatedAt: Date | null;
  
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type EndpointType = 
  | 'digital_output'    // Relay, solenoid
  | 'digital_input'     // Switch, float, e-stop
  | 'pwm_output'        // SSR, VFD speed control
  | 'analog_input'      // Pressure transducer, level sensor
  | 'pulse_input'       // Flow meter
  | 'onewire_temp'      // DS18B20 temperature probe
  | 'ble_tilt'          // Tilt hydrometer
  | 'i2c_device'        // Generic I2C sensor
  | 'modbus_device';    // Modbus RTU/TCP device
```

**Indexes**: `controllerId`, `channelType`, `status`, `isActive`

---

### 3. `device_tiles`
**Purpose**: Virtual devices on the control panel canvas

```typescript
interface DeviceTile {
  id: number;
  tileId: string;              // Unique identifier ("vessel-fv01", "pump-p1")
  name: string;                // Display name
  tileType: TileType;
  
  // Canvas position (for Device Layout page)
  positionX: number | null;
  positionY: number | null;
  width: number | null;        // Tile dimensions
  height: number | null;
  
  // Visual
  iconName: string | null;     // Lucide icon name
  colorTheme: string | null;   // Color override
  
  // Type-specific configuration
  config: TileConfig;          // JSON - see TileConfig types below
  
  // Status
  status: 'operational' | 'warning' | 'error' | 'offline' | 'maintenance';
  
  // Grouping
  groupId: number | null;      // FK to device_groups (for manifolds, etc.)
  parentTileId: number | null; // For nested tiles (sensor inside vessel)
  
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type TileType =
  | 'vessel'           // Fermenter, brite, tote, keg
  | 'temp_sensor'      // DS18B20 probe
  | 'gravity_sensor'   // Tilt hydrometer
  | 'flow_meter'       // Hall-effect flow meter
  | 'pump'             // Transfer pump
  | 'valve'            // Solenoid or motorized valve
  | 'relay_ssr'        // Generic relay/SSR output
  | 'digital_input'    // Switch, float, e-stop
  | 'analog_input';    // Generic analog sensor

// Type-specific configurations
type TileConfig = 
  | VesselConfig
  | TempSensorConfig
  | GravitySensorConfig
  | FlowMeterConfig
  | PumpConfig
  | ValveConfig
  | RelaySSRConfig
  | DigitalInputConfig
  | AnalogInputConfig;

interface VesselConfig {
  vesselType: 'fermenter' | 'brite' | 'tote' | 'keg' | 'barrel' | 'generic';
  capacity: number;
  capacityUnit: string;
  
  // Associated sensors (FK to device_tiles)
  primaryTempSensorId?: number;
  secondaryTempSensorId?: number;
  gravitySensorId?: number;
  levelSensorId?: number;
  pressureSensorId?: number;
  phSensorId?: number;
  
  // Associated actuators (FK to device_tiles)
  coolingOutputId?: number;    // SSR/relay for cooling
  heatingOutputId?: number;    // SSR/relay for heating
  mixerOutputId?: number;      // Agitator/mixer
  
  // Virtual PID data (stored but not used by OS)
  pidConfig?: {
    enabled: boolean;
    setpoint?: number;
    kp?: number;
    ki?: number;
    kd?: number;
    outputMin?: number;
    outputMax?: number;
    cycleTimeSeconds?: number;
    minOnTimeSeconds?: number;
    minOffTimeSeconds?: number;
  };
  
  // Alarm thresholds
  alarms?: {
    tempHighC?: number;
    tempLowC?: number;
    pressureHighPsi?: number;
    levelLowPct?: number;
  };
}

interface TempSensorConfig {
  sensorType: 'ds18b20' | 'thermocouple' | 'rtd' | 'analog';
  unit: 'C' | 'F';
  offsetCalibration?: number;
  smoothingWindow?: number;    // Number of readings to average
  alarmHighC?: number;
  alarmLowC?: number;
}

interface GravitySensorConfig {
  sensorType: 'tilt' | 'ispindel' | 'manual';
  color?: string;              // Tilt color (red, green, etc.)
  smoothingWindow?: number;
  calibrationPoints?: Array<{  // Calibration curve
    raw: number;
    actual: number;
  }>;
}

interface FlowMeterConfig {
  meterType: 'hall_effect' | 'turbine' | 'paddlewheel';
  pulsesPerUnit: number;
  unit: 'gal' | 'L';
  totalizer: {
    sessionTotal: number;
    lifetimeTotal: number;
  };
}

interface PumpConfig {
  pumpType: 'centrifugal' | 'diaphragm' | 'peristaltic' | 'gear';
  hasSpeedControl: boolean;    // PWM/VFD capable
  isReversible: boolean;
  
  // Flow path
  sourceVesselId?: number;     // FK to vessel tile
  destVesselId?: number;       // FK to vessel tile
  flowMeterId?: number;        // FK to flow meter tile
  
  // Associated valves (for line selection)
  valveIds?: number[];         // FK to valve tiles
  
  // Safety
  maxRunTimeSeconds?: number;  // Auto-shutoff
  dryRunProtection?: boolean;
}

interface ValveConfig {
  valveType: 'solenoid' | 'motorized' | 'pneumatic';
  isProportional: boolean;     // 0-100% control
  
  // Manifold
  manifoldGroupId?: number;    // FK to device_groups
  mutualExclusion?: boolean;   // Only one valve open at a time
  
  // Position feedback
  hasPositionSensor: boolean;
  openTimeoutSeconds?: number;
  closeTimeoutSeconds?: number;
}

interface RelaySSRConfig {
  outputType: 'relay' | 'ssr';
  isPwmCapable: boolean;
  
  // Load info
  loadType?: 'heater' | 'cooler' | 'pump' | 'solenoid' | 'light' | 'fan' | 'other';
  loadWatts?: number;
  loadAmps?: number;
  
  // PWM settings (if SSR)
  pwmFrequencyHz?: number;
  minDutyCycle?: number;
  maxDutyCycle?: number;
  
  // Protection
  minOnTimeSeconds?: number;
  minOffTimeSeconds?: number;
}

interface DigitalInputConfig {
  inputType: 'switch' | 'float' | 'door' | 'estop' | 'limit' | 'proximity';
  normalState: 'open' | 'closed'; // Normal operating state
  invertLogic: boolean;
  debounceMs: number;
  
  // For safety interlocks
  isSafetyInput: boolean;
  safetyAction?: 'estop_all' | 'stop_group' | 'alarm_only';
}

interface AnalogInputConfig {
  sensorType: 'pressure' | 'level' | 'ph' | 'voltage' | 'current' | 'generic';
  unit: string;
  
  // Scaling
  rawMin: number;
  rawMax: number;
  scaledMin: number;
  scaledMax: number;
  
  // Alarms
  alarmHigh?: number;
  alarmLow?: number;
}
```

**Indexes**: `tileId` (unique), `tileType`, `status`, `groupId`, `parentTileId`, `isActive`

---

### 4. `tile_endpoint_bindings`
**Purpose**: Map device tiles to hardware endpoints

```typescript
interface TileEndpointBinding {
  id: number;
  tileId: number;              // FK to device_tiles
  endpointId: number;          // FK to hardware_endpoints
  bindingType: BindingType;
  
  // For tiles with multiple endpoints
  role: string | null;         // "primary_temp", "cooling_output", "inlet_valve"
  
  // Scaling/transformation
  transform: {
    scale?: number;
    offset?: number;
    invert?: boolean;
    formula?: string;          // For complex transformations
  } | null;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type BindingType = 'read_pv' | 'write_output' | 'read_status';
```

**Indexes**: `tileId`, `endpointId`, `bindingType`, `isActive`
**Unique Constraint**: `(tileId, endpointId, role)`

---

### 5. `device_groups`
**Purpose**: Logical grouping of devices (manifolds, process zones, etc.)

```typescript
interface DeviceGroup {
  id: number;
  name: string;
  groupType: 'manifold' | 'process_zone' | 'safety_zone' | 'custom';
  
  // Rules
  rules: {
    mutualExclusion?: boolean;   // Only one device active at a time
    sequenceRequired?: boolean;  // Devices must activate in order
    interlockGroupId?: number;   // FK to another group
  };
  
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: `groupType`, `isActive`

---

### 6. `telemetry_readings`
**Purpose**: Time-series process values (temperatures, gravity, flow, etc.)

```typescript
interface TelemetryReading {
  id: number;
  timestamp: Date;             // Reading timestamp
  tileId: number;              // FK to device_tiles
  endpointId: number | null;   // FK to hardware_endpoints (optional)
  
  // Value
  value: number | boolean | string;
  unit: string | null;
  
  // Quality
  quality: 'good' | 'uncertain' | 'bad';
  qualityReason: string | null; // "sensor_fault", "out_of_range", etc.
  
  // Context
  batchId: number | null;      // FK to batches (if applicable)
  
  createdAt: Date;             // When record was inserted
}
```

**Indexes**: `timestamp` (DESC), `tileId`, `batchId`, `quality`
**Partitioning**: Consider partitioning by timestamp (monthly) for large datasets

---

### 7. `command_log`
**Purpose**: Audit log of all manual commands and automation actions

```typescript
interface CommandLog {
  id: number;
  timestamp: Date;
  
  // Command details
  commandType: 'manual' | 'automation' | 'safety' | 'system';
  action: string;              // "set_output", "start_pump", "open_valve", "estop"
  
  // Target
  tileId: number | null;       // FK to device_tiles
  endpointId: number | null;   // FK to hardware_endpoints
  
  // Command data
  commandData: {
    targetValue?: number | boolean;
    previousValue?: number | boolean;
    duration?: number;         // For timed operations
    reason?: string;
  };
  
  // Result
  status: 'pending' | 'success' | 'failed' | 'blocked';
  failureReason: string | null; // "interlock_active", "device_offline", etc.
  
  // Attribution
  initiatedBy: string;         // User ID or "system" or "automation"
  initiatedFrom: string | null; // "control_panel", "api", "recipe_step"
  
  // Safety
  interlockCheckPassed: boolean;
  interlockDetails: string | null;
  
  createdAt: Date;
}
```

**Indexes**: `timestamp` (DESC), `tileId`, `commandType`, `status`, `initiatedBy`

---

### 8. `safety_interlocks`
**Purpose**: Define safety rules that can block commands

```typescript
interface SafetyInterlock {
  id: number;
  name: string;
  description: string;
  
  // Scope
  interlockType: 'estop' | 'permissive' | 'conditional' | 'timer';
  priority: number;            // Higher = more critical
  
  // Condition
  condition: {
    // Input-based
    inputTileId?: number;      // FK to device_tiles (digital input)
    requiredState?: boolean;   // Required state to allow action
    
    // State-based
    targetTileId?: number;     // Tile being protected
    targetState?: string;      // "must_be_off", "must_be_closed"
    
    // Timer-based
    minOffTimeSeconds?: number;
    minOnTimeSeconds?: number;
    
    // Complex logic (future)
    expression?: string;       // "(input1 AND input2) OR NOT input3"
  };
  
  // Action
  affectedTiles: number[];     // FK array to device_tiles
  blockActions: string[];      // ["turn_on", "open", "start"]
  
  // Response
  onViolation: 'block' | 'alarm' | 'force_off';
  alarmMessage: string | null;
  
  // Status
  isActive: boolean;
  lastTriggered: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: `interlockType`, `priority`, `isActive`

---

### 9. `device_state_history`
**Purpose**: Track state changes for devices (on/off, open/closed, etc.)

```typescript
interface DeviceStateHistory {
  id: number;
  timestamp: Date;
  tileId: number;              // FK to device_tiles
  
  // State change
  previousState: string | number | boolean;
  newState: string | number | boolean;
  
  // Context
  changeReason: 'manual' | 'automation' | 'safety' | 'timeout' | 'fault';
  commandLogId: number | null; // FK to command_log
  
  // Duration tracking
  durationSeconds: number | null; // How long previous state lasted
  
  createdAt: Date;
}
```

**Indexes**: `timestamp` (DESC), `tileId`, `changeReason`

---

### 10. `alarm_events`
**Purpose**: Track alarm conditions and acknowledgments

```typescript
interface AlarmEvent {
  id: number;
  timestamp: Date;
  
  // Source
  tileId: number | null;       // FK to device_tiles
  alarmType: 'high' | 'low' | 'fault' | 'offline' | 'safety' | 'custom';
  severity: 'info' | 'warning' | 'critical';
  
  // Details
  message: string;
  value: number | string | null; // Actual value that triggered alarm
  threshold: number | string | null; // Threshold that was exceeded
  
  // Status
  status: 'active' | 'acknowledged' | 'cleared' | 'suppressed';
  acknowledgedBy: string | null;
  acknowledgedAt: Date | null;
  clearedAt: Date | null;
  
  // Context
  batchId: number | null;      // FK to batches
  
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes**: `timestamp` (DESC), `tileId`, `status`, `severity`, `alarmType`

---

## Relationships Summary

```
controller_nodes (1) ──→ (N) hardware_endpoints

device_tiles (1) ──→ (N) tile_endpoint_bindings ←── (N) hardware_endpoints
device_tiles (1) ──→ (N) telemetry_readings
device_tiles (1) ──→ (N) command_log
device_tiles (1) ──→ (N) device_state_history
device_tiles (1) ──→ (N) alarm_events

device_tiles (N) ──→ (1) device_groups
device_tiles (N) ──→ (1) device_tiles (parent/child)

safety_interlocks (N) ──→ (N) device_tiles (affected tiles)

batches (1) ──→ (N) telemetry_readings
batches (1) ──→ (N) alarm_events
```

---

## Migration Strategy

1. **Phase 1a**: Create controller_nodes, hardware_endpoints tables
2. **Phase 1b**: Create device_tiles, tile_endpoint_bindings tables
3. **Phase 1c**: Create device_groups table
4. **Phase 1d**: Create telemetry_readings, command_log tables
5. **Phase 1e**: Create safety_interlocks, device_state_history, alarm_events tables

---

## Data Retention Policies

- **telemetry_readings**: Keep 90 days at full resolution, then downsample to hourly averages
- **command_log**: Keep 1 year, then archive
- **device_state_history**: Keep 1 year, then archive
- **alarm_events**: Keep indefinitely (or until acknowledged + 1 year)

---

## Next Steps

1. ✅ Review this schema design
2. ⏳ Implement Drizzle schema definitions
3. ⏳ Generate and run migrations
4. ⏳ Create TypeScript types
5. ⏳ Build seed data for testing
