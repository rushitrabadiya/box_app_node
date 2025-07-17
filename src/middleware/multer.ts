// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';

// const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
// const MAX_FILE_SIZE = {
//   image: 5 * 1024 * 1024,
//   other: 15 * 1024 * 1024,
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = `uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}`;
//     fs.mkdirSync(folder, { recursive: true });
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${uuidv4()}${ext}`;
//     cb(null, uniqueName);
//   },
// });
// const fileFilter = (req: any, file: any, cb: any) => {
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type. Only images and videos are allowed.'));
//   }
// };

// // export const uploadSingleFile = multer({ storage }).single('file');
// export const uploadSingleFile = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50 MB
//   },
// }).single('file');
// export const uploadMultipleFiles = multer({ storage }).array('files', 10);

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

// Allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];

// Max file size limits (in bytes)
const MAX_FILE_SIZE = {
  image: 1 * 1024 * 1024, // 5 MB
  video: 1 * 1024 * 1024, // 15 MB
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = `uploads/${file.mimetype.startsWith('video') ? 'videos' : 'images'}`;
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// File type validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images and videos are allowed.'));
  }
};

// Function to dynamically adjust file size limit based on file type
const limits = {
  fileSize: (
    req: Request,
    file: Express.Multer.File,
    cb: (err: Error | null, limit: number) => void,
  ) => {
    const isVideo = file.mimetype.startsWith('video');
    const limit = isVideo ? MAX_FILE_SIZE.video : MAX_FILE_SIZE.image;
    cb(null, limit);
  },
};

// Final export
export const uploadSingleFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.video, // fallback: 15 MB
  },
}).single('file');

export const uploadMultipleFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.video,
  },
}).array('files', 10);
