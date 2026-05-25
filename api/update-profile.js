import { ObjectId } from 'mongodb';
import { getDb } from './_lib/db.js';
import { parseBearerToken, verifyAuthToken } from './_lib/auth.js';

const MAX_NAME_LENGTH = 60;
const MAX_PROFILE_PHOTO_LENGTH = 2_000_000;

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = parseBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyAuthToken(token);
    const db = await getDb();
    const users = db.collection('users');
    const prints = db.collection('prints');
    const viewpoints = db.collection('viewpoints');

    const name = req.body && typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const profilePhoto = req.body && typeof req.body.profile_photo === 'string'
      ? req.body.profile_photo.trim()
      : '';

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    if (name.length > MAX_NAME_LENGTH) {
      return res.status(400).json({ error: 'name too long' });
    }

    if (profilePhoto.length > MAX_PROFILE_PHOTO_LENGTH) {
      return res.status(400).json({ error: 'profile photo too large' });
    }

    const userId = new ObjectId(String(payload.sub));
    const normalizedProfilePhoto = profilePhoto || null;
    const updatedAt = new Date();

    const updateResult = await users.updateOne(
      { _id: userId },
      {
        $set: {
          name,
          profile_photo: normalizedProfilePhoto,
          updated_at: updatedAt,
        },
      }
    );

    if (!updateResult.matchedCount) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await users.findOne(
      { _id: userId },
      { projection: { name: 1, email: 1, profile_photo: 1 } }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prints.updateMany(
      { author_id: String(payload.sub) },
      {
        $set: {
          author_name: name,
          author_profile_photo: normalizedProfilePhoto,
        },
      }
    );

    await viewpoints.updateMany(
      { author_id: String(payload.sub) },
      {
        $set: {
          author_name: name,
          author_profile_photo: normalizedProfilePhoto,
        },
      }
    );

    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        profile_photo: updatedUser.profile_photo || null,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}