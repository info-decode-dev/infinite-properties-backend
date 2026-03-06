import { supabase, SUPABASE_STORAGE_BUCKET } from '../config/supabase';
import path from 'path';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadToSupabase(
  file: Express.Multer.File,
  folder: 'images' | 'videos' | 'logos' | 'profiles' = 'images'
): Promise<UploadResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  try {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    const filePath = `${folder}/${filename}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        url: '',
        path: filePath,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Error uploading to Supabase:', error);
    return {
      url: '',
      path: '',
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadMultipleToSupabase(
  files: Express.Multer.File[],
  folder: 'images' | 'videos' | 'logos' | 'profiles' = 'images'
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadToSupabase(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFromSupabase(filePath: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase is not configured. Cannot delete file.');
    return false;
  }

  try {
    // Remove /uploads prefix if present
    const pathToDelete = filePath.startsWith('/uploads/')
      ? filePath.replace('/uploads/', '')
      : filePath;

    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([pathToDelete]);

    if (error) {
      console.error('Error deleting from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting from Supabase:', error);
    return false;
  }
}

/**
 * Get public URL for a file path
 */
export function getSupabasePublicUrl(filePath: string): string {
  if (!supabase) {
    return filePath; // Return as-is if Supabase not configured
  }

  // Remove /uploads prefix if present
  const pathToGet = filePath.startsWith('/uploads/')
    ? filePath.replace('/uploads/', '')
    : filePath;

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(pathToGet);

  return data.publicUrl;
}
