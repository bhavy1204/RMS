# Creating Admin Users

## How to Create Admin Users

### Method 1: Using the Seed Script (Recommended)

The easiest way to create an admin user is using the built-in seed script:

```bash
# Navigate to backend folder
cd backend

# Run the seed script with default credentials
npm run seed-admin

# Or specify custom credentials
node scripts/seedAdmin.js "Admin Name" "admin@restaurant.com" "password123"
```

**Default Admin Credentials:**
- Email: `admin@restaurant.com`
- Password: `admin123`
- Name: `Admin User`

⚠️ **Important**: Change the default password immediately after first login!

### Method 2: Using MongoDB Shell

1. Connect to your MongoDB:
```bash
mongosh mongodb://localhost:27017/restaurant-qr-menu
```

2. Create admin user:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@restaurant.com",
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5wY4R1J5Yz5Zm", // bcrypt hash of "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Method 3: Register First, Then Upgrade

1. Register a regular customer account through the frontend
2. Use MongoDB shell to upgrade their role:
```bash
mongosh
use restaurant-qr-menu
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## User Roles

- **customer**: Default role for registered users
- **staff**: Restaurant staff (can manage orders, menu availability)
- **admin**: Full system access (menu, orders, tables, users)

## Security Best Practices

1. **Never create admins through public registration**
2. **Always use strong passwords**
3. **Change default passwords immediately**
4. **Use HTTPS in production**
5. **Keep admin accounts to a minimum**

## For Development

For testing purposes, you can create multiple admin accounts:

```bash
# Admin 1
npm run seed-admin

# Admin 2
node scripts/seedAdmin.js "Manager User" "manager@restaurant.com" "manager123"

# Staff account
# Register as customer first, then upgrade via MongoDB
```

## Verifying Admin Status

After creating an admin, you can verify by:

1. **Login to the frontend**: `http://localhost:5173/login`
2. **Use admin credentials**
3. **Should redirect to**: `/admin`

If you can access the admin dashboard, the user is properly configured as admin.

## Troubleshooting

**Can't login as admin?**
- Check MongoDB is running
- Verify user exists: `db.users.findOne({ email: "admin@restaurant.com" })`
- Check role field: `db.users.findOne({ email: "admin@restaurant.com" }).role`

**Role not working?**
- Clear browser cache and localStorage
- Check JWT token contains correct role
- Restart backend server

**Forgot password?**
- Create new admin user with different email
- Or reset password via MongoDB (updates passwordHash)








