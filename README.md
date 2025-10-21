# Frontwind LLC Invoice Generator

A modern invoice generator with database-backed user preferences. Users can generate professional PDF invoices with their banking details automatically saved and synced across sessions.

## Features

- **Browser-based PDF generation** using pdf-lib
- **Automatic data persistence** - saves to both browser cache and database
- **No login required** - unique ID stored in browser
- **Multi-page invoice support** with smart text wrapping
- **Regional banking support** - US (ACH/Wire) and International (SWIFT/IBAN)
- **Multiple payment types** - Per Item, Salary, Bonus, Custom
- **Dark theme UI** with Tailwind CSS

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **PDF Generation**: pdf-lib (client-side)
- **Hosting**: Railway (recommended)

## Project Structure

```
invoicer/
├── server/
│   └── index.js           # Express API server
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── index.html         # Frontend application
├── package.json
├── Procfile              # Railway deployment config
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running

### Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/invoicer"
   NODE_ENV="development"
   PORT=3000
   ```

3. **Initialize the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Railway Deployment

### Quick Deploy

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Install Railway CLI** (optional but recommended)
   ```bash
   npm install -g @railway/cli
   ```

3. **Login to Railway**
   ```bash
   railway login
   ```

4. **Initialize project**
   ```bash
   railway init
   ```

5. **Add PostgreSQL database**
   - Go to your Railway project dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` environment variable

6. **Deploy from GitHub**
   - Connect your GitHub repository to Railway
   - Railway will auto-detect the Node.js project
   - The Procfile will handle database setup and app start

   **OR deploy from CLI:**
   ```bash
   railway up
   ```

7. **Verify deployment**
   - Railway will provide a URL (e.g., `your-app.railway.app`)
   - Visit the URL to see your deployed app

### Manual Railway Setup

If Railway doesn't auto-detect properly:

1. **Set build command:**
   ```
   npm install && npx prisma generate
   ```

2. **Set start command:**
   ```
   npm start
   ```

3. **Add environment variable:**
   - `DATABASE_URL` - Auto-added when you provision PostgreSQL
   - `NODE_ENV` - Set to `production`
   - `PORT` - Railway sets this automatically

### Environment Variables

Railway automatically provides:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - App port (usually 3000)

You may want to add:
- `NODE_ENV` - Set to `production`

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Initialize User
```
POST /api/user/init
```
Generates a unique user ID

### Save User Data
```
POST /api/user/save
Body: {
  userId: string,
  data: {
    fullName, discordTag, department, paymentRegion,
    usAddress, usCity, ... (all form fields)
  }
}
```

### Load User Data
```
GET /api/user/:userId
```
Returns saved user data

## How It Works

### User Flow

1. **First Visit**
   - Unique user ID generated via `/api/user/init`
   - ID stored in browser localStorage
   - No login required

2. **Fill Invoice Form**
   - User enters personal info, banking details, line items
   - Can add up to 20 line items with different payment types

3. **Save Defaults**
   - When "Save Defaults" is checked on PDF generation
   - Data saved to both:
     - Browser localStorage (fast access)
     - PostgreSQL database (persistent backup)

4. **Return Visit**
   - Browser ID retrieved from localStorage
   - Data loaded from database via API
   - Falls back to localStorage if API unavailable
   - Form auto-populated with saved data

5. **Generate PDF**
   - PDF created client-side using pdf-lib
   - No sensitive data sent to server for PDF generation
   - Professional invoice with all banking details

### Data Sync Strategy

```
Browser Cache (localStorage)  ←→  Database (PostgreSQL)
         ↓                              ↓
    Fast access                  Persistent backup
    Instant load                 Sync across devices/browsers
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  userId    String   @unique  // Browser-generated ID
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Basic Info
  fullName     String?
  discordTag   String?
  department   String?
  paymentRegion String?

  // US Banking (15 fields)
  // International Banking (14 fields)
}
```

## Security Considerations

- **No passwords** - Browser ID is private to each user's device
- **No authentication** - Assumes trusted users only
- **Data encryption** - Use HTTPS in production (Railway provides SSL)
- **Input sanitization** - All user input is escaped before PDF generation
- **Database isolation** - Each user has unique UUID-based record

## Troubleshooting

### Database connection fails
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL is running
- Run `npm run db:push` to sync schema

### PDF generation not working
- Check browser console for errors
- Verify pdf-lib CDN is loading
- Try the HTML fallback (double-click Submit button)

### Data not saving
- Check `/api/health` endpoint is accessible
- Verify browser console for API errors
- Check Railway logs: `railway logs`

### Railway deployment issues
- Verify Procfile exists
- Check Railway build logs
- Ensure PostgreSQL database is provisioned
- Run `railway logs` to see runtime errors

## Development Commands

```bash
npm run dev         # Start dev server with auto-reload
npm start           # Start production server
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio (database GUI)
```

## Invoice Features

### Payment Types
- **PER_ITEM** - Video content with approval dates
- **SALARY** - Monthly services rendered
- **BONUS** - Performance-based payments
- **CUSTOM** - Free-form descriptions

### Regional Support
- **United States** - ACH/Wire with routing numbers
- **International** - SWIFT/IBAN with country-specific validation

### PDF Output
- A4 page size
- Professional layout
- Multi-page support
- Automatic text wrapping
- Email submission instructions

## Contributing

This is a private tool for Frontwind LLC. For issues or feature requests, contact the development team.

## License

Proprietary - Frontwind LLC

---

**Deployed with Railway** 🚂
