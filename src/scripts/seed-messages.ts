import { ChatMessage } from '@/types/db';
import { initDB } from '@/lib/db/index';

// Wrote this script to populate the database with messages for testing. Might be useful in the future.

const generateMessage = (index: number, isUser: boolean): ChatMessage => ({
  id: `test-${index}`,
  role: isUser ? 'user' : 'assistant',
  content: isUser
    ? `Test question ${index}`
    : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. This is a long response ${index}`,
  timestamp: Date.now() + index,
});

const seedMessages = async (count: number = 100) => {
  const db = await initDB();

  await db.clear('messages');

  for (let i = 0; i < count; i++) {
    const message = generateMessage(i, i % 2 === 0);
    await db.put('messages', message);
    console.log(`Added message ${i + 1}/${count}`);
  }

  console.log('Seeding complete!');
};

seedMessages().catch(console.error);
