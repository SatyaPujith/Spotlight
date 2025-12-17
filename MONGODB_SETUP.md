# MongoDB Setup Guide for Spotlight App

## Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Complete registration

### 2. Create a Cluster
1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Click "Create Cluster" (takes 3-5 minutes)

### 3. Create Database User
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address for better security
4. Click "Confirm"

### 5. Get Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver and latest version
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update .env.local
1. Open `.env.local` in your project
2. Replace the `MONGODB_URI` value with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add the database name after `.net/`:
   ```
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/spotlight_app?retryWrites=true&w=majority
   ```

### Example .env.local
```env
YELP_AI_API_KEY=your_yelp_ai_api_key_here
MONGODB_URI=mongodb+srv://spotlightuser:MySecurePass123@cluster0.abc123.mongodb.net/spotlight_app?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345_make_this_very_long_and_random
```

## Database Structure

The app will automatically create these collections:

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  isGuest: Boolean,
  createdAt: Date,
  savedBusinesses: [
    {
      id: String,
      name: String,
      category: String,
      price: String,
      rating: Number,
      reviewCount: Number,
      address: String,
      hours: String,
      tags: [String],
      whyThisPlace: String,
      highlight: String,
      imageUrl: String,
      savedAt: Date
    }
  ]
}
```

## Security Best Practices

1. **Never commit .env.local** - It's already in .gitignore
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Rotate JWT_SECRET** regularly
5. **Use environment-specific databases** (dev, staging, prod)

## Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in Network Access
- Verify your internet connection
- Try "Allow Access from Anywhere" temporarily

### Authentication Failed
- Double-check username and password in connection string
- Ensure special characters in password are URL-encoded
  - Example: `p@ssw0rd` becomes `p%40ssw0rd`

### Database Not Found
- The database will be created automatically on first write
- Make sure the database name is in the connection string

### Can't Connect from Local Machine
- Check firewall settings
- Verify MongoDB Atlas cluster is running
- Test connection using MongoDB Compass

## Testing Your Connection

After setting up, restart your backend server:
```bash
npm run server:dev
```

You should see:
```
Connected to MongoDB
Spotlight Backend running on http://localhost:3001
```

If you see connection errors, review the steps above.

## Need Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection String Format](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [MongoDB Node.js Driver Docs](https://www.mongodb.com/docs/drivers/node/current/)
