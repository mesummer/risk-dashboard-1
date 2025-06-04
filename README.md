# RiskSteward Parameter Updates Dashboard

A modern React TypeScript dashboard for monitoring parameter updates across DeFi protocols. Built for real-time visualization of manual and automated parameter changes in risk management systems.

## ✨ Features

- **Real-time Updates Timeline**: Chronological display of all parameter updates
- **Advanced Filtering**: Filter by status, steward type, network, and search functionality
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Rich Data Visualization**: Color-coded cards showing update details
- **Network Support**: Multi-network support (Ethereum, Polygon, Arbitrum, etc.)
- **Parameter Types**: Support for all major DeFi parameters (Supply Cap, LTV, etc.)

## 🛠️ Tech Stack

- **React 18** - Modern React with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting and manipulation
- **clsx** - Conditional CSS classes
- **TypeScript** - Type safety and better developer experience

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Badge, etc.)
│   ├── updates/      # Update-related components
│   │   ├── UpdateCard.tsx
│   │   └── UpdatesTimeline.tsx
│   └── layout/       # Layout components
│       └── Header.tsx
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── data/             # Mock data and data helpers
└── App.tsx          # Main application component
```

## 🎨 Design System

### Colors
- **Manual Steward**: Blue theme (`text-manual-600`, `bg-manual-50`)
- **Automated Steward**: Green theme (`text-automated-600`, `bg-automated-50`)
- **Success**: Green accents
- **Failed**: Red accents
- **Pending**: Yellow accents

### Components
- **UpdateCard**: Displays individual parameter updates
- **UpdatesTimeline**: Main timeline view with filtering
- **Header**: Dashboard header with summary statistics
- **Badge**: Reusable status indicators

## 📊 Data Types

### Parameter Types Supported
- Supply Cap
- Borrow Cap
- uOptimal
- Base Rate
- Slope1/Slope2
- LTV (Loan-to-Value)
- LT (Liquidation Threshold)
- LB (Liquidation Bonus)
- E Mode parameters
- Pendle Capo Discount Rate
- Capo Price Caps

### Networks Supported
- Ethereum
- Polygon
- Arbitrum
- Optimism
- Base

## 🔧 Development

### Adding New Parameter Types
1. Update the `ParameterType` union in `src/types/index.ts`
2. Add value generation logic in `src/data/mockData.ts`
3. Update any relevant UI components

### Adding New Networks
1. Add the network to the `networks` array in `src/data/mockData.ts`
2. Include appropriate chain ID and icon

### Customizing Styles
The project uses Tailwind CSS with custom color extensions for manual/automated themes. Modify `tailwind.config.js` to adjust the design system.

## 🚀 Deployment

The project is configured for easy deployment on platforms like Vercel, Netlify, or any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder

## 📱 Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Collapsible filters on mobile
- Optimized card layouts
- Touch-friendly interactions

## 🎯 Future Enhancements

- Real-time WebSocket integration
- Advanced analytics and charts
- Export functionality
- Dark mode support
- User authentication
- Parameter change notifications
- Historical trend analysis

## 📄 License

MIT License - see LICENSE file for details.