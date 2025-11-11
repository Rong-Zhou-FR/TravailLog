# TravailLog

A Next.js application for tracking work hours with **zero server-side storage**. All data is stored locally in your browser.

## Features

### 📅 Calendar View
- Monthly calendar displaying all days of the current month
- Navigate to any past or future month
- Quick "Today" button to return to current month
- Visual indication of days with recorded shifts

### ⏰ Shift Management
- Add multiple shifts per day
- Record start and end times for each shift (from x time to y time)
- Track in-shift pauses in minutes
- Edit or delete shifts at any time
- Real-time calculation of work hours per day

### 📊 Statistics
- Monthly total work time **with pauses** included
- Monthly total work time **without pauses** (excluding pause durations)
- Automatic updates as you add or edit shifts
- Clear display of hours and minutes worked

### 💾 Data Management
- **Zero server-side storage** - all data is stored in your browser's localStorage
- **Export** your data as JSON to save your progress
- **Import** previously exported JSON files to restore your data
- Perfect for backups or transferring data between browsers

### 🎨 User Interface
- Clean, modern design using Tailwind CSS
- Dark mode support
- Responsive layout that works on mobile and desktop
- Intuitive interface with built-in usage instructions

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rong-Zhou-FR/TravailLog.git
cd TravailLog
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How to Use

1. **Add a Shift**: Click the **+** button on any day to expand it
2. **Configure the Shift**: 
   - Set start time (e.g., 09:00)
   - Set end time (e.g., 17:00)
   - Add pause duration in minutes (e.g., 30 for a 30-minute lunch break)
3. **Multiple Shifts**: Click "Add Shift" to add more shifts to the same day
4. **View Statistics**: Monthly totals update automatically at the top
5. **Navigate Months**: Use Previous/Next buttons or "Today" to jump to current month
6. **Export Data**: Click "Export JSON" to save your data
7. **Import Data**: Click "Import JSON" to restore from a backup

## Technical Stack

- **Framework**: Next.js 16.0.2-canary (with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: React 19.2.0
- **Storage**: Browser localStorage (no backend required)

## Privacy & Security

- ✅ **Zero server-side storage** - your data never leaves your browser
- ✅ No tracking or analytics
- ✅ No external API calls
- ✅ Complete data ownership - export your data anytime

## Troubleshooting

### Development Server Issues

If you encounter Turbopack-related errors when running `npm run dev`, try the following:

1. **Clean build cache**:
   ```bash
   npm run clean
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Optional: Disable disk cache** (if issues persist):
   ```bash
   # Create a .env.local file with:
   NEXT_PRIVATE_SKIP_DISK_CACHE=1
   ```

The project uses Next.js 16.0.2-canary which includes fixes for Turbopack stability issues found in earlier versions.

## License

This project is licensed under the terms found in the [LICENSE](LICENSE) file.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
