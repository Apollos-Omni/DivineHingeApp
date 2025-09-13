# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DivineHingeApp is a React Native/Expo application for controlling smart door hinges with gaming elements, avatar systems, and vision tracking. The app integrates with Supabase for backend services and can interface with hardware components (Raspberry Pi sensors).

## Common Commands

### Development

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version

### Building & Deployment

- `eas build --platform android` - Build Android APK/AAB
- `eas build --platform ios` - Build iOS app
- `eas build --platform all` - Build for all platforms
- `eas submit` - Submit to app stores

### Maintenance

- `npm audit:prod` - Audit production dependencies
- `npm audit:all` - Audit all dependencies

## Code Architecture

### State Management

The app uses **Zustand** for state management with multiple stores:

- `hingeStore.ts` - Core hinge/door state with persistence
- `userStore.ts` - User profile and authentication state
- `deviceState.ts` - Hardware device management
- `avatarState.ts` - Avatar/gaming system state

### Navigation Structure

React Navigation stack navigator with auth gates:

- **AuthStack**: Login/Register screens
- **AppStack**: Main app screens (HomeScreen, DoorHubScreen, etc.)
- Authentication handled via `AuthProvider.tsx` with Supabase

### Key Modules

#### Authentication (`src/auth/`)

- Uses Supabase Auth with custom AuthProvider wrapper
- Handles login, registration, and session management
- Type-safe auth hooks and utilities

#### Hardware Integration (`src/hardware/`)

- Raspberry Pi GPIO, I2C, serial communication interfaces
- Sensor data collection and processing
- Hardware abstraction layer for cross-platform compatibility

#### Game Engine (`src/game/`)

- Real-time game loop with sensor integration
- Player state management and anomaly detection
- Physics and rendering system

#### Vision System (`src/vision/`)

- Vision tracking and management engine
- Status-based vision workflow (Draft → Active → Completed)
- Integration with user karma and avatar systems

#### Database Layer (`src/database/`)

- Supabase client configuration
- Typed schemas for all data models (HingeEvent, UserProfile, KarmaRecord, etc.)
- Data mappers and query utilities

### Environment Configuration

- Uses `react-native-dotenv` for environment variables
- Required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- TypeScript declarations in `.env.d.ts`

### Build Configuration

- **Metro**: Configured for SVG support via `react-native-svg-transformer`
- **Babel**: Includes dotenv plugin and Reanimated plugin (must be last)
- **EAS**: Production builds use Node 20.19.2, supports development/preview/production profiles

## Development Guidelines

### File Structure

- UI components organized by feature in `src/ui/`
- Business logic separated into `src/services/`
- Hardware abstractions in `src/hardware/`
- Type definitions centralized in `src/types/`

### State Updates

- Use Zustand stores for global state
- Persist critical data (hinge status, user preferences)
- Follow immutable update patterns in store actions

### Hardware Development

- Mock hardware interfaces when developing without Pi
- Use `HardwareInterface` abstraction for platform-agnostic code
- Test sensor integration with mock data first

### Authentication Flow

- All authenticated routes protected by AuthProvider
- Use `useAuth()` hook for user state and auth actions
- Handle loading states during session initialization

### API Integration

- Supabase client configured in `src/database/dbClient.ts`
- Edge functions available via `src/services/functions.ts`
- Follow schema definitions in `src/database/schemas.ts`
