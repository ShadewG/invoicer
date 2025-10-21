import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate new user ID
app.post('/api/user/init', async (req, res) => {
  try {
    const userId = nanoid(21); // Generate unique ID

    const user = await prisma.user.create({
      data: { userId }
    });

    res.json({ userId: user.userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to initialize user' });
  }
});

// Save user defaults
app.post('/api/user/save', async (req, res) => {
  try {
    const { userId, data } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const user = await prisma.user.upsert({
      where: { userId },
      update: {
        fullName: data.fullName,
        discordTag: data.discordTag,
        department: data.department,
        paymentRegion: data.paymentRegion,

        // US Banking
        usAddress: data.usAddress,
        usCity: data.usCity,
        usState: data.usState,
        usZip: data.usZip,
        usBankName: data.usBankName,
        usAccountName: data.usAccountName,
        usRoutingNumber: data.usRoutingNumber,
        usAccountNumber: data.usAccountNumber,
        usAccountType: data.usAccountType,
        usAccountSubtype: data.usAccountSubtype,
        usTransferType: data.usTransferType,

        // International Banking
        intlCountry: data.intlCountry,
        intlAddress: data.intlAddress,
        intlCity: data.intlCity,
        intlProvince: data.intlProvince,
        intlPostalCode: data.intlPostalCode,
        intlPhone: data.intlPhone,
        intlAccountName: data.intlAccountName,
        intlBankName: data.intlBankName,
        intlBankAddress: data.intlBankAddress,
        intlCurrency: data.intlCurrency,
        intlSwiftBic: data.intlSwiftBic,
        intlAccountNumber: data.intlAccountNumber,
        intlIban: data.intlIban,
        intlOtherInfo: data.intlOtherInfo,
      },
      create: {
        userId,
        fullName: data.fullName,
        discordTag: data.discordTag,
        department: data.department,
        paymentRegion: data.paymentRegion,

        // US Banking
        usAddress: data.usAddress,
        usCity: data.usCity,
        usState: data.usState,
        usZip: data.usZip,
        usBankName: data.usBankName,
        usAccountName: data.usAccountName,
        usRoutingNumber: data.usRoutingNumber,
        usAccountNumber: data.usAccountNumber,
        usAccountType: data.usAccountType,
        usAccountSubtype: data.usAccountSubtype,
        usTransferType: data.usTransferType,

        // International Banking
        intlCountry: data.intlCountry,
        intlAddress: data.intlAddress,
        intlCity: data.intlCity,
        intlProvince: data.intlProvince,
        intlPostalCode: data.intlPostalCode,
        intlPhone: data.intlPhone,
        intlAccountName: data.intlAccountName,
        intlBankName: data.intlBankName,
        intlBankAddress: data.intlBankAddress,
        intlCurrency: data.intlCurrency,
        intlSwiftBic: data.intlSwiftBic,
        intlAccountNumber: data.intlAccountNumber,
        intlIban: data.intlIban,
        intlOtherInfo: data.intlOtherInfo,
      },
    });

    res.json({
      success: true,
      userId: user.userId,
      savedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Load user defaults
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without internal IDs
    const userData = {
      fullName: user.fullName,
      discordTag: user.discordTag,
      department: user.department,
      paymentRegion: user.paymentRegion,

      // US Banking
      usAddress: user.usAddress,
      usCity: user.usCity,
      usState: user.usState,
      usZip: user.usZip,
      usBankName: user.usBankName,
      usAccountName: user.usAccountName,
      usRoutingNumber: user.usRoutingNumber,
      usAccountNumber: user.usAccountNumber,
      usAccountType: user.usAccountType,
      usAccountSubtype: user.usAccountSubtype,
      usTransferType: user.usTransferType,

      // International Banking
      intlCountry: user.intlCountry,
      intlAddress: user.intlAddress,
      intlCity: user.intlCity,
      intlProvince: user.intlProvince,
      intlPostalCode: user.intlPostalCode,
      intlPhone: user.intlPhone,
      intlAccountName: user.intlAccountName,
      intlBankName: user.intlBankName,
      intlBankAddress: user.intlBankAddress,
      intlCurrency: user.intlCurrency,
      intlSwiftBic: user.intlSwiftBic,
      intlAccountNumber: user.intlAccountNumber,
      intlIban: user.intlIban,
      intlOtherInfo: user.intlOtherInfo,

      savedAt: user.updatedAt,
    };

    res.json(userData);
  } catch (error) {
    console.error('Error loading user data:', error);
    res.status(500).json({ error: 'Failed to load user data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});
