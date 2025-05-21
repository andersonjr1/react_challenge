export interface Asset {
  id: string; // UUID
  user_id: string; // UUID, foreign key to users table
  name: string;
  description: string | null; // TEXT, can be NULL
  created_at: Date; // TIMESTAMPTZ
  updated_at: Date; // TIMESTAMPTZ
}

/**
 * Request body for creating a new asset.
 */
export interface CreateAssetRequestBody {
  user_id: string;
  name: string;
  description?: string; // Optional, will be stored as NULL if not provided
}

/**
 * Request body for updating an existing asset.
 * All fields are optional.
 */
export interface UpdateAssetRequestBody {
  name?: string;
  description?: string | null; // Allow explicitly setting description to null
}

