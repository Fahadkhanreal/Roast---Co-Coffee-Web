# 🎯 SUPABASE STORAGE SETUP (3 Minutes)

## Step 1: Create Storage Bucket

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click: **Storage** (left sidebar)
4. Click: **New Bucket**

### Bucket Settings:
```
Name: images
Public: ✅ YES (check this box!)
File size limit: 5 MB
Allowed MIME types: Leave empty (allows all images)
```

5. Click **Create Bucket**

---

## Step 2: Setup Storage Policies

1. Click on **images** bucket
2. Go to **Policies** tab
3. Click **New Policy**

### Policy 1: Public Read Access

```sql
-- Click "For full customization" and paste:

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

### Policy 2: Authenticated Upload (for admin)

```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );
```

### Policy 3: Authenticated Delete (for admin)

```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );
```

---

## Step 3: Create Folders

Storage will automatically create folders when you upload files. The system uses:
- `products/` - Product images
- `hero-images/` - Hero section images

No manual folder creation needed! ✅

---

## Step 4: Test Upload

### Option A: Test via Dashboard

1. Go to Storage → images bucket
2. Click **Upload File**
3. Upload any image
4. Copy the public URL
5. Paste in browser - should load! ✅

### Option B: Test via Admin Panel

1. Run: `npm run dev`
2. Login to admin
3. Go to Products
4. Click "Edit" on any product
5. Upload new image
6. Save - image URL should be from Supabase! ✅

---

## Step 5: Verify in Code

Check that `lib/supabase-storage.ts` has correct bucket name:

```typescript
// Should say 'images'
const { data, error } = await supabase.storage
  .from('images')  // ← This should match your bucket name
  .upload(filePath, file);
```

✅ It's already set to 'images'!

---

## 🐛 Troubleshooting

### "Row Level Security" Error?
**Fix:** Make sure you created the policies in Step 2

### Images not loading?
**Fix:** Make sure bucket is set to **Public**
- Go to Storage → images → Settings
- Check "Public bucket" is enabled

### Upload fails?
**Fix:** Check file size < 5MB and is an image format

### 403 Forbidden?
**Fix:** Your policies might be wrong. Delete and recreate them.

---

## ✅ Verification Checklist

- [ ] Bucket named 'images' created
- [ ] Bucket is set to Public
- [ ] All 3 policies created (SELECT, INSERT, DELETE)
- [ ] Test image uploaded via dashboard
- [ ] Test image accessible via public URL
- [ ] Admin panel can upload images

---

## 🎉 Done!

Your Supabase Storage is ready! Now images will be stored in the cloud permanently (not deleted on redeployments).

**Storage Limits (Free Tier):**
- 1 GB storage
- 2 GB bandwidth/month
- ~2000-5000 product images

**Next:** Run `npm run dev` and test uploading a product image! 🚀
