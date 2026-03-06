import { Express } from 'express';
import { uploadToSupabase, getSupabasePublicUrl } from './supabaseStorage';
import { supabase } from '../config/supabase';
import path from 'path';

/**
 * Get the URL for an uploaded file
 * Returns Supabase URL if Supabase is configured, otherwise returns local path
 */
export function getFileUrl(file: Express.Multer.File | undefined, folder: 'images' | 'videos' | 'logos' | 'profiles' = 'images'): string {
  if (!file) return '';
  
  // If Supabase is configured, upload to Supabase and return URL
  if (supabase && file.buffer) {
    // File is in memory (Supabase mode)
    // Note: This requires async handling in controllers
    // For now, return empty and let controllers handle upload
    return '';
  }
  
  // Local storage mode
  return `/uploads/${folder}/${file.filename}`;
}

/**
 * Determine folder based on field name and file type
 */
export function getFolderFromField(fieldname: string, mimetype?: string): 'images' | 'videos' | 'logos' | 'profiles' {
  if (fieldname === 'images' || fieldname === 'image' || fieldname.startsWith('teamMemberImage_')) {
    return 'images';
  } else if (fieldname === 'video' || fieldname === 'media' || (fieldname === 'gallery' && mimetype?.startsWith('video/'))) {
    return 'videos';
  } else if (fieldname === 'logo' || fieldname === 'logos') {
    return 'logos';
  } else if (fieldname === 'profilePicture') {
    return 'profiles';
  }
  return 'images'; // default
}

/**
 * Process uploaded files - uploads to Supabase if configured, otherwise returns local paths
 * This should be called after multer middleware processes the files
 */
export async function processUploadedFiles(
  files: Express.Multer.File[] | Express.Multer.File | undefined,
  fieldname?: string
): Promise<string[]> {
  if (!files) return [];
  
  const fileArray = Array.isArray(files) ? files : [files];
  if (fileArray.length === 0) return [];
  
  // If Supabase is configured and files are in memory
  if (supabase && fileArray[0].buffer) {
    const uploadPromises = fileArray.map(async (file) => {
      const folder = fieldname ? getFolderFromField(fieldname, file.mimetype) : 'images';
      const result = await uploadToSupabase(file, folder);
      return result.url || '';
    });
    return Promise.all(uploadPromises);
  }
  
  // Local storage mode
  return fileArray.map((file) => {
    const folder = fieldname ? getFolderFromField(fieldname, file.mimetype) : 'images';
    return `/uploads/${folder}/${file.filename}`;
  });
}

/**
 * Process a single uploaded file
 */
export async function processUploadedFile(
  file: Express.Multer.File | undefined,
  fieldname?: string
): Promise<string> {
  if (!file) return '';
  
  // If Supabase is configured and file is in memory
  if (supabase && file.buffer) {
    const folder = fieldname ? getFolderFromField(fieldname, file.mimetype) : 'images';
    const result = await uploadToSupabase(file, folder);
    return result.url || '';
  }
  
  // Local storage mode
  const folder = fieldname ? getFolderFromField(fieldname, file.mimetype) : 'images';
  return `/uploads/${folder}/${file.filename}`;
}

/**
 * Convert a stored file path to a full URL
 * Handles both Supabase URLs and local paths
 */
export function getFullFileUrl(filePath: string, apiUrl?: string): string {
  if (!filePath) return '';
  
  // If it's already a full URL (Supabase), return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // If it's a Supabase path (without /uploads), convert to Supabase URL
  if (supabase && !filePath.startsWith('/uploads/')) {
    return getSupabasePublicUrl(filePath);
  }
  
  // Local path - prepend API URL
  const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${filePath}`;
}
